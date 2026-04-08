import { GoogleGenAI } from "@google/genai";

export const getAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is required");
  }
  return new GoogleGenAI({ apiKey });
};

export async function generateLogo(prompt: string) {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-image",
    contents: {
      parts: [
        {
          text: `Create a professional, modern, and high-quality company logo based on this description: ${prompt}. The logo should be clean, iconic, and suitable for a brand identity. White background.`,
        },
      ],
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }
  throw new Error("No image generated");
}

export async function findInspiration(prompt: string) {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Find professional logo design inspiration and existing similar brand styles for a company described as: ${prompt}. Provide a list of 5 famous brands or design styles that match this vibe, explaining why they are relevant. Include links to search results if possible.`,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  return {
    text: response.text,
    sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
      title: chunk.web?.title,
      uri: chunk.web?.uri,
    })).filter((s: any) => s.title && s.uri) || [],
  };
}
