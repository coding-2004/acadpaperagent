import os
from dotenv import load_dotenv
from google import genai
import asyncio

load_dotenv()

api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    print("Error: GOOGLE_API_KEY not found")
    exit(1)

client = genai.Client(api_key=api_key)

# Trying a more stable / generally available model
MODEL_ID = 'gemini-1.5-flash'

def test_search():
    print(f"Testing model: {MODEL_ID}")
    try:
        response = client.models.generate_content(
            model=MODEL_ID,
            contents="Explain quantum computing in one sentence."
        )
        print("Response received!")
        if response.text:
             print(f"Response text: {response.text}")
        else:
             print("Response object has no text attribute or is empty.")
             print(response)

    except Exception as e:
        print("An error occurred:")
        print(e)

if __name__ == "__main__":
    test_search()
