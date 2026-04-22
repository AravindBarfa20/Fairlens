import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col">
      <header className="border-b border-white/5 bg-[#050505]/80 backdrop-blur-xl px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <Link
          href="/dashboard"
          className="text-xl font-bold tracking-tight text-white flex items-center gap-2"
        >
          FairLens{" "}
          <span className="text-sm font-normal text-neutral-500">Workspace</span>
        </Link>
        <UserButton />
      </header>
      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">{children}</main>
    </div>
  );
}
