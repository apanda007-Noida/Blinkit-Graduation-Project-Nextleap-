import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

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
You will be given raw, unstructured user feedback from several sources.
Your job:
1. Identify 4-7 recurring THEMES that explain repeat-category shopping behavior and barriers to category exploration. Ground every theme only in patterns actually present in the provided text.
2. Direct answers to each of the 8 research questions based only on the evidence.
3. List 3-5 validation_flags to check in follow-up 1:1 user interviews.

The 8 research questions, in order, are:
${RESEARCH_QUESTIONS.map((q,i)=>`${i+1}. ${q}`).join('\n')}`;

export async function POST(req: Request) {
  try {
    const { 
      appStore, 
      playStore, 
      reddit, 
      communityForums, 
      socialMedia, 
      productReviews, 
      quickCommerce 
    } = await req.json();
    
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "GEMINI_API_KEY is not configured." }, { status: 500 });
    }

    if (!appStore && !playStore && !reddit && !communityForums && !socialMedia && !productReviews && !quickCommerce) {
      return NextResponse.json({ error: "No input provided." }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    const userContent = `
You are a growth-analytics engine for a Product Manager researching why quick-commerce users (Blinkit) don't buy from new categories.
You will be given raw, unstructured user feedback from several sources.
Your job:
1. Identify 4-7 recurring THEMES that explain repeat-category shopping behavior and barriers to category exploration. Ground every theme only in patterns actually present in the provided text.
2. Direct answers to each of the 8 research questions based only on the evidence.
3. List 3-5 validation_flags to check in follow-up 1:1 user interviews.

The 8 research questions, in order, are:
${RESEARCH_QUESTIONS.map((q,i)=>`${i+1}. ${q}`).join('\n')}

RAW FEEDBACK:
APP STORE REVIEWS:\n${appStore || '(none provided)'}
PLAY STORE REVIEWS:\n${playStore || '(none provided)'}
REDDIT DISCUSSIONS:\n${reddit || '(none provided)'}
COMMUNITY FORUMS:\n${communityForums || '(none provided)'}
SOCIAL MEDIA CONVERSATIONS:\n${socialMedia || '(none provided)'}
PRODUCT REVIEWS:\n${productReviews || '(none provided)'}
QUICK-COMMERCE DISCUSSIONS:\n${quickCommerce || '(none provided)'}

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
}
`;

    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

    const result = await model.generateContent(userContent);
    let text = result.response.text();
    
    if (!text) throw new Error("No response generated.");
    
    // Strip markdown formatting if the model accidentally included it
    text = text.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
    
    const data = JSON.parse(text);
    return NextResponse.json(data);
    
  } catch (error: any) {
    console.error("Analyze API Error:", error);
    
    try {
      const modelsRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
      const modelsData = await modelsRes.json();
      const supportedModels = modelsData.models ? modelsData.models.map((m: any) => m.name).join(", ") : "None found";
      return NextResponse.json({ error: `Analysis Failed: ${error.message} --- SUPPORTED MODELS FOR YOUR KEY: ${supportedModels}` }, { status: 500 });
    } catch(e) {
      return NextResponse.json({ error: `Analysis Failed: ${error.message}` }, { status: 500 });
    }
  }
}
