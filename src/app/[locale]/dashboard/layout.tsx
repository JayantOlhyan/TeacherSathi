import { Metadata } from "next";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";

export const metadata: Metadata = {
  title: "Educator Dashboard",
  description: "Manage your Indian classrooms, generate AI lesson plans, access interactive whiteboards, and track student activity on your TeacherSathi dashboard.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex bg-[#F8FAF8] font-sans overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
