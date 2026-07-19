# Goal Description

Build a zero-cost, single-batch data pipeline to ingest, tag, aggregate, and synthesize public feedback regarding Blinkit category discovery. This will be used to answer 8 core research questions for a PM case study.

## User Review Required

> [!IMPORTANT]
> **The Free-Tier Bottleneck Resolved**
> We have pivoted from a manual Chat UI loop to using a programmatic API key (Option 2) for Phase 3. This enables automated batch processing of all 2600+ items without human intervention.

> [!IMPORTANT]
> **Data Scope**
> We are strictly filtering out non-English posts for V1 and generalizing PII in all evidence quotes before synthesis.

## Open Questions

> 1. What API provider (Gemini, OpenAI, Groq, etc.) does the provided API key belong to? I need to know which SDK/endpoint to use in the tagging script.

## Proposed Changes

### Phase 1: Foundation & Pilot Validation
- **Environment & Scrapers Setup**: Initialize a Python environment and install `google-play-scraper`, `app-store-scraper`, `praw`, and `pandas`.
- **Schema & Prompt Definition**: Finalize the JSON tagging schema (including the new `app_name` field) and draft the strict system prompt for the free-tier LLM.
- **Manual Pilot**: Pull 20-30 items manually, paste them into ChatGPT/Claude, and refine the tagging prompt until the JSON output is consistent and schema drift is resolved.

---

### Phase 2: Zero-Cost Data Ingestion (FR1)
- **Automated Collection**: Run scrapers for Play Store (~1200-1500), App Store (~1200-1500), and Reddit (~90-110).
- **Manual Curation**: Execute the strict manual search protocol (fixed keywords, date ranges, pull counts) for Forums (~25-35), Social Media (~50-100), and Product Reviews (~10-15).
- **Normalization & Caching**: Combine all sources, deduplicate, filter out non-English content, and store as `raw_dataset.csv` locally to respect rate limits.

---

### Phase 3: AI Tagging (FR2)
- **Chunking Logic**: Write a Python script to split `raw_dataset.csv` into text batches of 15-20 items.
- **Programmatic Execution**: Write `src/ai_tagger.py` to loop through the chunks and call the LLM API using the provided key.
- **Validation & Queue**: Append valid JSON back to `tagged_dataset.csv`. Log failures into an error queue for retry.

---

### Phase 4: Aggregation & Dashboard (FR3)
- **Statistical Rollups**: Write an aggregation script to compute frequency distributions for fields like `trigger_type`, `friction_type`, and `sentiment`.
- **Cross-Tabs**: Correlate tags (e.g., mapping `friction_type` against `segment_signal`).
- **Dashboard Output**: Export these aggregated results as formatted markdown tables or simple CSV views.

---

### Phase 5: Synthesis Generation (FR4)
- **Synthesis Prompting**: Feed the aggregated rollups and PII-stripped `evidence_quote`s into the LLM chat UI to draft answers for the 8 core research questions.
- **Traceability Review**: Ensure all claims made by the LLM in the synthesis report trace back accurately to the dataset without hallucination.

---

### Phase 6: Packaging (FR5)
- **Final Deliverables**: Package the `tagged_dataset.csv`, the Markdown synthesis report, and the summary stats for the 1-slide explainer.
- **Methodology Audit**: Ensure all manual search queries and workflow steps are cleanly documented for your case study presentation.

## Verification Plan

### Automated Tests
- Run a Python schema validation script (using `json` and standard logic) against the outputs pasted from the LLM to verify the dataset conforms to the predefined tags.

### Manual Verification
- Review the initial 20-30 item pilot tagging manually.
- Sanity check the final synthesis report to ensure it explicitly answers all 8 core questions.
