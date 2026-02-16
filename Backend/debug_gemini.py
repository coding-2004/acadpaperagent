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

MODEL_ID = 'gemini-2.0-flash'

def test_search():
    print(f"Testing model: {MODEL_ID}")
    try:
        response = client.models.generate_content(
            model=MODEL_ID,
            contents="Explain quantum computing in one sentence."
        )
        print("Response received!")
        print(f"Type of response: {type(response)}")
        print(f"Response text: {response.text}")
    except Exception as e:
        print("An error occurred:")
        print(e)
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_search()
