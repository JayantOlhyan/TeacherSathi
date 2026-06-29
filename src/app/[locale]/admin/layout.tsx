import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin CMS Portal – TeacherSathi",
  description: "Manage classroom resources, syllabus content, and monitor AI video generation pipelines in the unified Admin workspace.",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#0B0F19] min-h-screen text-slate-100 font-sans">
      {children}
    </div>
  );
}
