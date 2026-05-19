import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { Feedback, ApiResponse } from "@shared/types";

export const feedbackKeys = {
  forLog: (sessionLogId: string) => ["feedback", sessionLogId] as const,
};

export function useFeedback(sessionLogId: string | undefined) {
  return useQuery({
    queryKey: feedbackKeys.forLog(sessionLogId!),
    queryFn: () =>
      api.get<ApiResponse<Feedback[]>>(
        `/api/feedback?sessionLogId=${sessionLogId}`
      ),
    select: (res) => res.data,
    enabled: !!sessionLogId,
  });
}

interface SendFeedbackInput {
  sessionLogId: string;
  content: string;
}

export function useSendFeedback() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: SendFeedbackInput) =>
      api.post<ApiResponse<Feedback>>("/api/feedback", input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: feedbackKeys.forLog(variables.sessionLogId),
      });
    },
  });
}
