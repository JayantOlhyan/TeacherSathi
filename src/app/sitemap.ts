import { MetadataRoute } from 'next';
import { NCERT_SYLLABUS } from '@/lib/data/ncertSyllabus';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://teacher-sathi.online';

  // Core public static routes
  const staticRoutes = [
    { path: '', priority: 1.0, changeFrequency: 'daily' as const },
    { path: '/resources/lesson-plans', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/resources/ncert', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/resources/mind-maps', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/resources/quiz-generator', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/pricing', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/support', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/support/contact', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/support/sitemap', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/privacy', priority: 0.5, changeFrequency: 'yearly' as const },
    { path: '/terms', priority: 0.5, changeFrequency: 'yearly' as const },
    { path: '/login', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/signup', priority: 0.7, changeFrequency: 'monthly' as const },
    // Competitor comparison pages
    { path: '/compare/teachersathi-vs-chatgpt', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/compare/teachersathi-vs-magicschool-ai', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/compare/teachersathi-vs-khanmigo', priority: 0.8, changeFrequency: 'weekly' as const },
    // Persona campaign pages
    { path: '/for/kvs-teachers', priority: 0.85, changeFrequency: 'weekly' as const },
    { path: '/for/cbse-teachers', priority: 0.85, changeFrequency: 'weekly' as const },
    { path: '/for/state-board-teachers', priority: 0.85, changeFrequency: 'weekly' as const },
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Add static routes
  staticRoutes.forEach((route) => {
    sitemapEntries.push({
      url: `${baseUrl}${route.path}`,
      lastModified: new Date(),
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: {
        languages: {
          'en-IN': `${baseUrl}${route.path}`,
          'hi-IN': `${baseUrl}${route.path}`,
          'x-default': `${baseUrl}${route.path}`,
        },
      },
    });
  });

  // Programmatically generate entries for all NCERT Classes, Subjects, and Chapters (250+)
  Object.keys(NCERT_SYLLABUS).forEach((className) => {
    const gradeSlug = className.toLowerCase().replace(/\s+/g, '-'); // e.g. 'class-8'
    const gradeNum = className.replace(/Class\s*/i, '');
    const subjects = NCERT_SYLLABUS[className];

    Object.keys(subjects).forEach((subjectName) => {
      const subjectSlug = subjectName.toLowerCase().replace(/\s+/g, '-'); // e.g. 'science' or 'social-science'
      
      // Subject Hub URL (e.g. /ncert-class-8-science and /content/class-8/science)
      const hubSlug = `ncert-class-${gradeNum}-${subjectSlug}`;
      sitemapEntries.push({
        url: `${baseUrl}/${hubSlug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.85,
        alternates: {
          languages: {
            'en-IN': `${baseUrl}/${hubSlug}`,
            'hi-IN': `${baseUrl}/${hubSlug}`,
            'x-default': `${baseUrl}/${hubSlug}`,
          },
        },
      });

      sitemapEntries.push({
        url: `${baseUrl}/content/${gradeSlug}/${subjectSlug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.85,
        alternates: {
          languages: {
            'en-IN': `${baseUrl}/content/${gradeSlug}/${subjectSlug}`,
            'hi-IN': `${baseUrl}/content/${gradeSlug}/${subjectSlug}`,
            'x-default': `${baseUrl}/content/${gradeSlug}/${subjectSlug}`,
          },
        },
      });

      // Chapter Pages
      const chapters = subjects[subjectName];
      chapters.forEach((ch) => {
        const chapterSlug = `chapter-${ch.id}`;
        sitemapEntries.push({
          url: `${baseUrl}/content/${gradeSlug}/${subjectSlug}/${chapterSlug}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.8,
          alternates: {
            languages: {
              'en-IN': `${baseUrl}/content/${gradeSlug}/${subjectSlug}/${chapterSlug}`,
              'hi-IN': `${baseUrl}/content/${gradeSlug}/${subjectSlug}/${chapterSlug}`,
              'x-default': `${baseUrl}/content/${gradeSlug}/${subjectSlug}/${chapterSlug}`,
            },
          },
        });
      });
    });
  });

  return sitemapEntries;
}
