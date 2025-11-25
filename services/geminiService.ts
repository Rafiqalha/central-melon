import { GoogleGenAI, Type } from "@google/genai";
import { AIAnalysisResult } from '../types';

// NOTE: In a real production app, this call should go through your backend 
// to keep the API key secure.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeMelonImage = async (base64Image: string): Promise<AIAnalysisResult> => {
  try {
    const modelId = "gemini-2.5-flash"; // Multimodal capable model

    const prompt = `
      Analyze this image of a melon (or fruit). 
      Act as an agricultural quality expert.
      Assess the visible quality, ripeness based on skin color/texture, and potential defects.
      Estimate the sweetness (Brix) based on visual indicators of the variety.
      
      If the image is not a fruit or melon, reject it in the grade.
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image
            }
          },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            grade: {
              type: Type.STRING,
              enum: ["A", "B", "C", "Rejected"],
              description: "Quality grade of the fruit"
            },
            ripenessScore: {
              type: Type.NUMBER,
              description: "0 to 100 scale of ripeness"
            },
            sweetnessPrediction: {
              type: Type.NUMBER,
              description: "Estimated Brix value (e.g. 12-18)"
            },
            defects: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of visible defects if any"
            },
            reasoning: {
              type: Type.STRING,
              description: "Short explanation for the grading"
            }
          },
          required: ["grade", "ripenessScore", "sweetnessPrediction", "defects", "reasoning"]
        }
      }
    });

    if (response.text) {
      const result = JSON.parse(response.text) as AIAnalysisResult;
      return result;
    }
    
    throw new Error("No response text generated");
  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    // Fallback for demo purposes if API fails or key is missing
    return {
      grade: 'B',
      ripenessScore: 75,
      sweetnessPrediction: 13.5,
      defects: ['Could not connect to AI service'],
      reasoning: 'Fallback analysis due to API connection error.'
    };
  }
};