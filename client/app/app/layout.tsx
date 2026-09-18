import { Header } from "@/components/layout/header";
import { Suspense } from "react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full h-screen bg-[#f8fafc] flex flex-col overflow-hidden font-sans">
      <Suspense
        fallback={
          <div className="h-16 bg-white/70 border-b border-gray-200/80" />
        }
      >
        <Header />
      </Suspense>
      <main className="flex-1 overflow-hidden flex flex-col">{children}</main>
    </div>
  );
}
