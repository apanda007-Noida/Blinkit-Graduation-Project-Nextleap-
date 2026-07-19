import os
import json
import pandas as pd
from glob import glob

DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "data")

def main():
    print("Consolidating actual (unfiltered) reviews from chunks...")
    chunks = sorted(glob(os.path.join(DATA_DIR, "chunks", "*.json")))
    all_actual = []
    for chunk in chunks:
        with open(chunk, 'r', encoding='utf-8') as f:
            all_actual.extend(json.load(f))
            
    df_actual = pd.DataFrame(all_actual)
    # Drop unwanted columns
    cols_to_drop = ['id', 'app_name']
    df_actual = df_actual.drop(columns=[c for c in cols_to_drop if c in df_actual.columns])
    df_actual.to_csv(os.path.join(DATA_DIR, "all_actual_reviews.csv"), index=False)
    print(f"Saved {len(df_actual)} actual reviews.")

    print("Formatting normalized reviews...")
    normalized_path = os.path.join(DATA_DIR, "raw_dataset.csv")
    if os.path.exists(normalized_path):
        df_norm = pd.read_csv(normalized_path)
        df_norm = df_norm.drop(columns=[c for c in cols_to_drop if c in df_norm.columns])
        df_norm.to_csv(os.path.join(DATA_DIR, "all_normalized_reviews.csv"), index=False)
        print(f"Saved {len(df_norm)} normalized reviews.")
        # Remove the old file
        os.remove(normalized_path)
        
    print("Formatting tagged dataset...")
    tagged_json_path = os.path.join(DATA_DIR, "tagged_dataset.json")
    if os.path.exists(tagged_json_path):
        with open(tagged_json_path, 'r', encoding='utf-8') as f:
            tagged_data = json.load(f)
            
        for item in tagged_data:
            item.pop('id', None)
            item.pop('app_name', None)
            
        with open(tagged_json_path, 'w', encoding='utf-8') as f:
            json.dump(tagged_data, f, indent=4, ensure_ascii=False)
            
        # Also update the CSV
        df_tagged = pd.DataFrame(tagged_data)
        df_tagged.to_csv(os.path.join(DATA_DIR, "tagged_dataset.csv"), index=False)
        print(f"Cleaned {len(tagged_data)} tagged reviews.")
        
    # Cleanup aggregated_results to be consistent
    agg_csv = os.path.join(DATA_DIR, "aggregated_results.csv")
    if os.path.exists(agg_csv):
        df_agg = pd.read_csv(agg_csv)
        df_agg = df_agg.drop(columns=[c for c in cols_to_drop if c in df_agg.columns])
        df_agg.to_csv(agg_csv, index=False)

if __name__ == "__main__":
    main()
