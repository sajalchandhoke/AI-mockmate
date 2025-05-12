import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Handle POST request
export async function POST(req) {
  try {
    const { messages } = await req.json();
    console.log("Received request:", messages); // Debugging log

    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: "API key missing" },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const chatSession = model.startChat({
      generationConfig: {
        temperature: 1,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192
      }
    });

    const result = await chatSession.sendMessage(messages);
    const text = result.response.text();

    return NextResponse.json({ success: true, reply: text });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch AI response" },
      { status: 500 }
    );
  }
}

// Handle GET request (for testing)
export async function GET() {
  return NextResponse.json({ message: "API is working!" });
}
