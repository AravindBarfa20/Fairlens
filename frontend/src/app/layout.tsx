// frontend/src/app/layout.tsx
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
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
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: { 
          colorPrimary: "#fafafa", 
          colorBackground: "#0a0a0a",
          colorText: "#fafafa"
        },
        elements: {
          card: "bg-black border border-white/10 shadow-2xl",
        }
      }}
    >
      <html lang="en" className="dark">
        <body className="min-h-screen bg-[var(--background)] font-sans text-[var(--foreground)] antialiased selection:bg-white/20">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
