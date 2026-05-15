import { View, Text } from "react-native";

type BadgeVariant = "success" | "warning" | "danger" | "info" | "default";

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, { bg: string; text: string }> = {
  success: { bg: "bg-green-900/50", text: "text-green-400" },
  warning: { bg: "bg-amber-900/50", text: "text-amber-400" },
  danger: { bg: "bg-red-900/50", text: "text-red-400" },
  info: { bg: "bg-blue-900/50", text: "text-blue-400" },
  default: { bg: "bg-gray-800", text: "text-gray-400" },
};

export function Badge({ label, variant = "default" }: BadgeProps) {
  const styles = variantStyles[variant];

  return (
    <View className={`rounded-full px-3 py-1 ${styles.bg}`}>
      <Text className={`text-xs font-medium ${styles.text}`}>{label}</Text>
    </View>
  );
}
