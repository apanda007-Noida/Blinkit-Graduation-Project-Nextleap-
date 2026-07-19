import os
import json
import time
from glob import glob
from google import genai
from google.genai import types
from prompts import SYSTEM_PROMPT, TAGGING_SCHEMA

# Removed for GitHub push protection
API_KEY = os.environ.get("GEMINI_API_KEY", "")

DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "data")
CHUNKS_DIR = os.path.join(DATA_DIR, "chunks")
OUTPUT_FILE = os.path.join(DATA_DIR, "tagged_dataset.json")

def process_batch(client, batch_path):
    print(f"Processing {os.path.basename(batch_path)}...")
    with open(batch_path, 'r', encoding='utf-8') as f:
        batch_data = json.load(f)
    
    # Format the input
    input_text = json.dumps(batch_data, indent=2)
    prompt = SYSTEM_PROMPT + "\n\nInput Batch:\n" + input_text
    
    try:
        response = client.models.generate_content(
            model='gemini-2.0-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json"
            )
        )
        
        output_text = response.text.strip()
        # Some models might still wrap in markdown
        if output_text.startswith("```json"):
            output_text = output_text[7:-3].strip()
        elif output_text.startswith("```"):
            output_text = output_text[3:-3].strip()
            
        tagged_items = json.loads(output_text)
        return tagged_items
    except Exception as e:
        print(f"Failed to process {batch_path}: {e}")
        return None

def main():
    client = genai.Client(api_key=API_KEY)
    
    # Load existing to resume
    existing_ids = set()
    all_tagged = []
    if os.path.exists(OUTPUT_FILE):
        with open(OUTPUT_FILE, 'r', encoding='utf-8') as f:
            all_tagged = json.load(f)
            existing_ids = {item.get("id") for item in all_tagged if item.get("id")}
        print(f"Resuming with {len(all_tagged)} previously tagged items.")
    
    chunk_files = sorted(glob(os.path.join(CHUNKS_DIR, "*.json")))
    print(f"Found {len(chunk_files)} chunk files.")
    
    processed_count = 0
    for chunk_file in chunk_files:
        # Check if already processed (simple check based on first item id)
        with open(chunk_file, 'r', encoding='utf-8') as f:
            chunk_data = json.load(f)
            if not chunk_data:
                continue
            first_id = chunk_data[0].get("id")
            if first_id in existing_ids:
                print(f"Skipping {os.path.basename(chunk_file)}, already processed.")
                continue
                
        tagged_items = process_batch(client, chunk_file)
        
        if tagged_items:
            all_tagged.extend(tagged_items)
            # Update existing IDs
            for t in tagged_items:
                existing_ids.add(t.get("id"))
                
            # Save incrementally
            with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
                json.dump(all_tagged, f, indent=4, ensure_ascii=False)
            print(f"Successfully processed and saved {os.path.basename(chunk_file)}.")
            processed_count += 1
            
            # Simple rate limiting for free tier (15 RPM limits -> 4s wait)
            time.sleep(4) 
        else:
            print(f"Failed on {os.path.basename(chunk_file)}. Logging to failed_batches.txt and continuing...")
            with open(os.path.join(DATA_DIR, "failed_batches.txt"), "a") as err_f:
                err_f.write(f"{chunk_file}\n")
            continue
            
    print(f"Run complete. Total tagged items: {len(all_tagged)}")

if __name__ == "__main__":
    main()
