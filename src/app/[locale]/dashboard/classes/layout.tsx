import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Classes",
  description: "Organize and manage your government school classes, student rosters, subject curricula, and attendance tracking seamlessly on TeacherSathi AI platform.",
};

export default function ClassesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
