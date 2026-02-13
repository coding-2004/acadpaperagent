import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

# ==============================
# 🚀 FASTAPI APP INIT
# ==============================

app = FastAPI(title="Backend API", version="0.1.0")

# ==============================
# 🌍 CORS CONFIGURATION (IMPORTANT)
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
# 📌 EXISTING ENDPOINTS
# ==============================

@app.get("/")
async def root():
    return {"message": "Hello from Backend API!"}

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
# 🔎 SEARCH FEATURE (#9)
# ==============================

class SearchRequest(BaseModel):
    query: str
    databases: Optional[List[str]] = None

def mock_search(query: str, databases: Optional[List[str]] = None):
    return [
        {
            "title": f"Research Paper on {query}",
            "authors": ["John Doe", "Jane Smith"],
            "abstract": f"This paper explores concepts related to {query}.",
            "publication_date": "2024",
            "doi": "10.1000/example1"
        }
    ]

@app.post("/api/search")
async def search_papers(request: SearchRequest):
    if not request.query.strip():
        raise HTTPException(
            status_code=400,
            detail="Search query cannot be empty"
        )

    results = mock_search(request.query, request.databases)

    return {
        "success": True,
        "query": request.query,
        "databases": request.databases,
        "results": results
    }
