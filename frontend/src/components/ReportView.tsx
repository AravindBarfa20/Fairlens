"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { MetricBadge } from "@/components/ui/MetricBadge";
import { Skeleton } from "@/components/ui/Skeleton";
import { useBiasReport } from "@/store/useBiasReport";

export function ReportView() {
  const { status, metrics, reportStream } = useBiasReport();

  if (status === "uploading" || status === "analyzing") {
    return (
      <div className="animate-in fade-in w-full max-w-4xl space-y-8 duration-500">
        <div className="space-y-3">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
        <GlassCard className="flex h-48 items-center justify-center">
          <p className="animate-pulse text-neutral-500">
            Running AIF360 Bias Detection...
          </p>
        </GlassCard>
      </div>
    );
  }

  if (status === "complete") {
    return (
      <div className="animate-in slide-in-from-bottom-4 fade-in w-full max-w-5xl space-y-8 duration-700">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <MetricBadge
            label="Disparate Impact"
            value={metrics?.disparateImpact?.toFixed(2) || "0.00"}
            highlight={metrics?.isBiased}
          />
          <MetricBadge
            label="Demographic Parity"
            value={metrics?.demographicParityDifference?.toFixed(2) || "0.00"}
          />
          <MetricBadge label="Target Column" value={metrics?.targetColumn || "N/A"} />
          <MetricBadge
            label="Protected Attr"
            value={metrics?.protectedAttribute || "N/A"}
          />
        </div>

        <GlassCard className="p-8">
          <h3 className="mb-6 border-b border-white/10 pb-4 text-xl font-semibold text-white">
            AI Explainability Report
          </h3>
          <div className="prose prose-invert max-w-none whitespace-pre-wrap text-neutral-300 leading-relaxed">
            {reportStream || "Awaiting AI insights..."}
          </div>
        </GlassCard>
      </div>
    );
  }

  return null;
}
