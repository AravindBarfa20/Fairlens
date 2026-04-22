"use client";

import { motion } from "framer-motion";
import { ReportView } from "@/components/ReportView";
import { GlassCard } from "@/components/ui/GlassCard";
import { UploadDropzone } from "@/components/ui/UploadDropzone";
import { useBiasReport } from "@/store/useBiasReport";

export default function DashboardPage() {
  const {
    status,
    reset,
    setFile,
    setStatus,
    setMetrics,
    appendReportStream,
    setErrorMessage,
  } = useBiasReport();

  const handleFileUpload = async (file: File) => {
    try {
      reset();
      setFile(file);
      setStatus("analyzing");

      const formData = new FormData();
      formData.append("file", file);

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

      const aiResponse = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ metrics: realMetrics }),
      });

      if (!aiResponse.body) return;

      const reader = aiResponse.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n").filter((line) => line.startsWith("0:"));
        for (const line of lines) {
          try {
            const text = JSON.parse(line.slice(2));
            appendReportStream(text);
          } catch {
            // ignore partial chunk
          }
        }
      }
    } catch (err) {
      console.error("Analysis Error:", err);
      setErrorMessage(
        err instanceof Error ? err.message : "Could not process CSV"
      );
    }
  };

  return (
    <div className="space-y-8">
      {status === "idle" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="animate-in slide-in-from-bottom-4 fade-in space-y-8 duration-700"
        >
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
        </motion.div>
      )}

      {status !== "idle" && <ReportView />}
    </div>
  );
}
