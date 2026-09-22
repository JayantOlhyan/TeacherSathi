"use client";

export interface StoredResourceItem {
  id: string;
  title: string;
  description?: string;
  intent: "PREPARE" | "TEACH" | "PRACTICE" | "ASSESS";
  type: string; // e.g. "LESSON_SLIDES", "WORKSHEET", "QUIZ", "ACTIVITY", "VIDEO", "TEACHER_NOTES"
  typeLabel: string;
  grade: string;
  gradeName: string;
  subject: string;
  subjectName: string;
  chapter: string;
  chapterName: string;
  duration?: string; // e.g. "~30 min"
  itemCount?: string; // e.g. "12 slides" or "10 questions"
  thumbnailUrl?: string;
  lastAccessedAt?: string;
  savedAt?: string;
  teachUrl?: string;
  previewUrl?: string;
}

const RECENT_KEY = "teachersathi_recent_resources";
const SAVED_KEY = "teachersathi_saved_resources";
export const RESOURCE_STATE_EVENT = "teachersathi:resources-state-change";

function dispatchResourceEvent() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(RESOURCE_STATE_EVENT));
  }
}

export function getRecentResources(): StoredResourceItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addRecentResource(resource: StoredResourceItem): void {
  if (typeof window === "undefined") return;
  try {
    const current = getRecentResources();
    const filtered = current.filter((r) => r.id !== resource.id);
    const updated = [
      { ...resource, lastAccessedAt: new Date().toISOString() },
      ...filtered,
    ].slice(0, 20); // Keep last 20
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
    dispatchResourceEvent();
  } catch (err) {
    console.error("Failed to save recent resource:", err);
  }
}

export function getSavedResources(): StoredResourceItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SAVED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function isResourceSaved(id: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const saved = getSavedResources();
    return saved.some((r) => r.id === id);
  } catch {
    return false;
  }
}

export function toggleSaveResource(resource: StoredResourceItem): boolean {
  if (typeof window === "undefined") return false;
  try {
    const current = getSavedResources();
    const exists = current.some((r) => r.id === resource.id);
    let updated: StoredResourceItem[];
    let newState: boolean;

    if (exists) {
      updated = current.filter((r) => r.id !== resource.id);
      newState = false;
    } else {
      updated = [
        { ...resource, savedAt: new Date().toISOString() },
        ...current,
      ];
      newState = true;
    }

    localStorage.setItem(SAVED_KEY, JSON.stringify(updated));
    dispatchResourceEvent();
    return newState;
  } catch (err) {
    console.error("Failed to toggle save resource:", err);
    return false;
  }
}
