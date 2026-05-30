import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

// Increase body size limit for base64 image uploads
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Lazy initializer for Google Gen AI to prevent crashing if GEMINI_API_KEY is missing on startup
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not defined. Please add it via Settings > Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// API endpoint to analyze a photo
app.post("/api/analyze", async (req, res): Promise<any> => {
  try {
    const { imageBase64, helperText } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: "Missing imageBase64 parameter." });
    }

    // Extract raw base64 data and mimeType
    let mimeType = "image/jpeg";
    let base64Data = imageBase64;
    
    if (imageBase64.includes(";base64,")) {
      const parts = imageBase64.split(";base64,");
      mimeType = parts[0].split(":")[1] || "image/jpeg";
      base64Data = parts[1];
    }

    const ai = getGenAI();

    const imagePart = {
      inlineData: {
        mimeType,
        data: base64Data,
      },
    };

    const systemInstruction = 
      "You are a professional social media researcher and profile finder. Your goal is to identify other potential profiles or " +
      "specifically match public figures, celebrities, cricketers, politicians, influencers, digital creators, or artists " +
      "in Sri Lanka. You search for their direct Facebook, Instagram, and YouTube links and return a JSON response summarizing your findings. " +
      "You always output a valid, clean JSON object matching the requested schema. Important: Do not include markdown wrappers (e.g. ```json).";

    const prompt = `Identify this person in the image. Optional context provided by the user: "${helperText || 'None'}".
Find their actual name, a brief bio (1-2 sentences), their confidence rating, and search for their profiles on:
1. Facebook
2. Instagram
3. YouTube

Include direct links (URLs) if possible. If they are not a well-known public figure, gracefully describe their appearance/attributes and provide a few customized search terms targeting Sri Lankan platforms to help the user locate them.

Return a single JSON object of the following format:
{
  "identified": boolean,
  "name": string,
  "confidence": "High" | "Medium" | "Low" | "None",
  "bio": string,
  "reasoning": string,
  "profiles": [
    { "platform": "Facebook" | "Instagram" | "YouTube", "url": string, "confidence": "High" | "Medium" | "Low" | "None" }
  ],
  "searchSuggestions": string[]
}`;

    // Query Gemini 3.5 Flash using Search Grounding
    const apiResponse = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [imagePart, { text: prompt }],
      config: {
        systemInstruction,
        temperature: 0.2,
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
      },
    });

    let rawText = apiResponse.text || "{}";
    
    // Fallback cleaning of response in case formatting wrappers were returned anyway
    let cleanText = rawText.trim();
    if (cleanText.startsWith("```")) {
      cleanText = cleanText.replace(/^```(json)?\s*/i, "").replace(/```\s*$/i, "").trim();
    }

    let resultData;
    try {
      resultData = JSON.parse(cleanText);
    } catch (parseError) {
      console.error("JSON parsing failed, returning raw text as fallback:", rawText);
      resultData = {
        identified: false,
        name: "Unknown / Parsing Error",
        confidence: "None",
        bio: "We encountered an issue reading the structured response. Please see raw guidance.",
        reasoning: rawText,
        profiles: [],
        searchSuggestions: ["Try again with more descriptive helper text."]
      };
    }

    // Extract grounding sources
    const groundingChunks = apiResponse.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const webSources = groundingChunks
      .filter((chunk: any) => chunk.web)
      .map((chunk: any) => ({
        title: chunk.web.title || "Web Source",
        url: chunk.web.uri,
      }));

    return res.json({
      result: resultData,
      sources: webSources,
    });
  } catch (error: any) {
    console.error("API Analyze Error: ", error);
    return res.status(500).json({
      error: error.message || "An internal error occurred while analyzing the image.",
    });
  }
});

// Setup Vite development server or static files serving for production
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server starting on http://0.0.0.0:${PORT}`);
  });
}

setupServer();
