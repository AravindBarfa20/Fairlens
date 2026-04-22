import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";

const glm = createOpenAI({
  baseURL: "https://open.bigmodel.cn/api/paas/v4/",
  apiKey: process.env.GLM_API_KEY || "",
});

export async function POST(req: Request) {
  try {
    const { metrics } = await req.json();

    const prompt = `You are an AI fairness compliance expert. Analyze these bias metrics from a dataset audit:

Target Column: ${metrics.targetColumn}
Protected Attribute: ${metrics.protectedAttribute}
Disparate Impact Ratio: ${metrics.disparateImpact}
Demographic Parity Difference: ${metrics.demographicParityDifference}
Is Biased: ${metrics.isBiased}
Flagged Features: ${(metrics.flaggedFeatures || []).join(", ")}

Write a 3-paragraph executive summary:
1. State whether bias was detected and the severity
2. Explain what the metrics mean in plain English for a non-technical stakeholder
3. Provide 2-3 specific remediation recommendations

Keep it professional and concise. Do not use markdown formatting.`;

    const result = await streamText({
      model: glm("glm-4-flash"),
      prompt,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("[/api/report] Stream error:", error);

    // Return a fallback text response so the UI doesn't hang
    const fallback = generateFallbackReport(await req.clone().json().then(b => b.metrics).catch(() => null));
    return new Response(fallback, {
      headers: { "Content-Type": "text/plain" },
    });
  }
}

function generateFallbackReport(metrics: any): string {
  if (!metrics) return "Unable to generate AI analysis. Please check your API key configuration.";

  const di = metrics.disparateImpact;
  const dpd = metrics.demographicParityDifference;
  const biased = metrics.isBiased;
  const target = metrics.targetColumn;
  const protAttr = metrics.protectedAttribute;

  let severity = "low";
  if (di < 0.6 || di > 1.4) severity = "high";
  else if (di < 0.8 || di > 1.25) severity = "moderate";

  return `BIAS ANALYSIS REPORT (Auto-Generated)

${biased ? `BIAS DETECTED — Severity: ${severity.toUpperCase()}` : "NO SIGNIFICANT BIAS DETECTED"}

The analysis examined the "${target}" outcome across the "${protAttr}" attribute. The Disparate Impact ratio is ${di?.toFixed(3) ?? "N/A"}, ${di < 0.8 ? "which falls below the 4/5ths rule threshold (0.80), indicating potential adverse impact" : di > 1.25 ? "which exceeds 1.25, indicating potential reverse discrimination" : "which falls within the acceptable range (0.80 - 1.25)"}. The Demographic Parity Difference is ${dpd?.toFixed(3) ?? "N/A"}, ${Math.abs(dpd) > 0.1 ? "suggesting a meaningful gap in selection rates between groups" : "indicating roughly equal selection rates across groups"}.

Recommendations:
1. ${biased ? "Conduct a deeper intersectional analysis to identify root causes of the disparity" : "Continue monitoring these metrics on a quarterly basis"}
2. ${biased ? "Consider applying reweighing or disparate impact remover preprocessing before model training" : "Document this audit for compliance records"}
3. ${biased ? "Engage legal counsel to assess regulatory compliance (EEOC, EU AI Act)" : "Expand the audit to additional protected attributes (age, disability status)"}

Note: This is an auto-generated fallback report. For AI-powered analysis, ensure GLM_API_KEY is configured correctly.`;
}
