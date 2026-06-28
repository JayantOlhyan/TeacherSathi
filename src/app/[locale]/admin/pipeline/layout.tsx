import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Pipeline Admin",
  description: "Manage system pipelines, monitor AI content generation queues, review NCERT chapter processing, and oversee platform performance metrics efficiently.",
};

export default function PipelineLayout({ children }: { children: React.ReactNode }) {
  return children;
}
