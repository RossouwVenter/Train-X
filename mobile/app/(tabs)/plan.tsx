import { useCallback } from "react";
import { View, Text, FlatList, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Dumbbell, Home } from "lucide-react-native";
import { useAuth } from "@/hooks/useAuth";
import { usePlans } from "@/hooks/api";
import { PlanCard } from "@/components/training/PlanCard";
import { SkeletonCard } from "@/components/ui/SkeletonCard";
import { EmptyState } from "@/components/ui/EmptyState";
import type { TrainingPlan } from "@shared/types";

function CoachPlansTab() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-[#0a0a0a]">
      <View className="px-5 pt-4 pb-2">
        <Text className="text-2xl font-bold text-white">Plans</Text>
        <Text className="text-sm text-gray-400 mt-1">
          Manage training plans
        </Text>
      </View>

      <EmptyState
        icon={Home}
        title="Select an athlete first"
        description="Go to the Athletes tab to pick an athlete, then view and create their plans."
        action={{
          label: "Go to Athletes",
          onPress: () => router.push("/(tabs)"),
        }}
      />
    </SafeAreaView>
  );
}

function AthletePlansTab() {
  const router = useRouter();
  const { user } = useAuth();
  const {
    data: plans,
    isLoading,
    refetch,
    isRefetching,
  } = usePlans(user?.id);

  const renderItem = useCallback(
    ({ item }: { item: TrainingPlan }) => (
      <PlanCard
        plan={item}
        onPress={() => router.push(`/plan/${item.id}`)}
      />
    ),
    [router]
  );

  return (
    <SafeAreaView className="flex-1 bg-[#0a0a0a]">
      <View className="px-5 pt-4 pb-2">
        <Text className="text-2xl font-bold text-white">My Plans</Text>
        <Text className="text-sm text-gray-400 mt-1">
          Your training plans
        </Text>
      </View>

      {isLoading ? (
        <View className="px-5">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </View>
      ) : (
        <FlatList
          data={plans ?? []}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor="#fff"
            />
          }
          ListEmptyComponent={
            <EmptyState
              icon={Dumbbell}
              title="No plans yet"
              description="Your coach hasn't created any plans for you yet. Check back soon!"
            />
          }
        />
      )}
    </SafeAreaView>
  );
}

export default function PlanScreen() {
  const { user } = useAuth();
  return user?.role === "COACH" ? <CoachPlansTab /> : <AthletePlansTab />;
}
