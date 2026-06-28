import { Metadata } from "next";

export async function generateMetadata({ params }: { params: { grade: string } }): Promise<Metadata> {
  const gradeNum = params.grade.replace(/[^0-9]/g, '') || params.grade;
  const gradeLabel = gradeNum ? `Class ${gradeNum}` : "Classroom";
  
  return {
    title: `${gradeLabel} NCERT Content`,
    description: `Explore complete NCERT chapter syllabus, AI lesson plans, video tutorials, and interactive learning quizzes tailored specifically for ${gradeLabel} students.`,
  };
}

export default function GradeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
