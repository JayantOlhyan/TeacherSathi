export interface SvgSanitizeResult {
  isValid: boolean;
  sanitizedSvg: string;
  threatsDetected: string[];
}

const FORBIDDEN_TAGS = [
  'script',
  'foreignobject',
  'iframe',
  'embed',
  'object',
  'applet',
  'meta',
  'link',
  'base',
];

/**
 * Strict SVG sanitizer protecting educational smartboard presentations and media assets
 * against stored XSS, script injection, and XML external entity (XXE) vulnerabilities.
 */
export function sanitizeSvg(rawSvg: string): SvgSanitizeResult {
  const threats: string[] = [];
  let content = rawSvg;

  // 1. Check for XML External Entity (XXE) / DOCTYPE threats
  if (/<!entity/i.test(content)) {
    threats.push('XML External Entity (XXE) declaration detected');
    content = content.replace(/<!entity[\s\S]*?>/gi, '');
  }
  if (/<!doctype[\s\S]*?\[[\s\S]*?\]>/i.test(content)) {
    threats.push('Internal DTD subset declaration detected');
    content = content.replace(/<!doctype[\s\S]*?\[[\s\S]*?\]>/gi, '');
  }

  // 2. Strip dangerous elements entirely
  for (const tag of FORBIDDEN_TAGS) {
    const regex = new RegExp(`<${tag}[^>]*?>[\\s\\S]*?<\\/${tag}>|<${tag}[^>]*?\\/?>`, 'gi');
    if (regex.test(content)) {
      threats.push(`Dangerous SVG tag <${tag}> detected and stripped`);
      content = content.replace(regex, '');
    }
  }

  // 3. Strip inline event handlers (onload, onerror, onclick, onmouseover, etc.)
  const eventHandlerRegex = /\s+(on[a-zA-Z]+)\s*=\s*(["'][^"']*["']|[^\s>]+)/gi;
  if (eventHandlerRegex.test(content)) {
    threats.push('Inline JavaScript event handler detected and stripped');
    content = content.replace(eventHandlerRegex, '');
  }

  // 4. Strip javascript: and data: URIs in href and xlink:href attributes
  const jsHrefRegex = /(href|xlink:href)\s*=\s*["']\s*(javascript:|data:(?!image\/)):?[^"']*["']/gi;
  if (jsHrefRegex.test(content)) {
    threats.push('Malicious URI scheme in href detected and stripped');
    content = content.replace(jsHrefRegex, '$1="#"');
  }

  // 5. Verify basic SVG structure remains
  const hasSvgTag = /<svg[\s\S]*?>[\s\S]*?<\/svg>/i.test(content);
  const isValid = hasSvgTag && (threats.length === 0 || content.trim().length > 0);

  return {
    isValid,
    sanitizedSvg: content,
    threatsDetected: threats,
  };
}

/**
 * Boolean validator checking whether raw SVG contains any malicious vectors.
 */
export function isSvgClean(rawSvg: string): boolean {
  const result = sanitizeSvg(rawSvg);
  return result.threatsDetected.length === 0 && result.isValid;
}
