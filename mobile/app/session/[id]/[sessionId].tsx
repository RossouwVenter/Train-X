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
import { SkeletonCard } from "@/components/ui/SkeletonCard";
import { usePlan } from "@/hooks/api";
import type { PlanSession } from "@shared/types";

export default function SessionDetailScreen() {
  const { id: planId, sessionId } = useLocalSearchParams<{
    id: string;
    sessionId: string;
  }>();
  const router = useRouter();
  const { data: plan, isLoading } = usePlan(planId);

  const session = plan?.sessions?.find((s) => s.id === sessionId);
  const exercises = session?.exercises ?? [];

  const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

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
                <ExerciseCard
                  key={ex.id}
                  exercise={ex}
                  index={i}
                />
              ))}
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
    </>
  );
}
