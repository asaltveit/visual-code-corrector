import { GoogleGenAI, Type } from "@google/genai";
import { RefactorResult, VisualGenerationResponse } from "../types";

// Initialize Gemini Client
// IMPORTANT: process.env.API_KEY is assumed to be available in the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Refactors code and generates unit tests using Gemini 3 Pro Preview.
 */
export const generateRefactor = async (code: string): Promise<RefactorResult> => {
  try {
    const prompt = `
      You are an expert senior software engineer. 
      Refactor the following code snippet to be cleaner, more efficient, and follow best practices.
      Also, generate comprehensive unit tests for the refactored code.
      
      Input Code:
      ${code}
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview", // Best for complex coding tasks
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            refactoredCode: {
              type: Type.STRING,
              description: "The complete refactored code snippet.",
            },
            unitTests: {
              type: Type.STRING,
              description: "The unit tests for the refactored code.",
            },
            explanation: {
              type: Type.STRING,
              description: "A brief explanation of changes made.",
            },
          },
          required: ["refactoredCode", "unitTests"],
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini.");

    return JSON.parse(text) as RefactorResult;

  } catch (error) {
    console.error("Refactor Error:", error);
    throw error;
  }
};

/**
 * Generates a visual representation (flowchart/diagram) using Nano Banana Pro (Gemini 3 Pro Image Preview).
 */
export const generateVisual = async (code: string): Promise<VisualGenerationResponse> => {
  try {
    const prompt = `
      Create a high-quality, professional technical diagram or flowchart that explains the logic and control flow of the following code snippet.
      The visual should be clean, high-contrast, and easy to understand for a developer.
      
      Code Snippet:
      ${code}
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-image-preview", // Mapped from "Nano Banana Pro"
      contents: prompt,
      config: {
        // Nano Banana Pro does not support responseMimeType/responseSchema
      },
    });

    // Extract image from response parts
    // The response might contain text and inlineData
    const parts = response.candidates?.[0]?.content?.parts;
    let imageUrl = "";

    if (parts) {
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
           imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
           break;
        }
      }
    }

    if (!imageUrl) {
        throw new Error("No image generated.");
    }

    return { imageUrl };

  } catch (error) {
    console.error("Visual Generation Error:", error);
    throw error;
  }
};
