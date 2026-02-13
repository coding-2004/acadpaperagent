import os
import json
import time
from typing import List, Optional
from dotenv import load_dotenv

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# 🔥 Google Generative AI
import google.generativeai as genai


# ==============================
# 🔐 LOAD ENV VARIABLES
# ==============================

load_dotenv()

api_key = os.getenv("GOOGLE_API_KEY")

if not api_key:
    raise Exception("GOOGLE_API_KEY not found in .env file")

genai.configure(api_key=api_key)


# ==============================
# 🤖 GEMINI LLM INIT
# ==============================

# Using the SDK directly for better reliability
# Supported models include: gemini-1.5-flash, gemini-2.5-flash
model = genai.GenerativeModel('gemini-2.5-flash')


# ==============================
# 🛡️ RATE LIMIT PROTECTOR
# ==============================

class RateLimiter:
    """Simple in-memory rate limiter to prevent API abuse."""
    def __init__(self, requests_per_minute: int = 10):
        self.requests_per_minute = requests_per_minute
        self.history = {}

    def is_allowed(self, client_ip: str) -> bool:
        now = time.time()
        # Clean history older than 60s
        self.history[client_ip] = [t for t in self.history.get(client_ip, []) if now - t < 60]
        
        if len(self.history[client_ip]) >= self.requests_per_minute:
            return False
            
        self.history[client_ip].append(now)
        return True

limiter = RateLimiter(requests_per_minute=20)


# ==============================
# 📦 SCHEMAS (PYDANTIC MODELS)
# ==============================

class Paper(BaseModel):
    title: str
    authors: List[str]
    abstract: str
    publication_date: str
    doi: str

class SearchRequest(BaseModel):
    query: str
    databases: Optional[List[str]] = None


# ==============================
# 🚀 FASTAPI APP INIT
# ==============================

app = FastAPI(title="Academic Paper Finder API", version="0.2.0")


# ==============================
# 🌍 CORS CONFIGURATION
# ==============================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==============================
# 📌 BASIC ENDPOINTS
# ==============================

@app.get("/")
async def root():
    return {"message": "Academic Paper Finder API is live!"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


@app.get("/api/random-quote")
async def random_quote():
    return {
        "success": True,
        "data": {
            "quote": "Stay hungry, stay foolish."
        }
    }


# ==============================
# 🔎 SEARCH FEATURE (#10)
# ==============================

@app.post("/api/search")
async def search_papers(request: SearchRequest, client_request: Request):
    # 1. Rate Limiting Check
    client_ip = client_request.client.host
    if not limiter.is_allowed(client_ip):
        raise HTTPException(
            status_code=429,
            detail="Rate limit exceeded. Please wait a moment."
        )

    # 2. Validation
    if not request.query.strip():
        raise HTTPException(status_code=400, detail="Search query cannot be empty")

    # 3. Gemini Prompt Construction
    databases_str = ", ".join(request.databases) if request.databases else "various academic databases"
    
    prompt = f"""
    You are an academic research assistant. 
    Search for recent papers about: "{request.query}" in {databases_str}.
    
    Return a list of 5 high-quality academic papers with realistic metadata.
    
    CRITICAL: Return ONLY a valid JSON array of objects.
    No explanations, no markdown code blocks, no extra text.
    
    Format:
    [
      {{
        "title": "Full paper title",
        "authors": ["Author One", "Author Two"],
        "abstract": "A concise summary of the paper.",
        "publication_date": "Year",
        "doi": "10.xxxx/yyyy"
      }}
    ]
    """

    try:
        # 4. Invoke Gemini
        response = model.generate_content(prompt)
        
        if not response or not response.text:
            raise Exception("Empty response from Gemini")

        # 5. Parse and Clean Response
        # Strip potential markdown code blocks if the LLM ignores the instruction
        clean_text = response.text.strip()
        if clean_text.startswith("```json"):
            clean_text = clean_text[7:]
        if clean_text.endswith("```"):
            clean_text = clean_text[:-3]
        clean_text = clean_text.strip()

        raw_results = json.loads(clean_text)

        # 6. Validate with Pydantic
        validated_papers = [Paper(**p) for p in raw_results]

        return {
            "success": True,
            "query": request.query,
            "results": validated_papers
        }

    except json.JSONDecodeError:
        raise HTTPException(
            status_code=500,
            detail="Failed to parse structured data from Gemini"
        )
    except Exception as e:
        # Catch validation errors or API failures
        raise HTTPException(
            status_code=500,
            detail=f"Gemini API Error: {str(e)}"
        )


# ==============================
# 🤖 TEST LLM ENDPOINT (LEGACY)
# ==============================

@app.get("/api/test-llm")
async def test_llm():
    try:
        response = model.generate_content("Say hello like an AI research assistant")
        return {
            "success": True,
            "response": response.text
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
