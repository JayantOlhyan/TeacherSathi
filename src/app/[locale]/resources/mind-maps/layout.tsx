import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Mind Maps",
  description: "Create interactive visual mind maps and concept summaries for textbook chapters. Simplify complex classroom lessons for school students across India.",
};

export default function MindMapsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
