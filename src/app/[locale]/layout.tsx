import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Mukta } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileStickyCTA from "@/components/MobileStickyCTA";
import WhatsAppChatWidget from "@/components/WhatsAppChatWidget";
import SocialProofToast from "@/components/SocialProofToast";
import ExitIntentModal from "@/components/ExitIntentModal";
import SEOLinks from "@/components/SEOLinks";
import Breadcrumbs from "@/components/Breadcrumbs";
import "../globals.css";

export const dynamic = "force-dynamic";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-plus-jakarta-sans",
});

const mukta = Mukta({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["devanagari"],
  display: "swap",
  variable: "--font-mukta",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#14532D",
};

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const isHi = locale === 'hi';
  
  return {
    metadataBase: new URL("https://teacher-sathi.online"),
    title: {
      template: '%s – TeacherSathi',
      default: isHi 
        ? 'NCERT AI लेसन प्लान जनरेटर एवं CBSE वर्कशीट क्रिएटर – TeacherSathi' 
        : 'NCERT AI Lesson Plan Generator & CBSE Worksheet Creator – TeacherSathi',
    },
    description: isHi 
      ? 'भारतीय शिक्षकों के लिए कक्षा 6 से 10 तक के NCERT विषयों के लिए AI लेसन प्लान, द्विभाषी माइंड मैप, 75-इंच स्मार्टबोर्ड प्रेजेंटेशन और क्विज़ जनरेटर कुछ ही सेकंड में तैयार करें।' 
      : 'India\'s #1 NCERT AI Lesson Plan Generator and CBSE Worksheet Creator. Instantly generate bilingual 75-inch smartboard presentations, explainer videos, mind maps, quizzes, and print-ready worksheets for Classes 6 to 10.',
    keywords: [
      'ncert ai lesson plan generator',
      'ai teacher assistant india',
      'class 8 science ncert lesson plan pdf',
      'cbse smart class presentation generator',
      'ncert question paper generator free',
      'kvs lesson plan organizer ai',
      'nep 2020 competency based lesson plan',
      'class 10 science ncert mind map hindi',
      'ai worksheet generator for teachers hindi',
      'magicschool ai alternative india',
      'how to use ai in indian classrooms',
      'ncert class 6 to 10 teaching kit pdf',
      'CBSE lesson plan generator AI',
      'bilingual Hindi English teacher tools',
      'NCERT AI Education'
    ],
    alternates: {
      canonical: `https://teacher-sathi.online/${locale}`,
      languages: {
        'en-IN': 'https://teacher-sathi.online/en',
        'hi-IN': 'https://teacher-sathi.online/hi',
        'x-default': 'https://teacher-sathi.online/en',
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: 'website',
      locale: locale === 'hi' ? 'hi_IN' : 'en_IN',
      alternateLocale: locale === 'hi' ? ['en_IN'] : ['hi_IN'],
      url: `https://teacher-sathi.online/${locale}`,
      siteName: 'TeacherSathi',
      title: isHi ? 'TeacherSathi - NCERT AI शिक्षण साथी' : 'TeacherSathi - India\'s Dedicated NCERT AI Co-Pilot',
      description: isHi ? 'कक्षा 6-10 के लिए ऑटोमेटेड NCERT AI लेसन प्लान और वर्कशीट' : 'Instantly generate 75-inch smartboard lesson kits in 30 seconds.',
      images: [
        {
          url: 'https://teacher-sathi.online/logo-horizontal.png',
          width: 1200,
          height: 630,
          alt: 'TeacherSathi AI Lesson Plan & CBSE Worksheet Creator',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'TeacherSathi AI Co-Pilot',
      description: 'NCERT AI Lesson Plan Generator & CBSE Worksheet Creator',
      images: ['https://teacher-sathi.online/logo-horizontal.png'],
    },
    icons: {
      icon: '/favicon-green.png',
      shortcut: '/favicon-green.png',
      apple: '/favicon-green.png',
    },
    verification: {
      google: '-a0wyjaTybF3gldEtwwHLwq_ChLau7TLls8Q1KFF7lE',
    },
  };
}

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'hi' }];
}

export default async function RootLayout({
  children,
  params: {locale}
}: Readonly<{
  children: React.ReactNode;
  params: {locale: string};
}>) {
  const messages = await getMessages();

  const jsonLdOrg = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "TeacherSathi AI",
    "url": "https://teacher-sathi.online",
    "logo": "https://teacher-sathi.online/logo-horizontal.png",
    "description": "India's #1 NCERT AI Lesson Plan Generator & CBSE Worksheet Creator purpose-built for 75-inch smartboard displays.",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "IN",
      "addressRegion": "Delhi / All India"
    },
    "areaServed": ["IN", "Madhya Pradesh", "Bihar", "Rajasthan", "Delhi", "Uttar Pradesh", "Gujarat", "Maharashtra", "Tamil Nadu"],
    "inLanguage": ["en-IN", "hi-IN"],
    "sameAs": [
      "https://twitter.com/teachersathi",
      "https://youtube.com/@teachersathi"
    ]
  };

  const jsonLdApp = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "TeacherSathi AI Lesson Plan Generator",
    "operatingSystem": "Web, Android, iOS, Windows (75-inch Smartboards)",
    "applicationCategory": "EducationalApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "INR"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "1250",
      "bestRating": "5",
      "worstRating": "1"
    }
  };

  const jsonLdFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How do I generate NCERT AI Lesson Plans for Class 8 Science?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Select Class 8, choose Science, pick any NCERT chapter (e.g. Conservation of Plants and Animals), and click 'Generate Free NCERT Lesson Kit Now'. Your 75-inch smartboard presentation, explainer video, mind map, and worksheet PDF will be generated in 30 seconds."
        }
      },
      {
        "@type": "Question",
        "name": "Is TeacherSathi 100% free for individual Indian teachers?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, TeacherSathi is 100% free forever for individual Indian government and private school teachers with zero credit card requirements."
        }
      },
      {
        "@type": "Question",
        "name": "Is TeacherSathi aligned with NEP 2020 and DPDP Act 2023?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, all lesson kits comply fully with NEP 2020 competency-based learning standards and DPDP Act 2023 data privacy regulations."
        }
      }
    ]
  };

  const jsonLdSpeakable = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "TeacherSathi - NCERT AI Lesson Plan Generator",
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": ["h1", "p.hero-element"]
    }
  };

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <meta name="google-site-verification" content="-a0wyjaTybF3gldEtwwHLwq_ChLau7TLls8Q1KFF7lE" />
        <SEOLinks />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdApp) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSpeakable) }}
        />
      </head>
      <body
        className={`${plusJakartaSans.variable} ${mukta.variable} font-sans antialiased bg-background text-foreground`}
        suppressHydrationWarning
      >
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          <Breadcrumbs />
          {children}
          <Footer />
          <MobileStickyCTA />
          <WhatsAppChatWidget />
          <SocialProofToast />
          <ExitIntentModal />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
