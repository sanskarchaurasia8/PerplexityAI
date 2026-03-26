// import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

// const model = new ChatGoogleGenerativeAI({
//   model: "gemini-2.5-flash-lite",
//   apiKey: process.env.GEMINI_API_KEY
// });

// /chat gpt bala niche hai 

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import {HumanMessage,SystemMessage,AIMessage} from "langchain";
import {ChatMistralAI} from "@langchain/mistralai";

let geminiModel;
if (process.env.GEMINI_API_KEY) {
  geminiModel = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash-lite",
    apiKey: process.env.GEMINI_API_KEY
  });
}

export const testAi = async () => {
  if (!geminiModel) {
    throw new Error("Missing GEMINI_API_KEY");
  }

  const response = await geminiModel.invoke("Hello");
  console.log(response.content);
};

let mistralModel;
if (process.env.MISTRAL_API_KEY) {
  mistralModel = new ChatMistralAI({
    model: "mistral-small-latest",
    apiKey: process.env.MISTRAL_API_KEY,
  });
}

export async function generateResponse(messages) {
  if (!geminiModel) {
    const preview = typeof messages === "string" ? messages : messages?.[messages.length - 1]?.content || "";
    return `AI keys missing. Could not generate response for: ${preview.slice(0, 80)}...`;
  }

  try {
    let prompt;
    if (Array.isArray(messages)) {
      prompt = messages
        .map((msg) => {
          const role = msg.role === "ai" ? "AI" : "User";
          return `${role}: ${msg.content}`;
        })
        .join("\n");
    } else {
      prompt = `User: ${messages}`;
    }

    prompt += "\nAI:";
    const response = await geminiModel.invoke(prompt);
    return response?.text ?? response?.content ?? "";
  } catch (err) {
    console.error("generateResponse failed", err);
    return "AI failed to generate response. Please try again.";
  }
}

export async function generateChatTitle(message) {
  const fallbackTitle = message.trim().split("\n")[0].slice(0, 35).trim() || "Chat";
  if (!mistralModel) {
    return `${fallbackTitle}${fallbackTitle.length > 0 ? "..." : ""}`;
  }
  try {
    const response = await mistralModel.invoke([
      new SystemMessage(
        `You are a helpful assistant that generates concise and descriptive titles for chat conversations.
        
        User will provide you with the first message of a chat conversation, and you will generate a title that captures the essence of the conversation in 2-4 words. The title should be clear, relevant, and engaging, giving users a quick understanding of the chat's topic.`
      ),
      new HumanMessage(` Generate a title for a chat conversation based on the following first message: \"${message}\"`),
    ]);

    const title =
      response?.text ??
      response?.content ??
      response?.output?.[0]?.text ??
      response?.response?.output?.[0]?.content?.[0]?.text ??
      "";
    const trimmed = title.toString().trim();
    return trimmed || `${fallbackTitle}${fallbackTitle.length > 0 ? "..." : ""}`;
  } catch (err) {
    console.error("generateChatTitle failed", err);
    return `${fallbackTitle}${fallbackTitle.length > 0 ? "..." : ""}`;
  }
}
