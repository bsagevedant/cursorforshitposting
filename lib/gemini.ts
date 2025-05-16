import { ShitpostPrompt, ShitpostResponse } from "@/types";

// This would be an environment variable in production
// Replace with your actual Gemini API key when testing
const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

function generatePromptText(options: ShitpostPrompt): string {
  const { topic = "", tone = "funny", length = "short", includeHashtags, includeEmojis } = options;
  
  let promptText = `Generate a ${tone} shitpost for Twitter about ${topic || "something random and viral worthy"}. `;
  promptText += `Keep it ${length} and engaging for social media. `;
  
  if (includeHashtags) {
    promptText += "Include relevant hashtags. ";
  }
  
  if (includeEmojis) {
    promptText += "Include appropriate emojis. ";
  }
  
  promptText += "The tone should be entertaining and shareable. Don't include any warnings or explanations, just the post content.";
  
  return promptText;
}

export async function generateShitpost(options: ShitpostPrompt): Promise<ShitpostResponse> {
  if (!GEMINI_API_KEY) {
    throw new Error("Gemini API key is missing. Please add your API key to continue.");
  }

  const promptText = generatePromptText(options);
  
  try {
    const response = await fetch(`${API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: promptText
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.9,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 280,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Failed to generate shitpost");
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || "Could not generate content. Try again.";

    return {
      id: Date.now().toString(),
      content: content.trim(),
      prompt: options,
      createdAt: new Date(),
    };
  } catch (error) {
    console.error("Error generating shitpost:", error);
    throw error;
  }
}