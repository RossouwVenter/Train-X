import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type {
  PlanSession,
  SessionExercise,
  SessionLog,
  ApiResponse,
  Mood,
} from "@shared/types";

export const sessionKeys = {
  week: (athleteId: string, weekStart: string) =>
    ["sessions", athleteId, weekStart] as const,
  logs: (athleteId: string, weekStart: string) =>
    ["sessionLogs", athleteId, weekStart] as const,
};

export function useWeekSessions(
  athleteId: string | undefined,
  weekStart: string | undefined
) {
  return useQuery({
    queryKey: sessionKeys.week(athleteId!, weekStart!),
    queryFn: () =>
      api.get<ApiResponse<PlanSession[]>>(
        `/api/sessions?athleteId=${athleteId}&weekStart=${weekStart}`
      ),
    select: (res) => res.data,
    enabled: !!athleteId && !!weekStart,
  });
}

export function useWeekSessionLogs(
  athleteId: string | undefined,
  weekStart: string | undefined
) {
  return useQuery({
    queryKey: sessionKeys.logs(athleteId!, weekStart!),
    queryFn: () =>
      api.get<ApiResponse<SessionLog[]>>(
        `/api/sessions/log?athleteId=${athleteId}&weekStart=${weekStart}`
      ),
    select: (res) => res.data,
    enabled: !!athleteId && !!weekStart,
  });
}

interface CreateSessionInput {
  dayOfWeek: number;
  title: string;
  type: string;
  notes?: string;
  order: number;
}

export function useCreateSession(planId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateSessionInput) =>
      api.post<ApiResponse<PlanSession>>(
        `/api/plans/${planId}/sessions`,
        input
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plan", planId] });
    },
  });
}

interface AddExerciseInput {
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  duration?: number;
  restPeriod?: number;
  notes?: string;
  order: number;
}

export function useAddExercise(planId: string, sessionId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: AddExerciseInput) =>
      api.post<ApiResponse<SessionExercise>>(
        `/api/plans/${planId}/sessions/${sessionId}/exercises`,
        input
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plan", planId] });
    },
  });
}

interface LogSessionInput {
  sessionId: string;
  rpe?: number;
  mood?: Mood;
  notes?: string;
}

export function useLogSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: LogSessionInput) =>
      api.post<ApiResponse<SessionLog>>("/api/sessions/log", input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      queryClient.invalidateQueries({ queryKey: ["sessionLogs"] });
    },
  });
}
