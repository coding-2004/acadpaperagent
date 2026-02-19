import os
import json
import time
import sqlite3
from datetime import datetime
from typing import List, Optional
from dotenv import load_dotenv

# Force load .env from current directory
load_dotenv(override=True)
if not os.getenv("GOOGLE_API_KEY"):
    print("WARNING: GOOGLE_API_KEY not found in environment!")
else:
    print("SUCCESS: GOOGLE_API_KEY loaded.")

import requests
import xml.etree.ElementTree as ET
import google.generativeai as genai

from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from urllib.parse import unquote

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
# 🛡️ RATE LIMIT PROTECTOR
# ==============================

class RateLimiter:
    """Simple in-memory rate limiter to prevent API abuse."""
    def __init__(self, requests_per_minute: int = 20):
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
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "http://localhost:5175",
        "http://127.0.0.1:5175"
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

    # Rate limiting
    client_ip = client_request.client.host
    if not limiter.is_allowed(client_ip):
        raise HTTPException(
            status_code=429,
            detail="Rate limit exceeded. Please wait a moment."
        )

    # Validate query
    if not request.query.strip():
        raise HTTPException(
            status_code=400,
            detail="Search query cannot be empty"
        )

    try:
        url = (
            f"http://export.arxiv.org/api/query?"
            f"search_query=all:{request.query}"
            f"&start=0&max_results=5"
        )

        response = requests.get(url)

        if response.status_code != 200:
            raise HTTPException(
                status_code=500,
                detail="Failed to fetch results from arXiv"
            )

        root = ET.fromstring(response.content)
        ns = {"atom": "http://www.w3.org/2005/Atom"}

        results = []

        for entry in root.findall("atom:entry", ns):

            id_url = entry.find("atom:id", ns).text
            arxiv_id = id_url.split("/")[-1]

            title = entry.find("atom:title", ns).text.strip()
            abstract = entry.find("atom:summary", ns).text.strip()
            published = entry.find("atom:published", ns).text[:4]

            authors = []
            for author in entry.findall("atom:author", ns):
                authors.append(author.find("atom:name", ns).text)

            results.append({
                "id": arxiv_id,
                "title": title,
                "authors": authors,
                "abstract": abstract,
                "publication_date": published,
                "doi": f"https://arxiv.org/abs/{arxiv_id}",
                "pdf_url": f"https://arxiv.org/pdf/{arxiv_id}.pdf"
            })

        return {
            "success": True,
            "query": request.query,
            "results": results
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"arXiv API Error: {str(e)}"
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
# 🗑️ DELETE PAPER FEATURE (#14)
# ==============================

def delete_paper_by_id(paper_id: str, user_id: str):
    """
    Helper function to delete a paper if it belongs to the user.
    """
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Verify ownership
    cursor.execute("SELECT id FROM saved_papers WHERE paper_id = ? AND user_id = ?", (paper_id, user_id))
    if not cursor.fetchone():
        conn.close()
        raise HTTPException(status_code=404, detail="Paper not found or access denied")

    # Delete paper
    cursor.execute("DELETE FROM saved_papers WHERE paper_id = ? AND user_id = ?", (paper_id, user_id))
    conn.commit()
    conn.close()
    return True

@app.delete("/api/papers")
async def delete_paper(paper_id: str):
    try:
        # Mock authenticated user
        mock_user_id = "user_123"
        
        # paper_id comes as query param, FastAPI handles it. 
        # If it was still encoded by frontend, we might need unquote, 
        # but query params are usually decoded by framework. 
        # Let's inspect if we need it. 
        # If frontend sends ?paper_id=10.123%2F456, FastAPI usually sees "10.123/456".
        # Safe to keep unquote just in case? No, usually not needed for query params.
        
        delete_paper_by_id(paper_id, mock_user_id)
        
        return {
            "success": True,
            "message": "Paper deleted successfully",
            "paper_id": paper_id
        }
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database Error: {str(e)}")


# ==============================
# 📥 PDF DOWNLOAD PROXY
# ==============================

@app.get("/api/papers/download/{paper_id}")
def download_pdf(paper_id: str):
    try:
        pdf_url = f"https://arxiv.org/pdf/{paper_id}.pdf"
        headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"}
        response = requests.get(pdf_url, headers=headers)

        if response.status_code != 200:
            raise HTTPException(
                status_code=404,
                detail="PDF not found on arXiv"
            )

        return Response(
            content=response.content,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename={paper_id}.pdf"
            }
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"PDF download failed: {str(e)}"
        )


# ==============================
# 🤖 LLM CITATION GENERATION
# ==============================

def fetch_arxiv_details(arxiv_id: str) -> dict:
    """
    Fetches paper metadata directly from arXiv API.
    """
    try:
        url = f"http://export.arxiv.org/api/query?id_list={arxiv_id}"
        response = requests.get(url)
        if response.status_code != 200:
            return None
        
        root = ET.fromstring(response.content)
        namespace = {'atom': 'http://www.w3.org/2005/Atom'}
        entry = root.find('atom:entry', namespace)
        
        if not entry:
            return None
            
        title = entry.find('atom:title', namespace).text.strip().replace('\n', ' ')
        summary = entry.find('atom:summary', namespace).text.strip().replace('\n', ' ')
        published = entry.find('atom:published', namespace).text[:4] # Just year
        
        authors = []
        for author in entry.findall('atom:author', namespace):
            authors.append(author.find('atom:name', namespace).text)
            
        # Extract DOI if available
        doi = ""
        for link in entry.findall('atom:link', namespace):
            if link.get('title') == 'doi':
                doi = link.get('href')
                
        return {
            "id": arxiv_id,
            "title": title,
            "authors": authors,
            "publication_date": published,
            "doi": doi,
            "abstract": summary
        }
    except Exception as e:
        print(f"Error fetching from arXiv: {e}")
        return None

def generate_citation_with_llm(paper: dict, fmt: str) -> str:
    """
    Uses Google Gemini (direct API) to generate an academic citation.
    """
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        raise Exception("GOOGLE_API_KEY not found in environment variables")

    genai.configure(api_key=api_key)
    
    # Use flash model for speed and cost
    model = genai.GenerativeModel('gemini-flash-latest')

    prompt = f"""
    You are an academic citation expert.
    Generate a citation for the following paper in {fmt} format.
    
    Paper Details:
    Title: {paper['title']}
    Authors: {", ".join(paper['authors'])}
    Publication Year: {paper['publication_date']}
    Journal/Source: arXiv
    DOI: {paper['doi']}
    URL: https://arxiv.org/abs/{paper['id']}

    Rules:
    - Return ONLY the citation text.
    - Do NOT include any explanations, markdown, or labels.
    - Format it strictly according to {fmt} standards.
    """

    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        raise Exception(f"Gemini API Error: {str(e)}")


@app.get("/api/papers/{paper_id}/citation")
async def get_paper_citation(paper_id: str, format: str = "APA"):
    # Decode ID
    paper_id = unquote(paper_id)
    
    # Supported formats
    SUPPORTED_FORMATS = ["APA", "MLA", "Chicago", "Harvard", "IEEE", "BibTeX"]
    if format not in SUPPORTED_FORMATS:
        raise HTTPException(
            status_code=400, 
            detail=f"Unsupported format. Allowed: {', '.join(SUPPORTED_FORMATS)}"
        )

    # Use existing helper to fetch paper
    # Mock user ID as per other endpoints
    mock_user_id = "user_123"
    
    # Try fetching from DB first
    paper = get_paper_by_id(paper_id, mock_user_id)
    
    if not paper:
        # If not in DB, try fetching directly from arXiv
        paper = fetch_arxiv_details(paper_id)
        
        if not paper:
             raise HTTPException(status_code=404, detail="Paper not found in library or arXiv")

    try:
        citation_text = generate_citation_with_llm(paper, format)
        
        return {
            "success": True,
            "format": format,
            "citation": citation_text
        }
    except Exception as e:
        # Log the error behavior
        print(f"LLM Error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate citation: {str(e)}"
        )
