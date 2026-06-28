import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Site Map Directory",
  description: "Explore the complete TeacherSathi site map directory. Easily navigate AI lesson planning tools, NCERT learning resources, legal pages, and user accounts.",
};

export default function SitemapLayout({ children }: { children: React.ReactNode }) {
  return children;
}
