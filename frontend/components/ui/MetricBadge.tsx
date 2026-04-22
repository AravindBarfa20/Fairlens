// frontend/components/ui/MetricBadge.tsx
"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { fadeUp } from "@/lib/animations";

interface MetricBadgeProps {
  label: string;
  value: string | number;
  highlight?: boolean;
  className?: string;
}

export function MetricBadge({ label, value, highlight = false, className }: MetricBadgeProps) {
  return (
    <motion.div
      variants={fadeUp}
      className={cn(
        "flex flex-col gap-1 rounded-xl border p-4 transition-colors",
        highlight 
          ? "border-white/20 bg-white/10" 
          : "border-white/5 bg-white/5",
        className
      )}
    >
      <span className="text-neutral-400 text-xs font-medium uppercase tracking-wider">
        {label}
      </span>
      <span className="text-neutral-50 text-2xl font-semibold tracking-tight">
        {value}
      </span>
    </motion.div>
  );
}
