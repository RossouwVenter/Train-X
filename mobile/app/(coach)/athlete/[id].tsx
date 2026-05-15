import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, Plus } from "lucide-react-native";
import { useAthlete, usePlans } from "@/hooks/api";
import { PlanCard } from "@/components/training/PlanCard";
import { SkeletonCard } from "@/components/ui/SkeletonCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Dumbbell, Activity } from "lucide-react-native";
import type { TrainingPlan } from "@shared/types";

type Tab = "plans" | "activity";

export default function AthleteDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("plans");

  const { data: athlete, isLoading: loadingAthlete } = useAthlete(id);
  const {
    data: plans,
    isLoading: loadingPlans,
    refetch: refetchPlans,
    isRefetching,
  } = usePlans(id);

  if (loadingAthlete) {
    return (
      <SafeAreaView className="flex-1 bg-[#0a0a0a]">
        <View className="px-5 pt-4">
          <SkeletonCard lines={2} />
          <SkeletonCard />
          <SkeletonCard />
        </View>
      </SafeAreaView>
    );
  }

  if (!athlete) {
    return (
      <SafeAreaView className="flex-1 bg-[#0a0a0a]">
        <View className="flex-row items-center px-5 pt-4 pb-2">
          <Pressable onPress={() => router.back()} className="mr-3 p-1">
            <ArrowLeft size={24} color="#fff" />
          </Pressable>
          <Text className="text-lg font-semibold text-white">Not Found</Text>
        </View>
        <EmptyState
          icon={Dumbbell}
          title="Athlete not found"
          description="This athlete may have been removed."
        />
      </SafeAreaView>
    );
  }

  const renderPlanItem = ({ item }: { item: TrainingPlan }) => (
    <PlanCard
      plan={item}
      onPress={() => router.push(`/(coach)/plan/${item.id}`)}
    />
  );

  return (
    <SafeAreaView className="flex-1 bg-[#0a0a0a]">
      {/* Header */}
      <View className="flex-row items-center px-5 pt-4 pb-2">
        <Pressable onPress={() => router.back()} className="mr-3 p-1">
          <ArrowLeft size={24} color="#fff" />
        </Pressable>
        <View className="flex-1">
          <Text className="text-xl font-bold text-white">{athlete.name}</Text>
          {athlete.athleteProfile?.sport && (
            <Text className="text-sm text-gray-400 mt-0.5">
              {athlete.athleteProfile.sport}
            </Text>
          )}
        </View>
        <Pressable
          onPress={() =>
            router.push({
              pathname: "/(coach)/create-plan",
              params: { athleteId: id, athleteName: athlete.name },
            })
          }
          className="bg-blue-600 rounded-lg px-3 py-2 active:bg-blue-700"
        >
          <Plus size={20} color="#fff" />
        </Pressable>
      </View>

      {/* Tab Toggle */}
      <View className="flex-row mx-5 mt-3 mb-4 rounded-lg bg-neutral-900 p-1">
        <Pressable
          onPress={() => setActiveTab("plans")}
          className={`flex-1 py-2 rounded-md items-center ${
            activeTab === "plans" ? "bg-neutral-700" : ""
          }`}
        >
          <Text
            className={`text-sm font-medium ${
              activeTab === "plans" ? "text-white" : "text-gray-500"
            }`}
          >
            Plans
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setActiveTab("activity")}
          className={`flex-1 py-2 rounded-md items-center ${
            activeTab === "activity" ? "bg-neutral-700" : ""
          }`}
        >
          <Text
            className={`text-sm font-medium ${
              activeTab === "activity" ? "text-white" : "text-gray-500"
            }`}
          >
            Activity
          </Text>
        </Pressable>
      </View>

      {/* Content */}
      {activeTab === "plans" ? (
        loadingPlans ? (
          <View className="px-5">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </View>
        ) : (
          <FlatList
            data={plans ?? []}
            keyExtractor={(item) => item.id}
            renderItem={renderPlanItem}
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
            refreshControl={
              <RefreshControl
                refreshing={isRefetching}
                onRefresh={refetchPlans}
                tintColor="#fff"
              />
            }
            ListEmptyComponent={
              <EmptyState
                icon={Dumbbell}
                title="No plans yet"
                description="Create a training plan to get started."
                action={{
                  label: "Create Plan",
                  onPress: () =>
                    router.push({
                      pathname: "/(coach)/create-plan",
                      params: { athleteId: id, athleteName: athlete.name },
                    }),
                }}
              />
            }
          />
        )
      ) : (
        <View className="flex-1 items-center justify-center px-8">
          <Activity size={48} color="#6b7280" strokeWidth={1.5} />
          <Text className="mt-4 text-lg font-semibold text-gray-200 text-center">
            Activity Feed
          </Text>
          <Text className="mt-2 text-sm text-gray-400 text-center leading-5">
            Activity feed coming in Sprint M3
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}
