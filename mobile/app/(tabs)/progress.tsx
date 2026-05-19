import { useState } from "react";
import { View, Text, ScrollView, Pressable, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Flame, TrendingUp, Activity, Heart } from "lucide-react-native";
import { useAuth } from "@/hooks/useAuth";
import { useProgress } from "@/hooks/api";
import { CompletionRing } from "@/components/progress/CompletionRing";
import { RPETrendChart } from "@/components/progress/RPETrendChart";
import { SkeletonCard } from "@/components/ui/SkeletonCard";

type Range = "week" | "month" | "all";

const MOOD_EMOJI: Record<string, string> = {
  GREAT: "🔥",
  GOOD: "😊",
  OKAY: "😐",
  TOUGH: "😤",
  TERRIBLE: "😩",
};

export default function ProgressScreen() {
  const { user } = useAuth();
  const [range, setRange] = useState<Range>("month");
  const { data, isLoading, refetch, isRefetching } = useProgress(
    user?.id,
    range
  );

  return (
    <SafeAreaView className="flex-1 bg-[#0a0a0a]">
      <View className="px-5 pt-4 pb-2">
        <Text className="text-2xl font-bold text-white">Progress</Text>
        <Text className="text-sm text-gray-400 mt-1">
          Track your training progress
        </Text>
      </View>

      {/* Range selector */}
      <View className="flex-row px-5 mb-4">
        {(["week", "month", "all"] as Range[]).map((r) => (
          <Pressable
            key={r}
            onPress={() => setRange(r)}
            className="mr-2 px-4 py-1.5 rounded-full"
            style={{
              backgroundColor:
                range === r ? "#3b82f6" : "rgba(255,255,255,0.06)",
            }}
          >
            <Text
              className="text-xs font-medium"
              style={{ color: range === r ? "#fff" : "#9ca3af" }}
            >
              {r === "week" ? "This Week" : r === "month" ? "4 Weeks" : "All Time"}
            </Text>
          </Pressable>
        ))}
      </View>

      {isLoading ? (
        <View className="px-5">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </View>
      ) : !data ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-500">No progress data available</Text>
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor="#fff"
            />
          }
        >
          {/* Completion Rate */}
          <View className="rounded-xl bg-neutral-900 p-5 mb-4">
            <Text className="text-sm font-semibold text-gray-400 mb-4">
              COMPLETION RATE
            </Text>
            <CompletionRing
              percentage={data.completionRate}
              completed={data.completedSessions}
              total={data.totalSessions}
            />
          </View>

          {/* Quick stats row */}
          <View className="flex-row mb-4">
            {/* Streak */}
            <View className="flex-1 rounded-xl bg-neutral-900 p-4 mr-2">
              <View className="flex-row items-center mb-2">
                <Flame size={16} color="#f97316" />
                <Text className="text-xs text-gray-400 ml-1">Streak</Text>
              </View>
              <Text className="text-2xl font-bold text-white">
                {data.streak}
              </Text>
              <Text className="text-[10px] text-gray-600">days</Text>
            </View>

            {/* Avg RPE */}
            <View className="flex-1 rounded-xl bg-neutral-900 p-4 ml-2">
              <View className="flex-row items-center mb-2">
                <Activity size={16} color="#3b82f6" />
                <Text className="text-xs text-gray-400 ml-1">Avg RPE</Text>
              </View>
              <Text className="text-2xl font-bold text-white">
                {data.avgRpe ?? "—"}
              </Text>
              <Text className="text-[10px] text-gray-600">/ 10</Text>
            </View>
          </View>

          {/* Most common mood */}
          {data.mostCommonMood && (
            <View className="rounded-xl bg-neutral-900 p-4 mb-4 flex-row items-center">
              <Heart size={16} color="#ec4899" />
              <Text className="text-sm text-gray-400 ml-2">Top mood:</Text>
              <Text className="text-lg ml-2">
                {MOOD_EMOJI[data.mostCommonMood] ?? ""}
              </Text>
              <Text className="text-sm text-white font-medium ml-1">
                {data.mostCommonMood.charAt(0) +
                  data.mostCommonMood.slice(1).toLowerCase()}
              </Text>
            </View>
          )}

          {/* RPE Trend */}
          <View className="rounded-xl bg-neutral-900 p-5 mb-4">
            <View className="flex-row items-center mb-3">
              <TrendingUp size={16} color="#3b82f6" />
              <Text className="text-sm font-semibold text-gray-400 ml-2">
                RPE TREND
              </Text>
            </View>
            <RPETrendChart data={data.weeklyRpe} />
          </View>

          {/* Mood breakdown */}
          {Object.keys(data.moodCounts).length > 0 && (
            <View className="rounded-xl bg-neutral-900 p-5">
              <Text className="text-sm font-semibold text-gray-400 mb-3">
                MOOD BREAKDOWN
              </Text>
              <View className="flex-row flex-wrap">
                {Object.entries(data.moodCounts)
                  .sort(([, a], [, b]) => b - a)
                  .map(([mood, count]) => (
                    <View
                      key={mood}
                      className="flex-row items-center mr-4 mb-2"
                    >
                      <Text className="text-lg mr-1">
                        {MOOD_EMOJI[mood] ?? ""}
                      </Text>
                      <Text className="text-sm text-white font-medium">
                        {count}
                      </Text>
                    </View>
                  ))}
              </View>
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
