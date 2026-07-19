# Context: Blinkit Category Discovery Feedback Engine

## Problem Statement & Goal
Blinkit wants to increase the percentage of monthly active customers buying from new categories. To inform this, the product team needs evidence-backed answers explaining repeat-category behavior vs. barriers to exploring new categories. 

The goal is to build a one-time, batch data pipeline (an "infrastructure engine," not a SaaS product) that ingests unstructured public feedback, tags it against a consistent behavioral schema, and synthesizes the data into a report answering 8 core research questions.

## Core Research Questions
1. Why do users repeatedly buy from the same categories?
2. What prevents users from exploring new categories?
3. How do users discover products today?
4. What role do habits play in shopping behavior?
5. What information do users need before trying a new category?
6. What frustrations emerge repeatedly?
7. Which user segments are more likely to experiment?
8. What unmet needs emerge consistently across discussions?

## Technical Approach & The "Free-Tier" Constraint
A defining constraint of this project is the **zero-cost API budget**:
*   **Ingestion**: Focuses on free tools (`app-store-scraper`, `google-play-scraper`, free PRAW for Reddit) and a strict manual curation protocol (no cherry-picking) for forums, social media, and product reviews. Target volume is ~2600+ items.
*   **AI Tagging (The Bottleneck)**: Relies on free-tier chat interfaces (e.g., Claude.ai or ChatGPT). Because there is no programmatic API access, data must be chunked and passed into the chat UI in batches. *(Note: There is an open investigation into whether the Antigravity agent can drive a browser session to automate this copy-paste loop).*
*   **Aggregation**: Computes frequency distributions and cross-tabs of the tagged schema.
*   **Synthesis**: Utilizes the free-tier chat interface to evaluate aggregated rollups and evidence quotes to generate the final Markdown report.

## Schema Highlights & Privacy
*   **Tags Included**: `source`, `app_name`, `date`, `category_mentioned`, `sentiment`, `trigger_type`, `friction_type`, `segment_signal`, and verbatim `evidence_quote`s.
*   **PII & Language**: Personally identifying details (like usernames) must be stripped from evidence quotes. The v1 scope is strictly English-only; non-English/Hinglish posts will be filtered out entirely.

## Out of Scope
*   Real-time / continuously-updating pipelines.
*   Paid API usage or paid LLM API calls.
*   User-facing UI (beyond basic dashboards/tables).
*   Fine-tuning models.
