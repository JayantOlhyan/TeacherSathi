export interface ClassroomSession {
  sessionId: string;
  teacherId: string;
  teacherName: string;
  boardId: string;
  roomName: string;
  subject: string;
  grade: string;
  startTime: string;
  durationMinutes: number;
  status: "active" | "grace_period" | "terminated";
}

const SESSION_STORAGE_KEY = "ts_active_classroom_session";

export const getClassroomSession = (): ClassroomSession | null => {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(SESSION_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const startClassroomSession = (
  subject: string = "Class 8 Science",
  durationMinutes: number = 45,
  boardId: string = "Board-001",
  roomName: string = "Room 203"
): ClassroomSession => {
  const teacherName = typeof window !== "undefined" 
    ? localStorage.getItem("last_sathi_teacher_name") || "Teacher Anita"
    : "Teacher Anita";

  const session: ClassroomSession = {
    sessionId: `sess_${Math.random().toString(36).substring(2, 9)}`,
    teacherId: `usr_${Math.random().toString(36).substring(2, 8)}`,
    teacherName,
    boardId,
    roomName,
    subject,
    grade: "Class 8",
    startTime: new Date().toISOString(),
    durationMinutes,
    status: "active",
  };

  if (typeof window !== "undefined") {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  }
  return session;
};

export const terminateClassroomSession = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(SESSION_STORAGE_KEY);
  }
};
