'use client';

import { useState, useEffect, useCallback } from 'react';

export interface TeachingContext {
  classId?: string;
  grade: string;
  gradeName: string;
  section?: string;
  subject: string;
  subjectName: string;
  chapter: string;
  chapterNumber?: number;
  chapterTitle: string;
  chapterTitleHi?: string;
  totalTopics?: number;
  completedTopics?: number;
  lastAccessedAt: string;
  currentSlide?: number;
}

export const TEACHING_CONTEXT_STORAGE_KEY = 'teachersathi_teaching_context';
export const TEACHING_CONTEXT_EVENT = 'teachersathi:teaching-context-change';

export const DEFAULT_TEACHING_CONTEXT: TeachingContext = {
  classId: 'cls-8a',
  grade: 'class-8',
  gradeName: 'Class 8',
  section: 'A',
  subject: 'science',
  subjectName: 'Science',
  chapter: 'chapter-1',
  chapterNumber: 1,
  chapterTitle: 'Crop Production and Management',
  chapterTitleHi: 'फसल उत्पादन एवं प्रबंध',
  totalTopics: 7,
  completedTopics: 4,
  lastAccessedAt: new Date().toISOString(),
  currentSlide: 1,
};

/**
 * Retrieve the active teaching context synchronously from localStorage.
 * Returns null if running on the server or if no context is stored yet.
 */
export function getTeachingContext(): TeachingContext | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(TEACHING_CONTEXT_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as TeachingContext;
  } catch (e) {
    console.error('Failed to parse teaching context from storage', e);
    return null;
  }
}

/**
 * Persist an updated teaching context into localStorage and emit an event
 * so all listening UI components (Dashboard, Sidebar, Chapter Workspace) update in sync.
 */
export function setTeachingContext(
  updates: Partial<TeachingContext> | ((prev: TeachingContext) => TeachingContext)
): TeachingContext {
  if (typeof window === 'undefined') {
    return DEFAULT_TEACHING_CONTEXT;
  }

  const current = getTeachingContext() || DEFAULT_TEACHING_CONTEXT;
  const updated: TeachingContext =
    typeof updates === 'function'
      ? updates(current)
      : {
          ...current,
          ...updates,
          lastAccessedAt: new Date().toISOString(),
        };

  try {
    localStorage.setItem(TEACHING_CONTEXT_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(TEACHING_CONTEXT_EVENT, { detail: updated }));
  } catch (e) {
    console.error('Failed to persist teaching context', e);
  }

  return updated;
}

/**
 * React hook to observe and manipulate the active teaching context.
 */
export function useTeachingContext() {
  const [context, setContextState] = useState<TeachingContext | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const initial = getTeachingContext() || DEFAULT_TEACHING_CONTEXT;
    setContextState(initial);
    setIsLoaded(true);

    const handleUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<TeachingContext>;
      if (customEvent.detail) {
        setContextState(customEvent.detail);
      } else {
        setContextState(getTeachingContext() || DEFAULT_TEACHING_CONTEXT);
      }
    };

    window.addEventListener(TEACHING_CONTEXT_EVENT, handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener(TEACHING_CONTEXT_EVENT, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const updateContext = useCallback((updates: Partial<TeachingContext>) => {
    const res = setTeachingContext(updates);
    setContextState(res);
    return res;
  }, []);

  return {
    context: context || DEFAULT_TEACHING_CONTEXT,
    isLoaded,
    updateContext,
    setContext: updateContext,
  };
}
