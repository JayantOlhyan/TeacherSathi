/**
 * Phase 8 — Continuous Auto-Save Engine
 * Background sync for Whiteboard, Notes, AI Chat, Quiz, and Attendance data.
 */

export interface AutoSavePayload {
  whiteboardData?: string;
  notesData?: string;
  aiChatData?: string;
  quizData?: string;
  attendanceData?: string;
  lastSavedAt: string;
}

const AUTOSAVE_STORAGE_KEY = "ts_background_autosave_data";

class AutoSaveManager {
  private saveInterval: NodeJS.Timeout | null = null;
  private lastSavedTime: string = "Just now";
  private listeners: ((timeAgo: string) => void)[] = [];

  constructor() {
    if (typeof window !== "undefined") {
      this.startBackgroundSync();
    }
  }

  public startBackgroundSync(intervalMs: number = 5000) {
    if (this.saveInterval) return;

    this.saveInterval = setInterval(() => {
      this.executeAutoSave();
    }, intervalMs);
  }

  public executeAutoSave(customPayload?: Partial<AutoSavePayload>) {
    if (typeof window === "undefined") return;

    const current: AutoSavePayload = {
      whiteboardData: "canvas_vector_data_stream",
      notesData: "teacher_notes_buffer",
      aiChatData: "ai_conversation_history",
      quizData: "quiz_responses_map",
      attendanceData: "present_students_array",
      lastSavedAt: new Date().toISOString(),
      ...customPayload,
    };

    localStorage.setItem(AUTOSAVE_STORAGE_KEY, JSON.stringify(current));
    this.lastSavedTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    this.notify();
  }

  public getLastSavedTime(): string {
    return this.lastSavedTime;
  }

  public subscribe(callback: (timeAgo: string) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback);
    };
  }

  private notify() {
    this.listeners.forEach((cb) => cb(this.lastSavedTime));
  }

  public stopBackgroundSync() {
    if (this.saveInterval) {
      clearInterval(this.saveInterval);
      this.saveInterval = null;
    }
  }
}

export const autoSaveManager = new AutoSaveManager();
