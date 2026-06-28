import { Metadata } from "next";

export const metadata: Metadata = {
  title: "NCERT Textbooks & Guides",
  description: "Access complete NCERT textbook solutions, chapter study guides, and bilingual teaching aids designed to support government school classrooms in India.",
};

export default function NcertLayout({ children }: { children: React.ReactNode }) {
  return children;
}
