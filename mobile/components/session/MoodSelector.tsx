import { View, Text, Pressable } from "react-native";
import type { Mood } from "@shared/types";

interface MoodOption {
  mood: Mood;
  emoji: string;
  label: string;
}

const MOODS: MoodOption[] = [
  { mood: "GREAT", emoji: "🔥", label: "Great" },
  { mood: "GOOD", emoji: "😊", label: "Good" },
  { mood: "OKAY", emoji: "😐", label: "Okay" },
  { mood: "TOUGH", emoji: "😤", label: "Tough" },
  { mood: "TERRIBLE", emoji: "😩", label: "Terrible" },
];

interface MoodSelectorProps {
  value: Mood | null;
  onChange: (mood: Mood) => void;
}

export function MoodSelector({ value, onChange }: MoodSelectorProps) {
  return (
    <View>
      <Text className="text-sm font-semibold text-white mb-3">
        How did it feel?
      </Text>

      <View className="flex-row justify-between">
        {MOODS.map(({ mood, emoji, label }) => {
          const selected = value === mood;
          return (
            <Pressable
              key={mood}
              onPress={() => onChange(mood)}
              className="items-center"
            >
              <View
                className="rounded-xl items-center justify-center mb-1"
                style={{
                  width: 52,
                  height: 52,
                  backgroundColor: selected
                    ? "rgba(59,130,246,0.2)"
                    : "rgba(255,255,255,0.05)",
                  borderWidth: selected ? 2 : 0,
                  borderColor: selected ? "#3b82f6" : "transparent",
                }}
              >
                <Text style={{ fontSize: 24 }}>{emoji}</Text>
              </View>
              <Text
                className="text-[10px]"
                style={{
                  color: selected ? "#3b82f6" : "#6b7280",
                  fontWeight: selected ? "600" : "400",
                }}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
