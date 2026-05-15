import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { TrainingPlan, ApiResponse, PlanStatus } from "@shared/types";

export const planKeys = {
  all: (athleteId: string) => ["plans", athleteId] as const,
  detail: (planId: string) => ["plan", planId] as const,
};

export function usePlans(athleteId: string | undefined) {
  return useQuery({
    queryKey: planKeys.all(athleteId!),
    queryFn: () =>
      api.get<ApiResponse<TrainingPlan[]>>(`/api/plans?athleteId=${athleteId}`),
    select: (res) => res.data,
    enabled: !!athleteId,
  });
}

export function usePlan(planId: string | undefined) {
  return useQuery({
    queryKey: planKeys.detail(planId!),
    queryFn: () => api.get<ApiResponse<TrainingPlan>>(`/api/plans/${planId}`),
    select: (res) => res.data,
    enabled: !!planId,
  });
}

interface CreatePlanInput {
  athleteId: string;
  name: string;
  description?: string;
  weekStartDate: string;
  status?: PlanStatus;
}

export function useCreatePlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreatePlanInput) =>
      api.post<ApiResponse<TrainingPlan>>("/api/plans", input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: planKeys.all(variables.athleteId),
      });
    },
  });
}

interface UpdatePlanInput {
  planId: string;
  athleteId: string;
  data: Partial<Omit<CreatePlanInput, "athleteId">>;
}

export function useUpdatePlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ planId, data }: UpdatePlanInput) =>
      api.put<ApiResponse<TrainingPlan>>(`/api/plans/${planId}`, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: planKeys.detail(variables.planId),
      });
      queryClient.invalidateQueries({
        queryKey: planKeys.all(variables.athleteId),
      });
    },
  });
}

interface DeletePlanInput {
  planId: string;
  athleteId: string;
}

export function useDeletePlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ planId }: DeletePlanInput) =>
      api.delete(`/api/plans/${planId}`),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: planKeys.all(variables.athleteId),
      });
    },
  });
}
