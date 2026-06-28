import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Interactive Whiteboard",
  description: "Use the online digital whiteboard to sketch diagrams, teach concepts visually, and conduct engaging interactive live sessions in government school classrooms.",
};

export default function WhiteboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
