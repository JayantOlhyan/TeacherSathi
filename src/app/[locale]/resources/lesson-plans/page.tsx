"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";
import { useLocale } from "next-intl";
import { FileText, Sparkles, Wand2, Clock, CheckCircle2, ArrowLeft, Loader2, Settings } from "lucide-react";
import { Button } from "@/components/ui/Button";
import SEOAuthorityLinks from "@/components/SEOAuthorityLinks";

export default function LessonPlansPage() {
  const locale = useLocale();
  const isHi = locale === "hi";

  const [subject, setSubject] = useState("science");
  const [grade, setGrade] = useState("10");
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(true);

  const handleGenerate = () => {
    setLoading(true);
    setGenerated(false);
    setTimeout(() => {
      setLoading(false);
      setGenerated(true);
    }, 1200);
  };

  const getPlanData = () => {
    if (subject === "science") {
      return {
        topic: "Life Processes (Nutrition)",
        topicHi: "जैव प्रक्रम (पोषण)",
        objectives: [
          "Differentiate autotrophic and heterotrophic nutrition.",
          "Describe raw materials needed for photosynthesis.",
          "Understand the biochemical pathways of light/dark reactions."
        ],
        objectivesHi: [
          "स्वपोषी और विषमपोषी पोषण के बीच अंतर को समझना।",
          "प्रकाश संश्लेषण के लिए आवश्यक कच्चे माल का वर्णन करना।",
          "प्रकाश/अंधकार अभिक्रियाओं के जैव रासायनिक मार्गों को समझना।"
        ],
        hook: "Show a green potted plant and a mushroom. Ask: 'Both are alive, but how does each get its breakfast?'",
        hookHi: "एक हरा गमले का पौधा और एक मशरूम दिखाएं। पूछें: 'दोनों जीवित हैं, लेकिन प्रत्येक को अपना भोजन कैसे मिलता है?'",
        timeline: [
          { time: "5 mins", title: "Class Hook & Brainstorming", titleHi: "क्लास हुक और विचार-मंथन" },
          { time: "20 mins", title: "Direct Instruction (Stomata & Chloroplast)", titleHi: "प्रत्यक्ष निर्देश (स्टोमेटा और क्लोरोप्लास्ट)" },
          { time: "15 mins", title: "Interactive Stomata Drawing Activity", titleHi: "इंटरएक्टिव रंध्र (Stomata) चित्र गतिविधि" },
          { time: "5 mins", title: "Exit Ticket Q&A Assessment", titleHi: "एग्जिट टिकट प्रश्नोत्तर मूल्यांकन" }
        ],
        homework: "Draw a labeled diagram of chloroplasts and list 3 limiting factors of photosynthesis.",
        homeworkHi: "क्लोरोप्लास्ट का एक नामांकित आरेख बनाएं और प्रकाश संश्लेषण के 3 सीमित कारकों की सूची बनाएं।"
      };
    } else if (subject === "maths") {
      return {
        topic: "Real Numbers (Euclid's Division)",
        topicHi: "वास्तविक संख्याएँ (यूक्लिड विभाजन)",
        objectives: [
          "State and apply Euclid's Division Lemma.",
          "Compute HCF of two large integers systematically.",
          "Understand divisibility rules geometrically."
        ],
        objectivesHi: [
          "यूक्लिड विभाजन प्रमेयिका को समझना और लागू करना।",
          "दो बड़े पूर्णांकों का HCF व्यवस्थित रूप से निकालना।",
          "विभाज्यता के नियमों को ज्यामितीय रूप से समझना।"
        ],
        hook: "Ask: 'If you have 15 apples and 6 baskets, how do you distribute them equally with the minimum remainder?'",
        hookHi: "पूछें: 'यदि आपके पास 15 सेब और 6 टोकरियाँ हैं, तो आप उन्हें न्यूनतम शेषफल के साथ समान रूप से कैसे वितरित करेंगे?'",
        timeline: [
          { time: "5 mins", title: "Mathematical Remainder Puzzle", titleHi: "गणितीय शेषफल पहेली" },
          { time: "20 mins", title: "Step-by-step Division Lemma Proof", titleHi: "चरण-दर-चरण विभाजन प्रमेयिका प्रमाण" },
          { time: "15 mins", title: "HCF Board Solving Challenge", titleHi: "HCF बोर्ड सॉल्विंग चैलेंज" },
          { time: "5 mins", title: "Exit Quiz", titleHi: "एग्जिट क्विज़" }
        ],
        homework: "Solve Exercise 1.1 Q1 to Q3 in NCERT class textbook.",
        homeworkHi: "कक्षा की NCERT पाठ्यपुस्तक में प्रश्नावली 1.1 के प्रश्न 1 से 3 हल करें।"
      };
    } else {
      return {
        topic: "General Chapter Highlights",
        topicHi: "अध्याय की मुख्य बातें",
        objectives: ["Analyze core concepts.", "Understand the textual context.", "List key historical occurrences."],
        objectivesHi: ["मूल अवधारणाओं का विश्लेषण करना।", "पाठ्य संदर्भ को समझना।", "प्रमुख ऐतिहासिक घटनाओं की सूची बनाना।"],
        hook: "Relate the chapter to an everyday object or current event.",
        hookHi: "अध्याय को किसी रोजमर्रा की वस्तु या वर्तमान घटना से जोड़ें।",
        timeline: [
          { time: "5 mins", title: "Context Setting", titleHi: "संदर्भ निर्धारण" },
          { time: "20 mins", title: "Concept Explanation", titleHi: "अवधारणा व्याख्या" },
          { time: "15 mins", title: "Bilingual Reading Review", titleHi: "द्विभाषी पठन समीक्षा" },
          { time: "5 mins", title: "Exit Quiz", titleHi: "एग्जिट क्विज़" }
        ],
        homework: "Write a 150-word summary of the chapter's main idea.",
        homeworkHi: "अध्याय के मुख्य विचार का 150 शब्दों में सारांश लिखें।"
      };
    }
  };

  const plan = getPlanData();

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
          <Wand2 className="w-4 h-4 text-emerald-600 animate-pulse-slow" /> AI lesson planner
        </div>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-[#166534] leading-tight">
          {isHi ? "AI-संचालित पाठ योजना (Lesson Plans)" : "AI-Powered Lesson Plans"}
        </h1>
        <p className="text-lg text-[#3C4B3A]/80 max-w-2xl mx-auto leading-relaxed">
          {isHi 
            ? "पाठ्यक्रम तैयार करने में घंटे बर्बाद करना बंद करें। TeacherSathi सेकंडों में NCERT पर आधारित पाठ योजनाएं, अवधारणा रूपरेखा और वर्कशीट तैयार करता है।"
            : "Generate comprehensive AI lesson plans aligned with NCERT Class 6–10 syllabus in seconds. Built for Indian government school teachers with Bloom's Taxonomy, class activities, and quizzes tailored for smart classrooms."}
        </p>
      </section>

      {/* Playground Selector & Dynamic Board */}
      <section className="max-w-[1100px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Selector panel */}
        <div className="lg:col-span-4 bg-white border border-[#DCE4D7] rounded-3xl p-6 shadow-sm h-fit space-y-6">
          <h2 className="text-base font-bold text-[#1C2B1C] border-b border-[#DCE4D7] pb-3 flex items-center gap-2">
            <Settings className="w-4 h-4 text-[#166534]" />
            {isHi ? "पाठ सेटिंग्स" : "Lesson Settings"}
          </h2>

          {/* Subject Selector */}
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
            </select>
          </div>

          {/* Grade Selector */}
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

          <Button 
            className="w-full bg-[#16A34A] hover:bg-[#128A3E] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {isHi ? "AI योजना बना रहा है..." : "Saathi AI generating..."}
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5" />
                {isHi ? "पाठ योजना बनाएं" : "Generate Plan"}
              </>
            )}
          </Button>
        </div>

        {/* Dynamic Display Card */}
        <div className="lg:col-span-8 bg-white border border-[#DCE4D7] rounded-3xl p-8 shadow-card min-h-[400px] flex flex-col justify-between relative overflow-hidden">
          
          {loading && (
            <div className="absolute inset-0 bg-[#F7F9F4]/70 backdrop-blur-xs z-20 flex flex-col items-center justify-center space-y-4">
              <div className="w-12 h-12 rounded-full border-4 border-brand border-t-transparent animate-spin"></div>
              <p className="text-sm font-bold text-brand animate-pulse">
                {isHi ? "शिक्षा शास्त्र (Pedagogy) संरेखित की जा रही है..." : "Aligning standard NCERT pedagogy..."}
              </p>
            </div>
          )}

          {generated && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-[#DCE4D7] pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-brand/5 rounded-2xl flex items-center justify-center text-brand">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold text-brand">
                      {isHi ? plan.topicHi : plan.topic}
                    </h2>
                    <p className="text-xs text-[#5E6C5A] uppercase tracking-wider font-semibold">
                      Class {grade} · NCERT Blueprint
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full border border-emerald-100 w-fit">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Checked
                </div>
              </div>

              {/* Objectives */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#166534]">
                  {isHi ? "शिक्षण उद्देश्य (Learning Objectives)" : "Learning Objectives"}
                </h4>
                <ul className="list-disc pl-5 text-sm text-ink-2 space-y-1 font-medium">
                  {(isHi ? plan.objectivesHi : plan.objectives).map((obj, i) => (
                    <li key={i}>{obj}</li>
                  ))}
                </ul>
              </div>

              {/* Attention Grabber / Hook */}
              <div className="bg-[#EEF2EA] border-l-4 border-brand p-4 rounded-r-xl space-y-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-brand flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  {isHi ? "कक्षा हुक (Class Hook Activity)" : "Classroom Attention Grabber / Hook"}
                </h4>
                <p className="text-sm text-ink-2 font-medium italic">
                  &ldquo;{isHi ? plan.hookHi : plan.hook}&rdquo;
                </p>
              </div>

              {/* Timeline */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#166534]">
                  {isHi ? "समय-सीमा ब्रेकडाउन (Timeline Breakdown)" : "Timeline Breakdown"}
                </h4>
                <div className="space-y-2.5">
                  {plan.timeline.map((step, idx) => (
                    <div key={idx} className="flex items-center gap-4 text-sm bg-white border border-[#DCE4D7] p-3 rounded-xl shadow-xs">
                      <div className="flex items-center gap-1 text-[#166534] bg-[#166534]/10 px-2.5 py-1 rounded-lg font-bold text-xs shrink-0">
                        <Clock className="w-3.5 h-3.5" />
                        {step.time}
                      </div>
                      <span className="font-semibold text-ink-2">
                        {isHi ? step.titleHi : step.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Homework */}
              <div className="space-y-1.5 border-t border-[#DCE4D7] pt-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#166534]">
                  {isHi ? "गृहकार्य (Homework)" : "Homework Assignment"}
                </h4>
                <p className="text-sm text-ink-3 font-medium">
                  {isHi ? plan.homeworkHi : plan.homework}
                </p>
              </div>

            </div>
          )}

        </div>

      </section>

      <SEOAuthorityLinks />
    </div>
  );
}
