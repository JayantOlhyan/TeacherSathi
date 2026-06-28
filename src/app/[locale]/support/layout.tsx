import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Help & Support Center",
  description: "Access the TeacherSathi Help & Support Center. Browse FAQs, user guides, video tutorials, and technical support resources tailored for Indian educators.",
};

export default function SupportLayout({ children }: { children: React.ReactNode }) {
  return children;
}
