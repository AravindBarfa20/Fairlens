// frontend/components/ui/Button.tsx
"use client";

import { HTMLMotionProps, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { glassHover } from "@/lib/animations";
import { Loader2 } from "lucide-react";

interface ButtonProps extends HTMLMotionProps<"button"> {
  children: React.ReactNode;
  isLoading?: boolean;
  variant?: "primary" | "secondary";
}

export function Button({
  children,
  className,
  isLoading,
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <motion.button
      variants={glassHover}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      disabled={isLoading || props.disabled}
      className={cn(
        "relative flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none",
        variant === "primary"
          ? "bg-white text-black hover:bg-neutral-200"
          : "glass-card text-white",
        className
      )}
      {...props}
    >
      {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
      {!isLoading && children}
    </motion.button>
  );
}
