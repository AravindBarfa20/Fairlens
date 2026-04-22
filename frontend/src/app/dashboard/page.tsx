"use client";

import { motion } from "framer-motion";
import { ReportView } from "@/components/ReportView";
import { UploadDropzone } from "@/components/ui/UploadDropzone";
import { useBiasReport } from "@/store/useBiasReport";

export default function DashboardPage() {
  const { status, setFile, setStatus, setMetrics, appendReportStream } = useBiasReport();

  const handleFileUpload = async (file: File) => {
    try {
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
    } catch (err: any) {
      console.error("Analysis Error:", err);
      setStatus("idle");
      alert(`Analysis Failed: ${err.message || "Could not process CSV"}`);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 w-full space-y-8 duration-700">
      {status === "idle" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-white">Audit Workspace</h1>
            <p className="text-neutral-400">Upload your CSV dataset directly to the AIF360 engine.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#050505]/50 p-8 shadow-2xl backdrop-blur-xl">
            <UploadDropzone onFileSelect={handleFileUpload} />
          </div>
        </motion.div>
      )}

      {status !== "idle" && <ReportView />}
    </div>
  );
}
