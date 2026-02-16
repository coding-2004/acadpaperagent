import os
from dotenv import load_dotenv
from google import genai
import asyncio

load_dotenv()

api_key = os.getenv("GOOGLE_API_KEY")
client = genai.Client(api_key=api_key)

models_to_try = [
    "models/gemini-2.5-flash",
    "models/gemini-2.0-flash"
]

for model_id in models_to_try:
    print(f"Testing {model_id}...")
    try:
        response = client.models.generate_content(
            model=model_id,
            contents="Hello"
        )
        print(f"SUCCESS with {model_id}")
        if response.text:
             print(f"Response: {response.text}")
        break
    except Exception as e:
        print(f"FAILED {model_id}: {e}")
