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
APP STORE REVIEWS:\n${appStore || '(none provided)'}
PLAY STORE REVIEWS:\n${playStore || '(none provided)'}
REDDIT DISCUSSIONS:\n${reddit || '(none provided)'}
COMMUNITY FORUMS:\n${communityForums || '(none provided)'}
SOCIAL MEDIA CONVERSATIONS:\n${socialMedia || '(none provided)'}
PRODUCT REVIEWS:\n${productReviews || '(none provided)'}
QUICK-COMMERCE DISCUSSIONS:\n${quickCommerce || '(none provided)'}
`;

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: systemInstruction,
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            themes: {
              type: SchemaType.ARRAY,
              items: {
                type: SchemaType.OBJECT,
                properties: {
                  title: { type: SchemaType.STRING },
                  insight: { type: SchemaType.STRING },
                  confidence: { type: SchemaType.STRING },
                  paraphrased_example: { type: SchemaType.STRING },
                  related_questions: { type: SchemaType.ARRAY, items: { type: SchemaType.INTEGER } },
                  segment: { type: SchemaType.STRING }
                },
                required: ["title", "insight", "confidence", "paraphrased_example", "related_questions", "segment"]
              }
            },
            answers: {
              type: SchemaType.ARRAY,
              items: {
                type: SchemaType.OBJECT,
                properties: {
                  question: { type: SchemaType.STRING },
                  answer: { type: SchemaType.STRING }
                },
                required: ["question", "answer"]
              }
            },
            validation_flags: {
              type: SchemaType.ARRAY,
              items: { type: SchemaType.STRING }
            }
          },
          required: ["themes", "answers", "validation_flags"]
        }
      }
    });

    const result = await model.generateContent(userContent);
    const text = result.response.text();
    
    if (!text) throw new Error("No response generated.");
    
    const data = JSON.parse(text);
    return NextResponse.json(data);
    
  } catch (error: any) {
    console.error("Analyze API Error:", error);
    return NextResponse.json({ error: `Analysis Failed: ${error.message}` }, { status: 500 });
  }
}
