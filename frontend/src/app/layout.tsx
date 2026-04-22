import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: "FairLens | AI Bias Detection",
  description: "Enterprise AI Bias Detection and Explainability",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#050505] font-sans text-[#fafafa] antialiased selection:bg-white/20">
        {children}
        <Toaster theme="dark" position="bottom-right" />
      </body>
    </html>
  );
}
