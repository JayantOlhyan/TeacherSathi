export interface QuizOption {
  id: string; // "A", "B", "C", "D"
  text: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  correctAnswerId: string;
  explanation: string;
  difficulty: "Easy" | "Medium" | "Hard";
}

export interface QuizData {
  questions: QuizQuestion[];
}

export async function getQuizData(grade: string, subject: string, chapter: string): Promise<QuizData | null> {
  try {
    const filename = `${grade}-${subject}-${chapter}.json`.toLowerCase();
    
    // Fetch from the public directory
    const response = await fetch(`/quizzes/${filename}`);
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    return data as QuizData;
  } catch (error) {
    console.error("Error loading quiz data:", error);
    return null;
  }
}
