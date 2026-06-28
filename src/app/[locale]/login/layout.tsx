import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description: "Log in to your TeacherSathi educator account to access saved AI lesson plans, NCERT mind maps, classroom quizzes, and reports tailored for Indian teachers.",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
