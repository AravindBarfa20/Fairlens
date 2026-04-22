// frontend/components/ui/UploadDropzone.tsx
"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";
import { glassHover } from "@/lib/animations";

interface UploadDropzoneProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  className?: string;
}

export function UploadDropzone({
  onFileSelect,
  accept = ".csv",
  className,
}: UploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        onFileSelect(e.dataTransfer.files[0]);
      }
    },
    [onFileSelect]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <motion.div
      variants={glassHover}
      initial="rest"
      whileHover="hover"
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={cn(
        "relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12 transition-all duration-300",
        isDragging
          ? "border-white/40 bg-white/5"
          : "border-white/10 glass-card",
        className
      )}
    >
      <input
        type="file"
        accept={accept}
        onChange={handleChange}
        className="absolute inset-0 z-50 h-full w-full cursor-pointer opacity-0"
      />
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="rounded-full bg-white/5 p-4 ring-1 ring-white/10">
          <UploadCloud className="h-8 w-8 text-neutral-50" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-neutral-50">
            Click to upload or drag and drop
          </p>
          <p className="text-xs text-neutral-400">CSV files only (Max 50MB)</p>
        </div>
      </div>
    </motion.div>
  );
}
