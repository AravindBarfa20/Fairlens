"use client";

import { motion } from "framer-motion";
import { ReportView } from "@/components/ReportView";
import { GlassCard } from "@/components/ui/GlassCard";
import { UploadDropzone } from "@/components/ui/UploadDropzone";
import { useBiasReport } from "@/store/useBiasReport";
import { createClient } from "@/lib/supabase/client";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function DashboardPage() {
  const {
    status,
    errorMessage,
    file,
    metrics,
    reportStream,
    reset,
    setFile,
    setStatus,
    setMetrics,
    appendReportStream,
    setErrorMessage,
  } = useBiasReport();

  const supabase = createClient();

  const handleFileUpload = async (uploadedFile: File) => {
    try {
      reset();
      setFile(uploadedFile);
      setStatus("analyzing");

      const formData = new FormData();
      formData.append("file", uploadedFile);

      // 1. Call FastAPI Math Engine
      const response = await fetch("http://127.0.0.1:8000/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`FastAPI returned status ${response.status}`);
      }

      const realMetrics = await response.json();

      if (realMetrics.error) {
        throw new Error(realMetrics.error);
      }

      setMetrics(realMetrics);
      setStatus("complete");

      // 2. Stream AI explanation
      let fullExplanation = "";
      try {
        const aiResponse = await fetch("/api/report", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ metrics: realMetrics }),
        });

        if (aiResponse.body) {
          const reader = aiResponse.body.getReader();
          const decoder = new TextDecoder();
          let buffer = "";

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() ?? "";

            for (const line of lines) {
              if (!line.startsWith("0:")) continue;
              try {
                const text = JSON.parse(line.slice(2));
                appendReportStream(text);
                fullExplanation += text;
              } catch {
                // partial chunk
              }
            }
          }

          // Flush remaining buffer
          buffer += decoder.decode();
          for (const line of buffer.split("\n")) {
            if (!line.startsWith("0:")) continue;
            try {
              const text = JSON.parse(line.slice(2));
              appendReportStream(text);
              fullExplanation += text;
            } catch {
              // skip
            }
          }
        }
      } catch (streamError) {
        console.error("AI Stream failed:", streamError);
        appendReportStream("\n\n[AI insights could not be fully generated.]");
      }

      // 3. Persist to Supabase
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("audit_reports").insert({
          user_id: user.id,
          file_name: uploadedFile.name,
          target_column: realMetrics.targetColumn,
          protected_attribute: realMetrics.protectedAttribute,
          disparate_impact: realMetrics.disparateImpact,
          demographic_parity_diff: realMetrics.demographicParityDifference,
          is_biased: realMetrics.isBiased,
          flagged_features: realMetrics.flaggedFeatures,
          ai_explanation: fullExplanation || null,
        });
      }
    } catch (err) {
      console.error("Analysis Error:", err);
      setErrorMessage(
        err instanceof Error ? err.message : "Could not process CSV"
      );
    }
  };

  return (
    <div className="w-full space-y-8">
      {/* IDLE — Upload */}
      {status === "idle" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="animate-in slide-in-from-bottom-4 fade-in space-y-8 duration-700"
        >
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight dark:text-white text-neutral-900">
              Audit New Dataset
            </h1>
            <p className="dark:text-neutral-400 text-neutral-500">
              Upload your HR or applicant CSV to detect hidden biases. Data is processed ephemerally.
            </p>
          </div>

          <GlassCard className="max-w-2xl">
            <UploadDropzone onFileSelect={handleFileUpload} />
          </GlassCard>
        </motion.div>
      )}

      {/* ERROR — with retry */}
      {status === "error" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-2xl">
          <GlassCard className="flex flex-col items-center gap-4 p-10 text-center">
            <div className="rounded-full bg-red-500/10 p-3 ring-1 ring-red-500/20">
              <AlertTriangle className="h-6 w-6 text-red-400" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-semibold dark:text-white text-neutral-900">Analysis Failed</h2>
              <p className="text-sm dark:text-neutral-400 text-neutral-500">{errorMessage}</p>
            </div>
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 rounded-xl dark:bg-white/5 bg-neutral-100 px-5 py-2.5 text-sm font-medium dark:text-white text-neutral-900 ring-1 dark:ring-white/10 ring-neutral-200 transition-all dark:hover:bg-white/10 hover:bg-neutral-200"
            >
              <RotateCcw className="h-4 w-4" />
              Try Again
            </button>
          </GlassCard>
        </motion.div>
      )}

      {/* ANALYZING / COMPLETE — Show report */}
      {(status === "analyzing" || status === "complete") && <ReportView />}
    </div>
  );
}
