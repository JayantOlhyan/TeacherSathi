import { Metadata } from "next";

export async function generateMetadata({ params }: { params: { grade: string; subject: string; chapter: string } }): Promise<Metadata> {
  const subj = params.subject ? params.subject.charAt(0).toUpperCase() + params.subject.slice(1) : 'Subject';
  const chap = params.chapter.replace(/[-_]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  
  let titleStr = `${chap} Video Lesson`;
  if (titleStr.length > 40) titleStr = titleStr.slice(0, 37) + "...";

  let desc = `Watch AI animated video lessons and visual explanations for ${subj} ${chap}. Make learning interactive and engaging for government school students in India.`;
  if (desc.length < 150) desc += " Enhance classroom focus.";
  if (desc.length > 160) desc = desc.slice(0, 157) + "...";
  while (desc.length < 150) desc += " Watch now.";

  return {
    title: titleStr,
    description: desc,
  };
}

export default function VideoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
