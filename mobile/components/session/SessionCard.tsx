import { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { ChevronDown, ChevronUp, CheckCircle } from "lucide-react-native";
import { Badge } from "@/components/ui/Badge";
import type { PlanSession, SessionExercise } from "@shared/types";

interface SessionCardProps {
  session: PlanSession;
  isCompleted?: boolean;
}

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function typeBadgeVariant(type: string): "info" | "warning" | "success" | "default" {
  const t = type.toLowerCase();
  if (t.includes("strength") || t.includes("weight")) return "info";
  if (t.includes("cardio") || t.includes("conditioning")) return "warning";
  if (t.includes("recovery") || t.includes("rest")) return "success";
  return "default";
}

function formatExercise(ex: SessionExercise): string {
  let detail = `${ex.sets}×${ex.reps}`;
  if (ex.weight) detail += ` @ ${ex.weight}kg`;
  return detail;
}

export function SessionCard({ session, isCompleted }: SessionCardProps) {
  const [expanded, setExpanded] = useState(false);
  const exercises = session.exercises ?? [];
  const dayLabel = DAY_LABELS[session.dayOfWeek - 1] ?? `Day ${session.dayOfWeek}`;

  return (
    <Pressable
      onPress={() => setExpanded((prev) => !prev)}
      className="rounded-xl bg-neutral-900 p-4 mb-3 active:bg-neutral-800"
    >
      {/* Header */}
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          {isCompleted && (
            <CheckCircle size={18} color="#22c55e" className="mr-2" />
          )}
          <View className="flex-1 ml-1">
            <View className="flex-row items-center">
              <Text className="text-xs font-medium text-gray-500 mr-2">
                {dayLabel}
              </Text>
              <Badge label={session.type} variant={typeBadgeVariant(session.type)} />
            </View>
            <Text className="text-base font-semibold text-white mt-1">
              {session.title}
            </Text>
          </View>
        </View>

        <View className="flex-row items-center">
          <Text className="text-xs text-gray-500 mr-2">
            {exercises.length} {exercises.length === 1 ? "exercise" : "exercises"}
          </Text>
          {expanded ? (
            <ChevronUp size={18} color="#6b7280" />
          ) : (
            <ChevronDown size={18} color="#6b7280" />
          )}
        </View>
      </View>

      {/* Expanded exercises */}
      {expanded && exercises.length > 0 && (
        <View className="mt-3 pt-3 border-t border-neutral-800">
          {exercises.map((ex) => (
            <View key={ex.id} className="flex-row items-center justify-between py-2">
              <Text className="text-sm text-gray-300 flex-1" numberOfLines={1}>
                {ex.name}
              </Text>
              <Text className="text-sm text-gray-500 ml-2">
                {formatExercise(ex)}
              </Text>
            </View>
          ))}
        </View>
      )}

      {expanded && exercises.length === 0 && (
        <View className="mt-3 pt-3 border-t border-neutral-800">
          <Text className="text-sm text-gray-500 text-center py-2">
            No exercises added yet
          </Text>
        </View>
      )}
    </Pressable>
  );
}
