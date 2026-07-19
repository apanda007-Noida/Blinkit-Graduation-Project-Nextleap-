import os
import json
import pandas as pd
import emoji
from langdetect import detect, DetectorFactory

# Set seed for consistent language detection
DetectorFactory.seed = 0

DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "data")
RAW_DATA_PATH = os.path.join(DATA_DIR, "raw_dataset.csv")
TAGGED_DATA_PATH = os.path.join(DATA_DIR, "tagged_dataset.json")

def is_valid(text):
    if not isinstance(text, str) or not text.strip():
        return False
        
    # 1. Less than 8 words
    if len(text.split()) < 8:
        return False
        
    # 2. Contains Emojis
    if emoji.emoji_count(text) > 0:
        return False
        
    # 3. Another language (not English)
    try:
        if detect(text) != 'en':
            return False
    except:
        # If langdetect fails (e.g. string is too short or just numbers), reject
        return False
        
    return True

def normalize_dataset():
    print("Normalizing raw_dataset.csv...")
    if os.path.exists(RAW_DATA_PATH):
        df_raw = pd.read_csv(RAW_DATA_PATH)
        initial_count = len(df_raw)
        df_raw['is_valid'] = df_raw['raw_text'].apply(is_valid)
        df_raw = df_raw[df_raw['is_valid']].drop(columns=['is_valid'])
        df_raw.to_csv(RAW_DATA_PATH, index=False)
        print(f"  -> Kept {len(df_raw)} / {initial_count} items.")
    else:
        print("  -> raw_dataset.csv not found.")

    print("\nNormalizing tagged_dataset.json...")
    if os.path.exists(TAGGED_DATA_PATH):
        with open(TAGGED_DATA_PATH, 'r', encoding='utf-8') as f:
            tagged_data = json.load(f)
            
        initial_count = len(tagged_data)
        valid_tagged_data = [item for item in tagged_data if is_valid(item.get("raw_text", ""))]
        
        with open(TAGGED_DATA_PATH, 'w', encoding='utf-8') as f:
            json.dump(valid_tagged_data, f, indent=4, ensure_ascii=False)
        print(f"  -> Kept {len(valid_tagged_data)} / {initial_count} items.")
    else:
        print("  -> tagged_dataset.json not found.")

if __name__ == "__main__":
    normalize_dataset()
