import { View, Text, Pressable } from "react-native";
import { ChevronRight } from "lucide-react-native";
import type { AthleteWithProfile } from "@shared/types";

interface AthleteCardProps {
  athlete: AthleteWithProfile;
  onPress: () => void;
}

const avatarColors = [
  "bg-blue-600",
  "bg-emerald-600",
  "bg-purple-600",
  "bg-amber-600",
  "bg-rose-600",
  "bg-cyan-600",
  "bg-indigo-600",
];

function getAvatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return avatarColors[Math.abs(hash) % avatarColors.length];
}

function formatLastActivity(dateStr: string | null | undefined): string {
  if (!dateStr) return "No activity yet";
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

export function AthleteCard({ athlete, onPress }: AthleteCardProps) {
  const initial = athlete.name?.charAt(0)?.toUpperCase() ?? "?";
  const sport = athlete.athleteProfile?.sport;

  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center rounded-xl bg-neutral-900 p-4 mb-3 active:bg-neutral-800"
    >
      {/* Avatar */}
      <View
        className={`h-12 w-12 rounded-full items-center justify-center ${getAvatarColor(athlete.name)}`}
      >
        <Text className="text-lg font-bold text-white">{initial}</Text>
      </View>

      {/* Info */}
      <View className="flex-1 ml-3">
        <Text className="text-base font-semibold text-white">
          {athlete.name}
        </Text>
        <View className="flex-row items-center mt-1">
          {sport && (
            <Text className="text-sm text-gray-400 mr-3">{sport}</Text>
          )}
          <Text className="text-xs text-gray-500">
            {formatLastActivity(athlete.lastActivity)}
          </Text>
        </View>
      </View>

      {/* Chevron */}
      <ChevronRight size={20} color="#6b7280" />
    </Pressable>
  );
}
