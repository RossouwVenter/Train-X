import { useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import {
  ArrowLeft,
  Clock,
  Dumbbell,
  CheckCircle,
} from "lucide-react-native";
import { Badge } from "@/components/ui/Badge";
import { ExerciseCard } from "@/components/session/ExerciseCard";
import { CompletionSheet } from "@/components/session/CompletionSheet";
import { FeedbackSection } from "@/components/session/FeedbackSection";
import { SkeletonCard } from "@/components/ui/SkeletonCard";
import { AnimatedListItem } from "@/components/ui/AnimatedListItem";
import { HapticPressable } from "@/components/ui/HapticPressable";
import { usePlan, useWeekSessionLogs } from "@/hooks/api";
import { useLogSession } from "@/hooks/api/useSessions";
import { useAuth } from "@/hooks/useAuth";
import type { Mood, PlanSession } from "@shared/types";

export default function SessionDetailScreen() {
  const { id: planId, sessionId } = useLocalSearchParams<{
    id: string;
    sessionId: string;
  }>();
  const router = useRouter();
  const { user } = useAuth();
  const { data: plan, isLoading } = usePlan(planId);
  const { data: logs } = useWeekSessionLogs(user?.id, undefined);
  const logSession = useLogSession();
  const [sheetVisible, setSheetVisible] = useState(false);

  const session = plan?.sessions?.find((s) => s.id === sessionId);
  const exercises = session?.exercises ?? [];

  // Check if this session is already completed
  const sessionLog = logs?.find((l) => l.sessionId === sessionId);
  const isCompleted = !!sessionLog;

  const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  function handleComplete(data: { rpe: number; mood: Mood | null; notes: string }) {
    logSession.mutate(
      {
        sessionId: sessionId!,
        rpe: data.rpe,
        mood: data.mood ?? undefined,
        notes: data.notes || undefined,
      },
      {
        onSuccess: () => setSheetVisible(false),
      }
    );
  }

  function typeBadgeVariant(
    type: string
  ): "info" | "warning" | "success" | "default" {
    const t = type.toLowerCase();
    if (t.includes("strength") || t.includes("weight")) return "info";
    if (t.includes("cardio") || t.includes("conditioning")) return "warning";
    if (t.includes("recovery") || t.includes("rest")) return "success";
    return "default";
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <SafeAreaView className="flex-1 bg-[#0a0a0a]">
        {/* Header */}
        <View className="flex-row items-center px-5 pt-2 pb-4">
          <Pressable
            onPress={() => router.back()}
            hitSlop={12}
            className="mr-3 p-1"
          >
            <ArrowLeft size={24} color="#fff" />
          </Pressable>
          <Text className="text-lg font-bold text-white flex-1" numberOfLines={1}>
            Session Details
          </Text>
        </View>

        {isLoading || !session ? (
          <View className="px-5">
            <SkeletonCard />
            <SkeletonCard />
          </View>
        ) : (
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
          >
            {/* Session info card */}
            <View className="rounded-xl bg-neutral-900 p-4 mb-4">
              <View className="flex-row items-center mb-2">
                <Text className="text-xs font-medium text-gray-500 mr-2">
                  {DAY_LABELS[session.dayOfWeek - 1]}
                </Text>
                <Badge
                  label={session.type}
                  variant={typeBadgeVariant(session.type)}
                />
              </View>
              <Text className="text-xl font-bold text-white">
                {session.title}
              </Text>

              {session.notes && (
                <Text className="text-sm text-gray-400 mt-2 leading-5">
                  {session.notes}
                </Text>
              )}

              <View className="flex-row items-center mt-3">
                <Dumbbell size={14} color="#6b7280" />
                <Text className="text-xs text-gray-500 ml-1">
                  {exercises.length}{" "}
                  {exercises.length === 1 ? "exercise" : "exercises"}
                </Text>
              </View>
            </View>

            {/* Exercises */}
            <Text className="text-sm font-semibold text-gray-400 mb-2 ml-1">
              EXERCISES
            </Text>
            <View className="rounded-xl bg-neutral-900 px-4">
              {exercises.map((ex, i) => (
                <AnimatedListItem key={ex.id} index={i}>
                  <ExerciseCard
                    exercise={ex}
                    index={i}
                  />
                </AnimatedListItem>
              ))}
            </View>

            {/* Completed state */}
            {isCompleted && sessionLog && (
              <View className="rounded-xl bg-green-900/30 border border-green-800 p-4 mt-4">
                <View className="flex-row items-center mb-2">
                  <CheckCircle size={18} color="#22c55e" />
                  <Text className="text-green-400 font-semibold ml-2">
                    Completed
                  </Text>
                </View>
                <View className="flex-row items-center flex-wrap gap-2">
                  {sessionLog.rpe && (
                    <Badge label={`RPE ${sessionLog.rpe}`} variant="warning" />
                  )}
                  {sessionLog.mood && (
                    <Badge label={sessionLog.mood} variant="info" />
                  )}
                  <Text className="text-xs text-gray-500">
                    {new Date(sessionLog.completedAt).toLocaleDateString()}
                  </Text>
                </View>
                {sessionLog.notes && (
                  <Text className="text-sm text-gray-400 mt-2">
                    {sessionLog.notes}
                  </Text>
                )}
              </View>
            )}

            {/* Feedback section — show when completed */}
            {isCompleted && sessionLog && (
              <FeedbackSection
                sessionLogId={sessionLog.id}
                canPost={user?.role === "COACH"}
              />
            )}
          </ScrollView>

          {/* Fixed bottom: Mark Complete button */}
          {!isCompleted && session && (
            <View className="absolute bottom-0 left-0 right-0 px-5 pb-8 pt-4 bg-[#0a0a0a]">
              <HapticPressable
                haptic="medium"
                onPress={() => setSheetVisible(true)}
                className="rounded-xl bg-blue-600 py-4 items-center"
              >
                <Text className="text-white font-bold text-base">
                  Mark as Complete
                </Text>
              </HapticPressable>
            </View>
          )}

          {/* Completion Sheet */}
          <CompletionSheet
            visible={sheetVisible}
            onClose={() => setSheetVisible(false)}
            onSubmit={handleComplete}
            isSubmitting={logSession.isPending}
            sessionTitle={session?.title ?? ""}
          />
        )}
      </SafeAreaView>
    </>
  );
}
