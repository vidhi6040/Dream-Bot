# dream_interpreter.py

import json
import re
import os
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# Load dream symbols
with open("symbols/dream_symbols.json", "r") as f:
    SYMBOL_DICT = json.load(f)

def extract_keywords(dream_text):
    words = re.findall(r'\b\w+\b', dream_text.lower())
    found = {word: SYMBOL_DICT[word] for word in words if word in SYMBOL_DICT}
    return found

def gpt_interpretation(dream_text):
    try:
        # Use the OpenAI client properly
        client = OpenAI(api_key=OPENAI_API_KEY)

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an expert in dream interpretation."},
                {"role": "user", "content": f"Interpret this dream: {dream_text}"}
            ],
            temperature=0.8,
            max_tokens=150
        )

        return response.choices[0].message.content.strip()

    except Exception as e:
        if "insufficient_quota" in str(e):
            return "Our AI interpreter is currently unavailable due to usage limits. Please try again later."
    
        return f"GPT error: {e}"

def interpret_dream(dream_text):
    keywords = extract_keywords(dream_text)
    if keywords:
        interpretation = "Here’s what your dream might mean:\n\n"
        for word, meaning in keywords.items():
            interpretation += f"🔹 **{word.capitalize()}**: {meaning}\n"
        return interpretation
    else:
        return gpt_interpretation(dream_text)
