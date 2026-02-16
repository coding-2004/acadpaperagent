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

# Testing variations
models_to_test = [
    'gemini-1.5-flash',
    'models/gemini-1.5-flash',
    'gemini-2.0-flash-exp',
    'gemini-2.0-flash'
]

def test_search():
    for model_id in models_to_test:
        print(f"\n--- Testing model: {model_id} ---")
        try:
            response = client.models.generate_content(
                model=model_id,
                contents="Explain quantum computing in one sentence."
            )
            print("SUCCESS!")
            if response.text:
                print(f"Response text: {response.text}")
            return # Exit on first success
        except Exception as e:
            print(f"FAILED with {type(e).__name__}")
            # print(e) # truncated usually

if __name__ == "__main__":
    test_search()
