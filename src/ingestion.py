import pandas as pd
from google_play_scraper import Sort, reviews
from app_store_scraper import AppStore
import praw
import os
from datetime import datetime

# Ensure data directory exists
DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "data")
os.makedirs(DATA_DIR, exist_ok=True)

def fetch_play_store_reviews(app_id="com.grofers.customerapp", count=100, app_name="blinkit"):
    print(f"Fetching Play Store reviews for {app_id}...")
    result, continuation_token = reviews(
        app_id,
        lang='en', # English only per v1 constraint
        country='in',
        sort=Sort.NEWEST,
        count=count
    )
    
    formatted_reviews = []
    for r in result:
        formatted_reviews.append({
            "id": f"play_{r['reviewId']}",
            "source": "play_store",
            "app_name": app_name,
            "date": r['at'].strftime("%Y-%m-%d %H:%M:%S") if r.get('at') else None,
            "raw_text": r.get('content', '').replace('\n', ' ').strip()
        })
    return formatted_reviews

def fetch_app_store_reviews(app_name="blinkit", app_id=530930773, count=70, output_app_name="blinkit"):
    print(f"Fetching App Store reviews for {app_name}...")
    app = AppStore(country="in", app_name=app_name, app_id=app_id)
    app.review(how_many=count)
    
    formatted_reviews = []
    for r in app.reviews:
        # AppStore library doesn't always guarantee unique review IDs in its default output, so we fallback to timestamp if missing
        formatted_reviews.append({
            "id": f"appstore_{r.get('id', datetime.now().timestamp())}",
            "source": "app_store",
            "app_name": output_app_name,
            "date": r['date'].strftime("%Y-%m-%d %H:%M:%S") if r.get('date') else None,
            "raw_text": r.get('review', '').replace('\n', ' ').strip()
        })
    return formatted_reviews

def fetch_reddit_posts(client_id, client_secret, query="blinkit", limit=100):
    print("Fetching Reddit posts...")
    if not client_id or not client_secret:
        print("WARN: Reddit API requires client_id and client_secret. Skipping Reddit collection.")
        return []
        
    reddit = praw.Reddit(
        client_id=client_id,
        client_secret=client_secret,
        user_agent="blinkit_research_v1"
    )
    
    formatted_posts = []
    for submission in reddit.subreddit("all").search(query, limit=limit, sort="new"):
        formatted_posts.append({
            "id": f"reddit_{submission.id}",
            "source": "reddit",
            "app_name": "blinkit", # we assume queries are mostly about blinkit for this batch
            "date": datetime.fromtimestamp(submission.created_utc).strftime("%Y-%m-%d %H:%M:%S"),
            "raw_text": (submission.title + " " + submission.selftext).replace('\n', ' ').strip()
        })
    return formatted_posts

def main():
    # Fetch data
    play_reviews = fetch_play_store_reviews(count=1500)
    app_reviews = fetch_app_store_reviews(count=1500)
    
    # Optional: Set these environment variables to fetch Reddit data
    reddit_client_id = os.environ.get("REDDIT_CLIENT_ID")
    reddit_client_secret = os.environ.get("REDDIT_CLIENT_SECRET")
    reddit_posts = fetch_reddit_posts(reddit_client_id, reddit_client_secret, limit=100)
    
    all_data = play_reviews + app_reviews + reddit_posts
    
    if not all_data:
        print("No data collected.")
        return

    # Save raw dataset
    df = pd.DataFrame(all_data)
    
    # Filter out empty text (just in case)
    df = df[df['raw_text'].str.len() > 10]
    
    output_path = os.path.join(os.path.dirname(__file__), "..", "data", "raw_dataset.csv")
    df.to_csv(output_path, index=False)
    print(f"Saved {len(df)} items to {output_path}")

if __name__ == "__main__":
    main()
