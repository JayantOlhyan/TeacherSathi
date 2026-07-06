import { Metadata } from "next";

export async function generateMetadata({ params }: { params: { grade: string; subject: string; chapter: string } }): Promise<Metadata> {
  const subj = params.subject ? params.subject.charAt(0).toUpperCase() + params.subject.slice(1) : "Subject";
  const chap = params.chapter.replace(/[-_]/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  let titleStr = `${chap} Q&A Solutions`;
  if (titleStr.length > 40) titleStr = titleStr.slice(0, 37) + "...";

  let desc = `Comprehensive bilingual NCERT question answers, whiteboard key points, and competency-based practice solutions for ${subj} ${chap}. Tailored for educators and students.`;
  if (desc.length > 160) desc = desc.slice(0, 157) + "...";

  return {
    title: titleStr,
    description: desc,
  };
}

export default function QALayout({ children }: { children: React.ReactNode }) {
  return children;
}
