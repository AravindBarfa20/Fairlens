"use client";

import { ReportView } from "@/components/ReportView";
import { GlassCard } from "@/components/ui/GlassCard";
import { UploadDropzone } from "@/components/ui/UploadDropzone";
import { useBiasReport } from "@/store/useBiasReport";

export default function DashboardPage() {
  const { status, reset, setFile, setStatus, setMetrics, appendReportStream } =
    useBiasReport();

  const handleFileUpload = async (file: File) => {
    reset();
    setFile(file);
    setStatus("analyzing");

    const mockMetrics = {
        targetColumn: "Hiring_Decision",
        protectedAttribute: "Gender",
        disparateImpact: 0.72,
        demographicParityDifference: -0.18,
        isBiased: true,
        flaggedFeatures: ["Gender", "Zip_Code"],
      };

    setTimeout(async () => {
      setMetrics(mockMetrics);
      setStatus("complete");

      try {
        const res = await fetch("/api/report", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ metrics: mockMetrics }),
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
            const text = JSON.parse(line.slice(2));
            appendReportStream(text);
          }
        }

        buffer += decoder.decode();
        for (const line of buffer.split("\n")) {
          if (!line.startsWith("0:")) continue;
          const text = JSON.parse(line.slice(2));
          appendReportStream(text);
        }
      } catch (error) {
        console.error("AI Stream failed:", error);
        appendReportStream("Failed to generate AI insights.");
      }
    }, 2000);
  };

  return (
    <div className="space-y-8">
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

      {status !== "idle" && <ReportView />}
    </div>
  );
}
