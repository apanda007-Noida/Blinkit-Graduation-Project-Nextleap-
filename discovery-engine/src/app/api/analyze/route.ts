import { NextResponse } from 'next/server';

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

    const fallbackModels = ['gemini-3.5-flash', 'gemini-flash-latest', 'gemini-2.5-flash', 'gemini-2.0-flash'];
    let lastError: any = null;
    let resultData: any = null;
    
    const userContent = `
APP STORE REVIEWS:\n${appStore || '(none provided)'}
PLAY STORE REVIEWS:\n${playStore || '(none provided)'}
REDDIT DISCUSSIONS:\n${reddit || '(none provided)'}
COMMUNITY FORUMS:\n${communityForums || '(none provided)'}
SOCIAL MEDIA CONVERSATIONS:\n${socialMedia || '(none provided)'}
PRODUCT REVIEWS:\n${productReviews || '(none provided)'}
QUICK-COMMERCE DISCUSSIONS:\n${quickCommerce || '(none provided)'}
`;

    // The Gemini JSON Schema payload
    const schemaPayload = {
      type: "OBJECT",
      properties: {
        themes: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              title: { type: "STRING" },
              insight: { type: "STRING" },
              confidence: { type: "STRING" },
              paraphrased_example: { type: "STRING" },
              related_questions: { type: "ARRAY", items: { type: "INTEGER" } },
              segment: { type: "STRING" }
            },
            required: ["title", "insight", "confidence", "paraphrased_example", "related_questions", "segment"]
          }
        },
        answers: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              question: { type: "STRING" },
              answer: { type: "STRING" }
            },
            required: ["question", "answer"]
          }
        },
        validation_flags: {
          type: "ARRAY",
          items: { type: "STRING" }
        }
      },
      required: ["themes", "answers", "validation_flags"]
    };

    // Use native fetch to completely bypass the SDK's hidden auto-retry blocking
    for (const modelName of fallbackModels) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 45000); // 45s hard timeout per model
        
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${process.env.GEMINI_API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            system_instruction: { parts: [{ text: systemInstruction }] },
            contents: [{ parts: [{ text: userContent }] }],
            generationConfig: {
              responseMimeType: "application/json",
              responseSchema: schemaPayload
            }
          })
        });
        
        clearTimeout(timeoutId);
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(`[${response.status}] ${data.error?.message || 'Unknown error'}`);
        }
        
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) throw new Error("No text response generated.");
        
        resultData = JSON.parse(text);
        break; // Success! Break out of the fallback loop.
      } catch (err: any) {
        console.error(`Model ${modelName} failed:`, err.message);
        lastError = err;
        // Continue to the next model in the fallback list instantly
      }
    }

    if (!resultData) {
      throw lastError || new Error("All fallback models failed.");
    }
    
    return NextResponse.json(resultData);
    
  } catch (error: any) {
    console.error("Analyze API Error:", error);
    return NextResponse.json({ error: `Analysis Failed: ${error.message}` }, { status: 500 });
  }
}
