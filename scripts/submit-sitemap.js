/**
 * Sitemap submission & indexing helper script for TeacherSathi
 * Submits https://teacher-sathi.online/sitemap.xml to Search Engines
 */

const SITEMAP_URL = 'https://teacher-sathi.online/sitemap.xml';

async function submitSitemap() {
  console.log(`\n🚀 Submitting TeacherSathi XML Sitemap Index: ${SITEMAP_URL}\n`);

  const pingUrls = [
    { name: 'Google Search Console', url: `https://www.google.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}` },
    { name: 'Bing / Yahoo Webmaster', url: `https://www.bing.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}` },
  ];

  for (const engine of pingUrls) {
    try {
      console.log(`[+] Pinging ${engine.name}...`);
      const res = await fetch(engine.url);
      console.log(`    Status: ${res.status} ${res.statusText}`);
    } catch (err) {
      console.warn(`    Failed to ping ${engine.name}:`, err.message || err);
    }
  }

  console.log(`\n✅ Sitemap Submission Completed!`);
  console.log(`📌 Google Search Console Property: https://search.google.com/search-console`);
  console.log(`📌 Bing Webmaster Tools: https://www.bing.com/webmasters\n`);
}

submitSitemap();
