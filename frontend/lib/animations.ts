// frontend/lib/animations.ts
import { Variants } from "framer-motion";

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const glassHover: Variants = {
  rest: {
    scale: 1,
    backgroundColor: "var(--glass-bg)",
    borderColor: "var(--glass-border)",
  },
  hover: {
    scale: 1.02,
    backgroundColor: "rgba(15, 15, 15, 0.8)",
    borderColor: "var(--glass-highlight)",
    transition: { type: "spring", stiffness: 400, damping: 25 },
  },
  tap: { scale: 0.98 },
};
