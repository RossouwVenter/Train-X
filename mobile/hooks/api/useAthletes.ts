import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { AthleteWithProfile, ApiResponse } from "@shared/types";

export const athleteKeys = {
  all: ["athletes"] as const,
  detail: (id: string) => ["athletes", id] as const,
};

export function useAthletes() {
  return useQuery({
    queryKey: athleteKeys.all,
    queryFn: () => api.get<ApiResponse<AthleteWithProfile[]>>("/api/athletes"),
    select: (res) => res.data,
  });
}

export function useAthlete(id: string | undefined) {
  return useQuery({
    queryKey: athleteKeys.detail(id!),
    queryFn: () => api.get<ApiResponse<AthleteWithProfile[]>>("/api/athletes"),
    select: (res) => res.data.find((a) => a.id === id) ?? null,
    enabled: !!id,
  });
}
