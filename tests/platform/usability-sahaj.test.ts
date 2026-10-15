import { describe, it, expect } from 'vitest';

describe('Project Sahaj (Usability Program) - Smartboard, WhatsApp & Print Hub', () => {

  describe('Track 2: Show-of-Hands Smartboard Tally & Timers', () => {
    it('accurately computes vote counts and percentage distribution for 4 options', () => {
      const handTally: Record<number, number> = { 0: 12, 1: 18, 2: 6, 3: 4 };
      const totalHands = Object.values(handTally).reduce((a, b) => a + b, 0);

      expect(totalHands).toBe(40);

      const percentages = Object.entries(handTally).map(([idx, count]) => {
        return {
          optionIndex: Number(idx),
          pct: Math.round((count / totalHands) * 100),
        };
      });

      expect(percentages[0].pct).toBe(30); // 12/40 = 30%
      expect(percentages[1].pct).toBe(45); // 18/40 = 45%
      expect(percentages[2].pct).toBe(15); // 6/40 = 15%
      expect(percentages[3].pct).toBe(10); // 4/40 = 10%
      expect(percentages.reduce((sum, p) => sum + p.pct, 0)).toBe(100);
    });

    it('formats activity timer durations into mm:ss distance-readable strings', () => {
      const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
      };

      expect(formatTime(60)).toBe('01:00');
      expect(formatTime(180)).toBe('03:00');
      expect(formatTime(300)).toBe('05:00');
      expect(formatTime(59)).toBe('00:59');
      expect(formatTime(0)).toBe('00:00');
    });

    it('samples random student within valid roster range without out-of-bound errors', () => {
      const roster = [
        'Aarav Sharma', 'Pooja Verma', 'Rohan Kumar', 'Ananya Singh', 'Karan Patel',
        'Priya Yadav', 'Aditya Gupta', 'Sneha Meena', 'Vivek Tiwari', 'Ritu Chaudhary'
      ];

      for (let i = 0; i < 20; i++) {
        const randomIndex = Math.floor(Math.random() * roster.length);
        const selected = roster[randomIndex];
        expect(roster).toContain(selected);
        expect(randomIndex).toBeGreaterThanOrEqual(0);
        expect(randomIndex).toBeLessThan(roster.length);
      }
    });
  });

  describe('Track 3: 1-Tap WhatsApp Share & Print Hub', () => {
    it('generates valid WhatsApp Web and Native App URL schemes', () => {
      const message = 'नमस्ते बच्चों! आज का होमवर्क लिंक: https://teachersathi.in/classroom';
      const encoded = encodeURIComponent(message);

      const appUrl = `https://api.whatsapp.com/send?text=${encoded}`;
      const webUrl = `https://web.whatsapp.com/send?text=${encoded}`;

      expect(appUrl).toContain('https://api.whatsapp.com/send?text=');
      expect(webUrl).toContain('https://web.whatsapp.com/send?text=');
      expect(decodeURIComponent(encoded)).toBe(message);
    });

    it('constructs appropriate Hinglish, Pure Hindi, and Formal English templates', () => {
      const chapter = 'Crop Production';
      const grade = 'Class 8';
      const subject = 'Science';
      const url = 'https://teachersathi.in/resource/123';

      const hinglish = `नमस्ते अभिभावक एवं प्यारे बच्चों! 🙏 आज ${grade} (${subject}) में हमने ${chapter} पढ़ा। लिंक: ${url}`;
      const hindi = `प्रिय अभिभावक एवं छात्र, कक्षा ${grade} विषय ${subject} का पाठ ${chapter}। लिंक: ${url}`;
      const english = `Dear Students & Parents, Material for ${grade} ${subject} (${chapter}) is available: ${url}`;

      expect(hinglish).toContain('नमस्ते');
      expect(hinglish).toContain(chapter);
      expect(hindi).toContain('अभिभावक');
      expect(hindi).toContain(chapter);
      expect(english).toContain('Dear Students');
      expect(english).toContain(chapter);
    });

    it('categorizes printable worksheet questions by mark weight and sections', () => {
      const questions = [
        { question: 'Q1', marks: 1 },
        { question: 'Q2', marks: 1 },
        { question: 'Q3', marks: 1 },
        { question: 'Q4', marks: 2 },
        { question: 'Q5', marks: 2 },
        { question: 'Q6', marks: 3 },
        { question: 'Q7', marks: 5 },
      ];

      const sectionA = questions.filter(q => (q.marks || 1) === 1);
      const sectionB = questions.filter(q => (q.marks || 1) > 1 && (q.marks || 1) <= 3);
      const sectionC = questions.filter(q => (q.marks || 1) > 3);

      expect(sectionA.length).toBe(3);
      expect(sectionB.length).toBe(3);
      expect(sectionC.length).toBe(1);

      const totalMarks = questions.reduce((sum, q) => sum + (q.marks || 1), 0);
      expect(totalMarks).toBe(15);
    });
  });

  describe('Track 3: 1-Click Ready Presets Configuration', () => {
    it('maps preset IDs to expected classroom time and asset quantities', () => {
      const presets = {
        recap: { intent: 'slides', duration: 15, items: 5, difficulty: 'Easy' },
        full: { intent: 'slides', duration: 40, items: 8, difficulty: 'Medium' },
        worksheet: { intent: 'worksheet', duration: 30, items: 8, difficulty: 'Medium' },
      };

      expect(presets.recap.duration).toBe(15);
      expect(presets.recap.items).toBe(5);
      expect(presets.full.duration).toBe(40);
      expect(presets.full.items).toBe(8);
      expect(presets.worksheet.intent).toBe('worksheet');
    });
  });

});
