import React from 'react';

const SUB_DIGITS: Record<string, string> = {
  '0': '₀',
  '1': '₁',
  '2': '₂',
  '3': '₃',
  '4': '₄',
  '5': '₅',
  '6': '₆',
  '7': '₇',
  '8': '₈',
  '9': '₉',
};

const SUPER_CHARS: Record<string, string> = {
  '0': '⁰',
  '1': '¹',
  '2': '²',
  '3': '³',
  '4': '⁴',
  '5': '⁵',
  '6': '⁶',
  '7': '⁷',
  '8': '⁸',
  '9': '⁹',
  '+': '⁺',
  '-': '⁻',
};

// Common chemical element symbols (1 and 2 letters)
const ELEMENT_REGEX =
  '(?:He|Li|Be|Ne|Na|Mg|Al|Si|Cl|Ar|Ca|Sc|Ti|Cr|Mn|Fe|Co|Ni|Cu|Zn|Ga|Ge|As|Se|Br|Kr|Rb|Sr|Zr|Ag|Cd|Sn|Sb|Te|Xe|Cs|Ba|Pt|Au|Hg|Pb|Bi|Ra|Th|[BCFHIKNOPSUVWY])';

/**
 * Formats scientific and mathematical notation in raw strings:
 * - Chemical formulas (e.g., H2O -> H₂O, CO2 -> CO₂, CaCO3 -> CaCO₃, H2SO4 -> H₂SO₄)
 * - Exponents and units (e.g., m/s^2 -> m/s², cm^2 -> cm², x^2 -> x², 10^5 -> 10⁵)
 * - Degree symbols (e.g., 37 deg C -> 37°C)
 */
export function formatScientificText(input?: string | null): string {
  if (!input || typeof input !== 'string') return '';

  let formatted = input;

  // 1. Exponents with caret: x^2 -> x², 10^-3 -> 10⁻³
  formatted = formatted.replace(/\^([0-9+-]+)/g, (_, exp) => {
    return exp
      .split('')
      .map((ch: string) => SUPER_CHARS[ch] || ch)
      .join('');
  });

  // 2. Common physical units with powers (e.g., m/s2, cm2, km2, m3, cm3)
  formatted = formatted.replace(
    /\b(m\/s|km\/h|cm|mm|km|m)([23])\b/g,
    (_, unit, pow) => `${unit}${SUPER_CHARS[pow] || pow}`
  );

  // 3. Degree Celsius / Fahrenheit formatting: 37 deg C -> 37°C, 100 degrees C -> 100°C
  formatted = formatted.replace(
    /(\d+)\s*(?:deg|degrees?)\s*([CF])\b/gi,
    (_, num, unit) => `${num}°${unit.toUpperCase()}`
  );

  // 4. Chemical formulas with subscripts (e.g., H2O, CO2, O2, N2, CH4, CaCO3, Fe2O3, (NH4)2SO4)
  // Match elements or closing parentheses followed by numbers
  const chemFormulaRegex = new RegExp(
    `(\\b|(?:\\())(?:${ELEMENT_REGEX}|\\)|\\()+(?:\\d+)(?:(?:${ELEMENT_REGEX}|\\)|\\()*(?:\\d+)*)*\\b`,
    'g'
  );

  formatted = formatted.replace(chemFormulaRegex, (formula) => {
    // Within a valid chemical token, replace digits after elements or ')' with subscript unicode
    return formula.replace(
      new RegExp(`(${ELEMENT_REGEX}|\\))(\\d+)`, 'g'),
      (_, prefix, digits) => {
        const sub = digits
          .split('')
          .map((d: string) => SUB_DIGITS[d] || d)
          .join('');
        return `${prefix}${sub}`;
      }
    );
  });

  return formatted;
}

export interface RenderCurriculumOptions {
  boldClassName?: string;
}

/**
 * Renders curriculum text with:
 * - Scientific/math formula formatting (subscripts, superscripts)
 * - Markdown bold tokens (**term**) rendered as highlighted <strong> elements
 */
export function renderCurriculumText(
  text?: string | null,
  options?: RenderCurriculumOptions
): React.ReactNode {
  if (!text || typeof text !== 'string') return text || null;

  // First convert formulas
  const scientific = formatScientificText(text);

  // Check if there are markdown bold markers
  if (!scientific.includes('**')) {
    return scientific;
  }

  // Split by markdown bold: **bold text**
  const parts = scientific.split(/\*\*([^*]+)\*\*/g);

  return parts.map((part, index) => {
    // Odd indices are the captured bold texts
    if (index % 2 === 1) {
      return React.createElement(
        'strong',
        {
          key: index,
          className:
            options?.boldClassName ||
            'font-black text-amber-300 underline decoration-amber-400/40 decoration-2 underline-offset-4',
        },
        part
      );
    }
    return part;
  });
}
