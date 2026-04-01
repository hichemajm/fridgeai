import { GoogleGenAI, Type } from "@google/genai";
import { Plan } from "../types";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

export async function detectIngredients(base64Image: string): Promise<string[]> {
  const model = "gemini-1.5-flash";
  const prompt = "Detect all food ingredients visible in this fridge image. Return only a JSON array of strings representing the ingredient names. No other text.";

  const response = await ai.models.generateContent({
    model,
    contents: [
      {
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image,
            },
          },
        ],
      },
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
      },
    },
  });

  try {
    return JSON.parse(response.text || "[]");
  } catch (e) {
    console.error("Failed to parse ingredients:", e);
    return [];
  }
}

export async function generateRecipes(
  ingredients: string[],
  plan: Plan,
  filters: string[] = []
): Promise<any[]> {
  const model = "gemini-1.5-flash";
  
  const planContext = {
    free: "Basic recipes, simple instructions.",
    starter: "Better recipes, more variety.",
    pro: "Premium recipes, dietary filters, detailed instructions.",
    elite: "Ultra advanced recipes, nutrition analysis, AI chef assistant style.",
  }[plan];

  const prompt = `Generate 3 recipes using some or all of these ingredients: ${ingredients.join(", ")}. 
  Plan: ${planContext}. Filters: ${filters.join(", ")}.
  Return a JSON array of objects with these fields:
  - title: string
  - ingredients: string[]
  - instructions: string (markdown formatted)
  - nutrients: { calories: number, protein: number, carbs: number, fat: number } (only for elite plan)
  - time: string
  - difficulty: string (Easy, Medium, Hard)
  `;

  const response = await ai.models.generateContent({
    model,
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
            instructions: { type: Type.STRING },
            nutrients: {
              type: Type.OBJECT,
              properties: {
                calories: { type: Type.NUMBER },
                protein: { type: Type.NUMBER },
                carbs: { type: Type.NUMBER },
                fat: { type: Type.NUMBER },
              },
            },
            time: { type: Type.STRING },
            difficulty: { type: Type.STRING },
          },
          required: ["title", "ingredients", "instructions", "time", "difficulty"],
        },
      },
    },
  });

  try {
    return JSON.parse(response.text || "[]");
  } catch (e) {
    console.error("Failed to parse recipes:", e);
    return [];
  }
}
