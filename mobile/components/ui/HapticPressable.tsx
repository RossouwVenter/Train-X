import { Pressable, type PressableProps } from "react-native";
import * as Haptics from "expo-haptics";
import { forwardRef } from "react";
import type { View } from "react-native";

interface HapticPressableProps extends PressableProps {
  haptic?: "light" | "medium" | "heavy" | "selection" | "success" | "error";
}

const IMPACT_MAP: Record<string, Haptics.ImpactFeedbackStyle> = {
  light: Haptics.ImpactFeedbackStyle.Light,
  medium: Haptics.ImpactFeedbackStyle.Medium,
  heavy: Haptics.ImpactFeedbackStyle.Heavy,
};

const NOTIFICATION_MAP: Record<string, Haptics.NotificationFeedbackType> = {
  success: Haptics.NotificationFeedbackType.Success,
  error: Haptics.NotificationFeedbackType.Error,
};

export const HapticPressable = forwardRef<View, HapticPressableProps>(
  function HapticPressable({ haptic = "light", onPress, ...props }, ref) {
    function handlePress(e: any) {
      if (haptic === "selection") {
        Haptics.selectionAsync();
      } else if (NOTIFICATION_MAP[haptic]) {
        Haptics.notificationAsync(NOTIFICATION_MAP[haptic]);
      } else {
        Haptics.impactAsync(IMPACT_MAP[haptic] ?? IMPACT_MAP.light);
      }
      onPress?.(e);
    }

    return <Pressable ref={ref} onPress={handlePress} {...props} />;
  }
);
