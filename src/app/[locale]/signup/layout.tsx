import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create your free TeacherSathi account today to unlock instant AI lesson plans, interactive NCERT quizzes, and teaching videos for Indian government schools.",
};

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return children;
}
