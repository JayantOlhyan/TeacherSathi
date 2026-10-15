"use client";

import React, { useState } from "react";
import Image from "next/image";
import { 
  Presentation, 
  Video, 
  Network, 
  HelpCircle, 
  FileCheck2, 
  FileText, 
  CheckCircle2, 
  Play, 
  Settings, 
  Users, 
  Check, 
  Printer, 
  Download,
  Languages,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Volume2,
  Info
} from "lucide-react";
import SmartboardFrame from "./SmartboardFrame";

type Modality = "presentation" | "video" | "mindmap" | "quiz" | "questions" | "worksheet";
type LanguageMode = "en" | "hi";

export default function MetamorphicBoardConsole() {
  const [activeModality, setActiveModality] = useState<Modality>("presentation");
  const [lang, setLang] = useState<LanguageMode>("en");
  const [quizSelected, setQuizSelected] = useState<number | null>(null);
  const [activeMindmapNode, setActiveMindmapNode] = useState<string>("root");

  const modalities: { id: Modality; labelEn: string; labelHi: string; icon: React.ElementType }[] = [
    { id: "presentation", labelEn: "Slide Deck", labelHi: "स्लाइड्स", icon: Presentation },
    { id: "video", labelEn: "Explainer Video", labelHi: "वीडियो", icon: Video },
    { id: "mindmap", labelEn: "Concept Mind Map", labelHi: "माइंड मैप", icon: Network },
    { id: "quiz", labelEn: "Classroom Quiz", labelHi: "लाइव क्विज़", icon: HelpCircle },
    { id: "questions", labelEn: "Question Bank", labelHi: "प्रश्न बैंक", icon: FileCheck2 },
    { id: "worksheet", labelEn: "Print Worksheet", labelHi: "वर्कशीट", icon: FileText },
  ];

  // Bilingual dataset for Class 8 Science Chapter 7
  const content = {
    chapter: {
      en: "Conservation of Plants and Animals",
      hi: "पौधों एवं जंतुओं का संरक्षण",
      code: "NCERT Class 8 • Science • Chapter 7",
    },
    presentation: {
      titleEn: "Deforestation and Its Causes",
      titleHi: "वनोन्मूलन एवं इसके कारण",
      descEn: "A great variety of plants and animals exist on earth. They are essential for the well-being and survival of mankind. Today, a major threat to survival of these organisms is deforestation.",
      descHi: "पृथ्वी पर विभिन्न प्रकार के पौधे एवं जंतु पाए जाते हैं। ये मानव जाति के अस्तित्व एवं कल्याण के लिए आवश्यक हैं। आज इन जीवों के अस्तित्व के लिए सबसे बड़ा खतरा वनोन्मूलन है।",
      pointsEn: [
        "Procuring land for agricultural cultivation",
        "Building houses, factories and urban settlements",
        "Making furniture or using wood as fuel in rural kitchens",
        "Natural causes: Forest fires and severe periodic droughts",
      ],
      pointsHi: [
        "कृषि के लिए भूमि प्राप्त करना",
        "घरों, कारखानों और शहरी बस्तियों का निर्माण",
        "फर्नीचर बनाने या ईंधन के रूप में लकड़ी का उपयोग",
        "प्राकृतिक कारण: दावानल (जंगल की आग) एवं भीषण सूखा",
      ],
    },
    quiz: {
      questionEn: "Which of the following is a major consequence of continuous deforestation?",
      questionHi: "निरंतर वनोन्मूलन का प्रमुख परिणाम निम्नलिखित में से क्या है?",
      optionsEn: [
        "Significant increase in regular annual rainfall",
        "Increase in Earth's temperature (Global Warming)",
        "Rapid elevation of underground water tables",
      ],
      optionsHi: [
        "नियमित वार्षिक वर्षा में उल्लेखनीय वृद्धि",
        "पृथ्वी के तापमान में वृद्धि (ग्लोबल वार्मिंग)",
        "भूमिगत जल स्तर में तीव्र वृद्धि",
      ],
      correctIndex: 1,
      explanationEn: "Deforestation reduces trees that absorb CO2, leading to increased atmospheric carbon dioxide and global warming.",
      explanationHi: "पेड़ों की कटाई से CO2 का अवशोषण घटता है, जिससे वायुमंडल में ग्रीनहाउस गैसें बढ़कर ग्लोबल वार्मिंग पैदा करती हैं।",
    },
    questions: {
      q1En: "What is a Biosphere Reserve? Give one authentic Indian example.",
      q1Hi: "जैवमंडल आरक्षित क्षेत्र (बायोस्फीयर रिजर्व) क्या है? भारत का एक उदाहरण दें।",
      ans1En: "A biosphere reserve is a large protected area meant for the conservation of biodiversity, wildlife, and the traditional tribal cultures of the region. Example: Pachmarhi Biosphere Reserve in Madhya Pradesh.",
      ans1Hi: "जैवमंडल आरक्षित क्षेत्र जैव विविधता, वन्यजीवों और स्थानीय जनजातियों के पारंपरिक जीवन के संरक्षण हेतु विशाल संरक्षित क्षेत्र हैं। उदाहरण: मध्य प्रदेश का पचमढ़ी बायोस्फीयर रिजर्व।",
      mark1: "2 Marks • NCERT Exemplar",
    },
    worksheet: {
      schoolHeaderEn: "CENTRAL BOARD OF SECONDARY EDUCATION • FORMATIVE ASSESSMENT",
      schoolHeaderHi: "केंद्रीय माध्यमिक शिक्षा बोर्ड • रचनात्मक मूल्यांकन",
      titleEn: "Chapter 7: Conservation of Plants and Animals",
      titleHi: "अध्याय 7: पौधों एवं जंतुओं का संरक्षण",
      fill1En: "1. A sanctuary is a place where animals are protected from any disturbance to them and their ____________.",
      fill1Hi: "1. वन्यजीव अभयारण्य वह स्थान है जहाँ जंतु और उनका ____________ सुरक्षित रहते हैं।",
      fill2En: "2. Species found exclusively in a particular geographical area are called ____________ species.",
      fill2Hi: "2. किसी विशेष क्षेत्र में विशिष्ट रूप से पाई जाने वाली प्रजातियों को ____________ प्रजाति कहते हैं।",
    },
  };

  return (
    <section id="metamorphic-console" className="relative w-full z-20 py-20 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
      {/* Act Header (The Peak Anchor) */}
      <div className="max-w-4xl mx-auto text-center mb-10 space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100/90 text-emerald-950 font-extrabold text-[11px] uppercase tracking-wider border border-emerald-300/60 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
          The Live Metamorphic Surface
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1A2E20] tracking-tight leading-[1.12]">
          One NCERT chapter.<br />
          <span className="text-[#0F5B38]">Six synchronized classroom formats.</span>
        </h2>

        <p className="text-sm sm:text-base text-[#425B4C] font-semibold max-w-2xl mx-auto">
          Scrub through each pedagogical modality below. Every slide deck, video, mind map, quiz, and worksheet is generated simultaneously from authentic NCERT curriculum data.
        </p>

        {/* Signature Move: Bilingual Matrix Switcher */}
        <div className="pt-2 flex items-center justify-center gap-3">
          <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
            <Languages className="w-4 h-4 text-emerald-700" />
            Active Language:
          </span>
          <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200 shadow-inner">
            <button
              onClick={() => setLang("en")}
              className={`px-3.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                lang === "en"
                  ? "bg-[#0F5B38] text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLang("hi")}
              className={`px-3.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                lang === "hi"
                  ? "bg-[#0F5B38] text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              हिन्दी (Hindi)
            </button>
          </div>
        </div>
      </div>

      {/* Tactile Modality Control Bar */}
      <div className="w-full max-w-5xl mx-auto mb-6">
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 scrollbar-none px-2">
          {modalities.map((item) => {
            const Icon = item.icon;
            const isActive = activeModality === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveModality(item.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all duration-200 cursor-pointer shrink-0 border ${
                  isActive
                    ? "bg-[#0F5B38] text-white border-[#0F5B38] shadow-md -translate-y-0.5"
                    : "bg-white/90 text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-amber-300" : "text-[#0F5B38]"}`} />
                <span>{lang === "en" ? item.labelEn : item.labelHi}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* The 75-Inch Smartboard Hardware Anchor */}
      <SmartboardFrame className="w-full shadow-2xl">
        <div className="w-full h-[520px] sm:h-[560px] bg-[#F8FAF8] flex flex-col relative overflow-hidden select-none">
          
          {/* Smartboard Internal Header Ribbon */}
          <div className="h-12 bg-white border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-black text-[#1A2E20] tracking-tight">
                {content.chapter.code}
              </span>
              <span className="hidden md:inline-block text-xs font-bold text-slate-400">•</span>
              <span className="hidden md:inline-block text-xs font-extrabold text-[#0F5B38]">
                {lang === "en" ? content.chapter.en : content.chapter.hi}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                {modalities.find((m) => m.id === activeModality)?.[lang === "en" ? "labelEn" : "labelHi"]}
              </span>
            </div>
          </div>

          {/* Dynamic Modality Display Surface */}
          <div className="flex-1 relative overflow-hidden bg-white">
            
            {/* 1. SLIDE DECK MODALITY */}
            {activeModality === "presentation" && (
              <div className="absolute inset-0 p-6 sm:p-10 flex flex-col justify-between bg-gradient-to-br from-white via-slate-50 to-emerald-50/20">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center flex-1">
                  <div className="md:col-span-7 space-y-4">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-900 text-[10px] font-black uppercase tracking-wider">
                      Slide 1 of 12 • Core Concept
                    </div>
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#1A2E20] leading-tight">
                      {lang === "en" ? content.presentation.titleEn : content.presentation.titleHi}
                    </h3>
                    <p className="text-xs sm:text-sm font-medium text-slate-600 leading-relaxed">
                      {lang === "en" ? content.presentation.descEn : content.presentation.descHi}
                    </p>
                    <div className="space-y-2 pt-2">
                      {(lang === "en" ? content.presentation.pointsEn : content.presentation.pointsHi).map((pt, i) => (
                        <div key={i} className="flex items-center gap-2.5 text-xs font-bold text-[#1A2E20]">
                          <CheckCircle2 className="w-4 h-4 text-[#0F5B38] shrink-0" />
                          <span>{pt}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="md:col-span-5 h-64 sm:h-72 relative rounded-2xl overflow-hidden border border-slate-200 shadow-md">
                    <Image
                      src="/giraffe.jpg"
                      alt="Wildlife and Biodiversity Conservation"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-4">
                      <span className="text-white text-xs font-bold">
                        {lang === "en" ? "Biodiversity in Protected Sanctuaries" : "संरक्षित अभयारण्यों में जैव विविधता"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-500">
                  <span>Classroom Aspect Ratio: 16:9 4K Ultra-HD</span>
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1 font-bold">
                      <ChevronLeft className="w-3.5 h-3.5" /> Previous
                    </button>
                    <button className="px-3 py-1.5 rounded-lg bg-[#0F5B38] text-white flex items-center gap-1 font-bold">
                      Next <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 2. EXPLAINER VIDEO MODALITY */}
            {activeModality === "video" && (
              <div className="absolute inset-0 bg-slate-950 flex flex-col">
                <div className="flex-1 relative flex items-center justify-center">
                  <Image
                    src="/giraffe.jpg"
                    alt="Video Background"
                    fill
                    className="object-cover opacity-40 blur-[1px]"
                  />
                  <div className="relative z-10 flex flex-col items-center space-y-4 text-center px-4">
                    <div className="w-20 h-20 rounded-full bg-[#0F5B38]/90 backdrop-blur-md flex items-center justify-center text-white shadow-2xl cursor-pointer hover:scale-105 transition-transform border border-emerald-400/40">
                      <Play className="w-8 h-8 fill-white ml-1" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-white text-lg sm:text-xl font-black">
                        {lang === "en" ? "5-Minute Visual Explainer: Wildlife Sanctuaries" : "5 मिनट का वीडियो: वन्यजीव अभयारण्य एवं राष्ट्रीय उद्यान"}
                      </h4>
                      <p className="text-xs text-emerald-300 font-semibold">
                        {lang === "en" ? "Dual audio track: Pure Hindi voiceover + English subtitles" : "द्विभाषी ऑडियो: हिंदी वॉयसओवर एवं अंग्रेजी उपशीर्षक"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Video Scrubber & Hardware Controls */}
                <div className="h-16 bg-slate-900 border-t border-white/10 px-6 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-4 text-white text-xs font-bold">
                    <Play className="w-4 h-4 fill-white" />
                    <span>02:14 / 05:30</span>
                    <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      <Volume2 className="w-3 h-3" /> {lang === "en" ? "Hindi Audio Active" : "हिंदी ऑडियो सक्रिय"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-white">
                    <Settings className="w-4 h-4 text-slate-400 hover:text-white cursor-pointer" />
                    <span className="text-[10px] font-black uppercase tracking-wider bg-white/10 px-2 py-1 rounded">
                      1080p 60FPS
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* 3. INTERACTIVE CONCEPT MIND MAP MODALITY */}
            {activeModality === "mindmap" && (
              <div className="absolute inset-0 bg-[#F4F6F2] p-6 flex flex-col justify-between overflow-hidden">
                <div className="flex items-center justify-between border-b border-emerald-950/10 pb-3">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800">
                      NEP 2020 Conceptual Hierarchy
                    </span>
                    <h4 className="text-sm font-black text-[#1A2E20]">
                      {lang === "en" ? "Ecosystem & Conservation Relationship Tree" : "पारिस्थितिकी एवं संरक्षण संकल्पना मानचित्र"}
                    </h4>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 bg-white px-2.5 py-1 rounded-md border border-slate-200">
                    Tap any node to inspect
                  </span>
                </div>

                {/* SVG Vector Connected Mindmap Graph */}
                <div className="relative flex-1 w-full max-w-3xl mx-auto flex items-center justify-center">
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
                    <path d="M 50% 25% L 20% 70%" stroke="#96C7A0" strokeWidth="2.5" strokeDasharray="4 4" fill="none" />
                    <path d="M 50% 25% L 50% 70%" stroke="#96C7A0" strokeWidth="2.5" fill="none" />
                    <path d="M 50% 25% L 80% 70%" stroke="#96C7A0" strokeWidth="2.5" strokeDasharray="4 4" fill="none" />
                  </svg>

                  {/* Root Node */}
                  <div 
                    onClick={() => setActiveMindmapNode("root")}
                    className={`absolute top-[12%] left-1/2 -translate-x-1/2 px-6 py-3 rounded-2xl text-center shadow-lg transition-transform cursor-pointer border ${
                      activeMindmapNode === "root"
                        ? "bg-[#0F5B38] text-white border-emerald-400 scale-105"
                        : "bg-white text-[#1A2E20] border-slate-200 hover:scale-102"
                    }`}
                  >
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-300 block">Core Subject</span>
                    <span className="text-sm font-black">
                      {lang === "en" ? "Biodiversity Conservation" : "जैव विविधता संरक्षण"}
                    </span>
                  </div>

                  {/* Child Node 1 */}
                  <div 
                    onClick={() => setActiveMindmapNode("causes")}
                    className={`absolute top-[68%] left-[20%] -translate-x-1/2 p-3 rounded-xl shadow-md transition-transform cursor-pointer border text-center w-40 ${
                      activeMindmapNode === "causes"
                        ? "bg-[#0F5B38] text-white border-emerald-400 scale-105"
                        : "bg-white text-[#1A2E20] border-slate-200 hover:scale-102"
                    }`}
                  >
                    <span className="text-[9px] font-black uppercase text-rose-500 block">Causes</span>
                    <span className="text-xs font-bold">
                      {lang === "en" ? "Deforestation & Fires" : "वनोन्मूलन एवं आग"}
                    </span>
                  </div>

                  {/* Child Node 2 */}
                  <div 
                    onClick={() => setActiveMindmapNode("consequences")}
                    className={`absolute top-[68%] left-[50%] -translate-x-1/2 p-3 rounded-xl shadow-md transition-transform cursor-pointer border text-center w-40 ${
                      activeMindmapNode === "consequences"
                        ? "bg-[#0F5B38] text-white border-emerald-400 scale-105"
                        : "bg-white text-[#1A2E20] border-slate-200 hover:scale-102"
                    }`}
                  >
                    <span className="text-[9px] font-black uppercase text-amber-600 block">Effects</span>
                    <span className="text-xs font-bold">
                      {lang === "en" ? "Drought & Warming" : "सूखा एवं तापन"}
                    </span>
                  </div>

                  {/* Child Node 3 */}
                  <div 
                    onClick={() => setActiveMindmapNode("solutions")}
                    className={`absolute top-[68%] left-[80%] -translate-x-1/2 p-3 rounded-xl shadow-md transition-transform cursor-pointer border text-center w-40 ${
                      activeMindmapNode === "solutions"
                        ? "bg-[#0F5B38] text-white border-emerald-400 scale-105"
                        : "bg-white text-[#1A2E20] border-slate-200 hover:scale-102"
                    }`}
                  >
                    <span className="text-[9px] font-black uppercase text-emerald-600 block">Protection</span>
                    <span className="text-xs font-bold">
                      {lang === "en" ? "Biosphere Reserves" : "आरक्षित क्षेत्र"}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs font-bold text-slate-700">
                  <span className="flex items-center gap-1.5 text-emerald-800">
                    <Info className="w-3.5 h-3.5" />
                    {activeMindmapNode === "causes" && (lang === "en" ? "Selected: Agriculture & Urban Sprawl driving forest loss." : "चयनित: कृषि और शहरीकरण वनोन्मूलन के मुख्य कारण हैं।")}
                    {activeMindmapNode === "consequences" && (lang === "en" ? "Selected: Soil erosion, desertification and loss of species." : "चयनित: मृदा अपरदन, मरुस्थलीकरण और वन्यजीवों की हानि।")}
                    {activeMindmapNode === "solutions" && (lang === "en" ? "Selected: Pachmarhi, Kaziranga, and National Wildlife Sanctuaries." : "चयनित: पचमढ़ी, काजीरंगा और राष्ट्रीय वन्यजीव अभयारण्य।")}
                    {activeMindmapNode === "root" && (lang === "en" ? "Explore causes, consequences, and sanctuary networks." : "कारणों, परिणामों और अभयारण्य नेटवर्क का अन्वेषण करें।")}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">Exportable as SVG / Vector PDF</span>
                </div>
              </div>
            )}

            {/* 4. CLASSROOM QUIZ MODALITY */}
            {activeModality === "quiz" && (
              <div className="absolute inset-0 bg-slate-50 p-6 sm:p-10 flex flex-col justify-between">
                <div className="space-y-6 max-w-2xl mx-auto w-full">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
                      Question 3 of 10 • Multiple Choice
                    </span>
                    <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-emerald-600" /> 34 Students Connected
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl md:text-2xl font-black text-[#1A2E20] leading-snug">
                    {lang === "en" ? content.quiz.questionEn : content.quiz.questionHi}
                  </h3>

                  <div className="space-y-3">
                    {(lang === "en" ? content.quiz.optionsEn : content.quiz.optionsHi).map((opt, idx) => {
                      const isCorrect = idx === content.quiz.correctIndex;
                      const isSelected = quizSelected === idx;
                      return (
                        <button
                          key={idx}
                          onClick={() => setQuizSelected(idx)}
                          className={`w-full p-4 rounded-xl text-left text-xs sm:text-sm font-extrabold flex items-center justify-between transition-all cursor-pointer border ${
                            isSelected
                              ? isCorrect
                                ? "bg-emerald-50 border-emerald-500 text-emerald-950 shadow-sm"
                                : "bg-rose-50 border-rose-400 text-rose-950"
                              : "bg-white border-slate-200 hover:border-slate-300 text-[#1A2E20]"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-black ${
                              isSelected && isCorrect ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600"
                            }`}>
                              {String.fromCharCode(65 + idx)}
                            </span>
                            <span>{opt}</span>
                          </div>
                          {isSelected && isCorrect && <Check className="w-5 h-5 text-emerald-600 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  {quizSelected !== null && (
                    <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-semibold flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block">
                          {quizSelected === content.quiz.correctIndex ? "Correct Answer!" : "Incorrect — Review Explanation:"}
                        </span>
                        {lang === "en" ? content.quiz.explanationEn : content.quiz.explanationHi}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs font-bold text-slate-500">
                  <span>Smartboard Quick-Check Mode</span>
                  <button 
                    onClick={() => setQuizSelected(content.quiz.correctIndex)}
                    className="text-emerald-700 hover:text-emerald-900 font-bold underline cursor-pointer"
                  >
                    Reveal Model Answer
                  </button>
                </div>
              </div>
            )}

            {/* 5. QUESTION BANK MODALITY */}
            {activeModality === "questions" && (
              <div className="absolute inset-0 bg-slate-50 p-6 sm:p-10 flex flex-col justify-between overflow-y-auto">
                <div className="max-w-2xl mx-auto w-full space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {content.questions.mark1}
                      </span>
                      <h4 className="text-base font-black text-[#1A2E20] mt-2">
                        {lang === "en" ? content.questions.q1En : content.questions.q1Hi}
                      </h4>
                    </div>
                    <button className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-1.5 shrink-0">
                      <Printer className="w-3.5 h-3.5" /> Print Card
                    </button>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2 shadow-sm">
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 block">
                      CBSE Model Answer &amp; Marking Rubric
                    </span>
                    <p className="text-xs sm:text-sm font-medium text-slate-700 leading-relaxed">
                      {lang === "en" ? content.questions.ans1En : content.questions.ans1Hi}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-[11px] text-amber-900 font-semibold space-y-1">
                    <span className="font-bold block">Pedagogical Teacher Prompt:</span>
                    <p>
                      {lang === "en" 
                        ? "Ask students to locate Pachmarhi on the India physical map before discussing the flora and fauna found in Satpura National Park."
                        : "सतपुड़ा राष्ट्रीय उद्यान की वनस्पति और जीवों पर चर्चा करने से पहले विद्यार्थियों से भारत के भौतिक मानचित्र पर पचमढ़ी खोजने को कहें।"}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs font-bold text-slate-500">
                  <span>Contains 1-Mark, 2-Mark, 3-Mark &amp; 5-Mark Categorized CBSE Questions</span>
                  <span className="text-[#0F5B38] font-black">100% NCERT Solutions</span>
                </div>
              </div>
            )}

            {/* 6. PRINT-READY WORKSHEET MODALITY */}
            {activeModality === "worksheet" && (
              <div className="absolute inset-0 bg-slate-200 p-4 sm:p-8 flex items-center justify-center overflow-y-auto">
                <div className="w-full max-w-lg bg-white shadow-2xl rounded p-6 sm:p-8 space-y-5 text-[#1A2E20] border border-slate-300">
                  {/* Worksheet Header */}
                  <div className="border-b-2 border-black pb-3 space-y-1 text-center">
                    <span className="text-[9px] font-black tracking-widest uppercase block text-slate-500">
                      {lang === "en" ? content.worksheet.schoolHeaderEn : content.worksheet.schoolHeaderHi}
                    </span>
                    <h3 className="text-base font-black uppercase tracking-tight">
                      {lang === "en" ? content.worksheet.titleEn : content.worksheet.titleHi}
                    </h3>
                  </div>

                  {/* Student Credentials Row */}
                  <div className="grid grid-cols-3 gap-2 text-[10px] font-bold text-slate-600 border-b border-slate-200 pb-2">
                    <div>Name: ______________</div>
                    <div>Roll No: ____________</div>
                    <div className="text-right">Date: _____________</div>
                  </div>

                  {/* Questions */}
                  <div className="space-y-4 pt-1">
                    <div className="space-y-2">
                      <span className="text-xs font-black uppercase text-slate-800 block">
                        {lang === "en" ? "Section A: Fill in the Blanks (1 Mark Each)" : "खंड क: रिक्त स्थान भरें (प्रत्येक 1 अंक)"}
                      </span>
                      <p className="text-xs leading-relaxed text-slate-700">
                        {lang === "en" ? content.worksheet.fill1En : content.worksheet.fill1Hi}
                      </p>
                      <p className="text-xs leading-relaxed text-slate-700">
                        {lang === "en" ? content.worksheet.fill2En : content.worksheet.fill2Hi}
                      </p>
                    </div>
                  </div>

                  {/* Worksheet Action Footer */}
                  <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                      Print-Ready A4 PDF
                    </span>
                    <button className="px-4 py-2 rounded-xl bg-[#0F5B38] text-white font-extrabold text-xs flex items-center gap-2 hover:bg-[#0C4B2E] transition-colors shadow-sm cursor-pointer">
                      <Download className="w-3.5 h-3.5" /> Download Printable PDF
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </SmartboardFrame>
    </section>
  );
}
