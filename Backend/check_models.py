import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv(override=True)
api_key = os.getenv("GOOGLE_API_KEY")

if not api_key:
    print("API Key not found")
    exit(1)

genai.configure(api_key=api_key)

try:
    with open("models_utf8.txt", "w", encoding="utf-8") as f:
        print("Listing models...")
        for m in genai.list_models():
            if 'generateContent' in m.supported_generation_methods:
                print(m.name)
                f.write(m.name + "\n")
    print("Done. Written to models_utf8.txt")
    print("Done.")
except Exception as e:
    print(f"Error: {e}")
