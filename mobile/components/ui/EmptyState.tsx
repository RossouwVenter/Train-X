import { View, Text, Pressable } from "react-native";
import type { LucideIcon } from "lucide-react-native";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onPress: () => void;
  };
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-8 py-16">
      <Icon size={48} color="#6b7280" strokeWidth={1.5} />
      <Text className="mt-4 text-lg font-semibold text-gray-200 text-center">
        {title}
      </Text>
      <Text className="mt-2 text-sm text-gray-400 text-center leading-5">
        {description}
      </Text>
      {action && (
        <Pressable
          onPress={action.onPress}
          className="mt-6 rounded-lg bg-blue-600 px-6 py-3 active:bg-blue-700"
        >
          <Text className="text-sm font-semibold text-white">
            {action.label}
          </Text>
        </Pressable>
      )}
    </View>
  );
}
