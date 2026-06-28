import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://teacher-sathi.online';
  const locales = ['en', 'hi'];

  // All public routes to be included in the sitemap
  const routes = [
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
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  locales.forEach((locale) => {
    routes.forEach((route) => {
      const url = `${baseUrl}/${locale}${route.path}`;
      sitemapEntries.push({
        url,
        lastModified: new Date(),
        changeFrequency: route.changeFrequency,
        priority: route.priority,
        alternates: {
          languages: {
            en: `${baseUrl}/en${route.path}`,
            hi: `${baseUrl}/hi${route.path}`,
          },
        },
      });
    });
  });

  return sitemapEntries;
}
