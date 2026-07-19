import os
import json
import pandas as pd

DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "data")
DOCS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "Docs")
INPUT_FILE = os.path.join(DATA_DIR, "tagged_dataset.json")
DASHBOARD_FILE = os.path.join(DOCS_DIR, "dashboard.md")

def generate_markdown_table(df, title):
    markdown = f"### {title}\n\n"
    markdown += df.to_markdown() + "\n\n"
    return markdown

def main():
    print("Loading tagged dataset...")
    if not os.path.exists(INPUT_FILE):
        print("Tagged dataset not found.")
        return
        
    with open(INPUT_FILE, 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    print(f"Loaded {len(data)} items.")
    df = pd.DataFrame(data)
    
    # 1. Base Distributions (Non-array fields)
    sentiment_dist = df['sentiment'].value_counts().reset_index()
    sentiment_dist.columns = ['Sentiment', 'Count']
    
    trigger_dist = df['trigger_type'].value_counts().reset_index()
    trigger_dist.columns = ['Trigger', 'Count']
    
    segment_dist = df['segment_signal'].value_counts().reset_index()
    segment_dist.columns = ['Segment Signal', 'Count']
    
    # 2. Explode Array Fields (Frictions and Categories)
    # Frictions
    df_frictions = df.explode('friction_type').reset_index(drop=True)
    friction_dist = df_frictions['friction_type'].value_counts().reset_index()
    friction_dist.columns = ['Friction', 'Count']
    
    # Categories
    df_cats = df.explode('category_mentioned').reset_index(drop=True)
    category_dist = df_cats['category_mentioned'].value_counts().reset_index()
    category_dist.columns = ['Category', 'Count']
    
    # 3. Cross-Tabs
    # Friction vs Segment Signal
    crosstab_friction_segment = pd.crosstab(df_frictions['friction_type'], df_frictions['segment_signal'])
    
    # Trigger vs Sentiment
    crosstab_trigger_sentiment = pd.crosstab(df['trigger_type'], df['sentiment'])
    
    # 4. Generate Dashboard Markdown
    print("Generating Dashboard...")
    with open(DASHBOARD_FILE, 'w', encoding='utf-8') as f:
        f.write("# Blinkit Category Discovery - Aggregation Dashboard\n\n")
        f.write(f"**Total Items Analyzed**: {len(data)}\n\n")
        
        f.write("## 1. High-Level Distributions\n\n")
        f.write(generate_markdown_table(sentiment_dist, "Overall Sentiment"))
        f.write(generate_markdown_table(segment_dist, "User Segments"))
        f.write(generate_markdown_table(category_dist, "Categories Mentioned"))
        
        f.write("## 2. Behavioral Triggers & Frictions\n\n")
        f.write(generate_markdown_table(trigger_dist, "Purchase Triggers (Why they buy new categories)"))
        f.write(generate_markdown_table(friction_dist, "Frictions (Why they avoid new categories)"))
        
        f.write("## 3. Cross-Tabulations (Correlations)\n\n")
        f.write(generate_markdown_table(crosstab_friction_segment, "Friction Type vs Segment Signal"))
        f.write(generate_markdown_table(crosstab_trigger_sentiment, "Trigger Type vs Sentiment"))
        
    print(f"Dashboard generated successfully at {DASHBOARD_FILE}")
    
    # Export flat CSV for the user
    csv_output = os.path.join(DATA_DIR, "aggregated_results.csv")
    df.to_csv(csv_output, index=False)
    print(f"Flat data exported to {csv_output}")

if __name__ == "__main__":
    main()
