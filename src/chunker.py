import pandas as pd
import json
import os

DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "data")

def create_chunks(batch_size=20):
    input_file = os.path.join(DATA_DIR, "raw_dataset.csv")
    
    if not os.path.exists(input_file):
        print(f"Error: {input_file} not found.")
        return
        
    df = pd.read_csv(input_file)
    print(f"Loaded {len(df)} total items.")
    
    # Select only required columns to reduce token usage
    columns_to_keep = ['id', 'source', 'app_name', 'date', 'raw_text']
    df = df[columns_to_keep]
    
    # Convert to list of dicts
    records = df.to_dict('records')
    
    # Create chunks
    chunks_dir = os.path.join(DATA_DIR, "chunks")
    os.makedirs(chunks_dir, exist_ok=True)
    
    chunk_count = 0
    for i in range(0, len(records), batch_size):
        chunk = records[i:i + batch_size]
        
        output_file = os.path.join(chunks_dir, f"batch_{chunk_count+1}.json")
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(chunk, f, indent=4, ensure_ascii=False)
            
        print(f"Saved chunk {chunk_count+1} with {len(chunk)} items to {output_file}")
        chunk_count += 1
        
    print("Done generating chunks.")

if __name__ == "__main__":
    create_chunks(batch_size=20)
