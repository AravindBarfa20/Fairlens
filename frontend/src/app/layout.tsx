import type { Metadata } from "next";
import "./globals.css";

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
      <body className="min-h-screen bg-[#020617] font-sans text-slate-50 antialiased selection:bg-sky-500/30">
        {children}
      </body>
    </html>
  );
}
