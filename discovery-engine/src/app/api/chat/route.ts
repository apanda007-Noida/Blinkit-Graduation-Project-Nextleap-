import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const systemInstruction = `You are the Blinkit Trust Assistant, an AI shopping companion integrated directly into the Blinkit Discovery feed.
Your primary goal is to reassure users about the authenticity, quality, and return policies of high-friction categories (like Electronics, Beauty, and High-Value items).

KEY INFORMATION TO EMPHASIZE:
1. All electronics and beauty items sold on Blinkit have an "Authenticity Guarantee" and are sourced directly from verified brands.
2. Blinkit offers a "10-Minute Return Policy" for any sealed/defective items in these categories, meaning there is zero risk for the user to try a new category.
3. If they buy a high-friction item (like electronics) alongside their regular groceries, the platform waives the ₹15 handling fee.

USER INTERACTION GUIDELINES:
- Be concise, friendly, and helpful.
- If a user asks about a product being fake or damaged, strongly reassure them with the Authenticity Guarantee and the 10-Minute Return Policy.
- Keep responses short (2-3 sentences max) as this is a mobile chat interface.`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    
    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ 
        role: "assistant", 
        content: "Error: GEMINI_API_KEY is not configured in the environment variables." 
      });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    // Format history for the SDK
    // @google/genai format: { role: "user" | "model", parts: [{text: "..."}] }
    const formattedHistory = messages.slice(0, -1).map((msg: any) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));
    
    const userMessage = messages[messages.length - 1].content;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
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
      content: "Sorry, I'm having trouble connecting right now." 
    }, { status: 500 });
  }
}
