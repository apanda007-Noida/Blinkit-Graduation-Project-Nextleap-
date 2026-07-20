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

const BASE_REVIEWS = [
  { id: 1, source: 'APP STORE', author: 'Mudit.', content: 'Please confirm to customer , where you deliver product & give service like home door step.', tags: ['DELIVERY', 'ONBOARDING'], sentiment: 'NEUTRAL', rating: 5, date: '7/16/2026' },
  { id: 2, source: 'APP STORE', author: 'Muthahar17', content: 'Hi blinkit team Previously I have been purchased one thing on the blinkit and I received the other item in that I have been shared the photos off the item through your app and they said like it is not refunded and I did not ask about the refund I just to replacement they but they are informing it is also not replaceable then what should I do with that then I just requested to call back from the executive but they are informing the same thing I don\'t know what should I do with that product the product still unusable how can we trust on that', tags: ['TRUST', 'QUALITY'], sentiment: 'NEGATIVE', rating: 1, date: '7/16/2026' },
  { id: 3, source: 'APP STORE', author: 'Astitva Bhaduriya', content: 'Wow bro just order anything anytime', tags: ['CONVENIENCE'], sentiment: 'POSITIVE', rating: 5, date: '7/16/2026' },
  { id: 4, source: 'GOOGLE PLAY', author: 'Rahul K.', content: 'Prices are way too high for basic electronics compared to Amazon.', tags: ['PRICING'], sentiment: 'NEGATIVE', rating: 2, date: '7/15/2026' },
  { id: 5, source: 'TWITTER/X', author: 'Sneha_99', content: 'Literally saved me when I needed a charger at 11 PM. Delivery in 8 mins!', tags: ['DELIVERY', 'HABIT'], sentiment: 'POSITIVE', rating: 5, date: '7/15/2026' },
  { id: 6, source: 'REDDIT', author: 'u/delhifoodie', content: 'Has anyone noticed the produce quality dropping lately? Tomatoes were completely squashed.', tags: ['QUALITY'], sentiment: 'NEGATIVE', rating: 2, date: '7/14/2026' },
  { id: 7, source: 'GOOGLE PLAY', author: 'Vikram Singh', content: 'App is good but sometimes the search doesn\'t show what I want.', tags: ['DISCOVERY'], sentiment: 'NEUTRAL', rating: 3, date: '7/14/2026' },
  { id: 8, source: 'APP STORE', author: 'Priya Sharma', content: 'I buy my daily milk and bread from here. Never disappointed.', tags: ['REPEAT PURCHASE', 'TRUST'], sentiment: 'POSITIVE', rating: 5, date: '7/13/2026' },
  { id: 9, source: 'TWITTER/X', author: 'TechBro101', content: 'Why would I buy a ₹10,000 headphone on Blinkit without any return policy clearly stated?', tags: ['TRUST'], sentiment: 'NEGATIVE', rating: 1, date: '7/13/2026' },
  { id: 10, source: 'GOOGLE PLAY', author: 'Amit Patel', content: 'Huge variety of snacks available now, loving the new categories.', tags: ['VARIETY'], sentiment: 'POSITIVE', rating: 4, date: '7/12/2026' }
];

const FIRST_NAMES = ["Rahul", "Amit", "Priya", "Sneha", "Vikram", "Neha", "Rohit", "Anjali", "Suresh", "Karan", "Pooja", "Arjun", "Aditi", "Ravi", "Megha"];
const LAST_NAMES = ["K.", "Patel", "Sharma", "Singh", "Gupta", "Verma", "Reddy", "Kumar", "Das", "Jain", "B.", "Mishra", "Nair", "Rao", "Iyer"];
const COMMENTS_POS = ["Awesome service!", "Really fast delivery.", "Saved my day.", "Good variety.", "Easy to use.", "Love the app.", "Great experience.", "Highly recommend.", "Always on time.", "Best app for quick needs.", "Super convenient.", "Never disappoints.", "Perfect for urgent items.", "Quality is amazing.", "Very smooth experience."];
const COMMENTS_NEG = ["Too expensive.", "Delivery was late.", "Poor quality.", "Customer support is unhelpful.", "App crashed.", "Items missing.", "Wrong item delivered.", "Refund takes forever.", "Bad packaging.", "Prices are higher than market.", "Terrible experience.", "Not reliable.", "Worst service.", "Driver was rude.", "App is very slow."];
const COMMENTS_NEU = ["It's okay.", "Decent app.", "Works fine most of the time.", "Average experience.", "Nothing special.", "Needs some improvements.", "UI is a bit cluttered.", "Delivery is okay.", "Prices are normal.", "Can be better.", "Just average.", "Okay for basics.", "Has some bugs.", "Not bad, not great.", "Standard quick commerce."];

const SOURCES = ['APP STORE', 'GOOGLE PLAY', 'REDDIT', 'TWITTER/X'];
const TAGS = ['DELIVERY', 'ONBOARDING', 'TRUST', 'QUALITY', 'CONVENIENCE', 'PRICING', 'HABIT', 'DISCOVERY', 'REPEAT PURCHASE', 'VARIETY'];

function seededRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

const EXACT_SENTIMENTS: string[] = [];
for (let i = 0; i < 1456; i++) EXACT_SENTIMENTS.push('POSITIVE');
for (let i = 0; i < 1146; i++) EXACT_SENTIMENTS.push('NEGATIVE');
for (let i = 0; i < 388; i++) EXACT_SENTIMENTS.push('NEUTRAL');

for (let i = EXACT_SENTIMENTS.length - 1; i > 0; i--) {
  const j = Math.floor(seededRandom(i) * (i + 1));
  [EXACT_SENTIMENTS[i], EXACT_SENTIMENTS[j]] = [EXACT_SENTIMENTS[j], EXACT_SENTIMENTS[i]];
}

function generateReview(id: number, sentiment: string) {
  let content = "";
  let rating = 3;
  if (sentiment === 'POSITIVE') {
    content = COMMENTS_POS[Math.floor(seededRandom(id * 2) * COMMENTS_POS.length)];
    rating = Math.floor(seededRandom(id * 3) * 2) + 4;
  } else if (sentiment === 'NEGATIVE') {
    content = COMMENTS_NEG[Math.floor(seededRandom(id * 2) * COMMENTS_NEG.length)];
    rating = Math.floor(seededRandom(id * 3) * 2) + 1;
  } else {
    content = COMMENTS_NEU[Math.floor(seededRandom(id * 2) * COMMENTS_NEU.length)];
    rating = 3;
  }
  
  const numTags = Math.floor(seededRandom(id * 4) * 2) + 1;
  const reviewTags = [];
  for(let i=0; i<numTags; i++) {
    reviewTags.push(TAGS[Math.floor(seededRandom(id * 5 + i) * TAGS.length)]);
  }
  const uniqueTags = Array.from(new Set(reviewTags));

  return {
    id,
    source: SOURCES[Math.floor(seededRandom(id * 6) * SOURCES.length)],
    author: `${FIRST_NAMES[Math.floor(seededRandom(id * 7) * FIRST_NAMES.length)]} ${LAST_NAMES[Math.floor(seededRandom(id * 8) * LAST_NAMES.length)]}`,
    content,
    tags: uniqueTags,
    sentiment,
    rating,
    date: `7/${Math.floor(seededRandom(id * 9) * 15) + 1}/2026`
  };
}

const ALL_REVIEWS = Array.from({ length: 3000 }, (_, i) => {
  if (i < BASE_REVIEWS.length) return BASE_REVIEWS[i];
  return generateReview(i + 1, EXACT_SENTIMENTS[i - BASE_REVIEWS.length]);
});

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [activeHyp, setActiveHyp] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSentiment, setFilterSentiment] = useState("All Sentiments");
  const [filterTag, setFilterTag] = useState("All Category Tags");
  const [filterSource, setFilterSource] = useState("All Sources");
  const [sortOrder, setSortOrder] = useState("Newest First");
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, title: '', value: '', color: '' });
  
  const filteredReviews = ALL_REVIEWS.filter(rev => {
    if (searchQuery && !rev.content.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filterSentiment !== "All Sentiments" && rev.sentiment !== filterSentiment.toUpperCase()) return false;
    if (filterTag !== "All Category Tags" && !rev.tags.includes(filterTag.toUpperCase())) return false;
    if (filterSource !== "All Sources" && rev.source !== filterSource.toUpperCase()) return false;
    return true;
  });

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    if (sortOrder === "Newest First") return b.id - a.id;
    if (sortOrder === "Oldest First") return a.id - b.id;
    if (sortOrder === "Rating: High-Low") return b.rating - a.rating;
    if (sortOrder === "Rating: Low-High") return a.rating - b.rating;
    return 0;
  });

  const totalReviews = sortedReviews.length;
  const totalPages = Math.max(1, Math.ceil(totalReviews / 10));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  
  const displayedReviews = sortedReviews.slice((safeCurrentPage - 1) * 10, safeCurrentPage * 10);

  const handleMouseMove = (e: React.MouseEvent, title: string, value: string, color: string) => {
    setTooltip({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      title,
      value,
      color
    });
  };

  const handleMouseLeave = () => {
    setTooltip(prev => ({ ...prev, visible: false }));
  };

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
                {/* SVG Donut Chart for Sentiment */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '140px' }}>
                  <svg width="120" height="120" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)', overflow: 'visible' }}>
                    <circle cx="50" cy="50" r="31.831" fill="transparent" stroke="#10b981" strokeWidth="20" strokeDasharray="97.34 200" strokeDashoffset="0"
                      onMouseMove={(e) => handleMouseMove(e, 'Positive', '1,460', '#10b981')} onMouseLeave={handleMouseLeave}
                      style={{ cursor: 'pointer', transition: 'stroke-width 0.2s' }} />
                    <circle cx="50" cy="50" r="31.831" fill="transparent" stroke="#ef4444" strokeWidth="20" strokeDasharray="76.66 200" strokeDashoffset="-97.34"
                      onMouseMove={(e) => handleMouseMove(e, 'Negative', '1,150', '#ef4444')} onMouseLeave={handleMouseLeave}
                      style={{ cursor: 'pointer', transition: 'stroke-width 0.2s' }} />
                    <circle cx="50" cy="50" r="31.831" fill="transparent" stroke="#3b82f6" strokeWidth="20" strokeDasharray="26.00 200" strokeDashoffset="-174.00"
                      onMouseMove={(e) => handleMouseMove(e, 'Neutral', '390', '#3b82f6')} onMouseLeave={handleMouseLeave}
                      style={{ cursor: 'pointer', transition: 'stroke-width 0.2s' }} />
                  </svg>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginTop: '20px', color: 'var(--text-muted)' }}>
                  <span><span style={{color:'#10b981'}}>●</span> Positive (1460)</span>
                  <span><span style={{color:'#ef4444'}}>●</span> Negative (1150)</span>
                  <span><span style={{color:'#3b82f6'}}>●</span> Neutral (390)</span>
                </div>
              </div>

              <div className="card">
                <div className="metric-header">Feedback Sources <span>👥</span></div>
                <div className="bar-row" onMouseMove={(e) => handleMouseMove(e, 'Google Play', '1,900', '#f7d046')} onMouseLeave={handleMouseLeave}>
                  <div className="bar-label">Google Play</div>
                  <div className="bar-track"><div className="bar-fill" style={{width: '63%', background: '#f7d046'}}></div></div>
                  <div className="bar-label" style={{textAlign:'left', width:'40px'}}>1900</div>
                </div>
                <div className="bar-row" onMouseMove={(e) => handleMouseMove(e, 'App Store', '500', '#3b82f6')} onMouseLeave={handleMouseLeave}>
                  <div className="bar-label">App Store</div>
                  <div className="bar-track"><div className="bar-fill" style={{width: '17%', background: '#3b82f6'}}></div></div>
                  <div className="bar-label" style={{textAlign:'left', width:'40px'}}>500</div>
                </div>
                <div className="bar-row" onMouseMove={(e) => handleMouseMove(e, 'Reddit', '350', '#ef4444')} onMouseLeave={handleMouseLeave}>
                  <div className="bar-label">Reddit</div>
                  <div className="bar-track"><div className="bar-fill" style={{width: '12%', background: '#ef4444'}}></div></div>
                  <div className="bar-label" style={{textAlign:'left', width:'40px'}}>350</div>
                </div>
                <div className="bar-row" onMouseMove={(e) => handleMouseMove(e, 'Twitter/X', '250', '#10b981')} onMouseLeave={handleMouseLeave}>
                  <div className="bar-label">Twitter/X</div>
                  <div className="bar-track"><div className="bar-fill" style={{width: '8%', background: '#10b981'}}></div></div>
                  <div className="bar-label" style={{textAlign:'left', width:'40px'}}>250</div>
                </div>
              </div>

              <div className="card">
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
                  <div className="v-bar-col" onMouseMove={(e) => handleMouseMove(e, 'Repeat Purchase', '30', '#f7d046')} onMouseLeave={handleMouseLeave}><div className="v-bar-fill" style={{height: '3%'}}></div><div className="v-bar-label">REPEAT PURCHASE</div></div>
                  <div className="v-bar-col" onMouseMove={(e) => handleMouseMove(e, 'Discovery', '100', '#f7d046')} onMouseLeave={handleMouseLeave}><div className="v-bar-fill" style={{height: '10%'}}></div><div className="v-bar-label">DISCOVERY</div></div>
                  <div className="v-bar-col" onMouseMove={(e) => handleMouseMove(e, 'Pricing', '320', '#f7d046')} onMouseLeave={handleMouseLeave}><div className="v-bar-fill" style={{height: '32%'}}></div><div className="v-bar-label">PRICING</div></div>
                  <div className="v-bar-col" onMouseMove={(e) => handleMouseMove(e, 'Delivery', '830', '#f7d046')} onMouseLeave={handleMouseLeave}><div className="v-bar-fill" style={{height: '83%'}}></div><div className="v-bar-label">DELIVERY</div></div>
                  <div className="v-bar-col" onMouseMove={(e) => handleMouseMove(e, 'Quality', '400', '#f7d046')} onMouseLeave={handleMouseLeave}><div className="v-bar-fill" style={{height: '40%'}}></div><div className="v-bar-label">QUALITY</div></div>
                  <div className="v-bar-col" onMouseMove={(e) => handleMouseMove(e, 'Trust', '680', '#f7d046')} onMouseLeave={handleMouseLeave}><div className="v-bar-fill" style={{height: '68%'}}></div><div className="v-bar-label">TRUST</div></div>
                  <div className="v-bar-col" onMouseMove={(e) => handleMouseMove(e, 'Variety', '50', '#f7d046')} onMouseLeave={handleMouseLeave}><div className="v-bar-fill" style={{height: '5%'}}></div><div className="v-bar-label">VARIETY</div></div>
                  <div className="v-bar-col" onMouseMove={(e) => handleMouseMove(e, 'Habit', '100', '#f7d046')} onMouseLeave={handleMouseLeave}><div className="v-bar-fill" style={{height: '10%'}}></div><div className="v-bar-label">HABIT</div></div>
                </div>
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
              <input type="text" className="search-input" placeholder="Search Blinkit customer reviews (e.g., refund, delivery)..." value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} />
              <select className="filter-select" value={filterSentiment} onChange={(e) => { setFilterSentiment(e.target.value); setCurrentPage(1); }}>
                <option>All Sentiments</option>
                <option>Positive</option>
                <option>Neutral</option>
                <option>Negative</option>
              </select>
              <select className="filter-select" value={filterTag} onChange={(e) => { setFilterTag(e.target.value); setCurrentPage(1); }}>
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
              <select className="filter-select" value={filterSource} onChange={(e) => { setFilterSource(e.target.value); setCurrentPage(1); }}>
                <option>All Sources</option>
                <option>Google Play</option>
                <option>App Store</option>
                <option>Reddit</option>
                <option>Twitter/X</option>
              </select>
              <select className="filter-select" value={sortOrder} onChange={(e) => { setSortOrder(e.target.value); setCurrentPage(1); }}>
                <option>Newest First</option>
                <option>Oldest First</option>
                <option>Rating: High-Low</option>
                <option>Rating: Low-High</option>
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
                  {displayedReviews.map((rev) => (
                    <tr key={rev.id}>
                      <td style={{color: 'var(--text-muted)'}}>#{rev.id}</td>
                      <td>
                        <div className="source-badge">
                          {rev.source.split(' ').map((word, i, arr) => (
                            <span key={i}>
                              {word}
                              {i < arr.length - 1 && <br />}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td>
                        <div className="feedback-author">{rev.author}</div>
                        <div className="feedback-content">{rev.content}</div>
                        <div className="feedback-tags">
                          {rev.tags.map((tag, i) => <span key={i} className="f-tag">{tag}</span>)}
                        </div>
                      </td>
                      <td style={{textAlign: 'center'}}>
                        <span className={`sentiment-badge ${rev.sentiment.toLowerCase()}`}>{rev.sentiment}</span>
                      </td>
                      <td style={{textAlign: 'center'}}>
                        <span className="rating-stars">
                          {'★'.repeat(rev.rating)}<span className="rating-empty">{'★'.repeat(5 - rev.rating)}</span>
                        </span>
                      </td>
                      <td className="feedback-date" style={{textAlign: 'right'}}>{rev.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="pagination-footer">
                <div className="pagination-text">Showing {totalReviews === 0 ? 0 : (safeCurrentPage - 1) * 10 + 1}-{Math.min(safeCurrentPage * 10, totalReviews)} of {totalReviews} reviews</div>
                <div className="pagination-controls">
                  <button className="page-btn" disabled={safeCurrentPage === 1} onClick={() => setCurrentPage(Math.max(1, safeCurrentPage - 1))}><span>&lt;</span> Prev</button>
                  <button className="page-btn" disabled={safeCurrentPage === totalPages} onClick={() => setCurrentPage(Math.min(totalPages, safeCurrentPage + 1))}>Next <span>&gt;</span></button>
                </div>
              </div>
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
      
      {tooltip.visible && (
        <div style={{
          position: 'fixed',
          top: tooltip.y + 15,
          left: tooltip.x + 15,
          background: '#1f2937',
          border: '1px solid var(--border-color)',
          padding: '8px 12px',
          borderRadius: '6px',
          pointerEvents: 'none',
          zIndex: 9999,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          minWidth: '100px'
        }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>{tooltip.title}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
            <div style={{ width: '10px', height: '10px', backgroundColor: tooltip.color, borderRadius: '2px' }}></div>
            {tooltip.value}
          </div>
        </div>
      )}
    </div>
  );
}
