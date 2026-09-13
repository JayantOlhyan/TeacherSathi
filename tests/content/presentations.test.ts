import { describe, it, expect } from 'vitest';
import { contentValidator } from '@/lib/services/contentValidator';
import { PresentationContentSchema } from '@/lib/validations/resources';

describe('Smartboard Presentation Engine & Readability (Section 2, 7, 8)', () => {
  it('validates all 7 polymorphic slide types correctly', () => {
    const validPresentation = {
      title: 'NCERT Class 8 Crop Production',
      theme: 'LIGHT' as const,
      slides: [
        {
          type: 'TITLE' as const,
          title: 'Crop Production and Management',
          subtitle: 'NCERT Class 8 Science • Chapter 1',
        },
        {
          type: 'CONTENT' as const,
          title: 'Agricultural Practices',
          bullets: ['Preparation of Soil', 'Sowing of Seeds', 'Adding Manure', 'Irrigation'],
        },
        {
          type: 'IMAGE' as const,
          title: 'Modern Drip Irrigation System',
          image_url: 'https://cdn.teachersathi.in/irrigation.png',
          body: 'Drop by drop water delivery directly at roots.',
        },
        {
          type: 'DIAGRAM' as const,
          title: 'Nitrogen Cycle',
          diagram_code: 'graph TD; N2-->Bacteria; Bacteria-->Soil; Soil-->Plants;',
        },
        {
          type: 'QUESTION' as const,
          title: 'Quick Formative Check',
          question_text: 'Which crop is sown in the rainy season?',
          question_options: ['Wheat', 'Gram', 'Paddy (Kharif)', 'Mustard'],
          correct_option_index: 2,
        },
        {
          type: 'ACTIVITY' as const,
          title: 'Think-Pair-Share on Water Conservation',
          activity_prompt: 'Discuss why drip irrigation saves 70% water over flood irrigation.',
        },
        {
          type: 'SUMMARY' as const,
          title: 'Chapter 1 Summary',
          bullets: ['Kharif vs Rabi', 'Organic Manure Benefits', 'Harvesting & Silos'],
        },
      ],
    };

    const parseResult = PresentationContentSchema.safeParse(validPresentation);
    expect(parseResult.success).toBe(true);

    const report = contentValidator.validateContent('PRESENTATION', validPresentation, 'en');
    expect(report.status).toBe('PASSED');
    expect(report.score).toBeGreaterThanOrEqual(90);
    expect(report.errors).toHaveLength(0);
  });

  it('detects readability issues when slides exceed recommended word count', () => {
    const wordyPresentation = {
      title: 'Wordy Presentation',
      slides: [
        {
          type: 'CONTENT' as const,
          title: 'Extremely Overcrowded Slide',
          body: 'This is an excessively long block of text that is not suitable for a 75-inch classroom smartboard because students sitting in the fifth row cannot read small paragraphs. Teachers should keep text to under sixty words per slide so that everyone in the classroom can clearly read and absorb the core concepts without eye strain or cognitive overload.',
          bullets: [
            'First bullet point',
            'Second bullet point',
            'Third bullet point',
            'Fourth bullet point',
            'Fifth bullet point',
            'Sixth bullet point (violates 5-bullet rule)',
            'Seventh bullet point',
          ],
        },
      ],
    };

    const report = contentValidator.validateContent('PRESENTATION', wordyPresentation, 'en');
    expect(report.status).toBe('WARNING');
    expect(report.warnings.length).toBeGreaterThanOrEqual(1);
    expect(report.score).toBeLessThan(100);
  });

  it('fails validation when a QUESTION slide lacks 4 options or question text', () => {
    const invalidQuestion = {
      title: 'Broken Quiz Slide',
      slides: [
        {
          type: 'QUESTION' as const,
          title: 'Incomplete Question',
          question_text: 'Which is an organic fertiliser?',
          question_options: ['Manure', 'Urea'], // Missing 2 options
          correct_option_index: 0,
        },
      ],
    };

    const report = contentValidator.validateContent('PRESENTATION', invalidQuestion, 'en');
    expect(report.status).toBe('FAILED');
    expect(report.errors.length).toBeGreaterThan(0);
    expect(report.score).toBeLessThan(80);
  });

  it('enforces Hindi Devanagari script presence when language is set to hi', () => {
    const nonHindiContent = {
      title: 'Only English Text Here',
      slides: [
        {
          type: 'CONTENT' as const,
          title: 'English Title',
          body: 'This slide claims to be Hindi but contains zero Devanagari characters.',
        },
      ],
    };

    const report = contentValidator.validateContent('PRESENTATION', nonHindiContent, 'hi');
    expect(report.warnings.some((w) => w.code === 'HINDI_SCRIPT_MISSING')).toBe(true);

    const hindiContent = {
      title: 'फसल उत्पादन एवं प्रबंध',
      slides: [
        {
          type: 'CONTENT' as const,
          title: 'कृषि पद्धतियाँ',
          bullets: ['मिट्टी तैयार करना', 'बुआई', 'खाद एवं उर्वरक देना', 'सिंचाई'],
        },
      ],
    };

    const validHindiReport = contentValidator.validateContent('PRESENTATION', hindiContent, 'hi');
    expect(validHindiReport.warnings.some((w) => w.code === 'HINDI_SCRIPT_MISSING')).toBe(false);
  });
});
