import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--background)]">
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-white/5 bg-[#050505]/80 px-6 py-4 backdrop-blur-xl">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-xl font-bold tracking-tight text-white"
        >
          FairLens{" "}
          <span className="text-sm font-normal text-neutral-500">Workspace</span>
        </Link>
        <UserButton afterSignOutUrl="/" />
      </header>
      <main className="mx-auto flex-1 w-full max-w-7xl p-6 md:p-10">{children}</main>
    </div>
  );
}
