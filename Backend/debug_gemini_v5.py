import os
from dotenv import load_dotenv
from google import genai
import asyncio

load_dotenv()

api_key = os.getenv("GOOGLE_API_KEY")
client = genai.Client(api_key=api_key)

try:
    print("Listing models...")
    # client.models.list returns an iterator of Model objects
    for m in client.models.list():
        # Print only if it supports generateContent
        if 'generateContent' in m.supported_generation_methods:
            print(f"Model: {m.name}")
            # Also check display name to be sure
            # print(f"  Display Name: {m.display_name}")

except Exception as e:
    print(f"Error listing models: {e}")
