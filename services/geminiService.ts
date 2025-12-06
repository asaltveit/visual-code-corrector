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
      You are an expert senior software engineer and UI/UX specialist.
      Refactor the following React/HTML/CSS code snippet.
      
      Goals:
      1. Improve code cleanliness and readability.
      2. Enhance accessibility (ARIA).
      3. Use modern practices (e.g., Hooks, functional components, Tailwind CSS if applicable).
      4. Fix any obvious layout or logic bugs.
      
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
 * Generates a realistic webpage render of the code using Nano Banana Pro.
 */
export const generateWebpageRender = async (code: string, label: string): Promise<VisualGenerationResponse> => {
  try {
    // Enhanced prompt for rendering code fragments
    const prompt = `
      Render this React/HTML/CSS code as a realistic webpage component. 
      High resolution, 2K, clean, readable, professional style.
      
      Important:
      - If the code is a fragment (e.g., a single button or card), render it centered on a clean background.
      - If the code uses inline styles, render them exactly as described (even if messy) for the "Original" version.
      - If the code uses libraries not present (like FontAwesome), approximate the look with standard icons or text.
      
      Context: This is the "${label}" version of the component.
      
      Code Snippet:
      ${code.slice(0, 8000)} 
    `;

    return await generateImageFromPrompt(prompt);
  } catch (error) {
    console.error(`Visual Generation Error (${label}):`, error);
    throw error;
  }
};

/**
 * Generates an image directly from a raw prompt (Used for Documentation Demos and Renders)
 */
export const generateImageFromPrompt = async (prompt: string): Promise<VisualGenerationResponse> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-image-preview",
      contents: prompt,
      config: {
        // Nano Banana Pro does not support responseMimeType/responseSchema
      },
    });

    // Extract image from response parts
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
    console.error("Image Generation Error:", error);
    throw error;
  }
};