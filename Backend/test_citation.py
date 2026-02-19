import requests
import json
import sys
from urllib.parse import quote

BASE_URL = "http://127.0.0.1:8000/api"

def test_citation():
    print("1. Searching for 'machine learning'...")
    try:
        search_resp = requests.post(f"{BASE_URL}/search", json={"query": "machine learning"})
        if search_resp.status_code != 200:
            print(f"Search failed: {search_resp.text}")
            return
        
        results = search_resp.json().get("results", [])
        if not results:
            print("No results found.")
            return

        paper = results[0]
        paper_id = paper["id"]
        print(f"Found paper: {paper['title']} (ID: {paper_id})")

        # 2. Save the paper (required for citation endpoint per current implementation)
        print("2. Saving paper...")
        save_resp = requests.post(f"{BASE_URL}/papers/save", json={
            "paper": paper,
            "reading_list_id": 1
        })
        
        if save_resp.status_code == 200:
            print("Paper saved (or already exists).")
        else:
            print(f"Save failed: {save_resp.text}")
            return

        # 3. Request Citation (APA)
        print(f"3. Requesting APA citation for {paper_id}...")
        # encode the ID logic: if it has dots/slashes, we must handle it.
        # requests.get will encode path params if passed in URL string, but user's code unquotes it.
        # Frontend encodes it. Let's encode it here too.
        encoded_id = quote(paper_id, safe='') 
        
        cit_url = f"{BASE_URL}/papers/{encoded_id}/citation?format=APA"
        resp = requests.get(cit_url, timeout=60)
        
        if resp.status_code == 200:
            print("SUCCESS! APA Citation received:")
            print(json.dumps(resp.json(), indent=2))
        else:
            print(f"FAILED with status {resp.status_code}")
            print(resp.text)

        # 4. Request Citation (BibTeX)
        print(f"4. Requesting BibTeX citation for {paper_id}...")
        cit_url_bib = f"{BASE_URL}/papers/{encoded_id}/citation?format=BibTeX"
        resp_bib = requests.get(cit_url_bib)
        
        if resp_bib.status_code == 200:
            print("SUCCESS! BibTeX received:")
            print(json.dumps(resp_bib.json(), indent=2))
        else:
            print(f"FAILED BibTeX with status {resp_bib.status_code}")
            print(resp_bib.text)

    except Exception as e:
        print(f"Test Error: {e}")

if __name__ == "__main__":
    test_citation()
