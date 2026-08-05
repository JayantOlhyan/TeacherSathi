/**
 * Phase 5 — Smart Activity Detection Engine
 * Tracks dynamic classroom interactions to auto-sustain sessions without rigid timeouts.
 */

export interface ActivitySignal {
  type: "whiteboard" | "ppt" | "pdf_scroll" | "video_playing" | "quiz_active" | "ai_assistant" | "pointer_movement";
  weight: number;
  timestamp: number;
}

class SmartActivityDetector {
  private score: number = 100; // Starts at 100 (Full activity)
  private readonly decayRate: number = 2; // Decays 2 points per 10 seconds if idle
  private readonly threshold: number = 30; // Threshold score to maintain session active
  private listeners: ((score: number, isAboveThreshold: boolean) => void)[] = [];

  constructor() {
    if (typeof window !== "undefined") {
      this.attachDOMListeners();
      this.startDecayLoop();
    }
  }

  private attachDOMListeners() {
    const recordPointer = () => this.recordSignal("pointer_movement", 5);
    const recordScroll = () => this.recordSignal("pdf_scroll", 10);

    window.addEventListener("mousemove", recordPointer, { passive: true });
    window.addEventListener("touchstart", recordPointer, { passive: true });
    window.addEventListener("scroll", recordScroll, { passive: true });
    window.addEventListener("keydown", recordPointer, { passive: true });
  }

  public recordSignal(type: ActivitySignal["type"], weight: number = 15) {
    this.score = Math.min(100, this.score + weight);
    this.notify();
  }

  public getScore(): number {
    return Math.round(this.score);
  }

  public isSessionActive(): boolean {
    return this.score >= this.threshold;
  }

  public subscribe(callback: (score: number, isAboveThreshold: boolean) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback);
    };
  }

  private notify() {
    const isActive = this.isSessionActive();
    this.listeners.forEach((cb) => cb(this.score, isActive));
  }

  private startDecayLoop() {
    setInterval(() => {
      this.score = Math.max(0, this.score - this.decayRate);
      this.notify();
    }, 10000);
  }
}

export const activityDetector = new SmartActivityDetector();
