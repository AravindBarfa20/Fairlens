export async function POST(req: Request) {
  let metrics: any;
  try {
    const body = await req.json();
    metrics = body.metrics;
  } catch {
    return new Response("Invalid request body", { status: 400 });
  }

  if (!metrics) {
    return new Response(generateFallbackReport(null), {
      headers: { "Content-Type": "text/plain" },
    });
  }

  const apiKey = process.env.GLM_API_KEY;

  // If we have a valid API key, try GLM
  if (apiKey && apiKey.length > 10) {
    try {
      const glmResponse = await fetch(
        "https://open.bigmodel.cn/api/paas/v4/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "glm-4-flash",
            messages: [
              {
                role: "user",
                content: buildPrompt(metrics),
              },
            ],
            stream: true,
          }),
          signal: AbortSignal.timeout(20000),
        }
      );

      if (glmResponse.ok && glmResponse.body) {
        // Stream SSE lines to client as plain text
        const encoder = new TextEncoder();
        const readable = new ReadableStream({
          async start(controller) {
            const reader = glmResponse.body!.getReader();
            const decoder = new TextDecoder();
            let buffer = "";

            try {
              while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split("\n");
                buffer = lines.pop() ?? "";

                for (const line of lines) {
                  if (!line.startsWith("data: ")) continue;
                  const payload = line.slice(6).trim();
                  if (payload === "[DONE]") continue;

                  try {
                    const json = JSON.parse(payload);
                    const content = json.choices?.[0]?.delta?.content;
                    if (content) {
                      controller.enqueue(encoder.encode(content));
                    }
                  } catch {
                    // skip malformed chunk
                  }
                }
              }
            } catch (e) {
              console.error("[/api/report] stream read error:", e);
            } finally {
              controller.close();
            }
          },
        });

        return new Response(readable, {
          headers: { "Content-Type": "text/plain; charset=utf-8" },
        });
      }

      // Non-OK response — fall through to fallback
      const errText = await glmResponse.text().catch(() => "unknown");
      console.error("[/api/report] GLM returned:", glmResponse.status, errText);
    } catch (error) {
      console.error("[/api/report] GLM fetch failed:", error);
    }
  }

  // Fallback: generate locally
  console.log("[/api/report] Using local fallback report generator");
  return new Response(generateFallbackReport(metrics), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

function buildPrompt(metrics: any): string {
  return `You are an AI fairness compliance expert. Analyze these bias metrics from a dataset audit:

Target Column: ${metrics.targetColumn}
Protected Attribute: ${metrics.protectedAttribute}
Disparate Impact Ratio: ${metrics.disparateImpact}
Demographic Parity Difference: ${metrics.demographicParityDifference}
Is Biased: ${metrics.isBiased}
Flagged Features: ${(metrics.flaggedFeatures || []).join(", ")}

Write a 3-paragraph executive summary:
1. State whether bias was detected and the severity level (low/moderate/high)
2. Explain what these metrics mean in plain English for a non-technical HR executive
3. Provide 2-3 specific, actionable remediation steps

Keep it professional, 200 words max. Do not use markdown formatting or bullet points.`;
}

function generateFallbackReport(metrics: any): string {
  if (!metrics)
    return "Unable to generate AI analysis. Please verify your GLM_API_KEY in .env.local.";

  const di = metrics.disparateImpact ?? 1.0;
  const dpd = metrics.demographicParityDifference ?? 0;
  const biased = metrics.isBiased ?? false;
  const target = metrics.targetColumn ?? "unknown";
  const protAttr = metrics.protectedAttribute ?? "unknown";

  let severity = "low";
  if (di < 0.6 || di > 1.4) severity = "high";
  else if (di < 0.8 || di > 1.25) severity = "moderate";

  return `BIAS ANALYSIS REPORT

${biased ? `⚠ BIAS DETECTED — Severity: ${severity.toUpperCase()}` : "✓ NO SIGNIFICANT BIAS DETECTED"}

The analysis examined the "${target}" outcome across the "${protAttr}" protected attribute. The Disparate Impact ratio is ${di.toFixed(3)}, ${di < 0.8 ? "which falls below the 4/5ths rule threshold (0.80), indicating potential adverse impact against the unprivileged group" : di > 1.25 ? "which exceeds 1.25, indicating potential reverse discrimination" : "which falls within the acceptable range of 0.80–1.25 per the 4/5ths rule"}. The Demographic Parity Difference of ${dpd.toFixed(3)} ${Math.abs(dpd) > 0.1 ? "reveals a statistically meaningful gap in selection rates between protected groups" : "indicates roughly equal selection rates across groups"}.

WHAT THIS MEANS FOR YOUR ORGANIZATION:
${biased ? `The data suggests systematic disparity in "${target}" outcomes based on "${protAttr}". Under the EEOC Uniform Guidelines and the EU AI Act, this level of disparity would trigger further investigation. If left unaddressed, this could expose the organization to legal and reputational risk.` : `No corrective action is currently required. The "${target}" outcome appears to be distributed equitably across "${protAttr}" groups. This is a positive finding for compliance purposes.`}

RECOMMENDED ACTIONS:
1. ${biased ? "Root-Cause Analysis: Investigate whether the disparity stems from training data bias, feature selection, or model architecture" : "Continued Monitoring: Re-run this audit quarterly to detect metric drift"}
2. ${biased ? "Bias Mitigation: Apply preprocessing techniques (reweighing, disparate impact remover) or in-processing constraints (adversarial debiasing) before model deployment" : "Documentation: Archive this audit result for SOC2/EEOC/EU AI Act compliance records"}
3. ${biased ? "Legal Review: Consult compliance counsel before deploying affected models to production" : "Scope Expansion: Extend audits to additional protected attributes (age, disability, ethnicity)"}

This report was generated locally. For AI-powered natural language analysis, configure a valid GLM_API_KEY.`;
}
