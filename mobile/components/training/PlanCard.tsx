import { View, Text, Pressable } from "react-native";
import { Badge } from "@/components/ui/Badge";
import type { TrainingPlan, PlanStatus } from "@shared/types";

interface PlanCardProps {
  plan: TrainingPlan;
  onPress: () => void;
}

const statusVariant: Record<PlanStatus, "default" | "success" | "info" | "warning"> = {
  DRAFT: "default",
  ACTIVE: "success",
  COMPLETED: "info",
  ARCHIVED: "default",
};

function formatDateRange(weekStart: string): string {
  const start = new Date(weekStart);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return `${fmt(start)} – ${fmt(end)}`;
}

export function PlanCard({ plan, onPress }: PlanCardProps) {
  const sessionCount = plan.sessions?.length ?? 0;

  return (
    <Pressable
      onPress={onPress}
      className="rounded-xl bg-neutral-900 p-4 mb-3 active:bg-neutral-800"
    >
      <View className="flex-row items-start justify-between">
        <View className="flex-1 mr-3">
          <Text className="text-base font-semibold text-white" numberOfLines={1}>
            {plan.name}
          </Text>
          {plan.description ? (
            <Text className="text-sm text-gray-400 mt-1" numberOfLines={2}>
              {plan.description}
            </Text>
          ) : null}
        </View>
        <Badge label={plan.status} variant={statusVariant[plan.status]} />
      </View>

      <View className="flex-row items-center mt-3">
        <Text className="text-xs text-gray-500">
          {formatDateRange(plan.weekStartDate)}
        </Text>
        <View className="w-1 h-1 rounded-full bg-gray-600 mx-2" />
        <Text className="text-xs text-gray-500">
          {sessionCount} {sessionCount === 1 ? "session" : "sessions"}
        </Text>
      </View>
    </Pressable>
  );
}
