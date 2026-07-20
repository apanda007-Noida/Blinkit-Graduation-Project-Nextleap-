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
  
  const [aiJson, setAiJson] = useState("");
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
    setAiJson("");
    setResults(null);
    setStatus("Inputs cleared.");
  };

  const generatePrompt = () => {
    const hasData = Object.values(inputs).some(val => val.trim().length > 0);
    if (!hasData) {
      setStatus("Error: Paste at least one source before generating the prompt.");
      return;
    }

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
      "confidence": "high, medium, or low",
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

  const renderDashboard = () => {
    if (!aiJson.trim()) {
      setStatus("Error: Paste the JSON response from the AI first.");
      return;
    }

    try {
      // Strip markdown formatting if the model accidentally included it
      const cleanJson = aiJson.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
      const data = JSON.parse(cleanJson);
      
      if (!data.themes || !data.answers) {
        throw new Error("Invalid JSON structure. Ensure it matches the requested schema.");
      }

      setResults(data);
      setStatus(`✅ Dashboard rendered successfully — ${data.themes.length} themes found.`);
      
      const newHistoryItem = {
        id: Date.now(),
        date: new Date().toLocaleString(),
        title: data.themes?.[0]?.title || "Manual Analysis Run",
        data
      };
      const updatedHistory = [newHistoryItem, ...history].slice(0, 10);
      setHistory(updatedHistory);
      localStorage.setItem("blinkit_research_history", JSON.stringify(updatedHistory));
      
      window.scrollTo({ top: document.body.scrollHeight / 2, behavior: 'smooth' });
    } catch (error: any) {
      setStatus(`JSON Parsing Error: ${error.message}. Make sure you only pasted the JSON block.`);
      setResults(null);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="eyebrow">Growth · Blinkit</div>
      <h1 className="dashboard-title">Category Discovery Engine</h1>
      <div className="dashboard-sub">
        <strong>Zero-Cost Architecture Mode:</strong> Since programmatic API access is restricted, this engine acts as a Prompt Generator. Paste your data, click "Copy Prompt", paste it into ChatGPT/Claude (free tier), and paste the resulting JSON back here to render the dashboard!
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

      <div className="toolbar" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '30px', marginBottom: '30px' }}>
        <button className="primary-btn" onClick={generatePrompt}>1. COPY PROMPT TO CLIPBOARD</button>
        <button className="secondary-btn" onClick={loadSample}>LOAD SAMPLE BATCH</button>
        <button className="secondary-btn" onClick={clearInputs}>CLEAR ALL</button>
      </div>
      
      <div className="field-container" style={{ marginBottom: '20px' }}>
        <label className="field-label" style={{ color: 'var(--primary-accent)', fontSize: '1.2rem' }}>2. Paste AI JSON Response Here</label>
        <textarea 
          style={{ minHeight: '150px', border: '1px solid var(--primary-accent)' }}
          value={aiJson}
          onChange={e => setAiJson(e.target.value)}
          placeholder="Paste the raw JSON response from ChatGPT or Claude here..."
        />
      </div>

      <div className="toolbar">
        <button className="primary-btn" onClick={renderDashboard}>3. RENDER DASHBOARD</button>
      </div>

      {status && (
        <div className="status-message" style={{ color: status.includes('Error') ? '#ff6b6b' : status.includes('✅') ? '#4ade80' : 'var(--text-secondary)' }}>
          {status}
        </div>
      )}

      {results && (
        <div className="results-container">
          <div className="themes-section">
            <h2 className="section-heading">Behavioral Themes & Barriers</h2>
            <div className="themes-grid">
              {results.themes?.map((theme: any, index: number) => (
                <div key={index} className="theme-card">
                  <div className="theme-header">
                    <h3 className="theme-title">{theme.title}</h3>
                    <span className={`confidence-badge ${theme.confidence?.toLowerCase()}`}>
                      {theme.confidence} confidence
                    </span>
                  </div>
                  <div className="theme-insight">{theme.insight}</div>
                  <div className="theme-example">
                    <strong>Paraphrased Example:</strong> "{theme.paraphrased_example}"
                  </div>
                  <div className="theme-footer">
                    <span className="segment-tag">{theme.segment}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="answers-section">
            <h2 className="section-heading">Answers to Research Brief</h2>
            <div className="answers-list">
              {results.answers?.map((ans: any, index: number) => (
                <div key={index} className="answer-item">
                  <div className="question-text">Q: {ans.question}</div>
                  <div className="answer-text">{ans.answer}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="answers-section" style={{ marginTop: '40px' }}>
            <h2 className="section-heading">Validation Flags (1:1 Interviews)</h2>
            <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary)' }}>
              {results.validation_flags?.map((flag: string, index: number) => (
                <li key={index} style={{ marginBottom: '10px', lineHeight: '1.5' }}>{flag}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
      
      {history.length > 0 && (
        <div className="history-section">
          <h2 className="section-heading">Recent Analyses</h2>
          <div className="history-list">
            {history.map(item => (
              <div key={item.id} className="history-item" onClick={() => {
                setResults(item.data);
                setStatus(`Loaded previous analysis: ${item.title}`);
                window.scrollTo({ top: document.body.scrollHeight / 2, behavior: 'smooth' });
              }}>
                <span className="history-title">{item.title}</span>
                <span className="history-date">{item.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
