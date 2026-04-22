"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { UploadDropzone } from "@/components/ui/UploadDropzone";
import { useBiasReport } from "@/store/useBiasReport";

export default function DashboardPage() {
  const { setFile, setStatus } = useBiasReport();

  const handleFileUpload = (file: File) => {
    setFile(file);
    setStatus("uploading");
    // Wire up backend fetch here in Phase 4
    console.log("File captured in global state:", file.name);
  };

  return (
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
  );
}
