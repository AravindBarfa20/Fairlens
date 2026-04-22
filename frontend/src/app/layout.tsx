// frontend/src/app/layout.tsx
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FairLens | AI Bias Detection & Explainability",
  description: "Enterprise-grade AI bias detection engine. Audit datasets, run AIF360 fairness metrics, and stream GLM 5.1 explainability in real-time.",
  keywords: ["AI bias", "fairness", "machine learning", "AIF360", "explainability", "audit"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: "#fafafa",
          colorBackground: "#0a0a0a",
          colorText: "#fafafa",
          borderRadius: "1rem",
        },
        elements: {
          card: "bg-[#0a0a0a]/90 border border-white/10 shadow-2xl backdrop-blur-2xl",
          formButtonPrimary: "bg-white text-black hover:bg-neutral-200",
          footerActionLink: "text-neutral-400 hover:text-white",
        },
      }}
    >
      <html lang="en" className="dark antialiased" suppressHydrationWarning>
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
            rel="stylesheet"
          />
        </head>
        <body className="min-h-screen bg-[var(--background)] font-sans text-[var(--foreground)]">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
