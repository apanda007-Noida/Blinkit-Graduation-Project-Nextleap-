import { NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';

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

const systemInstruction = `You are a growth-analytics engine for a Product Manager researching why quick-commerce users (Blinkit) don't buy from new categories.
You will be given raw, unstructured user feedback from three sources: app/play store reviews, reddit/forum threads, and social posts.
Your job:
1. Identify 4-7 recurring THEMES that explain repeat-category shopping behavior and barriers to category exploration. Ground every theme only in patterns actually present in the provided text.
2. Direct answers to each of the 8 research questions based only on the evidence.
3. List 3-5 validation_flags to check in follow-up 1:1 user interviews.

The 8 research questions, in order, are:
${RESEARCH_QUESTIONS.map((q,i)=>`${i+1}. ${q}`).join('\n')}`;

export async function POST(req: Request) {
  try {
    const { reviews, reddit, social } = await req.json();
    
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "GEMINI_API_KEY is not configured." }, { status: 500 });
    }

    if (!reviews && !reddit && !social) {
      return NextResponse.json({ error: "No input provided." }, { status: 400 });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const userContent = `APP/PLAY STORE REVIEWS:\n${reviews || '(none provided)'}\n\nREDDIT/FORUM:\n${reddit || '(none provided)'}\n\nSOCIAL/OTHER:\n${social || '(none provided)'}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userContent,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            themes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  insight: { type: Type.STRING },
                  confidence: { type: Type.STRING, enum: ["high", "medium", "low"] },
                  paraphrased_example: { type: Type.STRING },
                  related_questions: { type: Type.ARRAY, items: { type: Type.INTEGER } },
                  segment: { type: Type.STRING }
                },
                required: ["title", "insight", "confidence", "paraphrased_example", "related_questions", "segment"]
              }
            },
            answers: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  answer: { type: Type.STRING }
                },
                required: ["question", "answer"]
              }
            },
            validation_flags: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["themes", "answers", "validation_flags"]
        }
      }
    });

    if (!response.text) throw new Error("No response generated.");
    
    // Parse the structured JSON response
    const data = JSON.parse(response.text);
    return NextResponse.json(data);
    
  } catch (error: any) {
    console.error("Analyze API Error:", error);
    return NextResponse.json({ error: `Analysis Failed: ${error.message}` }, { status: 500 });
  }
}
