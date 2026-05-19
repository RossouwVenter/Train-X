import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { ApiResponse } from "@shared/types";

export interface ProgressData {
  totalSessions: number;
  completedSessions: number;
  completionRate: number;
  avgRpe: number | null;
  mostCommonMood: string | null;
  streak: number;
  weeklyRpe: { week: string; avgRpe: number; count: number }[];
  moodCounts: Record<string, number>;
}

export const progressKeys = {
  athlete: (athleteId: string, range: string) =>
    ["progress", athleteId, range] as const,
};

export function useProgress(
  athleteId: string | undefined,
  range: "week" | "month" | "all" = "month"
) {
  return useQuery({
    queryKey: progressKeys.athlete(athleteId!, range),
    queryFn: () =>
      api.get<ApiResponse<ProgressData>>(
        `/api/progress?athleteId=${athleteId}&range=${range}`
      ),
    select: (res) => res.data,
    enabled: !!athleteId,
  });
}
