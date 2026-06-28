import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Read the TeacherSathi Privacy Policy. Learn how we safeguard educator and student data, protect classroom privacy, and uphold strict government standards.",
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
