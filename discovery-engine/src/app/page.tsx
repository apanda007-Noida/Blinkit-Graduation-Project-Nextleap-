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

const RESEARCH_QUESTIONS = [
  "Why do users repeatedly buy from the same categories?",
  "What prevents users from exploring new categories?",
  "How do users discover products today?",
  "What role do habits play in shopping behavior?",
  "What information do users need before trying a new category?",
  "What frustrations emerge repeatedly?",
  "Which user segments are more likely to experiment?",
  "What unmet needs emerge consistently across discussions?"
];

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
  
  // Hybrid Fallback State
  const [fallbackMode, setFallbackMode] = useState(false);
  const [aiJson, setAiJson] = useState("");

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
    setFallbackMode(false);
  };

  const clearInputs = () => {
    setInputs({
      appStore: "", playStore: "", reddit: "", communityForums: "",
      socialMedia: "", productReviews: "", quickCommerce: ""
    });
    setResults(null);
    setFallbackMode(false);
    setAiJson("");
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
    setFallbackMode(false);
    
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputs)
      });
      
      const data = await res.json();
      
      if (data.error) {
        // If the API returns a quota error, trigger Fallback Mode!
        if (data.error.includes("429") || data.error.includes("limit: 0")) {
          setFallbackMode(true);
          setStatus(`⚠️ API Quota Exceeded (limit: 0). Falling back to Zero-Cost Manual Mode!`);
        } else {
          setFallbackMode(true);
          setStatus(`⚠️ API Failed. Switched to Fallback Mode. Error: ${data.error.substring(0, 50)}...`);
        }
        setResults(null);
      } else {
        setResults(data);
        setStatus(`Analysis complete — ${data.themes?.length || 0} themes found.`);
        saveToHistory(data);
      }
    } catch (error: any) {
      setFallbackMode(true);
      setStatus("⚠️ Network error hitting the API. Switched to Fallback Mode.");
      setResults(null);
    }
    
    setLoading(false);
  };

  const saveToHistory = (data: any) => {
    const newHistoryItem = {
      id: Date.now(),
      date: new Date().toLocaleString(),
      title: data.themes?.[0]?.title || "Analysis Run",
      data
    };
    const updatedHistory = [newHistoryItem, ...history].slice(0, 10);
    setHistory(updatedHistory);
    localStorage.setItem("blinkit_research_history", JSON.stringify(updatedHistory));
  };

  const loadHistoryItem = (item: any) => {
    setResults(item.data);
    setStatus(`Loaded previous analysis: ${item.title}`);
    window.scrollTo({ top: document.body.scrollHeight / 2, behavior: 'smooth' });
  };

  // --- FALLBACK LOGIC ---
  const generatePrompt = () => {
    const promptText = `You are a growth-analytics engine for a Product Manager researching why quick-commerce users (Blinkit) don't buy from new categories.
You will be given raw, unstructured user feedback from several sources.
Your job:
1. Identify 4-7 recurring THEMES that explain repeat-category shopping behavior and barriers to category exploration. Ground every theme only in patterns actually present in the provided text.
2. Direct answers to each of the 8 research questions based only on the evidence.
3. List 3-5 validation_flags to check in follow-up 1:1 user interviews.

The 8 research questions, in order, are:
${RESEARCH_QUESTIONS.map((q,i)=>`${i+1}. ${q}`).join('\n')}

RAW FEEDBACK:
APP STORE REVIEWS:\n${inputs.appStore || '(none provided)'}
PLAY STORE REVIEWS:\n${inputs.playStore || '(none provided)'}
REDDIT DISCUSSIONS:\n${inputs.reddit || '(none provided)'}
COMMUNITY FORUMS:\n${inputs.communityForums || '(none provided)'}
SOCIAL MEDIA CONVERSATIONS:\n${inputs.socialMedia || '(none provided)'}
PRODUCT REVIEWS:\n${inputs.productReviews || '(none provided)'}
QUICK-COMMERCE DISCUSSIONS:\n${inputs.quickCommerce || '(none provided)'}

CRITICAL INSTRUCTION: You MUST return ONLY a raw, valid JSON object and absolutely nothing else. Do not include markdown code blocks like \`\`\`json. The JSON must exactly match this structure:
{
  "themes": [
    {
      "title": "String",
      "insight": "String",
      "confidence": "High, Medium, or Low",
      "paraphrased_example": "String",
      "related_questions": [1, 2],
      "segment": "String"
    }
  ],
  "answers": [
    {
      "question": "String",
      "answer": "String"
    }
  ],
  "validation_flags": ["String", "String"]
}`;

    navigator.clipboard.writeText(promptText)
      .then(() => setStatus("✅ Prompt copied to clipboard! Paste it into ChatGPT or Claude, then copy the JSON they return."))
      .catch(() => setStatus("Error: Could not copy to clipboard. Please check browser permissions."));
  };

  const renderFallbackDashboard = () => {
    if (!aiJson.trim()) {
      setStatus("Error: Paste the JSON response from the AI first.");
      return;
    }
    try {
      const cleanJson = aiJson.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
      const data = JSON.parse(cleanJson);
      if (!data.themes || !data.answers) throw new Error("Invalid JSON structure.");
      setResults(data);
      setStatus(`✅ Dashboard rendered successfully from manual JSON — ${data.themes.length} themes found.`);
      saveToHistory(data);
      setFallbackMode(false);
      window.scrollTo({ top: document.body.scrollHeight / 2, behavior: 'smooth' });
    } catch (error: any) {
      setStatus(`JSON Parsing Error: ${error.message}. Make sure you only pasted the JSON block.`);
    }
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
        <button onClick={runAnalysis} disabled={loading} style={{ background: 'var(--primary-accent)', color: 'black' }}>
          {loading ? 'Analyzing...' : 'Run Analysis'}
        </button>
        <button className="secondary" onClick={loadSample} disabled={loading}>Load Sample Batch</button>
        <button className="secondary" onClick={clearInputs} disabled={loading}>Clear Inputs</button>
      </div>

      <div style={{ marginTop: '10px', textAlign: 'center' }}>
         <span className="status-msg" style={{ color: status.includes('⚠️') || status.includes('Error') ? '#ff6b6b' : status.includes('✅') ? '#4ade80' : 'var(--text-secondary)' }}>
           {status}
         </span>
      </div>

      {/* GRACEFUL DEGRADATION UI */}
      {fallbackMode && (
        <div style={{ marginTop: '30px', padding: '20px', background: 'rgba(255, 107, 107, 0.1)', border: '1px solid #ff6b6b', borderRadius: '8px' }}>
          <h2 style={{ color: '#ff6b6b', marginTop: 0, marginBottom: '15px' }}>Fallback Mode Activated</h2>
          <p style={{ marginBottom: '20px' }}>Your API key failed to process the request. You can instantly bypass this by copying the prompt to a free-tier AI chat (like ChatGPT or Claude) and pasting the JSON back here!</p>
          
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <button onClick={generatePrompt} style={{ background: '#ff6b6b', color: 'black', fontWeight: 'bold' }}>1. COPY PROMPT TO CLIPBOARD</button>
          </div>

          <div className="field-container" style={{ marginBottom: '20px' }}>
            <label className="field-label" style={{ color: '#ff6b6b' }}>2. Paste AI JSON Response Here</label>
            <textarea 
              style={{ minHeight: '150px', border: '1px solid #ff6b6b' }}
              value={aiJson}
              onChange={e => setAiJson(e.target.value)}
              placeholder="Paste the raw JSON response from ChatGPT or Claude here..."
            />
          </div>

          <button onClick={renderFallbackDashboard} style={{ background: '#ff6b6b', color: 'black', fontWeight: 'bold' }}>3. RENDER DASHBOARD</button>
        </div>
      )}

      <hr className="divider" />

      {!results && !fallbackMode && (
        <div className="empty-state">
          No analysis yet. Paste a batch of feedback above and run the engine.
        </div>
      )}

      {results && (
        <div className="results-container">
          
          <div className="section-title">Answers to the Research Brief</div>
          <div className="answers-list">
            {results.answers?.map((qa: any, idx: number) => (
               <div key={idx} className="qa-card" style={{ background: 'var(--bg-surface)', padding: '20px', borderRadius: '8px', marginBottom: '15px', border: '1px solid var(--border-color)' }}>
                <div className="qa-q" style={{ fontWeight: 'bold', marginBottom: '10px', color: 'var(--text-primary)' }}>{idx + 1}. {qa.question}</div>
                <div className="qa-a" style={{ color: 'var(--text-secondary)' }}>{qa.answer}</div>
              </div>
            ))}
          </div>

          <div className="section-title" style={{ marginTop: '40px' }}>Themes Surfaced</div>
          <div className="themes-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
             {results.themes?.map((t: any, idx: number) => (
              <div key={idx} className="ticket" style={{ background: 'var(--bg-surface)', padding: '20px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div className="tt-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                  <div className="tt-title" style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--text-primary)' }}>{t.title}</div>
                  <div style={{ background: t.confidence?.toLowerCase() === 'high' ? '#166534' : t.confidence?.toLowerCase() === 'low' ? '#991b1b' : '#854d0e', padding: '4px 10px', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 'bold', color: 'white' }}>
                    {t.confidence}
                  </div>
                </div>
                <div className="tt-insight" style={{ marginBottom: '15px', color: 'var(--text-secondary)' }}>{t.insight}</div>
                <div className="tt-quote" style={{ borderLeft: '3px solid var(--primary-accent)', paddingLeft: '15px', fontStyle: 'italic', color: 'var(--text-primary)', marginBottom: '15px' }}>"{t.paraphrased_example}"</div>
                <div className="tt-meta" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <span>Relates to Q{(t.related_questions || []).join(', Q')}</span>
                  <span>{t.segment}</span>
                </div>
              </div>
            ))}
          </div>

          {results.validation_flags && results.validation_flags.length > 0 && (
            <div className="flags-container" style={{ marginTop: '40px' }}>
               <div className="section-title">Validate in Part 2 Interviews</div>
               <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary)' }}>
                {results.validation_flags.map((flag: string, idx: number) => (
                  <li key={idx} style={{ marginBottom: '10px', lineHeight: '1.5' }}>{flag}</li>
                ))}
              </ul>
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
