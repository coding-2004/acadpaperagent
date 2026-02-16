import os
from dotenv import load_dotenv
from google import genai
import asyncio

load_dotenv()

api_key = os.getenv("GOOGLE_API_KEY")
client = genai.Client(api_key=api_key)

# The new SDK often requires specific model strings
# Let's try the most standard 2.0 string
models_to_try = ["gemini-2.0-flash", "gemini-1.5-flash"]

for model_id in models_to_try:
    print(f"Testing {model_id}...")
    try:
        response = client.models.generate_content(
            model=model_id,
            contents="Hello"
        )
        print(f"SUCCESS with {model_id}")
        break
    except Exception as e:
        print(f"FAILED {model_id}: {e}")
