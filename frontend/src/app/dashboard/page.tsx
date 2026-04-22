"use client";

import { analyzeDataset } from "@/app/actions/analyze";
import { ReportView } from "@/components/ReportView";
import { GlassCard } from "@/components/ui/GlassCard";
import { UploadDropzone } from "@/components/ui/UploadDropzone";
import { useBiasReport } from "@/store/useBiasReport";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function DashboardPage() {
  const {
    status,
    errorMessage,
    reset,
    setFile,
    setStatus,
    setMetrics,
    appendReportStream,
    setErrorMessage,
  } = useBiasReport();

  const handleFileUpload = async (file: File) => {
    reset();
    setFile(file);
    setStatus("analyzing");

    const formData = new FormData();
    formData.append("file", file);

    const { data: realMetrics, error } = await analyzeDataset(formData);

    if (error || !realMetrics) {
      setErrorMessage(error || "Unknown error occurred during analysis.");
      return;
    }

    setMetrics(realMetrics);
    setStatus("complete");

    try {
      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ metrics: realMetrics }),
      });

      if (!res.ok || !res.body) {
        throw new Error("AI stream request failed");
      }

      const reader = res.body.getReader();
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
          } catch {
            // partial chunk — skip
          }
        }
      }

      buffer += decoder.decode();
      for (const line of buffer.split("\n")) {
        if (!line.startsWith("0:")) continue;
        try {
          const text = JSON.parse(line.slice(2));
          appendReportStream(text);
        } catch {
          // skip
        }
      }
    } catch (streamError) {
      console.error("AI Stream failed:", streamError);
      appendReportStream("\n\n[AI insights could not be fully generated.]");
    }
  };

  return (
    <div className="w-full space-y-8">
      {/* IDLE — Upload */}
      {status === "idle" && (
        <div className="animate-in slide-in-from-bottom-4 fade-in space-y-8 duration-700">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Audit New Dataset
            </h1>
            <p className="text-neutral-400">
              Upload your HR or applicant CSV to detect hidden biases.
            </p>
          </div>

          <GlassCard className="max-w-2xl">
            <UploadDropzone onFileSelect={handleFileUpload} />
          </GlassCard>
        </div>
      )}

      {/* ERROR — Show error with retry */}
      {status === "error" && (
        <div className="animate-in fade-in space-y-6 duration-500 max-w-2xl">
          <GlassCard className="flex flex-col items-center gap-4 p-10 text-center">
            <div className="rounded-full bg-red-500/10 p-3 ring-1 ring-red-500/20">
              <AlertTriangle className="h-6 w-6 text-red-400" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-white">Analysis Failed</h2>
              <p className="text-sm text-neutral-400">{errorMessage}</p>
            </div>
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 rounded-xl bg-white/5 px-5 py-2.5 text-sm font-medium text-white ring-1 ring-white/10 transition-all hover:bg-white/10"
            >
              <RotateCcw className="h-4 w-4" />
              Try Again
            </button>
          </GlassCard>
        </div>
      )}

      {/* ANALYZING / COMPLETE — Show report */}
      {(status === "analyzing" || status === "complete") && <ReportView />}
    </div>
  );
}
