import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";

const glm = createOpenAI({
  baseURL: "https://open.bigmodel.cn/api/paas/v4/",
  apiKey: process.env.GLM_API_KEY || "",
});

export async function POST(req: Request) {
  const { metrics } = await req.json();

  const prompt = `You are an AI compliance expert. Analyze these bias metrics from a dataset audit:
Target: ${metrics.targetColumn}, Protected Attr: ${metrics.protectedAttribute},
Disparate Impact: ${metrics.disparateImpact}, Parity Diff: ${metrics.demographicParityDifference}.
Write a 2-paragraph executive summary explaining if this is biased and what it means for the company. Keep it professional, concise, and do not use markdown bolding.`;

  const result = await streamText({
    model: glm("glm-4"),
    prompt,
  });

  return result.toDataStreamResponse();
}
