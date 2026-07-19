"use client";

import { useState, useEffect } from "react";

const SAMPLE = {
  reviews: `1-star: "App is fine for milk and bread but I don't trust it for electronics, prices don't feel right and no proper reviews on the product page."
4-star: "Fast delivery as always. Wish they'd show me things I actually need instead of random banners I never click."
2-star: "Ordered a phone charger through Blinkit for the first time, took forever to decide because there were like 2 reviews and I couldn't compare brands properly."
5-star: "Been ordering groceries daily for a year now. Same list basically every time, app remembers my cart which is great."
3-star: "Tried their personal care section once because of a discount banner, product came expired. Went back to my usual grocery-only orders."`,
  reddit: `r/india - "Does anyone actually buy non-grocery stuff on Blinkit/Zepto? I always just think of them as the 10-min grocery app, forget they even sell electronics or beauty until I see an ad."
Comment: "I tried buying a pet food bag on Blinkit because Amazon delivery was 2 days away. Worked fine but I only did it because I was desperate, wouldn't have thought of it otherwise."
r/BangaloreIndia - "Quick commerce apps need to stop cluttering the home screen with categories I'll never use. I open the app to buy vegetables, not browse skincare."
Comment: "The one time I bought baby diapers on Blinkit was because my usual store was closed at 11pm. If it hadn't been an emergency I'd have gone to the pharmacy like always."`,
  social: `Instagram comment on a Blinkit ad: "didn't know you guys sold this, thought you were only for grocery"
X post: "quick commerce apps are just faster kirana stores in my head, I don't associate them with anything beyond that"`
};

export default function Home() {
  const [reviews, setReviews] = useState("");
  const [reddit, setReddit] = useState("");
  const [social, setSocial] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [results, setResults] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("blinkit_research_history");
      if (stored) setHistory(JSON.parse(stored));
    } catch(e) {}
  }, []);

  const loadSample = () => {
    setReviews(SAMPLE.reviews);
    setReddit(SAMPLE.reddit);
    setSocial(SAMPLE.social);
    setStatus("Sample data loaded.");
  };

  const clearInputs = () => {
    setReviews("");
    setReddit("");
    setSocial("");
    setResults(null);
    setStatus("Inputs cleared.");
  };

  const runAnalysis = async () => {
    if (!reviews.trim() && !reddit.trim() && !social.trim()) {
      setStatus("Error: Paste at least one source before running.");
      return;
    }

    setLoading(true);
    setStatus("Reading sources and clustering themes using Gemini AI...");
    
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviews, reddit, social })
      });
      
      const data = await res.json();
      
      if (data.error) {
        setStatus(data.error);
        setResults(null);
      } else {
        setResults(data);
        setStatus(`Analysis complete — ${data.themes?.length || 0} themes found.`);
        
        // Save to history
        const newHistoryItem = {
          id: Date.now(),
          date: new Date().toLocaleString(),
          title: data.themes?.[0]?.title || "Analysis Run",
          data
        };
        const updatedHistory = [newHistoryItem, ...history].slice(0, 10);
        setHistory(updatedHistory);
        localStorage.setItem("blinkit_research_history", JSON.stringify(updatedHistory));
      }
    } catch (error: any) {
      setStatus("Something went wrong processing the analysis.");
      setResults(null);
    }
    
    setLoading(false);
  };

  const loadHistoryItem = (item: any) => {
    setResults(item.data);
    setStatus(`Loaded previous analysis: ${item.title}`);
    window.scrollTo({ top: document.body.scrollHeight / 2, behavior: 'smooth' });
  };

  return (
    <div className="dashboard-container">
      <div className="eyebrow">Growth · Blinkit</div>
      <h1 className="dashboard-title">Category Discovery Engine</h1>
      <div className="dashboard-sub">
        Paste raw feedback from App Store / Play Store reviews, Reddit threads, and forum discussions below. 
        The engine uses Google Gemini to read across all sources, surface recurring themes, and answer the core research questions.
      </div>

      <div className="input-grid">
        <div className="field-container">
          <label className="field-label">App / Play Store Reviews</label>
          <textarea 
            value={reviews}
            onChange={e => setReviews(e.target.value)}
            placeholder="Paste review text here..."
          />
        </div>
        <div className="field-container">
          <label className="field-label">Reddit / Forum Threads</label>
          <textarea 
            value={reddit}
            onChange={e => setReddit(e.target.value)}
            placeholder="Paste thread titles or comments..."
          />
        </div>
      </div>
      
      <div className="field-container" style={{ marginBottom: '20px' }}>
        <label className="field-label">Social / Other (X, Instagram)</label>
        <textarea 
          style={{ minHeight: '80px' }}
          value={social}
          onChange={e => setSocial(e.target.value)}
          placeholder="Optional — paste anything else you've gathered..."
        />
      </div>

      <div className="toolbar">
        <button onClick={runAnalysis} disabled={loading}>
          {loading ? 'Analyzing...' : 'Run Analysis'}
        </button>
        <button className="secondary" onClick={loadSample} disabled={loading}>Load Sample Batch</button>
        <button className="secondary" onClick={clearInputs} disabled={loading}>Clear Inputs</button>
        <span className="status-msg">{status}</span>
      </div>

      <hr className="divider" />

      {!results && (
        <div className="empty-state">
          No analysis yet. Paste a batch of feedback above and run the engine.
        </div>
      )}

      {results && (
        <div className="results-container">
          
          <div className="section-title">Answers to the Research Brief</div>
          <div className="answers-list">
            {results.answers?.map((qa: any, idx: number) => (
              <div key={idx} className="qa-card">
                <div className="qa-q">{idx + 1}. {qa.question}</div>
                <div className="qa-a">{qa.answer}</div>
              </div>
            ))}
          </div>

          <div className="section-title">Themes Surfaced</div>
          <div className="themes-grid">
            {results.themes?.map((t: any, idx: number) => (
              <div key={idx} className="ticket">
                <div className="tt-head">
                  <div className="tt-title">{t.title}</div>
                  <div className={`tt-conf conf-${t.confidence?.toLowerCase() || 'medium'}`}>
                    {t.confidence}
                  </div>
                </div>
                <div className="tt-insight">{t.insight}</div>
                <div className="tt-quote">"{t.paraphrased_example}"</div>
                <div className="tt-meta">
                  <span>Relates to Q{(t.related_questions || []).join(', Q')}</span>
                  <span>{t.segment}</span>
                </div>
              </div>
            ))}
          </div>

          {results.validation_flags && results.validation_flags.length > 0 && (
            <div className="flags-container">
              <div className="section-title">Validate in Part 2 Interviews</div>
              {results.validation_flags.map((flag: string, idx: number) => (
                <div key={idx} className="flag-item">
                  <span className="flag-mark">▸</span>
                  <span>{flag}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <hr className="divider" />
      
      <div className="section-title">Past Runs (Saved to Browser)</div>
      {history.length === 0 ? (
        <div className="empty-state" style={{ padding: '20px' }}>No saved runs yet.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {history.map(item => (
            <div 
              key={item.id} 
              style={{ cursor: 'pointer', padding: '12px', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}
              onClick={() => loadHistoryItem(item)}
            >
              <span style={{ color: 'var(--primary-accent)' }}>{item.title}</span>
              <span style={{ color: 'var(--text-muted)' }}>{item.date}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
