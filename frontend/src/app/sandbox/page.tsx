// frontend/src/app/sandbox/page.tsx
"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { UploadDropzone } from "@/components/ui/UploadDropzone";
import { Skeleton } from "@/components/ui/Skeleton";
import { MetricBadge } from "@/components/ui/MetricBadge";

export default function SandboxPage() {
  return (
    <div className="min-h-screen p-10 max-w-5xl mx-auto space-y-12">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-white">UI Component Sandbox</h1>
        <p className="text-neutral-400">Verifying Deep Space Monochrome Glass theme.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* GlassCard & Buttons */}
        <div className="space-y-4">
          <h2 className="text-sm font-medium uppercase text-neutral-500">Containers & Buttons</h2>
          <GlassCard>
            <div className="space-y-6">
              <p className="text-sm text-neutral-300">This is a standard GlassCard component.</p>
              <div className="flex gap-4">
                <Button variant="primary">Primary Action</Button>
                <Button variant="secondary">Secondary</Button>
              </div>
              <Button isLoading variant="primary" className="w-full">Generating Report</Button>
            </div>
          </GlassCard>
        </div>

        {/* Dropzone */}
        <div className="space-y-4">
          <h2 className="text-sm font-medium uppercase text-neutral-500">Data Upload</h2>
          <UploadDropzone onFileSelect={(file) => console.log(file)} />
        </div>

        {/* Metrics & Skeletons */}
        <div className="space-y-4 md:col-span-2">
          <h2 className="text-sm font-medium uppercase text-neutral-500">Data Display</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricBadge label="Disparate Impact" value="0.82" />
            <MetricBadge label="Demographic Parity" value="-0.15" highlight />
            <div className="space-y-2 col-span-2 flex flex-col justify-center">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
