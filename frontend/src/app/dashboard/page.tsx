"use client";

import { motion } from "framer-motion";
import { ReportView } from "@/components/ReportView";
import { GlassCard } from "@/components/ui/GlassCard";
import { UploadDropzone } from "@/components/ui/UploadDropzone";
import { useBiasReport } from "@/store/useBiasReport";
import { createClient } from "@/lib/supabase/client";
import { AlertTriangle, RotateCcw, Sparkles, ShieldCheck, Lock, Activity } from "lucide-react";
import { toast } from "sonner";

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
      const apiUrl = process.env.NODE_ENV === "production" 
        ? "/api/math/analyze" 
        : "http://127.0.0.1:8000/analyze";

      const response = await fetch(apiUrl, {
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
          let rawText = "";

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            rawText += decoder.decode(value, { stream: true });
          }
          rawText += decoder.decode();

          // Try parsing as SSE stream (lines like "0:\"text\"")
          const sseLines = rawText.split("\n").filter((l) => l.startsWith("0:"));
          if (sseLines.length > 0) {
            for (const line of sseLines) {
              try {
                const text = JSON.parse(line.slice(2));
                appendReportStream(text);
                fullExplanation += text;
              } catch {
                // partial chunk
              }
            }
          } else {
            // Plain text fallback response
            appendReportStream(rawText);
            fullExplanation = rawText;
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
      toast.error(err instanceof Error ? err.message : "Could not process CSV");
    }
  };

  const loadSampleDataset = async () => {
    try {
      toast.loading("Fetching sample biased dataset...", { id: "sample" });
      const res = await fetch('/sample_biased.csv');
      const blob = await res.blob();
      const demoFile = new File([blob], "sample_biased_hr.csv", { type: "text/csv" });
      toast.dismiss("sample");
      toast.success("Dataset loaded successfully!");
      handleFileUpload(demoFile);
    } catch (e) {
      toast.error("Failed to load sample data.");
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

          <div className="relative max-w-2xl">
            {/* Glowing orb background effect for UI juice */}
            <div className="absolute inset-0 -z-10 translate-y-12 blur-[100px] bg-cyan-500/10 rounded-full" />
            
            <GlassCard className="flex flex-col items-center p-8">
              <UploadDropzone onFileSelect={handleFileUpload} className="w-full" />
              
              <div className="mt-8 flex flex-col items-center justify-center w-full gap-4">
                <p className="text-xs text-neutral-500">CSV files only (Max 4.5MB)</p>
                <button 
                  onClick={loadSampleDataset} 
                  className="flex items-center gap-2 text-sm font-medium dark:text-cyan-400 text-cyan-600 dark:hover:text-cyan-300 transition-colors border dark:border-cyan-500/30 border-cyan-500/20 dark:bg-cyan-500/10 bg-cyan-50 px-5 py-2.5 rounded-full dark:hover:bg-cyan-500/20 hover:bg-cyan-100"
                >
                  <Sparkles className="w-4 h-4" />
                  No CSV? Load 1-Click Sample Biased Dataset
                </button>
              </div>
            </GlassCard>

            {/* Trust Badges bottom */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { icon: ShieldCheck, title: "EEOC Compliant", desc: "Maps to Uniform Guidelines" },
                { icon: Lock, title: "Zero Retention", desc: "Data is dropped post-audit" },
                { icon: Activity, title: "Real-Time Math", desc: "Powered by strict AIF360" }
              ].map((badge, idx) => {
                const Icon = badge.icon;
                return (
                  <div key={idx} className="flex items-center gap-3 p-4 rounded-2xl border border-white/5 bg-white/[0.01]">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-neutral-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{badge.title}</p>
                      <p className="text-xs text-neutral-500">{badge.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
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
