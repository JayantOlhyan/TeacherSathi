"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";
import { useLocale } from "next-intl";
import SEOAuthorityLinks from "@/components/SEOAuthorityLinks";
import { 
  ArrowLeft, 
  Wand2, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  HelpCircle, 
  Settings, 
  Trophy, 
  Loader2,
  ChevronRight,
  BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface QuizQuestion {
  qEn: string;
  qHi: string;
  optionsEn: string[];
  optionsHi: string[];
  answerIndex: number;
  explanationEn: string;
  explanationHi: string;
}

const scienceQuestions: QuizQuestion[] = [
  {
    qEn: "Which of the following is a raw material required for photosynthesis?",
    qHi: "निम्नलिखित में से कौन सा प्रकाश संश्लेषण के लिए आवश्यक कच्चा माल है?",
    optionsEn: ["Carbon Dioxide", "Water", "Sunlight", "All of the above"],
    optionsHi: ["कार्बन डाइऑक्साइड", "पानी", "सूर्य का प्रकाश", "उपरोक्त सभी"],
    answerIndex: 3,
    explanationEn: "Photosynthesis requires carbon dioxide, water, and sunlight in the presence of chlorophyll to synthesize glucose.",
    explanationHi: "प्रकाश संश्लेषण के लिए क्लोरोफिल की उपस्थिति में ग्लूकोज का संश्लेषण करने के लिए कार्बन डाइऑक्साइड, पानी और सूर्य के प्रकाश की आवश्यकता होती है।"
  },
  {
    qEn: "What is the pH value of a neutral solution (like pure water) at room temperature?",
    qHi: "कमरे के तापमान पर एक उदासीन विलयन (जैसे शुद्ध पानी) का pH मान क्या होता है?",
    optionsEn: ["Less than 7", "Exactly 7", "Greater than 7", "Zero"],
    optionsHi: ["7 से कम", "ठीक 7", "7 से अधिक", "शून्य"],
    answerIndex: 1,
    explanationEn: "A neutral solution has a pH value of exactly 7. Values below 7 are acidic, and values above 7 are basic.",
    explanationHi: "उदासीन विलयन का pH मान ठीक 7 होता है। 7 से नीचे के मान अम्लीय होते हैं, और 7 से ऊपर के मान क्षारीय होते हैं।"
  },
  {
    qEn: "Which gas is released during the process of photosynthesis?",
    qHi: "प्रकाश संश्लेषण की प्रक्रिया के दौरान कौन सी गैस निकलती है?",
    optionsEn: ["Carbon Dioxide", "Oxygen", "Nitrogen", "Hydrogen"],
    optionsHi: ["कार्बन डाइऑक्साइड", "ऑक्सीजन", "नाइट्रोजन", "हाइड्रोजन"],
    answerIndex: 1,
    explanationEn: "During photosynthesis, plants take in carbon dioxide and release oxygen as a byproduct of water photolysis.",
    explanationHi: "प्रकाश संश्लेषण के दौरान, पौधे कार्बन डाइऑक्साइड लेते हैं और पानी के प्रकाश अपघटन के सह-उत्पाद के रूप में ऑक्सीजन छोड़ते हैं।"
  }
];

const mathsQuestions: QuizQuestion[] = [
  {
    qEn: "What is the HCF of two co-prime numbers a and b?",
    qHi: "दो सह-अभाज्य (co-prime) संख्याओं a और b का HCF क्या होता है?",
    optionsEn: ["0", "1", "a * b", "a + b"],
    optionsHi: ["0", "1", "a * b", "a + b"],
    answerIndex: 1,
    explanationEn: "Co-prime numbers have no common factors other than 1. Therefore, their Highest Common Factor (HCF) is always 1.",
    explanationHi: "सह-अभाज्य संख्याओं का 1 के अलावा कोई अन्य उभयनिष्ठ गुणनखंड नहीं होता है। इसलिए, उनका महत्तम समापवर्तक (HCF) हमेशा 1 होता है।"
  },
  {
    qEn: "The decimal expansion of the rational number 14587/1250 will terminate after how many decimal places?",
    qHi: "परिमेय संख्या 14587/1250 का दशमलव प्रसार कितने दशमलव स्थानों के बाद समाप्त होगा?",
    optionsEn: ["1 decimal place", "2 decimal places", "3 decimal places", "4 decimal places"],
    optionsHi: ["1 दशमलव स्थान", "2 दशमलव स्थान", "3 दशमलव स्थान", "4 दशमलव स्थान"],
    answerIndex: 3,
    explanationEn: "1250 can be written as 2^1 * 5^4. The exponent of 5 is 4, which is larger, so it terminates after 4 decimal places.",
    explanationHi: "1250 को 2^1 * 5^4 के रूप में लिखा जा सकता है। 5 की घात 4 है, जो बड़ी है, इसलिए यह 4 दशमलव स्थानों के बाद समाप्त होता है।"
  },
  {
    qEn: "If one zero of the quadratic polynomial x² + 3x + k is 2, then what is the value of k?",
    qHi: "यदि द्विघात बहुपद x² + 3x + k का एक शून्यक 2 है, तो k का मान क्या है?",
    optionsEn: ["10", "-10", "-7", "-2"],
    optionsHi: ["10", "-10", "-7", "-2"],
    answerIndex: 1,
    explanationEn: "Substitute x = 2: (2)² + 3(2) + k = 0 => 4 + 6 + k = 0 => k = -10.",
    explanationHi: "x = 2 प्रतिस्थापित करें: (2)² + 3(2) + k = 0 => 4 + 6 + k = 0 => k = -10।"
  }
];

export default function QuizGeneratorPage() {
  const locale = useLocale();
  const isHi = locale === "hi";

  // Sidebar parameters
  const [subject, setSubject] = useState("science");
  const [grade, setGrade] = useState("10");
  const [difficulty, setDifficulty] = useState("medium");
  const [questionsCount, setQuestionsCount] = useState("5");

  // State machine for generator loading
  const [loading, setLoading] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>(scienceQuestions);

  // Playable quiz states
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);

  const handleGenerate = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Swap question pool based on selected subject
      if (subject === "maths") {
        setQuizQuestions(mathsQuestions);
      } else {
        setQuizQuestions(scienceQuestions);
      }
      // Reset quiz state
      setCurrentIdx(0);
      setSelectedOpt(null);
      setIsChecked(false);
      setScore(0);
      setQuizDone(false);
    }, 1200);
  };

  const handleOptionSelect = (optIdx: number) => {
    if (isChecked) return; // Prevent changing after checking
    setSelectedOpt(optIdx);
  };

  const handleCheckAnswer = () => {
    if (selectedOpt === null || isChecked) return;
    setIsChecked(true);
    const correctIdx = quizQuestions[currentIdx].answerIndex;
    if (selectedOpt === correctIdx) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx + 1 < quizQuestions.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOpt(null);
      setIsChecked(false);
    } else {
      setQuizDone(true);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOpt(null);
    setIsChecked(false);
    setScore(0);
    setQuizDone(false);
  };

  const currentQuestion = quizQuestions[currentIdx];
  const totalQuestions = quizQuestions.length;
  const progressPercent = ((currentIdx + (isChecked ? 1 : 0)) / totalQuestions) * 100;

  return (
    <div className="min-h-screen bg-[#F7F9F4] text-[#1C2B1C] font-sans pb-20">
      
      {/* Top Banner */}
      <div className="max-w-[1200px] mx-auto px-4 pt-8">
        <Link href="/" className="inline-flex items-center gap-2 text-[#166534] hover:underline font-semibold text-sm">
          <ArrowLeft className="w-4 h-4" /> 
          {isHi ? "मुख्य पृष्ठ पर वापस जाएं" : "Back to Home"}
        </Link>
      </div>

      {/* Hero */}
      <section className="max-w-[900px] mx-auto px-4 py-12 text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-[#166534]/5 border border-[#166534]/10 px-4 py-1.5 rounded-full text-xs font-bold text-[#166534] uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-emerald-600 animate-pulse-slow" /> Interactive Evaluator
        </div>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-[#166534] leading-tight">
          {isHi ? "TeacherSathi AI परीक्षा प्रश्नोत्तरी (Quiz Generator)" : "TeacherSathi AI Quiz Generator"}
        </h1>
        <p className="text-lg text-[#3C4B3A]/80 max-w-2xl mx-auto leading-relaxed">
          {isHi 
            ? "कक्षा के लिए तुरंत प्रश्न और हल तैयार करें। भारतीय सरकारी स्कूलों के शिक्षकों हेतु बहुविकल्पीय प्रश्न (MCQ) और योग्यता-आधारित प्रश्न, सभी पूरी तरह से NCERT मानकों के अनुरूप।"
            : "Generate curriculum-aligned CBSE and NCERT quizzes and diagnostic worksheets in seconds. Built for Indian government school teachers with instant scoring for interactive smart boards or printable PDFs."}
        </p>
      </section>

      {/* Main Grid */}
      <section className="max-w-[1100px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Sidebar Quiz Customizer */}
        <div className="lg:col-span-4 bg-white border border-[#DCE4D7] rounded-3xl p-6 shadow-sm h-fit space-y-6">
          <h2 className="text-base font-bold text-[#1C2B1C] border-b border-[#DCE4D7] pb-3 flex items-center gap-2">
            <Settings className="w-4 h-4 text-[#166534]" />
            {isHi ? "प्रश्नोत्तरी सेटिंग्स" : "Quiz Engine Settings"}
          </h2>

          {/* Subject */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#5E6C5A] block">
              {isHi ? "विषय" : "Subject"}
            </label>
            <select 
              value={subject} 
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-[#EEF2EA]/60 border border-[#DCE4D7] rounded-xl px-3 py-2.5 text-sm font-semibold focus:outline-none focus:border-[#166534] text-ink"
            >
              <option value="science">Science / विज्ञान</option>
              <option value="maths">Mathematics / गणित</option>
              <option value="social">Social Science / सामाजिक विज्ञान</option>
              <option value="english">English / अंग्रेज़ी</option>
            </select>
          </div>

          {/* Class Grade */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#5E6C5A] block">
              {isHi ? "कक्षा" : "Class / Grade"}
            </label>
            <select 
              value={grade} 
              onChange={(e) => setGrade(e.target.value)}
              className="w-full bg-[#EEF2EA]/60 border border-[#DCE4D7] rounded-xl px-3 py-2.5 text-sm font-semibold focus:outline-none focus:border-[#166534] text-ink"
            >
              <option value="10">Class 10 / कक्षा 10</option>
              <option value="9">Class 9 / कक्षा 9</option>
              <option value="8">Class 8 / कक्षा 8</option>
              <option value="7">Class 7 / कक्षा 7</option>
              <option value="6">Class 6 / कक्षा 6</option>
            </select>
          </div>

          {/* Question Type & Count */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#5E6C5A] block">
                {isHi ? "प्रश्नों की संख्या" : "Questions"}
              </label>
              <select 
                value={questionsCount} 
                onChange={(e) => setQuestionsCount(e.target.value)}
                className="w-full bg-[#EEF2EA]/60 border border-[#DCE4D7] rounded-xl px-3 py-2.5 text-sm font-semibold focus:outline-none focus:border-[#166534] text-ink"
              >
                <option value="3">3 Qs</option>
                <option value="5">5 Qs</option>
                <option value="10">10 Qs</option>
                <option value="20">20 Qs</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#5E6C5A] block">
                {isHi ? "कठिनाई स्तर" : "Difficulty"}
              </label>
              <select 
                value={difficulty} 
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full bg-[#EEF2EA]/60 border border-[#DCE4D7] rounded-xl px-3 py-2.5 text-sm font-semibold focus:outline-none focus:border-[#166534] text-ink"
              >
                <option value="easy">Easy / आसान</option>
                <option value="medium">Medium / मध्यम</option>
                <option value="hard">Hard / कठिन</option>
              </select>
            </div>
          </div>

          <Button 
            className="w-full bg-[#16A34A] hover:bg-[#128A3E] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {isHi ? "AI जनरेट कर रहा है..." : "Saathi AI compiling..."}
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5" />
                {isHi ? "लाइव क्विज़ बनाएं" : "Generate Live Quiz"}
              </>
            )}
          </Button>
        </div>

        {/* Live Quiz Playground Area */}
        <div className="lg:col-span-8 bg-white border border-[#DCE4D7] rounded-3xl p-8 shadow-card min-h-[440px] flex flex-col justify-between relative overflow-hidden">
          
          {loading && (
            <div className="absolute inset-0 bg-[#F7F9F4]/75 backdrop-blur-xs z-20 flex flex-col items-center justify-center space-y-4">
              <div className="w-12 h-12 rounded-full border-4 border-brand border-t-transparent animate-spin"></div>
              <p className="text-sm font-bold text-brand animate-pulse">
                {isHi ? "NCERT पाठ्यपुस्तक से प्रश्न संरेखित किए जा रहे हैं..." : "Synthesizing CBSE Board exam-style questions..."}
              </p>
            </div>
          )}

          {!quizDone ? (
            <div className="space-y-6 flex-1 flex flex-col justify-between">
              
              {/* Question Header & Live Progress */}
              <div>
                <div className="flex justify-between items-center text-xs font-bold text-[#5E6C5A] uppercase tracking-wider mb-2">
                  <span>
                    {isHi ? `प्रश्न ${currentIdx + 1} का ${totalQuestions}` : `Question ${currentIdx + 1} of ${totalQuestions}`}
                  </span>
                  <span className="text-[#166534] bg-[#166534]/10 px-2.5 py-1 rounded-lg">
                    {isHi ? `स्कोर: ${score}/${totalQuestions}` : `Score: ${score}/${totalQuestions}`}
                  </span>
                </div>
                
                {/* Progress bar */}
                <div className="w-full bg-[#EEF2EA] h-2 rounded-full overflow-hidden mb-6">
                  <div 
                    className="bg-[#16A34A] h-full transition-all duration-300 ease-out" 
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                {/* Question Text */}
                <div className="flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-full bg-[#166534]/10 text-[#166534] flex items-center justify-center shrink-0 mt-0.5">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-brand leading-snug">
                    {isHi ? currentQuestion.qHi : currentQuestion.qEn}
                  </h2>
                </div>
              </div>

              {/* Options Stack */}
              <div className="grid grid-cols-1 gap-3.5 my-6">
                {(isHi ? currentQuestion.optionsHi : currentQuestion.optionsEn).map((opt, idx) => {
                  const isSelected = selectedOpt === idx;
                  const isCorrect = currentQuestion.answerIndex === idx;
                  
                  // Style variables
                  let optionClass = "bg-white hover:bg-[#EEF2EA]/40 border-[#DCE4D7] text-ink-2";
                  let iconElement = null;

                  if (isChecked) {
                    if (isCorrect) {
                      optionClass = "bg-emerald-50 border-emerald-500 text-emerald-950 font-bold shadow-xs";
                      iconElement = <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />;
                    } else if (isSelected) {
                      optionClass = "bg-rose-50 border-rose-500 text-rose-950 font-bold shadow-xs";
                      iconElement = <XCircle className="w-5 h-5 text-rose-600 shrink-0" />;
                    } else {
                      optionClass = "bg-white border-[#DCE4D7]/50 text-white/40 opacity-60";
                    }
                  } else if (isSelected) {
                    optionClass = "bg-[#166534]/5 border-[#166534] text-[#166534] font-bold shadow-xs";
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleOptionSelect(idx)}
                      disabled={isChecked}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-150 flex items-center justify-between min-h-[52px] cursor-pointer ${optionClass}`}
                    >
                      <span className="text-sm font-semibold">{opt}</span>
                      {iconElement}
                    </button>
                  );
                })}
              </div>

              {/* Explanation Panel if checked */}
              {isChecked && (
                <div className="bg-[#EEF2EA] border-l-4 border-brand p-4 rounded-r-xl space-y-1 my-4 animate-fadeIn">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-brand">
                    {isHi ? "व्याख्या" : "Explanation"}
                  </h4>
                  <p className="text-sm text-ink-2 font-semibold">
                    {isHi ? currentQuestion.explanationHi : currentQuestion.explanationEn}
                  </p>
                </div>
              )}

              {/* Bottom Actions */}
              <div className="flex justify-end pt-4 border-t border-[#DCE4D7]">
                {!isChecked ? (
                  <Button
                    onClick={handleCheckAnswer}
                    disabled={selectedOpt === null}
                    className="bg-[#166534] hover:bg-[#114E27] text-white px-8 py-3 rounded-xl font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {isHi ? "उत्तर जांचें" : "Check Answer"}
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleNext}
                    className="bg-[#16A34A] hover:bg-[#128A3E] text-white px-8 py-3 rounded-xl font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95"
                  >
                    {currentIdx + 1 === totalQuestions 
                      ? (isHi ? "परिणाम देखें" : "View Results")
                      : (isHi ? "अगला प्रश्न" : "Next Question")
                    }
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                )}
              </div>

            </div>
          ) : (
            
            // Score Summary Card
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 py-6 animate-fadeIn">
              <div className="w-20 h-20 bg-emerald-50 border border-emerald-100 rounded-3xl flex items-center justify-center text-[#16A34A] shadow-inner">
                <Trophy className="w-10 h-10 animate-bounce" />
              </div>
              
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-brand">
                  {isHi ? "क्विज़ संपन्न हुआ!" : "Quiz Completed!"}
                </h2>
                <p className="text-sm font-bold text-[#5E6C5A] uppercase tracking-wider">
                  {isHi ? "आपका अंतिम परिणाम" : "Your Final Result Summary"}
                </p>
              </div>

              {/* Final Score Board */}
              <div className="bg-[#EEF2EA] border border-[#DCE4D7] px-8 py-6 rounded-2xl flex flex-col items-center justify-center space-y-1 min-w-[240px]">
                <span className="text-5xl font-black text-[#166534]">
                  {score} / {totalQuestions}
                </span>
                <span className="text-xs font-bold text-[#5E6C5A] uppercase tracking-wider">
                  {score === totalQuestions 
                    ? (isHi ? "उत्कृष्ट प्रदर्शन!" : "Perfect score! Brilliant.") 
                    : score >= 2 
                      ? (isHi ? "अच्छा प्रयास!" : "Good job! Keep learning.")
                      : (isHi ? "और अभ्यास करें!" : "Need more review.")}
                </span>
              </div>

              <p className="text-sm text-ink-2 max-w-sm font-semibold">
                {isHi 
                  ? "इस प्रकार के प्रश्न छात्रों के कॉन्सेप्ट्स को स्पष्ट करते हैं और बोर्ड परीक्षा में सफलता दिलाते हैं।" 
                  : "Perfect for testing student comprehension on large displays in real-time or creating exit slips."}
              </p>

              <div className="flex gap-4 pt-4 w-full justify-center sm:w-auto">
                <Button
                  onClick={handleRestart}
                  className="bg-white border border-[#DCE4D7] text-brand hover:bg-[#EEF2EA]/40 px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  {isHi ? "पुनः प्रयास करें" : "Retake Quiz"}
                </Button>
                <Link
                  href="/signup"
                  className="bg-[#16A34A] hover:bg-[#128A3E] text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-brand"
                >
                  <BookOpen className="w-4 h-4" />
                  {isHi ? "मुफ़्त खाता खोलें" : "Access For Free"}
                </Link>
              </div>
            </div>

          )}

        </div>

      </section>

      {/* Feature Grid Details */}
      <section className="max-w-[900px] mx-auto px-4 mt-20 space-y-8">
        <h2 className="text-2xl font-black text-center text-[#166534]">
          {isHi ? "क्विज़ इंजन की विशेषताएं" : "Engineered for Classroom Excellence"}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white border border-[#DCE4D7] rounded-2xl p-6 space-y-2">
            <h3 className="font-bold text-base text-[#1C2B1C]">
              {isHi ? "प्रिंट करने योग्य वर्कशीट निर्यात" : "One-Click PDF Worksheets"}
            </h3>
            <p className="text-sm text-[#5E6C5A] leading-relaxed">
              {isHi 
                ? "केवल एक क्लिक में पूरी उत्तर कुंजी और व्याख्या सहित क्विज़ को सुंदर प्रिंट करने योग्य पीडीएफ में बदलें।"
                : "Convert any generated quiz instantly into a high-contrast printable handout with answer keys for written assessments."}
            </p>
          </div>
          <div className="bg-white border border-[#DCE4D7] rounded-2xl p-6 space-y-2">
            <h3 className="font-bold text-base text-[#1C2B1C]">
              {isHi ? "योग्यता और Bloom के शिक्षाशास्त्र पर आधारित" : "CBSE Competency Aligned"}
            </h3>
            <p className="text-sm text-[#5E6C5A] leading-relaxed">
              {isHi 
                ? "सभी प्रश्न नवीनतम सीबीएसई योग्यता-आधारित और केस-स्टडी दिशानिर्देशों का कड़ाई से पालन करते हैं।"
                : "Questions explicitly follow CBSE competency rules and include analytical case-based formats for smart boards."}
            </p>
          </div>
        </div>
      </section>

      <SEOAuthorityLinks />
    </div>
  );
}
