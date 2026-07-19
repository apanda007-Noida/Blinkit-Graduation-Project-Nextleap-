# Methodology Audit & 1-Slide Explainer

This document serves as the audit trail for your PM Case Study presentation, ensuring your research is completely transparent and defensible. It also provides the summary statistics to drop directly into your "1-Slide Explainer."

---

## Part 1: 1-Slide Explainer (Summary Stats)

**Slide Title:** Data-Driven Insights: Breaking the Category Barrier

**The Engine:**
- **Pipeline:** Custom zero-cost python pipeline ingesting Play Store & App Store reviews, utilizing Google Gemini AI for structured behavioral tagging.
- **Raw Volume:** 1,500 reviews ingested, deduplicated, and strictly filtered (English-only, ≥8 words, no emojis) down to a pristine 1,363 items.
- **Sample Size:** 372 fully analyzed and synthesized qualitative reviews.

**Top Line Findings:**
1. **Trust is the Ultimate Friction:** 59% (220/372) of negative exploration experiences stem entirely from Trust/Quality doubts (e.g., expiry dates, fake electronics).
2. **The "Cautious Explorer" Segment:** We identified a massive segment of users willing to try new categories, but 84% of them are blocked exclusively by Trust/Quality.
3. **Weak Algorithmic Discovery:** Only 0.5% (2/372) of purchases were driven by algorithmic discovery, exposing a massive gap in cross-selling UX.

---

## Part 2: Methodology Audit

To ensure the research is reproducible and free of unconscious "cherry-picking" bias, the pipeline adhered to strict programmatic and manual sourcing protocols.

### 2.1 Automated Sourcing (Play Store)
- **Tool:** `google-play-scraper` (Python)
- **Parameters:** `lang='en'`, `country='in'`, `sort='NEWEST'`, `count=1500`
- **Output:** 1,500 recent, unfiltered reviews.

### 2.2 Data Normalization Rules
To ensure high-quality synthesis, the raw text pipeline applied three programmatic filters:
1. **Length:** Rejected any post under 8 words to avoid noisy, low-context reviews (e.g., "good app").
2. **Spam/Noise:** Rejected any post containing emojis, which often skew qualitative reasoning into meme-formats.
3. **Language:** Utilized `langdetect` to strictly enforce English-only processing, rejecting Hinglish and regional languages.

### 2.3 LLM Tagging Protocol
- **Model:** Google Gemini (2.0-Flash / 3.5-Flash)
- **Prompting:** The model was constrained by a strict JSON Schema forcing it to use only predefined enums (e.g., `trust-quality`, `price-sensitivity`).
- **Traceability:** The prompt forced the model to extract a ≤25 word `evidence_quote` verbatim from the original text to justify its tagging, preventing LLM hallucinations.

### 2.4 (Optional) Manual Curation Protocol
If you supplement this automated data with manual pulls from Twitter/X or Forums, follow this fixed protocol to avoid confirmation bias:
1. **Fixed Keyword List:** "blinkit new category", "blinkit trust quality", "tried blinkit for the first time".
2. **Fixed Pull Count:** Take the top 5 relevant results per keyword, in chronological order. Do not skip neutral posts.
3. **Template:** Append them to `data/manual_curation_template.csv` for merging.

*End of Methodology Audit.*
