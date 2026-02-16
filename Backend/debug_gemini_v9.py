import os
from dotenv import load_dotenv
from google import genai
import asyncio

load_dotenv()

api_key = os.getenv("GOOGLE_API_KEY")
client = genai.Client(api_key=api_key)

model_id = "models/gemini-1.5-flash"

print(f"Testing {model_id}...")
try:
    response = client.models.generate_content(
        model=model_id,
        contents="Hello"
    )
    print("SUCCESS")
    print(response.text)
except Exception as e:
    print(f"FAILED {model_id}")
    print(e)
