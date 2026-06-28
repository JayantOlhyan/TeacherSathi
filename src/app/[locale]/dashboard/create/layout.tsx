import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create AI Content",
  description: "Create customized NCERT lesson plans, generate diagnostic quizzes, design mind maps, and build study guides tailored for your classroom in just minutes.",
};

export default function CreateLayout({ children }: { children: React.ReactNode }) {
  return children;
}
