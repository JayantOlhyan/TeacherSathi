"use client";

import { usePathname } from "next/navigation";

export default function SEOLinks() {
  const pathname = usePathname() || "/en";
  const baseUrl = "https://teacher-sathi.online";

  // Strip leading /en or /hi if present to get clean route path
  const cleanPath = pathname.replace(/^\/(en|hi)(?=\/|$)/, "") || "";

  const enUrl = `${baseUrl}/en${cleanPath}`;
  const hiUrl = `${baseUrl}/hi${cleanPath}`;
  const currentUrl = `${baseUrl}${pathname}`;

  return (
    <>
      <link rel="canonical" href={currentUrl} />
      <link rel="alternate" hrefLang="en" href={enUrl} />
      <link rel="alternate" hrefLang="hi" href={hiUrl} />
      <link rel="alternate" hrefLang="x-default" href={enUrl} />
    </>
  );
}
