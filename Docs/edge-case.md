# Edge Cases and Mitigation Strategies: Blinkit Feedback Engine

This document outlines potential edge cases that could disrupt the zero-cost data pipeline, along with strategies to handle them gracefully.

## 1. Data Ingestion Edge Cases

| Edge Case | Impact | Mitigation Strategy |
| :--- | :--- | :--- |
| **Scraper API Blocks / Rate Limits** | `app-store-scraper` or `google-play-scraper` hits IP bans when pulling the new target of ~1500 items, returning 0 reviews. | Introduce exponential backoff/sleep delays in the script. If the library remains completely blocked (common with Apple), fall back to manual export via App Store Connect if available, or reduce target volume. |
| **Missing Fields in Raw Data** | Reviews missing timestamps or identifiers. | The `ingestion.py` script includes fallback logic (e.g., generating an ID based on the current timestamp) to ensure the row is still viable for analysis. |
| **Non-English/Hinglish Text** | The script scrapes Hinglish reviews written in Latin characters, polluting the dataset. | The LLM Tagging prompt has a strict rule to detect and drop non-English/Hinglish items. They are excluded from the output JSON array entirely. |
| **Cherry-picking during Curation** | Manual collection for Forums and Social Media unconsciously leans towards negative reviews. | Strict adherence to the manual curation protocol: fixed keywords, strict date ranges, and a fixed pull count per keyword regardless of sentiment. |

## 2. AI Tagging Edge Cases (The Free-Tier Bottleneck)

| Edge Case | Impact | Mitigation Strategy |
| :--- | :--- | :--- |
| **Chat UI Message Limits** | Processing 2600+ items in batches of 20 means ~130 messages. Claude.ai / ChatGPT free tiers enforce strict hourly message limits. | **Critical Risk:** Tagging must be staggered over multiple days, or spread across multiple free accounts/platforms simultaneously (e.g., Claude + ChatGPT) to bypass the limit. |
| **Schema/Prompt Drift** | After 10+ batches in the same chat session, the LLM "forgets" the strict JSON requirement and starts outputting conversational text or hallucinating tags outside the Enums. | Start a fresh chat session every 5-10 batches and re-paste the `SYSTEM_PROMPT`. Do not process all 130 batches in a single continuous thread. |
| **Browser Automation Breakage** | If an agent is used to automate the browser copy/paste loop, UI changes by OpenAI/Anthropic will break the DOM selectors. | Fallback immediately to the manual copy/paste process. Budget active human hours for this task. |
| **Malformed JSON Responses** | The LLM misses a trailing comma or bracket. | Run a quick linter/JSON formatter on the output before appending it to `tagged_dataset.csv`. |

## 3. Aggregation & Synthesis Edge Cases

| Edge Case | Impact | Mitigation Strategy |
| :--- | :--- | :--- |
| **App Name Conflation** | Comparative data from Zepto/Instamart gets mixed up with Blinkit data during synthesis, skewing Blinkit's friction insights. | The schema now includes `app_name`. The Aggregation Module must strictly group-by `app_name` before calculating frequency distributions. |
| **Thin Data for Certain Segments** | Not enough evidence to answer one of the 8 core research questions reliably. Synthesis module might hallucinate an answer. | Explicitly prompt the Synthesis LLM: *"If there is insufficient data to answer a question confidently, explicitly state 'Insufficient evidence in the sample' rather than guessing."* |
| **Dashboard Cross-Tab Clutter** | Too many combinations in cross-tabulations (e.g., `friction_type` x `segment_signal`) result in mostly empty cells. | Apply a minimum threshold (e.g., >3 occurrences) for a pattern to be highlighted in the Aggregation Module. Group low-frequency items under "Other". |
