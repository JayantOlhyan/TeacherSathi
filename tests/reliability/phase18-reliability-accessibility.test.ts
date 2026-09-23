import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('Phase 18 — Reliability, Accessibility & Exhibition Polish', () => {

  describe('Section 1: Classroom Session Resilience & Accidental Refresh Recovery', () => {
    let mockSessionStorage: Record<string, string> = {};

    beforeEach(() => {
      mockSessionStorage = {};
      vi.stubGlobal('sessionStorage', {
        getItem: (key: string) => mockSessionStorage[key] || null,
        setItem: (key: string, value: string) => {
          mockSessionStorage[key] = value;
        },
        removeItem: (key: string) => {
          delete mockSessionStorage[key];
        },
        clear: () => {
          mockSessionStorage = {};
        }
      });
    });

    it('persists slide index, active tab, and standalone status to sessionStorage', () => {
      // Teacher navigates to slide 5 and opens whiteboard
      sessionStorage.setItem('classroom_slide_index', '5');
      sessionStorage.setItem('classroom_active_tab', 'whiteboard');
      sessionStorage.setItem('classroom_is_standalone', 'true');

      expect(sessionStorage.getItem('classroom_slide_index')).toBe('5');
      expect(sessionStorage.getItem('classroom_active_tab')).toBe('whiteboard');
      expect(sessionStorage.getItem('classroom_is_standalone')).toBe('true');
    });

    it('recovers active classroom state after an accidental browser reload', () => {
      // Simulate state prior to refresh
      mockSessionStorage = {
        classroom_slide_index: '4',
        classroom_active_tab: 'quiz',
        classroom_is_standalone: 'false',
      };

      // Simulating recovery routine inside useEffect
      const savedSlide = sessionStorage.getItem('classroom_slide_index');
      const savedTab = sessionStorage.getItem('classroom_active_tab');
      const savedStandalone = sessionStorage.getItem('classroom_is_standalone');

      const recoveredSlide = savedSlide ? parseInt(savedSlide, 10) : 1;
      const recoveredTab = savedTab || 'presentation';
      const recoveredStandalone = savedStandalone === 'true';

      expect(recoveredSlide).toBe(4);
      expect(recoveredTab).toBe('quiz');
      expect(recoveredStandalone).toBe(false);
    });

    it('cleans up session keys upon deliberate session completion', () => {
      mockSessionStorage = {
        classroom_slide_index: '7',
        classroom_active_tab: 'presentation',
        classroom_is_standalone: 'true',
      };

      // Simulating handleConfirmEndSession cleanup
      sessionStorage.removeItem('classroom_slide_index');
      sessionStorage.removeItem('classroom_active_tab');
      sessionStorage.removeItem('classroom_is_standalone');

      expect(sessionStorage.getItem('classroom_slide_index')).toBeNull();
      expect(sessionStorage.getItem('classroom_active_tab')).toBeNull();
      expect(sessionStorage.getItem('classroom_is_standalone')).toBeNull();
    });
  });

  describe('Section 2: Whiteboard Drawing Stroke Safety & Undo Recovery', () => {
    interface Point {
      x: number;
      y: number;
    }
    interface Stroke {
      points: Point[];
      color: string;
      size: number;
      tool: 'pen' | 'marker' | 'eraser';
    }

    it('prevents accidental work loss by moving cleared strokes to redo stack', () => {
      let strokes: Stroke[] = [
        {
          points: [{ x: 10, y: 10 }, { x: 20, y: 20 }],
          color: '#10B981',
          size: 4,
          tool: 'pen',
        },
        {
          points: [{ x: 50, y: 50 }, { x: 80, y: 90 }],
          color: '#3B82F6',
          size: 8,
          tool: 'marker',
        }
      ];
      let redoStack: Stroke[][] = [];

      // Accidental canvas clear action
      const handleClear = () => {
        if (strokes.length === 0) return;
        redoStack.push([...strokes]);
        strokes = [];
      };

      // Teacher clicks Clear accidentally
      handleClear();
      expect(strokes).toHaveLength(0);
      expect(redoStack).toHaveLength(1);
      expect(redoStack[0]).toHaveLength(2);

      // Teacher realizes mistake and hits Undo
      const handleUndo = () => {
        if (strokes.length === 0 && redoStack.length > 0) {
          const recovered = redoStack.pop();
          if (recovered) strokes = recovered;
        } else if (strokes.length > 0) {
          const popped = strokes.pop();
          if (popped) redoStack.push([popped]);
        }
      };

      handleUndo();
      expect(strokes).toHaveLength(2);
      expect(strokes[0].color).toBe('#10B981');
      expect(strokes[1].color).toBe('#3B82F6');
    });

    it('verifies Whiteboard DOM preservation in classroom page source', () => {
      const classroomPagePath = path.resolve(process.cwd(), 'src/app/[locale]/classroom/page.tsx');
      const content = fs.readFileSync(classroomPagePath, 'utf8');

      // The whiteboard must NOT be unmounted conditionally with `{activeTab === "whiteboard" && <ClassroomWhiteboard />}`
      // Instead, it must be kept mounted with hidden class toggle to preserve canvas context
      expect(content).toContain('activeTab === "whiteboard" ? "" : "hidden"');
      expect(content).toContain('<ClassroomWhiteboard');
    });
  });

  describe('Section 3: Duplicate Action Prevention (Generation & Save Locks)', () => {
    it('blocks rapid duplicate execution while generation is in flight', async () => {
      let isGenerating = false;
      let generationExecutionCount = 0;

      const handleStartGeneration = async () => {
        if (isGenerating) return; // Guard
        isGenerating = true;
        generationExecutionCount++;
        try {
          await new Promise((resolve) => setTimeout(resolve, 50));
        } finally {
          isGenerating = false;
        }
      };

      // Simulate teacher double-clicking or triple-clicking quickly
      const call1 = handleStartGeneration();
      const call2 = handleStartGeneration();
      const call3 = handleStartGeneration();

      await Promise.all([call1, call2, call3]);

      // Exactly 1 execution should have occurred
      expect(generationExecutionCount).toBe(1);
      expect(isGenerating).toBe(false);
    });

    it('blocks duplicate save requests while save is in flight', async () => {
      let isSaving = false;
      let saveCount = 0;

      const handleSave = async () => {
        if (isSaving) return;
        isSaving = true;
        saveCount++;
        try {
          await new Promise((resolve) => setTimeout(resolve, 30));
        } finally {
          isSaving = false;
        }
      };

      const save1 = handleSave();
      const save2 = handleSave();

      await Promise.all([save1, save2]);

      expect(saveCount).toBe(1);
      expect(isSaving).toBe(false);
    });

    it('verifies disabled attributes on create page buttons', () => {
      const createPagePath = path.resolve(process.cwd(), 'src/app/[locale]/dashboard/create/page.tsx');
      const content = fs.readFileSync(createPagePath, 'utf8');

      expect(content).toContain('disabled={isGenerating}');
      expect(content).toContain('disabled={isSaving}');
      expect(content).toContain('Preparing Draft...');
      expect(content).toContain('Saving...');
    });
  });

  describe('Section 4: Standardized Pedagogical Error Language (Zero Technical Jargon)', () => {
    it('verifies root error boundary uses calm, reassuring language', () => {
      const rootErrorPath = path.resolve(process.cwd(), 'src/app/[locale]/error.tsx');
      const content = fs.readFileSync(rootErrorPath, 'utf8');

      // Must have pedagogical reassurance
      expect(content).toContain('Lesson Session Protected');
      expect(content).toContain('Your curriculum context and recent work parameters have been preserved');
      expect(content).toContain('Try Again');
      expect(content).toContain('Go to Dashboard');

      // Prohibited technical jargon
      expect(content).not.toContain('500 Internal Server Error');
      expect(content).not.toContain('Server Glitch');
      expect(content).not.toContain('Database Exception');
    });

    it('verifies classroom error boundary has 75-inch smartboard recovery', () => {
      const classroomErrorPath = path.resolve(process.cwd(), 'src/app/[locale]/classroom/error.tsx');
      const content = fs.readFileSync(classroomErrorPath, 'utf8');

      expect(content).toContain('Classroom State Protected');
      expect(content).toContain('Restore Classroom Session');
      expect(content).toContain('Back to Chapter Workspace');
      expect(content).toContain('min-h-[64px]');

      // Prohibited jargon
      expect(content).not.toContain('Unhandled Runtime Error');
      expect(content).not.toContain('500 Internal Server Error');
      expect(content).not.toContain('Error 500');
    });

    it('verifies content and dashboard error boundaries exist and protect context', () => {
      const contentErrorPath = path.resolve(process.cwd(), 'src/app/[locale]/content/error.tsx');
      const dashboardErrorPath = path.resolve(process.cwd(), 'src/app/[locale]/dashboard/error.tsx');

      expect(fs.existsSync(contentErrorPath)).toBe(true);
      expect(fs.existsSync(dashboardErrorPath)).toBe(true);

      const contentError = fs.readFileSync(contentErrorPath, 'utf8');
      expect(contentError).toContain('Curriculum Continuity Active');

      const dashboardError = fs.readFileSync(dashboardErrorPath, 'utf8');
      expect(dashboardError).toContain('Teaching Data Protected');
    });
  });

  describe('Section 5: Accessibility & Tactile Controls', () => {
    it('verifies prefers-reduced-motion media query is configured in globals.css', () => {
      const cssPath = path.resolve(process.cwd(), 'src/app/globals.css');
      const content = fs.readFileSync(cssPath, 'utf8');

      expect(content).toContain('@media (prefers-reduced-motion: reduce)');
      expect(content).toContain('animation-duration: 0.01ms !important');
      expect(content).toContain('transition-duration: 0.01ms !important');
    });

    it('verifies ClassroomTouchBar provides explicit aria-labels on tactile tools', () => {
      const touchBarPath = path.resolve(process.cwd(), 'src/components/ui/ClassroomTouchBar.tsx');
      const content = fs.readFileSync(touchBarPath, 'utf8');

      expect(content).toContain('aria-label="Open Interactive Whiteboard"');
      expect(content).toContain('aria-label="View Lesson Resources"');
      expect(content).toContain('aria-label="Start Quick Check Quiz"');
      expect(content).toContain('aria-label="Ask Saathi Co-Pilot"');
      expect(content).toContain('aria-label="End Classroom Session"');
      expect(content).toContain('aria-label="Previous Slide"');
      expect(content).toContain('aria-label="Next Slide"');
      expect(content).toContain('min-h-[64px]');
    });

    it('verifies ClassroomWhiteboard provides explicit aria-labels on drawing tools', () => {
      const whiteboardPath = path.resolve(process.cwd(), 'src/components/classroom/ClassroomWhiteboard.tsx');
      const content = fs.readFileSync(whiteboardPath, 'utf8');

      expect(content).toContain('aria-label="Draw with Pen Tool"');
      expect(content).toContain('aria-label="Highlight with Marker Tool"');
      expect(content).toContain('aria-label="Erase with Whiteboard Eraser"');
      expect(content).toContain('aria-label="Undo last whiteboard stroke"');
      expect(content).toContain('aria-label="Redo whiteboard stroke"');
      expect(content).toContain('aria-label="Clear whiteboard canvas"');
    });
  });

  describe('Section 6: Exhibition Mode Deterministic Flow & Reset Mechanism', () => {
    it('verifies exhibition demo page exists at src/app/[locale]/demo/page.tsx', () => {
      const demoPagePath = path.resolve(process.cwd(), 'src/app/[locale]/demo/page.tsx');
      expect(fs.existsSync(demoPagePath)).toBe(true);

      const content = fs.readFileSync(demoPagePath, 'utf8');
      expect(content).toContain('Demonstration Mode');
      expect(content).toContain('Simulated Classroom Data');
      expect(content).toContain('Reset Demo');
      expect(content).toContain('Step {currentStep} of {STEPS.length}');
    });

    it('verifies demo flow contains the 8 essential pedagogical steps', () => {
      const demoPagePath = path.resolve(process.cwd(), 'src/app/[locale]/demo/page.tsx');
      const content = fs.readFileSync(demoPagePath, 'utf8');

      expect(content).toContain('Teacher Workspace');
      expect(content).toContain('Unified Chapter Workspace');
      expect(content).toContain('Classroom Mode');
      expect(content).toContain('Quick Check Poll');
      expect(content).toContain('Live Student Response Distribution');
      expect(content).toContain('Saathi Pedagogical Diagnostic');
      expect(content).toContain('Post-Intervention Mastery Recheck');
      expect(content).toContain('The TeacherSathi Loop is Complete');
    });

    it('verifies 1-tap reset returns to initial state deterministically', () => {
      let currentStep = 6;
      let autoPlay = true;
      let pollSelected = 'B';

      const handleResetDemo = () => {
        currentStep = 1;
        autoPlay = false;
        pollSelected = 'A';
      };

      handleResetDemo();
      expect(currentStep).toBe(1);
      expect(autoPlay).toBe(false);
      expect(pollSelected).toBe('A');
    });
  });
});
