import { Header } from "@/components/layout/header";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full h-screen bg-[#f8fafc] flex flex-col overflow-hidden font-sans">
      <Header />
      {/* Main Content renders here */}
      <main className="flex-1 overflow-hidden flex flex-col">{children}</main>
    </div>
  );
}
