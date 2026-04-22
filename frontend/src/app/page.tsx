// frontend/src/app/page.tsx
import { Button } from "@/components/ui/Button";
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden p-6 text-center">
      <div className="relative z-10 max-w-3xl space-y-8">
        <h1 className="text-5xl font-bold tracking-tighter text-white md:text-7xl">
          Stop AI Bias <br />
          <span className="text-neutral-500">Before It Deploys.</span>
        </h1>
        
        <p className="mx-auto max-w-xl text-lg text-neutral-400">
          Enterprise-grade bias detection and explainability. Audit your datasets and models instantly without a PhD in data science.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="relative flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 font-medium text-black transition-colors hover:bg-neutral-200">
                Get Started Securely
              </button>
            </SignInButton>
          </SignedOut>
          
          <SignedIn>
            <Link href="/dashboard">
              <Button variant="primary">Go to Dashboard</Button>
            </Link>
          </SignedIn>

          <Link href="/sandbox">
            <Button variant="secondary">View Components</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
