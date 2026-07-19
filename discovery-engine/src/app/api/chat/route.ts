import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const systemInstruction = `You are an AI Research Assistant for a NextLeap PM Case Study on Blinkit.
Your primary role is to answer questions about user behavior, frictions, and unmet needs based exclusively on the Phase 5 Synthesis data provided below.
Maintain a professional, analytical Product Manager tone. Keep responses concise (2-4 sentences max).

CASE STUDY SYNTHESIS DATA (DO NOT HALLUCINATE OUTSIDE OF THIS):
1. Why do users repeatedly buy from the same categories?
Driven by Habit (69 mentions) and Urgent-Need (54 mentions). Users view quick-commerce as a utility for immediate replenishment of known items (like groceries). The "loyalist-repeat-only" segment locks into a recurring habit and rarely deviates.

2. What prevents users from exploring new categories?
Trust and Quality (220 mentions) is the overwhelming barrier. Users are skeptical of Blinkit's ability to deliver high-quality, non-grocery items. Price Sensitivity (73) and App UX / Findability (71) are secondary frictions (unpredictable surcharges).

3. How do users discover products today?
Discovery mechanisms are weak. Accidental (6) and Algorithmic Discovery (2) are non-existent. Users overwhelmingly search for exactly what they already intend to buy rather than browsing.

4. What role do habits play in shopping behavior?
Habits are the foundation of retention but act as a double-edged sword for category expansion. Attempting to cross-sell into new categories requires breaking a strong psychological boundary.

5. What information do users need before trying a new category?
Users need upfront reassurance: visible expiry dates on perishables, authenticity guarantees on high-ticket items (electronics/beauty), and a frictionless return policy.

6. What frustrations emerge repeatedly?
Sentiment is heavily Negative (303 items). Frustrations center around Inconsistent Pricing (unpredictable surcharges), Fulfillment Failures (missing items in multi-category orders), and Quality Control (poor packaging outside dry groceries).

7. Which user segments are more likely to experiment?
Cautious-Explorer (63) and Active-Explorer (23). Cautious-Explorers are blocked by Trust-Quality (53/63 mentions). The Deal-Driven (35) segment is blocked by Price-Sensitivity (32 mentions).

8. What unmet needs emerge consistently?
Predictability and Reassurance: Transparent predictable pricing (no arbitrary inflation), reliable curation (not taking a gamble on electronics), and Discovery UX (actively bridging the gap between intentional buying and new category discovery).
`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ 
        role: "assistant", 
        content: "Error: GEMINI_API_KEY is not configured in the environment variables." 
      });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const formattedHistory = messages.slice(0, -1).map((msg: any) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));
    
    const userMessage = messages[messages.length - 1].content;

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: [
        ...formattedHistory,
        { role: 'user', parts: [{ text: userMessage }] }
      ],
      config: {
        systemInstruction: systemInstruction,
      }
    });

    return NextResponse.json({ 
      role: "assistant", 
      content: response.text || "I'm sorry, I couldn't process that." 
    });
    
  } catch (error: any) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ 
      role: "assistant", 
      content: `Sorry, I hit an error: ${error.message || "Unknown error"}` 
    }, { status: 500 });
  }
}
