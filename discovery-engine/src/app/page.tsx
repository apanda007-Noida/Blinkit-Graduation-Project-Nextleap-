"use client";

import { useState, useEffect } from "react";

const SAMPLE = {
  appStore: `1-star: "App is fine for milk and bread but I don't trust it for electronics, prices don't feel right."
4-star: "Wish they'd show me things I actually need instead of random banners."`,
  playStore: `2-star: "Ordered a charger through Blinkit for the first time, took forever to decide because there were 2 reviews."
5-star: "Been ordering groceries daily for a year now. Same list basically every time."`,
  reddit: `r/india - "Does anyone actually buy non-grocery stuff on Blinkit/Zepto? I always just think of them as the 10-min grocery app."`,
  communityForums: `User123: "I tried buying a pet food bag because Amazon delivery was 2 days away. Worked fine but wouldn't have thought of it."`,
  socialMedia: `Instagram comment on a Blinkit ad: "didn't know you guys sold this, thought you were only for grocery"`,
  productReviews: `Review on Skincare item: "Product came expired. Went back to my usual grocery-only orders."`,
  quickCommerce: `X post: "quick commerce apps are just faster kirana stores in my head, I don't associate them with anything beyond that"`
};

export default function Home() {
  const [inputs, setInputs] = useState({
    appStore: "",
    playStore: "",
    reddit: "",
    communityForums: "",
    socialMedia: "",
    productReviews: "",
    quickCommerce: ""
  });
  
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

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const loadSample = () => {
    setInputs(SAMPLE);
    setStatus("Sample data loaded.");
  };

  const clearInputs = () => {
    setInputs({
      appStore: "", playStore: "", reddit: "", communityForums: "",
      socialMedia: "", productReviews: "", quickCommerce: ""
    });
    setResults(null);
    setStatus("Inputs cleared.");
  };

  const runAnalysis = async () => {
    const hasData = Object.values(inputs).some(val => val.trim().length > 0);
    if (!hasData) {
      setStatus("Error: Paste at least one source before running.");
      return;
    }

    setLoading(true);
    setStatus("Reading sources and clustering themes using Gemini AI...");
    
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputs)
      });
      
      const data = await res.json();
      
      if (data.error) {
        setStatus(`Analysis Failed: ${JSON.stringify(data)}`);
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
        Paste raw feedback from App Store, Play Store, Reddit, Forums, Social, and other channels below. 
        The engine uses Google Gemini to read across all sources, surface recurring themes, and answer the core research questions.
      </div>

      <div className="input-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        {[
          { key: 'appStore', label: 'App Store Reviews' },
          { key: 'playStore', label: 'Play Store Reviews' },
          { key: 'reddit', label: 'Reddit Discussions' },
          { key: 'communityForums', label: 'Community Forums' },
          { key: 'socialMedia', label: 'Social Media Conversations' },
          { key: 'productReviews', label: 'Product Reviews' },
          { key: 'quickCommerce', label: 'Quick-Commerce Discussions' }
        ].map((field) => (
          <div key={field.key} className="field-container">
            <label className="field-label">{field.label}</label>
            <textarea 
              style={{ minHeight: '100px' }}
              value={(inputs as any)[field.key]}
              onChange={e => handleInputChange(field.key, e.target.value)}
              placeholder={`Paste ${field.label.toLowerCase()} here...`}
            />
          </div>
        ))}
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
