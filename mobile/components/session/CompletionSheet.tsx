import { useState } from "react";
import { View, Text, TextInput, Pressable, ActivityIndicator } from "react-native";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { RPESlider } from "@/components/session/RPESlider";
import { MoodSelector } from "@/components/session/MoodSelector";
import type { Mood } from "@shared/types";

interface CompletionSheetProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: { rpe: number; mood: Mood | null; notes: string }) => void;
  isSubmitting: boolean;
  sessionTitle: string;
}

export function CompletionSheet({
  visible,
  onClose,
  onSubmit,
  isSubmitting,
  sessionTitle,
}: CompletionSheetProps) {
  const [rpe, setRpe] = useState(5);
  const [mood, setMood] = useState<Mood | null>(null);
  const [notes, setNotes] = useState("");

  function handleSubmit() {
    onSubmit({ rpe, mood, notes });
  }

  return (
    <BottomSheet visible={visible} onClose={onClose} title="Complete Session">
      <Text className="text-xs text-gray-400 mb-4">
        How was "{sessionTitle}"?
      </Text>

      {/* RPE */}
      <View className="mb-6">
        <RPESlider value={rpe} onChange={setRpe} />
      </View>

      {/* Mood */}
      <View className="mb-6">
        <MoodSelector value={mood} onChange={setMood} />
      </View>

      {/* Notes */}
      <View className="mb-6">
        <Text className="text-sm font-semibold text-white mb-2">
          Notes (optional)
        </Text>
        <TextInput
          className="rounded-lg bg-neutral-800 text-white p-3 min-h-[80px]"
          placeholder="How did it go? Any adjustments needed?"
          placeholderTextColor="#6b7280"
          value={notes}
          onChangeText={setNotes}
          multiline
          textAlignVertical="top"
        />
      </View>

      {/* Submit */}
      <Pressable
        onPress={handleSubmit}
        disabled={isSubmitting}
        className="rounded-xl py-4 items-center"
        style={{
          backgroundColor: isSubmitting ? "#1d4ed8" : "#3b82f6",
          opacity: isSubmitting ? 0.7 : 1,
        }}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text className="text-white font-bold text-base">
            Mark as Complete ✓
          </Text>
        )}
      </Pressable>
    </BottomSheet>
  );
}
