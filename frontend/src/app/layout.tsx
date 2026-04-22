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
          colorPrimary: "#a78bfa",
          colorBackground: "#0c0c0c",
          colorInputBackground: "#1a1a1a",
          colorInputText: "#fafafa",
          colorText: "#fafafa",
          colorTextSecondary: "#a3a3a3",
        },
        elements: {
          card: "!bg-[#0c0c0c] !border !border-white/10 !shadow-2xl !rounded-2xl !backdrop-blur-2xl",
          formButtonPrimary: "!bg-white !text-black hover:!bg-neutral-200 !font-semibold !transition-all",
          formFieldInput: "!border-white/10 focus:!border-white/30 !text-white !bg-[#1a1a1a] !rounded-xl",
          formFieldLabel: "!text-neutral-300",
          footerActionLink: "!text-neutral-400 hover:!text-white",
          headerTitle: "!text-white",
          headerSubtitle: "!text-neutral-400",
          socialButtonsBlockButton: "!bg-[#1a1a1a] !border-white/10 hover:!bg-white/10 !text-white",
          dividerLine: "!bg-white/10",
          dividerText: "!text-neutral-500",
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
        <body className="min-h-screen bg-[#050505] font-sans text-[#fafafa]">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
