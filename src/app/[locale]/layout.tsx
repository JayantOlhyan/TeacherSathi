import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Mukta } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOLinks from "@/components/SEOLinks";
import Breadcrumbs from "@/components/Breadcrumbs";
import "../globals.css";

export const dynamic = "force-dynamic";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
});

const mukta = Mukta({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["devanagari"],
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
      default: isHi ? 'AI टीचिंग असिस्टेंट – TeacherSathi' : 'AI Teaching Assistant – TeacherSathi',
    },
    description: isHi 
      ? 'भारतीय शिक्षकों के लिए NCERT आधारित AI लेसन प्लान, इंटरेक्टिव माइंड मैप और क्विज़ जनरेटर कुछ ही सेकंड में तैयार करें। आपका विश्वसनीय शिक्षण साथी।' 
      : 'Generate NCERT-aligned AI lesson plans, interactive mind maps, and quiz generators in seconds. The ultimate AI teaching assistant for Indian educators.',
    keywords: [
      'AI teaching assistant India',
      'CBSE lesson plan generator AI',
      'NCERT class 10 solutions AI',
      'automatic question paper generator CBSE',
      'bilingual Hindi English teacher tools',
      'NCERT',
      'AI Education',
      'Teacher Tools',
      'Lesson Planning',
      'Indian Education',
      'CBSE'
    ],
    openGraph: {
      type: 'website',
      locale: locale === 'hi' ? 'hi_IN' : 'en_IN',
      alternateLocale: locale === 'hi' ? ['en_IN'] : ['hi_IN'],
      url: `https://teacher-sathi.online/${locale}`,
      siteName: 'TeacherSathi',
      images: [
        {
          url: '/og-image.png', // User should provide this
          width: 1200,
          height: 630,
          alt: 'TeacherSathi - Aapka Teaching Companion',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'TeacherSathi',
      description: 'Aapka Teaching Companion',
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

export default async function RootLayout({
  children,
  params: {locale}
}: Readonly<{
  children: React.ReactNode;
  params: {locale: string};
}>) {
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <meta name="google-site-verification" content="-a0wyjaTybF3gldEtwwHLwq_ChLau7TLls8Q1KFF7lE" />
        <SEOLinks />
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
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
