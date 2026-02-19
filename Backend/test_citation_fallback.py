import requests
import json
import sys
from urllib.parse import quote

BASE_URL = "http://127.0.0.1:8000/api"

def test_fallback_citation():
    # "Attention Is All You Need" - likely not in our tiny DB
    paper_id = "1706.03762" 
    
    print(f"Testing citation for non-saved paper: {paper_id}")
    
    encoded_id = quote(paper_id, safe='') 
    cit_url = f"{BASE_URL}/papers/{encoded_id}/citation?format=APA"
    
    try:
        resp = requests.get(cit_url, timeout=60)
        
        if resp.status_code == 200:
            print("SUCCESS! Citation received (from arXiv fallback):")
            print(json.dumps(resp.json(), indent=2))
        else:
            print(f"FAILED with status {resp.status_code}")
            print(resp.text)
            
    except Exception as e:
        print(f"Test Error: {e}")

if __name__ == "__main__":
    test_fallback_citation()
