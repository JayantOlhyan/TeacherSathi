import { Metadata } from "next";

export async function generateMetadata({ params }: { params: { grade: string; subject: string; chapter: string } }): Promise<Metadata> {
  const subj = params.subject ? params.subject.charAt(0).toUpperCase() + params.subject.slice(1) : 'Subject';
  const chap = params.chapter.replace(/[-_]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  
  let titleStr = `${chap} Practice Quiz`;
  if (titleStr.length > 40) titleStr = titleStr.slice(0, 37) + "...";

  let desc = `Engage students with gamified practice quizzes and formative classroom assessments for ${subj} ${chap}. Instant feedback and bilingual NCERT alignment.`;
  if (desc.length < 150) desc += " Track learning fast.";
  if (desc.length > 160) desc = desc.slice(0, 157) + "...";
  while (desc.length < 150) desc += " Try now.";

  return {
    title: titleStr,
    description: desc,
  };
}

export default function QuizLayout({ children }: { children: React.ReactNode }) {
  return children;
}
