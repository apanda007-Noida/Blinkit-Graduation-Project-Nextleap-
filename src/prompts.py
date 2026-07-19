import json

TAGGING_SCHEMA = {
    "type": "object",
    "properties": {
        "id": {
            "type": "string",
            "description": "Unique identifier for the item (leave unchanged from input)."
        },
        "source": {
            "type": "string",
            "enum": ["play_store", "app_store", "reddit", "forum", "social"],
            "description": "The source platform (leave unchanged from input)."
        },
        "app_name": {
            "type": "string",
            "enum": ["blinkit", "zepto", "instamart", "bigbasket", "other"],
            "description": "The specific quick-commerce app mentioned."
        },
        "date": {
            "type": "string",
            "description": "The date of the feedback (leave unchanged from input, if available)."
        },
        "raw_text": {
            "type": "string",
            "description": "The cleaned original text (leave unchanged from input)."
        },
        "category_mentioned": {
            "type": "array",
            "items": {"type": "string"},
            "description": "Categories mentioned (e.g., grocery, personal care, electronics, none)."
        },
        "sentiment": {
            "type": "string",
            "enum": ["positive", "negative", "neutral"],
            "description": "Overall sentiment of the feedback regarding exploring categories."
        },
        "trigger_type": {
            "type": "string",
            "enum": ["habit", "promo-discount", "urgent-need", "social-recommendation", "algorithmic-discovery", "accidental", "none"],
            "description": "What triggered the user to buy from a category."
        },
        "friction_type": {
            "type": "array",
            "items": {
                "type": "string",
                "enum": ["trust-quality", "delivery-time-doubt", "price-sensitivity", "category-unfamiliarity", "app-ux-findability", "no-felt-need", "none"]
            },
            "description": "Frictions preventing the user from exploring new categories."
        },
        "segment_signal": {
            "type": "string",
            "enum": ["loyalist-repeat-only", "cautious-explorer", "active-explorer", "deal-driven", "unclear"],
            "description": "Directional signal for the user segment based on this single item."
        },
        "evidence_quote": {
            "type": "string",
            "description": "Short excerpt (<= 25 words) from raw_text supporting the tags. Strip any personally identifying information (PII)."
        }
    },
    "required": ["id", "source", "app_name", "date", "raw_text", "category_mentioned", "sentiment", "trigger_type", "friction_type", "segment_signal", "evidence_quote"]
}

SYSTEM_PROMPT = f"""You are an expert user behavior analyst for Blinkit, a quick-commerce app. 
Your task is to structure and tag raw feedback from various sources based on a strict behavioral schema.

You will be provided with a JSON array containing raw feedback items. 
For each item, you must output a corresponding JSON object that strictly adheres to the following JSON schema:

{json.dumps(TAGGING_SCHEMA, indent=4)}

CRITICAL INSTRUCTIONS:
1. STRICT JSON ONLY: Your output MUST be a valid JSON array containing the tagged objects. Do not include any conversational text before or after the JSON.
2. ENUM ENFORCEMENT: You must ONLY use the exact string values provided in the enums. Do not invent new tags.
3. EVIDENCE QUOTE: Extract a verbatim quote (max 25 words) from the `raw_text` that justifies your tagging. REMOVE ANY PERSONALLY IDENTIFYING INFORMATION (PII) like usernames or full names from the quote.
4. NO HINGLISH/NON-ENGLISH: If the `raw_text` is predominantly non-English or Hinglish, do NOT tag it. Instead, omit it from your output JSON array entirely.

Input Format Example:
[
  {{
    "id": "12345",
    "source": "play_store",
    "date": "2023-10-01",
    "raw_text": "I only use Blinkit for groceries. I don't trust them with electronics, it might be fake."
  }}
]

Process the provided batch and return the tagged JSON array.
"""
