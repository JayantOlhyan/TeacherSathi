import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Lesson Plans",
  description: "Generate structured CBSE and NCERT AI lesson plans instantly. Save hours of classroom preparation time with bilingual Indian educator teaching workflows.",
};

export default function LessonPlansLayout({ children }: { children: React.ReactNode }) {
  return children;
}
