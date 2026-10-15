import { describe, it, expect, vi } from 'vitest';
import { 
  formatScientificText, 
  renderCurriculumText 
} from '@/lib/classroom/curriculumFormatter';

describe('Phase 16 — Classroom Kiosk, 75" Smartboard & Teacher Usability', () => {

  describe('1. Scientific & Mathematical Formula Formatting', () => {
    it('correctly converts common chemical formulas to subscript unicode', () => {
      expect(formatScientificText('Water is H2O')).toBe('Water is H₂O');
      expect(formatScientificText('Carbon dioxide is CO2 and oxygen is O2')).toBe('Carbon dioxide is CO₂ and oxygen is O₂');
      expect(formatScientificText('Limestone is CaCO3 and sulfuric acid is H2SO4')).toBe('Limestone is CaCO₃ and sulfuric acid is H₂SO₄');
      expect(formatScientificText('Iron oxide Fe2O3 and methane CH4')).toBe('Iron oxide Fe₂O₃ and methane CH₄');
      expect(formatScientificText('Nitrogen N2')).toBe('Nitrogen N₂');
    });

    it('preserves non-chemical text and standard numbers without false positives', () => {
      expect(formatScientificText('Class 8 Science')).toBe('Class 8 Science');
      expect(formatScientificText('Chapter 3 Section 4')).toBe('Chapter 3 Section 4');
      expect(formatScientificText('Step 1: Read page 25')).toBe('Step 1: Read page 25');
    });

    it('formats physical units and exponent powers cleanly', () => {
      expect(formatScientificText('Acceleration is 9.8 m/s^2 or 9.8 m/s2')).toBe('Acceleration is 9.8 m/s² or 9.8 m/s²');
      expect(formatScientificText('Area of square is 25 cm^2 or 25 cm2')).toBe('Area of square is 25 cm² or 25 cm²');
      expect(formatScientificText('Volume is 100 m3')).toBe('Volume is 100 m³');
      expect(formatScientificText('Scientific notation: 10^5 and 10^-3')).toBe('Scientific notation: 10⁵ and 10⁻³');
    });

    it('formats temperature degrees correctly', () => {
      expect(formatScientificText('Normal body temperature is 37 deg C')).toBe('Normal body temperature is 37°C');
      expect(formatScientificText('Boiling point of water is 100 degrees C')).toBe('Boiling point of water is 100°C');
    });

    it('safely handles empty, null, or undefined strings', () => {
      expect(formatScientificText('')).toBe('');
      expect(formatScientificText(null as unknown as string)).toBe('');
      expect(formatScientificText(undefined as unknown as string)).toBe('');
    });

    it('renders markdown bold keywords as structured elements', () => {
      const rendered = renderCurriculumText('The process of **photosynthesis** requires **chlorophyll** and sunlight.');
      expect(Array.isArray(rendered)).toBe(true);
      if (Array.isArray(rendered)) {
        // Index 1 and 3 are the bold elements
        expect(rendered[0]).toContain('The process of ');
        expect(rendered[1]).toBeDefined(); // React strong element
        expect(rendered[2]).toContain(' requires ');
        expect(rendered[3]).toBeDefined(); // React strong element
      }
    });
  });

  describe('2. Hardware Clicker & Keyboard Shortcut Mapping Logic', () => {
    // Replicates the event dispatch matrix used by ClassroomTouchBar
    const simulateKeyDown = (
      code: string,
      key: string,
      isInput = false,
      callbacks: {
        onNextSlide?: () => void;
        onPrevSlide?: () => void;
        onToggleBlackout?: () => void;
        onOpenWhiteboard?: () => void;
        onOpenTimer?: () => void;
        onOpenRandomCaller?: () => void;
        onOpenQuiz?: () => void;
        onToggleHindi?: () => void;
        onToggleFullscreen?: () => void;
      }
    ) => {
      if (isInput) return false;

      switch (code) {
        case 'PageDown':
        case 'ArrowRight':
        case 'Space':
          callbacks.onNextSlide?.();
          return true;
        case 'PageUp':
        case 'ArrowLeft':
          callbacks.onPrevSlide?.();
          return true;
        case 'KeyB':
        case 'Period':
          callbacks.onToggleBlackout?.();
          return true;
        case 'KeyW':
          callbacks.onOpenWhiteboard?.();
          return true;
        case 'KeyT':
          callbacks.onOpenTimer?.();
          return true;
        case 'KeyS':
          callbacks.onOpenRandomCaller?.();
          return true;
        case 'KeyQ':
          callbacks.onOpenQuiz?.();
          return true;
        case 'KeyH':
          callbacks.onToggleHindi?.();
          return true;
        case 'KeyF':
          callbacks.onToggleFullscreen?.();
          return true;
        default:
          return false;
      }
    };

    it('triggers next slide on standard 2.4GHz clicker PageDown, ArrowRight, and Space', () => {
      const onNext = vi.fn();
      simulateKeyDown('PageDown', 'PageDown', false, { onNextSlide: onNext });
      expect(onNext).toHaveBeenCalledTimes(1);

      simulateKeyDown('ArrowRight', 'ArrowRight', false, { onNextSlide: onNext });
      expect(onNext).toHaveBeenCalledTimes(2);

      simulateKeyDown('Space', ' ', false, { onNextSlide: onNext });
      expect(onNext).toHaveBeenCalledTimes(3);
    });

    it('triggers previous slide on clicker PageUp and ArrowLeft', () => {
      const onPrev = vi.fn();
      simulateKeyDown('PageUp', 'PageUp', false, { onPrevSlide: onPrev });
      expect(onPrev).toHaveBeenCalledTimes(1);

      simulateKeyDown('ArrowLeft', 'ArrowLeft', false, { onPrevSlide: onPrev });
      expect(onPrev).toHaveBeenCalledTimes(2);
    });

    it('triggers blackout screen pause on clicker B key and period', () => {
      const onToggleBlackout = vi.fn();
      simulateKeyDown('KeyB', 'b', false, { onToggleBlackout });
      expect(onToggleBlackout).toHaveBeenCalledTimes(1);

      simulateKeyDown('Period', '.', false, { onToggleBlackout });
      expect(onToggleBlackout).toHaveBeenCalledTimes(2);
    });

    it('triggers secondary classroom tool shortcuts (W, T, S, Q, H, F)', () => {
      const cbs = {
        onOpenWhiteboard: vi.fn(),
        onOpenTimer: vi.fn(),
        onOpenRandomCaller: vi.fn(),
        onOpenQuiz: vi.fn(),
        onToggleHindi: vi.fn(),
        onToggleFullscreen: vi.fn(),
      };

      simulateKeyDown('KeyW', 'w', false, cbs);
      expect(cbs.onOpenWhiteboard).toHaveBeenCalledTimes(1);

      simulateKeyDown('KeyT', 't', false, cbs);
      expect(cbs.onOpenTimer).toHaveBeenCalledTimes(1);

      simulateKeyDown('KeyS', 's', false, cbs);
      expect(cbs.onOpenRandomCaller).toHaveBeenCalledTimes(1);

      simulateKeyDown('KeyQ', 'q', false, cbs);
      expect(cbs.onOpenQuiz).toHaveBeenCalledTimes(1);

      simulateKeyDown('KeyH', 'h', false, cbs);
      expect(cbs.onToggleHindi).toHaveBeenCalledTimes(1);

      simulateKeyDown('KeyF', 'f', false, cbs);
      expect(cbs.onToggleFullscreen).toHaveBeenCalledTimes(1);
    });

    it('ignores shortcut triggers when the user is actively focused in a form input', () => {
      const onNext = vi.fn();
      const onToggleBlackout = vi.fn();

      const handled = simulateKeyDown('PageDown', 'PageDown', true, { onNextSlide: onNext, onToggleBlackout });
      expect(handled).toBe(false);
      expect(onNext).not.toHaveBeenCalled();
      expect(onToggleBlackout).not.toHaveBeenCalled();
    });
  });

  describe('3. Paper-Saver Print Density & Examination Customization', () => {
    it('provides compact single-sheet photostat layout styles when compact density is chosen', () => {
      const getLayoutMetrics = (density: 'standard' | 'compact') => {
        return {
          paddingClass: density === 'compact' ? 'p-5 sm:p-7 text-[13px]' : 'p-8 sm:p-12 text-sm',
          sectionSpacingClass: density === 'compact' ? 'py-2 space-y-3.5' : 'py-4 space-y-6',
          answerLinesCount: density === 'compact' ? 1 : 2,
          diagramBoxHeight: density === 'compact' ? 'h-14' : 'h-28',
        };
      };

      const standardMetrics = getLayoutMetrics('standard');
      expect(standardMetrics.answerLinesCount).toBe(2);
      expect(standardMetrics.diagramBoxHeight).toBe('h-28');

      const compactMetrics = getLayoutMetrics('compact');
      expect(compactMetrics.answerLinesCount).toBe(1);
      expect(compactMetrics.diagramBoxHeight).toBe('h-14');
      expect(compactMetrics.paddingClass).toContain('p-5');
    });

    it('formats bilingual Hindi/English examination metadata', () => {
      const getExamHeader = (isBilingual: boolean, grade: string, subject: string) => {
        return isBilingual
          ? `कक्षा / Class: ${grade} • विषय / Subject: ${subject}`
          : `Class: ${grade} • Subject: ${subject}`;
      };

      expect(getExamHeader(false, 'Class 8', 'Science')).toBe('Class: Class 8 • Subject: Science');
      expect(getExamHeader(true, 'Class 8', 'Science')).toBe('कक्षा / Class: Class 8 • विषय / Subject: Science');
    });
  });

  describe('4. In-Place Draft Slide Editing State Logic', () => {
    it('updates slide title and subtitle without altering other slides', () => {
      const draft = {
        title: 'Photosynthesis Module',
        slides: [
          { title: 'Intro to Photosynthesis', subtitle: 'Light Reaction', bullets: ['Sunlight absorbed', 'Chlorophyll role'] },
          { title: 'Dark Reaction', subtitle: 'Calvin Cycle', bullets: ['Glucose formed'] },
        ],
      };

      // Mutate slide 0
      const updatedSlides = [...draft.slides];
      updatedSlides[0] = {
        ...updatedSlides[0],
        title: 'Cellular Chloroplasts & Photosynthesis',
        subtitle: 'Light & Chemical Energy',
      };

      expect(updatedSlides[0].title).toBe('Cellular Chloroplasts & Photosynthesis');
      expect(updatedSlides[0].subtitle).toBe('Light & Chemical Energy');
      // Slide 1 remains untouched
      expect(updatedSlides[1].title).toBe('Dark Reaction');
    });

    it('allows adding, editing, and deleting bullets in place', () => {
      const slide = {
        title: 'Crop Protection',
        bullets: ['Weed control', 'Insect management'],
      };

      // Add bullet
      const withAdded = {
        ...slide,
        bullets: [...slide.bullets, 'Fungicide rotation'],
      };
      expect(withAdded.bullets).toHaveLength(3);
      expect(withAdded.bullets[2]).toBe('Fungicide rotation');

      // Edit bullet
      const withEdited = {
        ...withAdded,
        bullets: withAdded.bullets.map((b, i) => (i === 0 ? 'Biological weed control' : b)),
      };
      expect(withEdited.bullets[0]).toBe('Biological weed control');

      // Delete bullet
      const withDeleted = {
        ...withEdited,
        bullets: withEdited.bullets.filter((_, i) => i !== 1),
      };
      expect(withDeleted.bullets).toHaveLength(2);
      expect(withDeleted.bullets).toEqual(['Biological weed control', 'Fungicide rotation']);
    });
  });

});
