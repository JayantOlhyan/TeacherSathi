import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Quiz Generator",
  description: "Instantly generate bilingual practice quizzes, chapter tests, and evaluation worksheets aligned with CBSE and NCERT school syllabus for your students.",
};

export default function QuizGeneratorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
