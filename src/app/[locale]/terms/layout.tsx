import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Review the TeacherSathi Terms of Service. Understand our user guidelines, AI content licensing, educator responsibilities, and platform usage policies.",
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
