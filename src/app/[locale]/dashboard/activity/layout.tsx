import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Student Activity Feed",
  description: "Monitor real-time student activity logs, track quiz completions, review learning engagement, and analyze academic milestones across Indian classrooms.",
};

export default function ActivityLayout({ children }: { children: React.ReactNode }) {
  return children;
}
