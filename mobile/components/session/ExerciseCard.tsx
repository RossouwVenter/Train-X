import { View, Text } from "react-native";
import type { SessionExercise } from "@shared/types";

interface ExerciseCardProps {
  exercise: SessionExercise;
  /** Actual completed values (from session log), if available */
  actual?: {
    sets?: number;
    reps?: number;
    weight?: number;
  };
  index: number;
}

export function ExerciseCard({ exercise, actual, index }: ExerciseCardProps) {
  const prescribed = formatPrescribed(exercise);

  return (
    <View className="flex-row items-start py-3 border-b border-neutral-800">
      {/* Index */}
      <View className="w-7 h-7 rounded-full bg-neutral-800 items-center justify-center mr-3 mt-0.5">
        <Text className="text-xs font-bold text-gray-400">{index + 1}</Text>
      </View>

      {/* Info */}
      <View className="flex-1">
        <Text className="text-base font-medium text-white">{exercise.name}</Text>

        <View className="flex-row items-center mt-1.5">
          {/* Prescribed */}
          <View className="flex-row items-center">
            <Text className="text-xs text-gray-500 mr-1">Target:</Text>
            <Text className="text-sm text-gray-300">{prescribed}</Text>
          </View>

          {/* Actual (if logged) */}
          {actual && (
            <View className="flex-row items-center ml-4">
              <Text className="text-xs text-gray-500 mr-1">Done:</Text>
              <Text className="text-sm text-green-400">
                {formatActual(actual)}
              </Text>
            </View>
          )}
        </View>

        {/* Rest period */}
        {exercise.restPeriod && (
          <Text className="text-xs text-gray-500 mt-1">
            Rest: {exercise.restPeriod}s
          </Text>
        )}

        {/* Notes */}
        {exercise.notes && (
          <Text className="text-xs text-gray-500 mt-1 italic">
            {exercise.notes}
          </Text>
        )}
      </View>
    </View>
  );
}

function formatPrescribed(ex: SessionExercise): string {
  let s = `${ex.sets}×${ex.reps}`;
  if (ex.weight) s += ` @ ${ex.weight}kg`;
  if (ex.duration) s += ` · ${ex.duration}s`;
  return s;
}

function formatActual(actual: { sets?: number; reps?: number; weight?: number }): string {
  const parts: string[] = [];
  if (actual.sets != null && actual.reps != null) {
    parts.push(`${actual.sets}×${actual.reps}`);
  }
  if (actual.weight != null) {
    parts.push(`${actual.weight}kg`);
  }
  return parts.join(" @ ") || "—";
}
