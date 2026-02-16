import os
import json
import time
import sqlite3
from datetime import datetime
from typing import List, Optional
from dotenv import load_dotenv

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# 🔥 Google Generative AI
from google import genai

# ==============================
# 🔐 LOAD ENV VARIABLES
# ==============================

load_dotenv()

api_key = os.getenv("GOOGLE_API_KEY")

if not api_key:
    raise Exception("GOOGLE_API_KEY not found in .env file")

# Initialize Client
client = genai.Client(api_key=api_key)


# ==============================
# 🗄️ DATABASE INITIALIZATION
# ==============================

DB_PATH = "papers.db"

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS saved_papers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            paper_id TEXT NOT NULL,
            title TEXT NOT NULL,
            authors TEXT NOT NULL,
            abstract TEXT,
            publication_date TEXT,
            doi TEXT,
            user_id TEXT NOT NULL,
            reading_list_id INTEGER,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    conn.close()

init_db()


# ==============================
# 🤖 GEMINI LLM INIT
# ==============================

# Using the new Google GenAI SDK
# Supported models include: gemini-2.0-flash
MODEL_ID = 'models/gemini-2.5-flash'


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
    id: str
    title: str
    authors: List[str]
    abstract: str
    publication_date: str
    doi: str

class SearchRequest(BaseModel):
    query: str
    databases: Optional[List[str]] = None

class SavePaperRequest(BaseModel):
    paper: Paper
    reading_list_id: Optional[int] = None

class ReadingList(BaseModel):
    id: int
    name: str
    description: Optional[str] = None


# ==============================
# 🚀 FASTAPI APP INIT
# ==============================

app = FastAPI(title="Academic Paper Finder API", version="0.3.0")


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
# 📂 READING LISTS ENDPOINT
# ==============================

@app.get("/api/reading-lists", response_model=List[ReadingList])
async def get_reading_lists():
    # Mock reading lists for now
    return [
        {"id": 1, "name": "AI Ethics", "description": "Papers about AI ethics and policy"},
        {"id": 2, "name": "Medical AI", "description": "Healthcare applications of AI"},
        {"id": 3, "name": "Generative Models", "description": "LLMs and Diffusion models"}
    ]


# ==============================
# 📄 SAVED PAPERS ENDPOINT (#12, #13)
# ==============================

def get_paper_by_id(paper_id: str, user_id: str):
    """Helper to fetch a single paper with ownership check."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    # We check by paper_id (the string identifier) and user_id
    cursor.execute("""
        SELECT * FROM saved_papers 
        WHERE paper_id = ? AND user_id = ?
    """, (paper_id, user_id))
    
    row = cursor.fetchone()
    conn.close()
    
    if row:
        return {
            "id": row["paper_id"],
            "db_id": row["id"],
            "title": row["title"],
            "authors": row["authors"].split(", "),
            "abstract": row["abstract"],
            "publication_date": row["publication_date"],
            "doi": row["doi"],
            "reading_list_id": row["reading_list_id"],
            "created_at": row["created_at"]
        }
    return None


from urllib.parse import unquote

@app.get("/api/papers/{paper_id}")
async def get_paper_detail(paper_id: str):
    # Decode ID to handle slashes in DOIs
    paper_id = unquote(paper_id)

    # Mock authenticated user
    mock_user_id = "user_123"
    
    paper = get_paper_by_id(paper_id, mock_user_id)
    
    if not paper:
        # Check if it exists for another user for 403 (Security Requirement)
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("SELECT id FROM saved_papers WHERE paper_id = ?", (paper_id,))
        exists_for_other = cursor.fetchone()
        conn.close()
        
        if exists_for_other:
            raise HTTPException(status_code=403, detail="Access denied to this paper")
        else:
            raise HTTPException(status_code=404, detail="Paper not found")
            
    return {
        "success": True,
        "paper": paper
    }


@app.get("/api/papers")
async def get_saved_papers():
    # Mock authenticated user
    mock_user_id = "user_123"
    
    try:
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row  # To return results as dictionaries
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT id, paper_id, title, authors, abstract, publication_date, doi, reading_list_id 
            FROM saved_papers 
            WHERE user_id = ? 
            ORDER BY created_at DESC
        """, (mock_user_id,))
        
        rows = cursor.fetchall()
        
        papers = []
        for row in rows:
            papers.append({
                "id": row["paper_id"], # Returning paper_id as the primary identifier for the frontend
                "db_id": row["id"],
                "title": row["title"],
                "authors": row["authors"].split(", "),
                "abstract": row["abstract"],
                "publication_date": row["publication_date"],
                "doi": row["doi"],
                "reading_list_id": row["reading_list_id"]
            })
            
        conn.close()
        
        return {
            "success": True,
            "count": len(papers),
            "papers": papers
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database Error: {str(e)}")


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
        response = client.models.generate_content(
            model=MODEL_ID,
            contents=prompt
        )
        
        if not response or not response.text:
            raise Exception("Empty response from Gemini")

        # 5. Parse and Clean Response
        clean_text = response.text.strip()
        if clean_text.startswith("```json"):
            clean_text = clean_text[7:]
        if clean_text.endswith("```"):
            clean_text = clean_text[:-3]
        clean_text = clean_text.strip()

        raw_results = json.loads(clean_text)

        # 6. Validate with Pydantic and generate IDs
        validated_papers = []
        for i, p in enumerate(raw_results):
            paper_data = p.copy()
            # Generate a simple ID based on DOI or index if DOI is missing
            paper_id = paper_data.get("doi", f"paper_{int(time.time())}_{i}")
            paper_data["id"] = paper_id
            validated_papers.append(Paper(**paper_data))

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
        raise HTTPException(
            status_code=500,
            detail=f"Gemini API Error: {str(e)}"
        )


# ==============================
# 💾 SAVE PAPER FEATURE (#11)
# ==============================

@app.post("/api/papers/save")
async def save_paper(request: SavePaperRequest):
    paper_id = request.paper.id

    # Mock authenticated user
    mock_user_id = "user_123"
    
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        # Check if the paper is already saved for this user
        cursor.execute("SELECT id FROM saved_papers WHERE paper_id = ? AND user_id = ?", (paper_id, mock_user_id))
        if cursor.fetchone():
            conn.close()
            return {"success": True, "message": "Paper was already saved"}

        # Insert paper metadata
        cursor.execute("""
            INSERT INTO saved_papers 
            (paper_id, title, authors, abstract, publication_date, doi, user_id, reading_list_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            paper_id,
            request.paper.title,
            ", ".join(request.paper.authors),
            request.paper.abstract,
            request.paper.publication_date,
            request.paper.doi,
            mock_user_id,
            request.reading_list_id
        ))
        
        conn.commit()
        conn.close()
        
        return {
            "success": True,
            "message": "Paper saved successfully",
            "paper_id": paper_id
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database Error: {str(e)}")


# ==============================
# 🤖 TEST LLM ENDPOINT (LEGACY)
# ==============================

@app.get("/api/test-llm")
async def test_llm():
    try:
        response = client.models.generate_content(
            model=MODEL_ID,
            contents="Say hello like an AI research assistant"
        )
        return {
            "success": True,
            "response": response.text
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
