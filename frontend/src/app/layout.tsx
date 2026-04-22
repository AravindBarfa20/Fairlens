// frontend/src/app/layout.tsx
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FairLens | AI Bias Detection",
  description: "Enterprise AI Bias Detection and Explainability",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: "#0ea5e9",
          colorBackground: "#0f172a",
          colorInputBackground: "#1e293b",
          colorInputText: "#f8fafc",
          colorText: "#f8fafc",
          colorTextSecondary: "#94a3b8",
        },
        elements: {
          card: "bg-slate-900 border border-slate-800 shadow-2xl rounded-2xl",
          formButtonPrimary: "bg-sky-500 hover:bg-sky-400 text-white font-bold transition-all",
          formFieldInput: "border-slate-700 focus:border-sky-500 text-white bg-slate-800",
          formFieldLabel: "text-slate-300",
          footerActionLink: "text-sky-400 hover:text-sky-300",
        },
      }}
    >
      <html lang="en" className="dark">
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
            rel="stylesheet"
          />
        </head>
        <body className="min-h-screen bg-[#020617] font-sans text-slate-50 antialiased selection:bg-sky-500/30">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
