"use client";

import { ReportView } from "@/components/ReportView";
import { GlassCard } from "@/components/ui/GlassCard";
import { UploadDropzone } from "@/components/ui/UploadDropzone";
import { useBiasReport } from "@/store/useBiasReport";

export default function DashboardPage() {
  const { status, setFile, setStatus, setMetrics } = useBiasReport();

  const handleFileUpload = (file: File) => {
    setFile(file);
    setStatus("analyzing");

    setTimeout(() => {
      setMetrics({
        targetColumn: "Hiring_Decision",
        protectedAttribute: "Gender",
        disparateImpact: 0.72,
        demographicParityDifference: -0.18,
        isBiased: true,
        flaggedFeatures: ["Gender", "Zip_Code"],
      });
      setStatus("complete");
    }, 2500);
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
