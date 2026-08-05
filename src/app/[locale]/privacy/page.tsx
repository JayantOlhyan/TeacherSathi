"use client";

import { useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { Shield, Eye, Lock, Database, ArrowLeft } from "lucide-react";

export default function PrivacyPolicyPage() {
  const locale = useLocale();
  const isHi = locale.startsWith("hi");

  const content = {
    en: {
      title: "Privacy Policy",
      subtitle: "Your privacy is extremely important to us. Learn how TeacherSathi handles and protects personal data for Indian school educators, student quizzes, and AI lesson plans.",
      lastUpdated: "Last Updated: June 2026",
      backLink: "Back to Home",
      sections: [
        {
          title: "1. Information We Collect",
          icon: Database,
          body: "We collect information you provide directly to us when creating a Teacher or Student account, such as your name, school name, role, email address, password, and optional profile pictures. We also collect metadata from live clicker responses during quiz sessions."
        },
        {
          title: "2. How We Use Your Data",
          icon: Eye,
          body: "Your data is used to customize your classroom dashboards, compile student performance analytics, generate AI-aligned curriculum content (NCERT maps, quizzes, lesson plans), and provide technical support. We do not sell or monetize your personal information."
        },
        {
          title: "3. Data Security & Storage",
          icon: Lock,
          body: "We implement robust security measures to protect your data from unauthorized access, loss, or disclosure. Student clicker data and school records are stored securely using Supabase database tables with strict row-level security (RLS) policies."
        },
        {
          title: "4. Cookies & Custom Accessibility",
          icon: Shield,
          body: "We use local storage cookies to remember your interface preferences, such as selected language settings (English/Hindi), light/dark appearance preference, and customized accessibility modes (font-scaling, high-contrast, text-to-speech toggles)."
        },
        {
          title: "5. Your Rights & Contacts",
          icon: Database,
          body: "You have the right to request a copy of the personal data we store, request modifications, or delete your account entirely at any time. For privacy queries or data deletion requests, contact us at jayantolhyan@khelclan.online."
        },
        {
          title: "6. Digital Personal Data Protection (DPDP) Act 2023 Compliance",
          icon: Shield,
          body: "TeacherSathi strictly complies with the Digital Personal Data Protection (DPDP) Act 2023 of India. We act as a Data Fiduciary for school account management and ensure that student data is processed solely with explicit educator/school consent. We do not engage in behavioral tracking or targeted advertising directed at minor students."
        }
      ]
    },
    hi: {
      title: "गोपनीयता नीति",
      subtitle: "आपकी गोपनीयता हमारे लिए अत्यंत महत्वपूर्ण है। जानें कि हम आपके व्यक्तिगत डेटा को कैसे प्रबंधित और सुरक्षित करते हैं।",
      lastUpdated: "अंतिम अपडेट: जून 2026",
      backLink: "होम पर वापस जाएं",
      sections: [
        {
          title: "1. जानकारी जो हम एकत्र करते हैं",
          icon: Database,
          body: "हम वह जानकारी एकत्र करते हैं जो आप शिक्षक या छात्र खाता बनाते समय सीधे हमें प्रदान करते हैं, जैसे कि आपका नाम, स्कूल का नाम, भूमिका, ईमेल पता, पासवर्ड और वैकल्पिक प्रोफ़ाइल चित्र। हम प्रश्नोत्तरी सत्रों के दौरान लाइव क्लिकर प्रतिक्रियाओं से मेटाडेटा भी एकत्र करते हैं।"
        },
        {
          title: "2. हम आपके डेटा का उपयोग कैसे करते हैं",
          icon: Eye,
          body: "आपके डेटा का उपयोग आपके क्लासरूम डैशबोर्ड को कस्टमाइज़ करने, छात्र प्रदर्शन विश्लेषण को संकलित करने, AI-संरेखित पाठ्यक्रम सामग्री (NCERT मैप्स, क्विज़, पाठ योजनाएं) उत्पन्न करने और तकनीकी सहायता प्रदान करने के लिए किया जाता है। हम आपकी व्यक्तिगत जानकारी को बेचते या मुद्रीकृत नहीं करते हैं।"
        },
        {
          title: "3. डेटा सुरक्षा और भंडारण",
          icon: Lock,
          body: "हम आपके डेटा को अनधिकृत पहुंच, हानि या प्रकटीकरण से बचाने के लिए मजबूत सुरक्षा उपाय लागू करते हैं। छात्र क्लिकर डेटा और स्कूल के रिकॉर्ड कड़े रो-लेवल सुरक्षा (RLS) नीतियों के साथ Supabase डेटाबेस तालिकाओं का उपयोग करके सुरक्षित रूप से संग्रहीत किए जाते हैं।"
        },
        {
          title: "4. कुकीज़ और कस्टम एक्सेसिबिलिटी",
          icon: Shield,
          body: "हम आपकी इंटरफ़ेस प्राथमिकताओं को याद रखने के लिए स्थानीय स्टोरेज कुकीज़ का उपयोग करते हैं, जैसे चयनित भाषा सेटिंग्स (अंग्रेजी / हिंदी), लाइट / डार्क उपस्थिति वरीयता, और अनुकूलित एक्सेसिबिलिटी मोड (फ़ॉन्ट-स्केलिंग, उच्च-कंट्रास्ट, टेक्स्ट-टू-स्पीच टॉगल)।"
        },
        {
          title: "5. आपके अधिकार और संपर्क",
          icon: Database,
          body: "आपको हमारे द्वारा संग्रहीत व्यक्तिगत डेटा की एक प्रति का अनुरोध करने, संशोधनों का अनुरोध करने, या किसी भी समय अपना खाता पूरी तरह से हटाने का अधिकार है। गोपनीयता प्रश्नों या डेटा हटाने के अनुरोधों के लिए, हमसे jayantolhyan@khelclan.online पर संपर्क करें।"
        },
        {
          title: "6. डिजिटल पर्सनल डेटा प्रोटेक्शन (DPDP) अधिनियम 2023 अनुपालन",
          icon: Shield,
          body: "TeacherSathi भारत के डिजिटल पर्सनल डेटा प्रोटेक्शन (DPDP) अधिनियम 2023 का कड़ाई से अनुपालन करता है। हम केवल शिक्षक/स्कूल की स्पष्ट सहमति से ही छात्रों के डेटा को संसाधित करते हैं। हम नाबालिग छात्रों के लक्षित विज्ञापन या व्यवहार ट्रैकिंग में संलग्न नहीं होते हैं।"
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
