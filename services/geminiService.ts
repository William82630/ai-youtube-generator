
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { GEMINI_MODEL_NAME } from '../constants';
import { YouTubeContent } from "../types";

const API_KEY = process.env.API_KEY;

export async function generateYouTubeContent(topic: string): Promise<YouTubeContent> {
  if (!API_KEY) {
    console.warn("Attempted to call Gemini API without API_KEY.");
    throw new Error("API_KEY is not configured. Please set the API_KEY environment variable.");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });

  const prompt = `You are an expert YouTube content strategist.
For the given topic: "${topic}", generate the following content for a YouTube video, formatted strictly as a single JSON object:
1.  "titles": An array of 3-5 catchy and SEO-friendly video title suggestions. Each title should be a string.
2.  "scriptOutline": A string representing a structured script outline. Include sections like "Intro" (hooking the viewer), "Main Content" (broken into 2-3 key points or steps), "Call to Action" (e.g., subscribe, like, comment), and "Outro". Use newline characters (\\n) for readability and structure within the string.
3.  "description": A compelling YouTube video description as a string. Include a brief summary of the video, a call to action, and placeholders like "[Your Channel Link]" and "[Link to Related Video/Resource]". Suggest including relevant keywords. Use newline characters (\\n) for paragraphs.
4.  "tags": An array of 10-15 relevant YouTube tags. Each tag should be a string.

The output MUST be a valid JSON object. Do not include any text, markdown formatting, or explanations outside of the JSON object itself.
Example JSON structure:
{
  "titles": ["Amazing Title 1", "Incredible Title 2"],
  "scriptOutline": "Intro:\\n- Hook viewer\\nMain Content:\\n- Point 1\\n- Point 2\\nCall to Action:\\n- Subscribe!\\nOutro:\\n- Thanks for watching!",
  "description": "In this video, we discuss ${topic}.\\n\\nDon't forget to subscribe: [Your Channel Link]\\n\\nCheck out this related video: [Link to Related Video/Resource]\\n\\n#keyword1 #keyword2",
  "tags": ["tag1", "tag2", "common phrase tag"]
}`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const rawText = response.text;
    if (!rawText) {
      console.error("Gemini API returned no text.");
      throw new Error("No text returned from Gemini API.");
    }

    let jsonStr = rawText.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }

    try {
      const parsedData = JSON.parse(jsonStr) as YouTubeContent;
      // Basic validation of the parsed structure
      if (!parsedData.titles || !Array.isArray(parsedData.titles) ||
          typeof parsedData.scriptOutline !== 'string' ||
          typeof parsedData.description !== 'string' ||
          !parsedData.tags || !Array.isArray(parsedData.tags)) {
        console.error("Parsed JSON does not match expected YouTubeContent structure:", parsedData);
        throw new Error("Received malformed JSON data from API.");
      }
      return parsedData;
    } catch (e) {
      console.error("Failed to parse JSON response:", e, "Raw response:", jsonStr);
      throw new Error("Failed to parse JSON response from Gemini API. The response might not be valid JSON. Raw text: " + jsonStr);
    }

  } catch (error) {
    console.error("Error generating YouTube content from Gemini:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to generate YouTube content: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating YouTube content.");
  }
}