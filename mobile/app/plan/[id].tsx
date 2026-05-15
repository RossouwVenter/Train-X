import { View, Text, ScrollView, Pressable, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, Stack } from "expo-router";
import { ArrowLeft, ClipboardList } from "lucide-react-native";
import { useAuth } from "@/hooks/useAuth";
import { usePlans } from "@/hooks/api";
import { PlanCard } from "@/components/training/PlanCard";
import { SkeletonCard } from "@/components/ui/SkeletonCard";
import { EmptyState } from "@/components/ui/EmptyState";

export default function AthletePlansScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const { data: plans, isLoading, refetch, isRefetching } = usePlans(user?.id);

  const activePlans = plans?.filter((p) => p.status === "ACTIVE") ?? [];
  const pastPlans = plans?.filter((p) => p.status !== "ACTIVE") ?? [];

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView className="flex-1 bg-[#0a0a0a]">
        {/* Header */}
        <View className="flex-row items-center px-5 pt-2 pb-4">
          <Pressable
            onPress={() => router.back()}
            hitSlop={12}
            className="mr-3 p-1"
          >
            <ArrowLeft size={24} color="#fff" />
          </Pressable>
          <Text className="text-lg font-bold text-white">My Plans</Text>
        </View>

        {isLoading ? (
          <View className="px-5">
            <SkeletonCard />
            <SkeletonCard />
          </View>
        ) : !plans?.length ? (
          <EmptyState
            icon={ClipboardList}
            title="No plans yet"
            description="Your coach hasn't assigned any training plans yet. Check back soon!"
          />
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
            {/* Active plans */}
            {activePlans.length > 0 && (
              <>
                <Text className="text-sm font-semibold text-gray-400 mb-2 ml-1">
                  ACTIVE
                </Text>
                {activePlans.map((plan) => (
                  <PlanCard
                    key={plan.id}
                    plan={plan}
                    onPress={() =>
                      router.push(`/plan/${plan.id}`)
                    }
                  />
                ))}
              </>
            )}

            {/* Past plans */}
            {pastPlans.length > 0 && (
              <>
                <Text className="text-sm font-semibold text-gray-400 mt-4 mb-2 ml-1">
                  PAST
                </Text>
                {pastPlans.map((plan) => (
                  <PlanCard
                    key={plan.id}
                    plan={plan}
                    onPress={() =>
                      router.push(`/plan/${plan.id}`)
                    }
                  />
                ))}
              </>
            )}
          </ScrollView>
        )}
      </SafeAreaView>
    </>
  );
}
