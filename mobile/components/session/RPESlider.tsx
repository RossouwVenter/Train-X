import { useState } from "react";
import { View, Text, Pressable } from "react-native";

interface RPESliderProps {
  value: number;
  onChange: (value: number) => void;
}

const RPE_COLORS: Record<number, string> = {
  1: "#22c55e",
  2: "#4ade80",
  3: "#86efac",
  4: "#a3e635",
  5: "#facc15",
  6: "#fbbf24",
  7: "#fb923c",
  8: "#f97316",
  9: "#ef4444",
  10: "#dc2626",
};

const RPE_LABELS: Record<number, string> = {
  1: "Very Light",
  2: "Light",
  3: "Moderate",
  4: "Somewhat Hard",
  5: "Hard",
  6: "Harder",
  7: "Very Hard",
  8: "Extremely Hard",
  9: "Near Max",
  10: "Maximum",
};

export function RPESlider({ value, onChange }: RPESliderProps) {
  return (
    <View>
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-sm font-semibold text-white">RPE</Text>
        <Text
          className="text-xs font-medium"
          style={{ color: RPE_COLORS[value] }}
        >
          {value} — {RPE_LABELS[value]}
        </Text>
      </View>

      {/* Scale */}
      <View className="flex-row items-center justify-between">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
          <Pressable
            key={n}
            onPress={() => onChange(n)}
            hitSlop={4}
            className="items-center"
          >
            <View
              className="rounded-full items-center justify-center"
              style={{
                width: n === value ? 36 : 28,
                height: n === value ? 36 : 28,
                backgroundColor:
                  n === value ? RPE_COLORS[n] : "rgba(255,255,255,0.08)",
              }}
            >
              <Text
                className="font-bold"
                style={{
                  fontSize: n === value ? 14 : 11,
                  color: n === value ? "#000" : "#6b7280",
                }}
              >
                {n}
              </Text>
            </View>
          </Pressable>
        ))}
      </View>

      {/* Min/Max labels */}
      <View className="flex-row justify-between mt-1">
        <Text className="text-[10px] text-gray-600">Easy</Text>
        <Text className="text-[10px] text-gray-600">Max Effort</Text>
      </View>
    </View>
  );
}
