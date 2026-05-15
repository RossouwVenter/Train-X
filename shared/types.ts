// ── Enums ───────────────────────────────────────────────

export type Role = "COACH" | "ATHLETE";
export type PlanStatus = "DRAFT" | "ACTIVE" | "COMPLETED" | "ARCHIVED";
export type Mood = "GREAT" | "GOOD" | "OKAY" | "TOUGH" | "TERRIBLE";

// ── User ────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatarUrl?: string | null;
  createdAt: string;
}

// ── Profiles ────────────────────────────────────────────

export interface CoachProfile {
  id: string;
  userId: string;
  bio?: string | null;
  specialty?: string | null;
}

export interface AthleteProfile {
  id: string;
  userId: string;
  coachId: string;
  sport?: string | null;
  dateOfBirth?: string | null;
}

// ── Training ────────────────────────────────────────────

export interface TrainingPlan {
  id: string;
  athleteId: string;
  coachId: string;
  name: string;
  description?: string | null;
  weekStartDate: string;
  status: PlanStatus;
  sessions?: PlanSession[];
  createdAt: string;
  updatedAt: string;
}

export interface PlanSession {
  id: string;
  planId: string;
  dayOfWeek: number;
  title: string;
  type: string;
  order: number;
  notes?: string | null;
  exercises?: SessionExercise[];
}

export interface SessionExercise {
  id: string;
  sessionId: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number | null;
  duration?: number | null;
  restPeriod?: number | null;
  notes?: string | null;
  order: number;
}

// ── Logging ─────────────────────────────────────────────

export interface SessionLog {
  id: string;
  sessionId: string;
  athleteId: string;
  userId: string;
  completedAt: string;
  rpe?: number | null;
  notes?: string | null;
  mood?: Mood | null;
  createdAt: string;
}

// ── Feedback ────────────────────────────────────────────

export interface Feedback {
  id: string;
  content: string;
  userId: string;
  sessionLogId: string;
  createdAt: string;
  user?: Pick<User, "id" | "name" | "role">;
}

// ── API Responses ───────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
}

export interface ApiError {
  error: string;
  code: string;
  details?: Array<{ path: string; message: string }>;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
}

// ── Athlete with details (for coach views) ──────────────

export interface AthleteWithProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
  athleteProfile: AthleteProfile;
  lastActivity?: string | null;
}
