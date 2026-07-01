"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "@/i18n/routing";
import { ArrowRight, Check, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { QuizData } from "@/lib/data/quizData";

export default function QuickQuizPage() {
  const params = useParams();
  const router = useRouter();
  const grade = params.grade as string;
  const subject = params.subject as string;
  const chapter = params.chapter as string;

  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [incorrect, setIncorrect] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined" && grade && subject && chapter) {
      const cleanSubject = subject.charAt(0).toUpperCase() + subject.slice(1);
      const cleanChapter = chapter.replace("chapter-", "");
      localStorage.setItem("last_sathi_view", window.location.pathname);
      localStorage.setItem("last_sathi_view_title", `AI Quiz - ${cleanSubject} (Ch. ${cleanChapter})`);
      
      const fetchQuiz = async () => {
        try {
          const filename = `${grade}-${subject}-${chapter}.json`.toLowerCase();
          const response = await fetch(`/quizzes/${filename}`);
          if (response.ok) {
            const data = await response.json();
            setQuizData(data);
          }
        } catch (error) {
          console.error("Failed to load quiz", error);
        } finally {
          setLoading(false);
        }
      };
      
      fetchQuiz();
    }
  }, [grade, subject, chapter]);

  const handleQuit = () => {
    if (typeof window !== "undefined" && window.confirm("Are you sure you want to quit this quiz? Your current score will not be saved.")) {
      router.push(`/content/${grade}/${subject}/${chapter}`);
    }
  };

  const handleOptionClick = (optionId: string) => {
    if (isAnswerRevealed) return;
    setSelectedAnswerId(optionId);
    setIsAnswerRevealed(true);
    
    if (quizData && optionId === quizData.questions[currentQuestionIndex].correctAnswerId) {
      setScore(prev => prev + 1);
    } else {
      setIncorrect(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (quizData && currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswerId(null);
      setIsAnswerRevealed(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg text-[#F4F8F1] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#16A34A]" />
      </div>
    );
  }

  if (!quizData || quizData.questions.length === 0) {
    return (
      <div className="min-h-screen bg-dark-bg text-[#F4F8F1] flex flex-col items-center justify-center py-10 px-4">
        <h2 className="text-2xl font-bold mb-4">Quiz coming soon!</h2>
        <p className="text-[#B9C7B6] mb-8 text-center max-w-md">
          The quiz for this chapter is currently being prepared. Check back later or create your own custom test.
        </p>
        <button 
          onClick={() => router.push(`/content/${grade}/${subject}/${chapter}`)}
          className="bg-white/10 hover:bg-white/20 border border-white/20 px-6 py-3 rounded-xl transition-all"
        >
          Go Back
        </button>
      </div>
    );
  }

  const currentQuestion = quizData.questions[currentQuestionIndex];
  const progressPercent = Math.round(((currentQuestionIndex) / quizData.questions.length) * 100);
  const isFinished = isAnswerRevealed && currentQuestionIndex === quizData.questions.length - 1;

  return (
    <div className="min-h-screen bg-dark-bg text-[#F4F8F1] font-sans flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-4xl mb-6 text-center sm:text-left">
        <h1 className="text-xl sm:text-2xl font-black text-white">
          TeacherSathi NCERT Classroom Interactive Quiz
        </h1>
        <p className="text-xs text-[#B9C7B6] mt-1">
          Live CBSE competency-based assessment formatted for Indian government school smart classrooms.
        </p>
      </div>
      
      {/* Top Header Bar with Quit Button */}
      <div className="w-full max-w-4xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <button 
          onClick={handleQuit}
          className="flex items-center justify-center gap-2 text-[#B9C7B6] hover:text-white hover:bg-white/10 transition-all font-bold text-sm bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl cursor-pointer w-fit active:scale-95"
        >
          <X className="w-4 h-4" /> Quit Quiz
        </button>
        <div className="flex items-center justify-between sm:justify-end gap-6 text-sm font-semibold flex-1">
          <span className="text-[#B9C7B6]">Progress {progressPercent}%</span>
          <span className="text-[#B9C7B6]">Q {currentQuestionIndex + 1} of {quizData.questions.length}</span>
          <div className="bg-[#14532D] border border-white/10 px-3 py-1 rounded-xl flex items-center gap-2">
            <span className="text-[#B9C7B6]">Live score</span>
            <span className="flex items-center text-success"><span className="font-bold mr-0.5">{score}</span><Check className="w-3 h-3 stroke-[3]" /></span>
            <span className="flex items-center text-danger"><span className="font-bold mr-0.5">{incorrect}</span><X className="w-3 h-3 stroke-[3]" /></span>
          </div>
        </div>
      </div>
      <div className="w-full max-w-4xl h-2 bg-[#14532D] rounded-full overflow-hidden mb-12">
        <div className="h-full bg-[#16A34A] rounded-full transition-all duration-300" style={{ width: `${progressPercent}%` }}></div>
      </div>

      {/* Quiz Card */}
      <div className="w-full max-w-3xl relative">
        {/* Floating Q Badge */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-brand text-white text-xl font-bold px-6 py-2 rounded-full border-4 border-dark-bg z-10 shadow-lg">
          Q{(currentQuestionIndex + 1).toString().padStart(2, '0')}
        </div>

        <div className="bg-[#14532D] border border-white/5 rounded-3xl p-8 sm:p-12 shadow-2xl relative">
          
          {/* Difficulty Badge */}
          {currentQuestion.difficulty && (
            <div className={`absolute top-6 right-8 text-xs font-bold px-3 py-1 rounded-full ${
              currentQuestion.difficulty === 'Easy' ? 'bg-success/20 text-success' : 
              currentQuestion.difficulty === 'Medium' ? 'bg-[#D97706]/20 text-[#D97706]' : 
              'bg-danger/20 text-danger'
            }`}>
              {currentQuestion.difficulty}
            </div>
          )}

          <h2 className="text-2xl sm:text-3xl font-bold text-center mt-6 mb-10 text-balance">
            {currentQuestion.question}
          </h2>

          <div className="space-y-4 mb-8">
            {currentQuestion.options.map((option) => {
              const isSelected = selectedAnswerId === option.id;
              const isCorrect = option.id === currentQuestion.correctAnswerId;
              
              let containerClass = "bg-white/5 border border-white/10 hover:bg-white/10";
              let badgeClass = "bg-white/10 text-gray-300";
              let textClass = "text-gray-300";
              
              if (isAnswerRevealed) {
                if (isCorrect) {
                  containerClass = "bg-success/10 border border-success relative overflow-hidden";
                  badgeClass = "bg-success text-white shadow-sm";
                  textClass = "text-white";
                } else if (isSelected && !isCorrect) {
                  containerClass = "bg-danger/10 border border-danger";
                  badgeClass = "bg-danger/20 text-danger";
                  textClass = "text-danger";
                } else {
                  containerClass = "bg-white/5 border border-white/5 opacity-50";
                }
              }

              return (
                <div key={option.id}>
                  <div 
                    onClick={() => handleOptionClick(option.id)}
                    className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-colors ${containerClass}`}
                  >
                    {isAnswerRevealed && isCorrect && (
                      <div className="absolute right-0 top-0 w-32 h-32 bg-[url('https://cdn-icons-png.flaticon.com/512/3253/3253018.png')] bg-contain bg-no-repeat bg-right opacity-20 pointer-events-none"></div>
                    )}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0 relative z-10 ${badgeClass}`}>
                      {option.id}
                    </div>
                    <div className={`font-medium text-lg relative z-10 ${textClass}`}>
                      {option.text}
                    </div>
                  </div>
                  
                  {isAnswerRevealed && isSelected && !isCorrect && (
                    <div className="text-danger font-medium text-sm flex items-center gap-1 mt-2 ml-2">
                      <X className="w-4 h-4 stroke-[3]" /> Incorrect
                    </div>
                  )}
                  {isAnswerRevealed && isCorrect && (
                    <div className="text-success font-medium text-sm flex items-center gap-1 mt-2 ml-2">
                      <Check className="w-4 h-4 stroke-[3]" /> {isSelected ? "Correct! Well done 🎉" : "This is the correct answer"}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-6 border-t border-white/10 transition-opacity duration-300 ${isAnswerRevealed ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <p className="text-[#B9C7B6] text-sm flex-1 leading-relaxed">
              {currentQuestion.explanation}
            </p>
            {isFinished ? (
              <Button 
                onClick={handleQuit}
                className="bg-[#16A34A] hover:bg-[#128A3E] text-white px-6 py-4 rounded-xl text-lg font-bold shrink-0 flex items-center gap-2 shadow-brand"
              >
                Finish Quiz <Check className="w-5 h-5" />
              </Button>
            ) : (
              <Button 
                onClick={handleNextQuestion}
                className="bg-[#16A34A] hover:bg-[#128A3E] text-white px-6 py-4 rounded-xl text-lg font-bold shrink-0 flex items-center gap-2 shadow-brand"
              >
                Next Question <ArrowRight className="w-5 h-5" />
              </Button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
