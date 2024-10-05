import {
  CopilotRuntime,
  OpenAIAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";
import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const serviceAdapter = new OpenAIAdapter({ openai });

const runtime = new CopilotRuntime();

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { language, prompt } = body;

    console.log("Received language:", language);
    console.log("Received prompt:", prompt);

    // Check if language and prompt are provided
    if (!language || !prompt) {
      console.error("Invalid request: Missing language or prompt");
      return NextResponse.json(
        { error: "Invalid request: Missing language or prompt" },
        { status: 400 }
      );
    }

    const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
      runtime,
      serviceAdapter,
      endpoint: "/api/copilotkit",
    });

    const response = await handleRequest(req);

    // Check if response is ok and parse it
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error from handleRequest:", errorData);
      return NextResponse.json(
        { error: "Error generating code snippet", details: errorData },
        { status: response.status }
      );
    }

    const responseData = await response.json();

    console.log("Response data:", responseData);

    return NextResponse.json(
      { generatedCode: responseData.generatedCode },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to generate code snippet" },
      { status: 500 }
    );
  }
};
