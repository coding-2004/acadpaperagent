import os
from dotenv import load_dotenv
from google import genai
import asyncio

load_dotenv()

api_key = os.getenv("GOOGLE_API_KEY")
client = genai.Client(api_key=api_key)

try:
    print("Listing models (simple)...")
    pager = client.models.list()
    with open("models_list_utf8.txt", "w", encoding="utf-8") as f:
        for m in pager:
            # print(f"Model Name: {m.name}")
            f.write(f"Model Name: {m.name}\n")
    print(" written to models_list_utf8.txt")

except Exception as e:
    print(f"Error listing models: {e}")
