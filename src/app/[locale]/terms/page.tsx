"use client";

import { useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { FileText, ShieldAlert, Scale, HelpCircle, ArrowLeft } from "lucide-react";

export default function TermsOfUsePage() {
  const locale = useLocale();
  const isHi = locale.startsWith("hi");

  const content = {
    en: {
      title: "Terms of Use",
      subtitle: "Please read these terms carefully before accessing TeacherSathi AI lesson plans, NCERT mind maps, and interactive classroom tools.",
      lastUpdated: "Last Updated: June 2026",
      backLink: "Back to Home",
      sections: [
        {
          title: "1. Acceptance of Terms",
          icon: Scale,
          body: "By accessing or using the TeacherSathi website, application, or services, you agree to be bound by these Terms of Use and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site."
        },
        {
          title: "2. License & Service Use",
          icon: FileText,
          body: "TeacherSathi grants you a limited, non-exclusive, non-transferable, and revocable license to use our NCERT-aligned AI resource generators for classroom and personal educational purposes. You may not resell, redistribute, or reverse-engineer our proprietary AI algorithms or templates without explicit written permission."
        },
        {
          title: "3. Account Security & Verification",
          icon: ShieldAlert,
          body: "When you create an account (Teacher or Student), you are responsible for maintaining the confidentiality of your credentials. You agree to notify us immediately of any unauthorized use of your account. TeacherSathi is not liable for any loss resulting from unauthorized account access."
        },
        {
          title: "4. User Conduct & Content Guidelines",
          icon: HelpCircle,
          body: "You agree not to use our platform to generate spam, upload malicious files, or distribute inappropriate material. AI-generated resources (including videos, quizzes, and mind maps) must be used in accordance with school policies and local regulations. We reserve the right to suspend accounts that violate these rules."
        },
        {
          title: "5. Zero Data Scraping & AI Model Privacy",
          icon: ShieldAlert,
          body: "TeacherSathi enforces a strict zero-data-retention policy. Proprietary teacher lesson plans, classroom prompts, and student assessment data uploaded or generated on our platform are never used to train public artificial intelligence models, scraped by third-party web crawlers, or sold to external data brokers. All data remains encrypted and strictly private under India's Digital Personal Data Protection (DPDP) Act 2023."
        },
        {
          title: "5. Limitations & Governing Law",
          icon: Scale,
          body: "TeacherSathi services are provided 'as is' without warranties of any kind. Under no circumstances shall TeacherSathi be liable for any indirect, incidental, or consequential damages. These terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions."
        }
      ]
    },
    hi: {
      title: "उपयोग की शर्तें",
      subtitle: "TeacherSathi सेवाओं का उपयोग करने से पहले कृपया इन शर्तों को ध्यान से पढ़ें।",
      lastUpdated: "अंतिम अपडेट: जून 2026",
      backLink: "होम पर वापस जाएं",
      sections: [
        {
          title: "1. शर्तों की स्वीकृति",
          icon: Scale,
          body: "TeacherSathi वेबसाइट, एप्लिकेशन या सेवाओं का उपयोग करके, आप इन उपयोग की शर्तों और सभी लागू कानूनों और विनियमों से बाध्य होने के लिए सहमत हैं। यदि आप इन शर्तों में से किसी से भी सहमत नहीं हैं, तो आपको इस साइट का उपयोग करने की अनुमति नहीं है।"
        },
        {
          title: "2. लाइसेंस और सेवा का उपयोग",
          icon: FileText,
          body: "TeacherSathi आपको कक्षा और व्यक्तिगत शैक्षिक उद्देश्यों के लिए हमारे NCERT-आधारित AI संसाधन जनरेटर का उपयोग करने के लिए एक सीमित, गैर-अनन्य, गैर-हस्तांतरणीय और प्रतिसंहरणीय लाइसेंस प्रदान करता है। आप हमारी लिखित अनुमति के बिना हमारे AI एल्गोरिदम या टेम्पलेट्स को पुनर्विक्रय या पुनर्वितरित नहीं कर सकते।"
        },
        {
          title: "3. खाता सुरक्षा और सत्यापन",
          icon: ShieldAlert,
          body: "जब आप एक खाता (शिक्षक या छात्र) बनाते हैं, तो आप अपनी साख (credentials) की गोपनीयता बनाए रखने के लिए जिम्मेदार होते हैं। आप अपने खाते के किसी भी अनधिकृत उपयोग के बारे में हमें तुरंत सूचित करने के लिए सहमत हैं। TeacherSathi अनधिकृत खाता पहुंच से होने वाले किसी भी नुकसान के लिए उत्तरदायी नहीं है।"
        },
        {
          title: "4. उपयोगकर्ता आचरण और सामग्री दिशानिर्देश",
          icon: HelpCircle,
          body: "आप स्पैम उत्पन्न करने, दुर्भावनापूर्ण फाइलें अपलोड करने या अनुचित सामग्री वितरित करने के लिए हमारे प्लेटफॉर्म का उपयोग न करने पर सहमत हैं। AI-जनित संसाधनों (वीडियो, क्विज़ और माइंड मैप) का उपयोग स्कूल की नीतियों और स्थानीय नियमों के अनुसार किया जाना चाहिए। हम इन नियमों का उल्लंघन करने वाले खातों को निलंबित करने का अधिकार सुरक्षित रखते हैं।"
        },
        {
          title: "5. सीमाएं और शासी कानून",
          icon: Scale,
          body: "TeacherSathi सेवाएं बिना किसी वारंटी के 'जैसी हैं' वैसे ही प्रदान की जाती हैं। किसी भी परिस्थिति में TeacherSathi किसी भी अप्रत्यक्ष, आकस्मिक या परिणामी नुकसान के लिए उत्तरदायी नहीं होगा। ये शर्तें कानून के प्रावधानों के टकराव के बिना, भारत के कानूनों के अनुसार शासित और समझी जाएंगी।"
        }
      ]
    }
  };

  const t = isHi ? content.hi : content.en;

  return (
    <div className="min-h-screen bg-cream text-ink font-sans py-16 px-6 sm:px-12 transition-colors duration-200">
      <div className="max-w-[800px] mx-auto space-y-10">
        
        {/* Back Link */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm font-bold text-brand hover:text-brand-light transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          {t.backLink}
        </Link>

        {/* Header Hero */}
        <div className="space-y-3 border-b border-line pb-6">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-brand tracking-tight">{t.title}</h1>
          <p className="text-ink-2 text-base sm:text-lg leading-relaxed">{t.subtitle}</p>
          <p className="text-xs font-semibold text-ink-3 uppercase tracking-wider">{t.lastUpdated}</p>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {t.sections.map((section, idx) => {
            const Icon = section.icon;
            return (
              <div 
                key={idx} 
                className="bg-white border border-line p-6 sm:p-8 rounded-2xl shadow-sm hover:shadow-md transition-all space-y-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-tint border border-brand-tint-2 flex items-center justify-center text-brand">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-ink">{section.title}</h2>
                </div>
                <p className="text-sm sm:text-base text-ink-2 leading-relaxed pl-1">
                  {section.body}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
