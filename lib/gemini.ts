import { GoogleGenAI } from "@google/genai";

export async function generateLogo(prompt: string, size: "1K" | "2K" | "4K") {
  const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("API key not found");
  
  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-image-preview",
    contents: {
      parts: [
        {
          text: `Create a professional, modern, and high-quality company logo based on this description: ${prompt}. The logo should be clean, iconic, and suitable for a brand identity.`,
        },
      ],
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1",
        imageSize: size,
      },
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }
  throw new Error("No image generated");
}

export async function animateLogo(imageUri: string, prompt: string, aspectRatio: "16:9" | "9:16") {
  const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("API key not found");

  const ai = new GoogleGenAI({ apiKey });
  const base64Data = imageUri.split(",")[1];
  const mimeType = imageUri.split(";")[0].split(":")[1];

  let operation = await ai.models.generateVideos({
    model: "veo-3.1-fast-generate-preview",
    prompt: `Animate this logo in a professional, cinematic way. ${prompt}. Subtle motion, elegant transitions, high-end production value.`,
    image: {
      imageBytes: base64Data,
      mimeType: mimeType,
    },
    config: {
      numberOfVideos: 1,
      resolution: "1080p",
      aspectRatio: aspectRatio,
    },
  });

  while (!operation.done) {
    await new Promise((resolve) => setTimeout(resolve, 5000));
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!downloadLink) throw new Error("No video generated");

  const response = await fetch(downloadLink, {
    method: "GET",
    headers: {
      "x-goog-api-key": apiKey,
    },
  });

  const blob = await response.blob();
  return URL.createObjectURL(blob);
}
