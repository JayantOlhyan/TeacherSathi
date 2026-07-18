import { Metadata } from "next";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import AdminRoleGuard from "@/components/admin/AdminRoleGuard";

export const metadata: Metadata = {
  title: "Admin CMS Portal – TeacherSathi",
  description: "Manage classroom resources, syllabus content, and monitor AI video generation pipelines in the unified Admin workspace.",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen flex bg-gradient-to-br from-[#E8F5E9] via-[#FDFBF7] to-[#F1F8E9] font-sans overflow-hidden text-slate-800">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-y-auto p-8">
          <AdminRoleGuard>
            {children}
          </AdminRoleGuard>
        </main>
      </div>
    </div>
  );
}
