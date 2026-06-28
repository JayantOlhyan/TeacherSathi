import { Metadata } from "next";

export async function generateMetadata({ params }: { params: { grade: string; subject: string; chapter: string } }): Promise<Metadata> {
  const subj = params.subject ? params.subject.charAt(0).toUpperCase() + params.subject.slice(1) : 'Subject';
  const chap = params.chapter.replace(/[-_]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  
  let titleStr = `${subj}: ${chap}`;
  if (titleStr.length > 40) titleStr = titleStr.slice(0, 37) + "...";

  let desc = `Access AI lesson plans, NCERT solutions, mind maps, and practice worksheets for ${subj} ${chap} tailored for Indian school classrooms.`;
  if (desc.length < 150) desc += " Boost your teaching efficiency.";
  if (desc.length > 160) desc = desc.slice(0, 157) + "...";
  while (desc.length < 150) desc += " Explore.";

  return {
    title: titleStr,
    description: desc,
  };
}

export default function ChapterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
