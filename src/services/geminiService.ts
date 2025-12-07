import { GoogleGenAI, Type } from "@google/genai";
import { RefactorResult, VisualGenerationResponse } from "../types";

/**
 * Refactors code and generates unit tests using Gemini 3 Pro Preview.
 */
export const generateRefactor = async (code: string): Promise<RefactorResult> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const prompt = `
      You are an expert senior software engineer and UI/UX specialist.
      Refactor the following code snippet.
      
      Goals:
      1. Improve code cleanliness, performance, and readability.
      2. Fix logic bugs, security vulnerabilities, or time complexity issues (Big O).
      3. Use modern practices (e.g., proper variable scoping, built-in methods, secure patterns).
      4. If it is UI code, enhance accessibility (ARIA) and ensure it is a self-contained functional component that can be rendered immediately.
      
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
              description: "The complete refactored code snippet. If React, ensure it is a functional component.",
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
 * Generates an illustration using Gemini 3 Pro Image Preview.
 */
export const generateImageFromPrompt = async (prompt: string): Promise<VisualGenerationResponse> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [
          {
            text: prompt,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9",
          imageSize: "2K"
        }
      },
    });

    if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                const base64EncodeString: string = part.inlineData.data;
                const mimeType = part.inlineData.mimeType || 'image/png';
                const imageUrl = `data:${mimeType};base64,${base64EncodeString}`;
                return { imageUrl };
            }
        }
    }
    
    throw new Error("No image generated.");
  } catch (error) {
    console.error("Image Gen Error:", error);
    throw error;
  }
};

/**
 * Helper to generate logic diagrams for backend code using Nano banana style
 */
export const generateLogicDiagram = async (code: string, context: "Original" | "Refactored"): Promise<string | null> => {
    try {
        const prompt = `
            Create a professional, high-resolution logic flow diagram using Nano banana style representing the logic of the following ${context} code.
            
            Style: Nano banana - Clean, structured visual representation with clear process flow, decision points, and logic branches. 
            Use professional flowchart conventions: rectangles for processes, diamonds for decisions, arrows for flow direction.
            High contrast, blueprint aesthetic. Do NOT show code text directly, show shapes, arrows, and logic flow.
            
            Code Context:
            ${code.slice(0, 5000)}
        `;
        const result = await generateImageFromPrompt(prompt);
        return result.imageUrl;
    } catch (e) {
        console.warn(`Failed to generate logic diagram for ${context}`, e);
        return null;
    }
};