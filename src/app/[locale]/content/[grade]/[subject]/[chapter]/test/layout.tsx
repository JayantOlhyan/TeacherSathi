import { Metadata } from "next";

export async function generateMetadata({ params }: { params: { grade: string; subject: string; chapter: string } }): Promise<Metadata> {
  const subj = params.subject ? params.subject.charAt(0).toUpperCase() + params.subject.slice(1) : 'Subject';
  const chap = params.chapter.replace(/[-_]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  
  let titleStr = `${chap} Chapter Test`;
  if (titleStr.length > 40) titleStr = titleStr.slice(0, 37) + "...";

  let desc = `Conduct instant chapter mock tests and diagnostic evaluations for ${subj} ${chap}. Access auto-graded question papers designed for Indian school curriculums.`;
  if (desc.length < 150) desc += " Boost exam prep.";
  if (desc.length > 160) desc = desc.slice(0, 157) + "...";
  while (desc.length < 150) desc += " Test now.";

  return {
    title: titleStr,
    description: desc,
  };
}

export default function TestLayout({ children }: { children: React.ReactNode }) {
  return children;
}
