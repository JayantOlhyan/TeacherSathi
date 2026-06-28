import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Academic Reports",
  description: "Analyze class performance analytics, export detailed academic progress reports, and uncover actionable student insights to elevate classroom outcomes.",
};

export default function ReportsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
