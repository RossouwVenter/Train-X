import { z } from "zod";

// ── Auth ───────────────────────────────────────────────

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["COACH", "ATHLETE"]),
  coachId: z.string().optional(),
});

// ── Training Plans ─────────────────────────────────────

export const trainingPlanSchema = z.object({
  name: z.string().min(1, "Plan name is required"),
  description: z.string().optional(),
  weekStartDate: z.coerce.date({ required_error: "Week start date is required" }),
  athleteId: z.string().min(1, "Athlete ID is required"),
});

export const sessionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  dayOfWeek: z.number().int().min(0).max(6),
  type: z.string().min(1, "Session type is required"),
  notes: z.string().optional(),
});

export const exerciseSchema = z.object({
  name: z.string().min(1, "Exercise name is required"),
  sets: z.number().int().min(1, "At least 1 set required"),
  reps: z.number().int().min(1, "At least 1 rep required"),
  weight: z.number().optional(),
  duration: z.number().int().optional(),
  restPeriod: z.number().int().optional(),
  notes: z.string().optional(),
});

// ── Logging & Feedback ─────────────────────────────────

export const sessionLogSchema = z.object({
  sessionId: z.string().min(1, "Session ID is required"),
  rpe: z.number().int().min(1).max(10).optional(),
  notes: z.string().optional(),
  mood: z.enum(["GREAT", "GOOD", "OKAY", "TOUGH", "TERRIBLE"]).optional(),
});

export const feedbackSchema = z.object({
  content: z.string().min(1, "Feedback content is required"),
  sessionLogId: z.string().min(1, "Session log ID is required"),
});

// ── Type exports ───────────────────────────────────────

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type TrainingPlanInput = z.infer<typeof trainingPlanSchema>;
export type SessionInput = z.infer<typeof sessionSchema>;
export type ExerciseInput = z.infer<typeof exerciseSchema>;
export type SessionLogInput = z.infer<typeof sessionLogSchema>;
export type FeedbackInput = z.infer<typeof feedbackSchema>;
