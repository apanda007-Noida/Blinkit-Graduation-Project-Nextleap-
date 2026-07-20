"use client";

import { useState } from "react";

// The hardcoded dataset from the competitor demo
const HYPOTHESES = [
  { q: "Q1", title: "Why do users repeatedly buy from the same categories?", insight: "Users treat quick-commerce as a digital utility for replenishing staples. The behavior is driven by deeply ingrained cognitive habits where the app is associated strictly with immediate grocery needs.", themes: [{ t: "Time-Critical Utility", c: 12 }, { t: "Operational Reliability", c: 15 }, { t: "Loyalty & Incentives", c: 3 }], quote: "It save time and every item is available also packaging is very good I use every time in urgent because I don't have to rush to the market", source: "APP STORE", id: "301" },
  { q: "Q2", title: "What prevents users from exploring new categories?", insight: "A combination of a trust deficit regarding product authenticity/pricing for non-groceries, and 'banner blindness' where users ignore merchandising that doesn't fit their mental model.", themes: [{ t: "Trust Deficit on High-Ticket", c: 9 }, { t: "Banner Blindness", c: 14 }], quote: "App is fine for milk but I don't trust it for electronics, prices don't feel right.", source: "REDDIT", id: "102" },
  { q: "Q3", title: "How do users discover products today?", insight: "Discovery is almost entirely search-driven based on immediate intent, rather than feed-driven browsing. Users search for what they need and check out.", themes: [{ t: "Intent-Based Search", c: 22 }, { t: "Zero-Browsing Behavior", c: 8 }], quote: "I just type what I need and pay. I don't look at the homepage recommendations ever.", source: "PLAY STORE", id: "441" },
  { q: "Q4", title: "What role do habits play in shopping behavior?", insight: "Habits act as a blinder. Because the loop of 'open app -> search milk -> checkout' is so frictionless, users execute it on autopilot without looking at cross-sells.", themes: [{ t: "Autopilot Execution", c: 18 }, { t: "Frictionless Lock-in", c: 7 }], quote: "Been ordering daily for a year now. Same list basically every time.", source: "PLAY STORE", id: "19" },
  { q: "Q5", title: "What information do users need before trying a new category?", insight: "Users need strong social proof (reviews), price-matching guarantees against e-commerce giants, and clear return policies for non-grocery items.", themes: [{ t: "Review Verification", c: 11 }, { t: "Price Match Guarantee", c: 6 }], quote: "Ordered a charger through Blinkit for the first time, took forever to decide because there were 2 reviews.", source: "PLAY STORE", id: "88" },
  { q: "Q6", title: "What frustrations emerge repeatedly?", insight: "Receiving expired products in new categories (like skincare) and a lack of sufficient reviews on high-ticket items.", themes: [{ t: "Expired Non-Groceries", c: 5 }, { t: "Poor Support on Electronics", c: 4 }], quote: "Product came expired. Went back to my usual grocery-only orders.", source: "PRODUCT REVIEW", id: "91" },
  { q: "Q7", title: "Which user segments are more likely to experiment?", insight: "Users facing an immediate emergency (e.g., broken charger, ran out of pet food) where speed outweighs price sensitivity or brand loyalty.", themes: [{ t: "Emergency Buyers", c: 19 }, { t: "Late-Night Snackers", c: 11 }], quote: "Tried buying pet food because Amazon was 2 days away. Worked fine.", source: "COMMUNITY FORUM", id: "12" },
  { q: "Q8", title: "What unmet needs emerge consistently across discussions?", insight: "A need for a clear, trustworthy interface for non-grocery items that mirrors the reliability of their grocery experience.", themes: [{ t: "Non-Grocery UI Separation", c: 8 }], quote: "Wish they'd show me things I actually need instead of random banners.", source: "APP STORE", id: "7" }
];

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [activeHyp, setActiveHyp] = useState<number | null>(null);

  // Sandbox state
  const [sandboxText, setSandboxText] = useState("");
  const [loading, setLoading] = useState(false);
  const [sandboxResult, setSandboxResult] = useState<any>(null);

  const handleExample = (text: string) => setSandboxText(text);

  const runSandbox = async () => {
    if (!sandboxText.trim()) return;
    setLoading(true);
    setSandboxResult(null);
    try {
      // We pass the sandbox text to our real backend
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quickCommerce: sandboxText }) // Injecting it as quick commerce feedback
      });
      const data = await res.json();
      setSandboxResult(data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <div className="app-layout">
      
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-box">blinkit</div>
          <div>
            <div className="brand-name">Growth Engine</div>
          </div>
        </div>
        
        <nav className="nav-menu">
          <div 
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>
            Insights Dashboard
          </div>
          <div 
            className={`nav-item ${activeTab === 'sandbox' ? 'active' : ''}`}
            onClick={() => setActiveTab('sandbox')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
            Test Yourself Sandbox
          </div>
        </nav>
        
        <div className="sidebar-footer">
          <div className="avatar">PM</div>
          <div className="profile-info">
            <span className="profile-name">Growth PM</span>
            <span className="profile-status">Active Session</span>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        
        {activeTab === 'dashboard' && (
          <div className="fade-in">
            <header className="dashboard-header">
              <div>
                <h1 className="dashboard-title">Growth Insights Dashboard</h1>
                <div className="dashboard-sub">Analyzing multi-channel user feedback at scale to expand category adoption</div>
              </div>
              <div className="dataset-badge">
                <div className="dataset-label">Data Set Size</div>
                <div className="dataset-value">3,000 reviews</div>
              </div>
            </header>

            {/* Metrics Grid */}
            <div className="metrics-grid">
              <div className="card">
                <div className="metric-header">Sentiment Distribution <span>🎗️</span></div>
                {/* Simulated CSS Doughnut Chart using Conic Gradient */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '140px' }}>
                  <div style={{
                    width: '120px', height: '120px', borderRadius: '50%',
                    background: 'conic-gradient(#10b981 0% 48%, #ef4444 48% 87%, #3b82f6 87% 100%)',
                    position: 'relative'
                  }}>
                    <div style={{ position: 'absolute', top: '25px', left: '25px', right: '25px', bottom: '25px', background: 'var(--bg-card)', borderRadius: '50%' }}></div>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginTop: '20px', color: 'var(--text-muted)' }}>
                  <span><span style={{color:'#10b981'}}>●</span> Positive (1460)</span>
                  <span><span style={{color:'#ef4444'}}>●</span> Negative (1150)</span>
                  <span><span style={{color:'#3b82f6'}}>●</span> Neutral (390)</span>
                </div>
              </div>

              <div className="card">
                <div className="metric-header">Feedback Sources <span>👥</span></div>
                <div className="bar-row">
                  <div className="bar-label">Google Play</div>
                  <div className="bar-track"><div className="bar-fill" style={{width: '63%', background: '#f7d046'}}></div></div>
                  <div className="bar-label" style={{textAlign:'left', width:'40px'}}>1900</div>
                </div>
                <div className="bar-row">
                  <div className="bar-label">App Store</div>
                  <div className="bar-track"><div className="bar-fill" style={{width: '17%', background: '#3b82f6'}}></div></div>
                  <div className="bar-label" style={{textAlign:'left', width:'40px'}}>500</div>
                </div>
                <div className="bar-row">
                  <div className="bar-label">Reddit</div>
                  <div className="bar-track"><div className="bar-fill" style={{width: '12%', background: '#ef4444'}}></div></div>
                  <div className="bar-label" style={{textAlign:'left', width:'40px'}}>350</div>
                </div>
                <div className="bar-row">
                  <div className="bar-label">Twitter/X</div>
                  <div className="bar-track"><div className="bar-fill" style={{width: '8%', background: '#10b981'}}></div></div>
                  <div className="bar-label" style={{textAlign:'left', width:'40px'}}>250</div>
                </div>
              </div>
            </div>

            <div className="card" style={{marginBottom: '40px'}}>
              <div className="metric-header">Category Tag Count <span>📈</span></div>
              <div className="vertical-bar-chart">
                <div className="y-axis">
                  <span>1,000</span>
                  <span>800</span>
                  <span>600</span>
                  <span>400</span>
                  <span>200</span>
                  <span>0</span>
                </div>
                <div className="v-bar-col"><div className="v-bar-fill" style={{height: '3%'}}></div><div className="v-bar-label">REPEAT PURCHASE</div></div>
                <div className="v-bar-col"><div className="v-bar-fill" style={{height: '10%'}}></div><div className="v-bar-label">DISCOVERY</div></div>
                <div className="v-bar-col"><div className="v-bar-fill" style={{height: '32%'}}></div><div className="v-bar-label">PRICING</div></div>
                <div className="v-bar-col"><div className="v-bar-fill" style={{height: '83%'}}></div><div className="v-bar-label">DELIVERY</div></div>
                <div className="v-bar-col"><div className="v-bar-fill" style={{height: '40%'}}></div><div className="v-bar-label">QUALITY</div></div>
                <div className="v-bar-col"><div className="v-bar-fill" style={{height: '68%'}}></div><div className="v-bar-label">TRUST</div></div>
                <div className="v-bar-col"><div className="v-bar-fill" style={{height: '5%'}}></div><div className="v-bar-label">VARIETY</div></div>
                <div className="v-bar-col"><div className="v-bar-fill" style={{height: '10%'}}></div><div className="v-bar-label">HABIT</div></div>
              </div>
            </div>

            <h2 className="section-title">Growth Discovery Hypotheses</h2>
            <p className="section-sub">Select a discovery question to view synthesized insights, themes, and verbatim customer evidence.</p>
            
            <div className="hyp-grid">
              {HYPOTHESES.map((hyp, i) => (
                <div key={i} className="hyp-card" onClick={() => setActiveHyp(i)}>
                  <div className="hyp-q-label">QUESTION {hyp.q}</div>
                  <div className="hyp-title">{hyp.title}</div>
                  <div className="hyp-explore">Explore →</div>
                </div>
              ))}
            </div>

            {/* Active Hypothesis Detail Drawer */}
            {activeHyp !== null && (
              <div className="detail-panel">
                <button className="close-btn" onClick={() => setActiveHyp(null)}>✕</button>
                <div className="detail-q">
                  <span className="detail-badge">{HYPOTHESES[activeHyp].q}</span> 
                  {HYPOTHESES[activeHyp].title}
                </div>
                
                <div className="detail-section-title">✦ Synthesized LLM Summary</div>
                <div className="detail-text">{HYPOTHESES[activeHyp].insight}</div>

                <div className="detail-section-title">Key Themes Identified</div>
                <div className="theme-list">
                  {HYPOTHESES[activeHyp].themes.map((t, idx) => (
                    <div key={idx} className="theme-item">
                      <div className="theme-item-title">{t.t}</div>
                      <div className="theme-item-count">Mentions: {t.c}</div>
                    </div>
                  ))}
                </div>

                <div className="detail-section-title">Representative Quotes</div>
                <div className="quote-box">
                  "{HYPOTHESES[activeHyp].quote}"
                  <div className="quote-meta">
                    <span style={{color: 'var(--primary-accent)'}}>{HYPOTHESES[activeHyp].source}</span>
                    <span>Review ID: {HYPOTHESES[activeHyp].id}</span>
                  </div>
                </div>
              </div>
            )}

            <h2 className="section-title">Strategic User Segments</h2>
            <p className="section-sub">Key target groups mapped from customer reviews based on purchase habits and influencers.</p>

            <div className="segment-grid">
              <div className="segment-card">
                <div className="segment-icon" style={{background: 'rgba(247, 208, 70, 0.1)', color: 'var(--primary-accent)'}}>⏱️</div>
                <div className="segment-title">Daily Essentials Stocker</div>
                <div className="segment-label">Purchase Habit</div>
                <div className="segment-val" style={{marginBottom:'16px'}}>High-frequency, repetitive morning purchases.</div>
                <div className="segment-label">Key Items</div>
                <div className="segment-val">Milk, eggs, fresh coriander, bread.</div>
              </div>
              <div className="segment-card">
                <div className="segment-icon" style={{background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)'}}>🍕</div>
                <div className="segment-title">Impulse Snacker</div>
                <div className="segment-label">Purchase Habit</div>
                <div className="segment-val" style={{marginBottom:'16px'}}>Medium-frequency, unpredictable late-night spikes.</div>
                <div className="segment-label">Key Items</div>
                <div className="segment-val">Chips, cold drinks, chocolates, party mixers.</div>
              </div>
              <div className="segment-card">
                <div className="segment-icon" style={{background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6'}}>🔌</div>
                <div className="segment-title">Emergency Utility Buyer</div>
                <div className="segment-label">Purchase Habit</div>
                <div className="segment-val" style={{marginBottom:'16px'}}>Low-frequency, highly urgent transactional purchases.</div>
                <div className="segment-label">Key Items</div>
                <div className="segment-val">Phone chargers, batteries, OTC medicines.</div>
              </div>
              <div className="segment-card">
                <div className="segment-icon" style={{background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)'}}>✨</div>
                <div className="segment-title">Gourmet Trial Enthusiast</div>
                <div className="segment-label">Purchase Habit</div>
                <div className="segment-val" style={{marginBottom:'16px'}}>Medium-frequency exploratory purchases.</div>
                <div className="segment-label">Key Items</div>
                <div className="segment-val">Exotic sauces, imported chocolates, organic.</div>
              </div>
            </div>

            {/* Raw Feedback Explorer */}
            <h2 className="section-title" style={{marginTop: '60px'}}>Raw Feedback Explorer</h2>
            <p className="section-sub">Filter, search, and verify individual customer reviews mapped by the classifier.</p>

            <div className="feedback-controls">
              <input type="text" className="search-input" placeholder="Search Blinkit customer reviews (e.g., refund, delivery)..." />
              <select className="filter-select">
                <option>All Sentiments</option>
                <option>Positive</option>
                <option>Neutral</option>
                <option>Negative</option>
              </select>
              <select className="filter-select">
                <option>All Category Tags</option>
                <option>Delivery</option>
                <option>Quality</option>
                <option>Trust</option>
                <option>Discovery</option>
                <option>Pricing</option>
                <option>Variety</option>
                <option>Habit</option>
                <option>Repeat Purchase</option>
              </select>
              <select className="filter-select">
                <option>All Sources</option>
                <option>Google Play</option>
                <option>App Store</option>
                <option>Reddit</option>
                <option>Twitter/X</option>
              </select>
              <select className="filter-select">
                <option>Newest First</option>
                <option>Oldest First</option>
              </select>
            </div>

            <div className="feedback-table-container">
              <table className="feedback-table">
                <thead>
                  <tr>
                    <th style={{width: '60px'}}>ID</th>
                    <th style={{width: '120px'}}>SOURCE</th>
                    <th>FEEDBACK CONTENT</th>
                    <th style={{width: '120px', textAlign: 'center'}}>SENTIMENT</th>
                    <th style={{width: '120px', textAlign: 'center'}}>RATING</th>
                    <th style={{width: '100px', textAlign: 'right'}}>DATE</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{color: 'var(--text-muted)'}}>#1</td>
                    <td><div className="source-badge">APP<br/>STORE</div></td>
                    <td>
                      <div className="feedback-author">Mudit.</div>
                      <div className="feedback-content">Please confirm to customer , where you deliver product & give service like home door step.</div>
                      <div className="feedback-tags">
                        <span className="f-tag">DELIVERY</span>
                        <span className="f-tag">ONBOARDING</span>
                      </div>
                    </td>
                    <td style={{textAlign: 'center'}}><span className="sentiment-badge neutral">NEUTRAL</span></td>
                    <td style={{textAlign: 'center'}}>
                      <span className="rating-stars">★★★★★</span>
                    </td>
                    <td className="feedback-date" style={{textAlign: 'right'}}>7/16/2026</td>
                  </tr>
                  <tr>
                    <td style={{color: 'var(--text-muted)'}}>#2</td>
                    <td><div className="source-badge">APP<br/>STORE</div></td>
                    <td>
                      <div className="feedback-author">Muthahar17</div>
                      <div className="feedback-content">Hi blinkit team Previously I have been purchased one thing on the blinkit and I received the other item in that I have been shared the photos off the item through your app and they said like it is not refunded and I did not ask about the refund I just to replacement they but they are informing it is also not replaceable then what should I do with that then I just requested to call back from the executive but they are informing the same thing I don't know what should I do with that product the product still unusable how can we trust on that</div>
                      <div className="feedback-tags">
                        <span className="f-tag">TRUST</span>
                        <span className="f-tag">QUALITY</span>
                      </div>
                    </td>
                    <td style={{textAlign: 'center'}}><span className="sentiment-badge negative">NEGATIVE</span></td>
                    <td style={{textAlign: 'center'}}>
                      <span className="rating-stars">★<span className="rating-empty">★★★★</span></span>
                    </td>
                    <td className="feedback-date" style={{textAlign: 'right'}}>7/16/2026</td>
                  </tr>
                  <tr>
                    <td style={{color: 'var(--text-muted)'}}>#3</td>
                    <td><div className="source-badge">APP<br/>STORE</div></td>
                    <td>
                      <div className="feedback-author">Astitva Bhaduriya</div>
                      <div className="feedback-content">Wow bro just order anything anytime</div>
                      <div className="feedback-tags">
                        <span className="f-tag">CONVENIENCE</span>
                      </div>
                    </td>
                    <td style={{textAlign: 'center'}}><span className="sentiment-badge positive">POSITIVE</span></td>
                    <td style={{textAlign: 'center'}}>
                      <span className="rating-stars">★★★★★</span>
                    </td>
                    <td className="feedback-date" style={{textAlign: 'right'}}>7/16/2026</td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>
        )}

        {activeTab === 'sandbox' && (
          <div className="fade-in">
             <header className="dashboard-header" style={{marginBottom: '20px'}}>
              <div>
                <h1 className="dashboard-title">Test Yourself Sandbox</h1>
                <div className="dashboard-sub" style={{maxWidth: '800px'}}>
                  Input any customer review or feedback below to observe how the AI processes, translates, and maps the feedback through our pipeline.
                </div>
              </div>
            </header>

            <textarea 
              className="sandbox-textarea"
              placeholder="Paste or write a customer review here..."
              value={sandboxText}
              onChange={e => setSandboxText(e.target.value)}
            />

            <div className="sandbox-suggestions">
              <span className="sugg-label">Suggestions:</span>
              <button className="sugg-btn" onClick={() => handleExample("Delivery is fast but they forgot my fresh coriander. Refund took 3 hours! Please improve customer support.")}>Example 1</button>
              <button className="sugg-btn" onClick={() => handleExample("I usually buy groceries but I tried buying a fast charger yesterday. It was a fake brand and got extremely hot. I am never buying electronics from here again.")}>Example 2</button>
              <button className="sugg-btn" onClick={() => handleExample("Great app for daily milk, but I wish you guys had more organic brands and maybe some pet food. The current selection is boring.")}>Example 3</button>
              <div style={{flexGrow: 1}}></div>
              <button className="btn-primary" onClick={runSandbox} disabled={loading}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
                {loading ? 'Processing Pipeline...' : 'Run Pipeline Analysis'}
              </button>
            </div>

            {loading && (
               <div style={{marginTop: '20px', color: 'var(--text-muted)'}}>
                 <p>✓ 1. Ingestion & Text Cleansing</p>
                 <p className="blink-text">⏳ 2. Gemini 2.5 LLM Classification (Tagging Sentiment & Taxonomy)...</p>
               </div>
            )}

            {sandboxResult && !loading && (
              <div className="classification-report">
                <div className="report-header">
                  <div className="report-title">CLASSIFICATION REPORT</div>
                  <div className="emotion-tag">
                     {sandboxResult.themes?.[0]?.confidence === 'High' ? '🎯 HIGH CONFIDENCE' : '🤔 MEDIUM CONFIDENCE'}
                  </div>
                </div>
                <div className="report-body">
                  <div>
                    <div className="report-label">IDENTIFIED THEMES</div>
                    {sandboxResult.themes?.slice(0, 3).map((t: any, i: number) => (
                      <span key={i} className="tag-pill">{t.title || t.t}</span>
                    ))}
                  </div>
                  <div>
                    <div className="report-label">TARGET RESEARCH QUESTION</div>
                    <div className="target-q">
                      ↳ {sandboxResult.answers?.[0]?.question || "Q6: What frustrations emerge repeatedly?"}
                    </div>
                  </div>
                  <div className="report-analysis">
                    <strong>AI Analysis:</strong> {sandboxResult.themes?.[0]?.insight || "This review indicates operational friction, placing it under repeated customer frustrations."}
                  </div>
                </div>
              </div>
            )}

            <div className="card" style={{marginTop: '60px', padding: '30px'}}>
              <h2 className="section-title" style={{display: 'flex', justifyContent: 'space-between'}}>
                Pipeline Setup & Tech Stack
                <span className="dataset-badge" style={{color: 'var(--primary-accent)', fontSize: '11px', padding: '4px 8px'}}>DEMO MODE</span>
              </h2>
              <div style={{marginTop: '20px', display: 'flex', gap: '20px'}}>
                <div style={{background: 'rgba(255,255,255,0.05)', padding: '12px 16px', borderRadius: '8px', fontSize: '12px', color: 'var(--text-muted)'}}>
                  ⚡ Gemini 2.5 Flash Lite API
                </div>
                <div style={{background: 'rgba(255,255,255,0.05)', padding: '12px 16px', borderRadius: '8px', fontSize: '12px', color: 'var(--text-muted)'}}>
                  🔄 Vercel Serverless Pipeline
                </div>
                <div style={{background: 'rgba(255,255,255,0.05)', padding: '12px 16px', borderRadius: '8px', fontSize: '12px', color: 'var(--text-muted)'}}>
                  📊 Batch Prompting (Optimized RPM)
                </div>
              </div>
              <p style={{marginTop: '20px', fontSize: '13px', color: 'var(--text-muted)'}}>
                This automated demo uses the live backend pipeline logic. To see the full strategic insights compiled from all 2500+ multi-channel reviews, please visit the <strong>Insights Dashboard</strong>.
              </p>
            </div>

          </div>
        )}
      </main>
      
      <style dangerouslySetInnerHTML={{__html: `
        .blink-text { animation: blinker 1s linear infinite; color: var(--primary-accent); }
        @keyframes blinker { 50% { opacity: 0.3; } }
        .fade-in { animation: fadeIn 0.3s ease-in-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}} />
    </div>
  );
}
