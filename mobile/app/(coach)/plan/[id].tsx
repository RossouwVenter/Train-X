import { useState, useCallback } from "react";
import {
  View,
  Text,
  Pressable,
  SectionList,
  RefreshControl,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, Edit3, Plus } from "lucide-react-native";
import { usePlan, useUpdatePlan, useCreateSession } from "@/hooks/api";
import { SessionCard } from "@/components/session/SessionCard";
import { Badge } from "@/components/ui/Badge";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { SkeletonCard } from "@/components/ui/SkeletonCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Dumbbell } from "lucide-react-native";
import type { PlanSession, PlanStatus } from "@shared/types";

const DAY_LABELS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const statusVariant: Record<PlanStatus, "default" | "success" | "info" | "warning"> = {
  DRAFT: "default",
  ACTIVE: "success",
  COMPLETED: "info",
  ARCHIVED: "default",
};

interface DaySection {
  title: string;
  data: PlanSession[];
}

function groupByDay(sessions: PlanSession[]): DaySection[] {
  const grouped = new Map<number, PlanSession[]>();
  for (const s of sessions) {
    const existing = grouped.get(s.dayOfWeek) ?? [];
    existing.push(s);
    grouped.set(s.dayOfWeek, existing);
  }
  const sections: DaySection[] = [];
  for (let day = 1; day <= 7; day++) {
    const items = grouped.get(day);
    if (items && items.length > 0) {
      sections.push({
        title: DAY_LABELS[day - 1],
        data: items.sort((a, b) => a.order - b.order),
      });
    }
  }
  return sections;
}

export default function PlanDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [editSheetVisible, setEditSheetVisible] = useState(false);
  const [addSessionVisible, setAddSessionVisible] = useState(false);

  const {
    data: plan,
    isLoading,
    refetch,
    isRefetching,
  } = usePlan(id);

  const updatePlan = useUpdatePlan();
  const createSession = useCreateSession(id!);

  // Edit form state
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  // Add session form state
  const [sessionTitle, setSessionTitle] = useState("");
  const [sessionType, setSessionType] = useState("");
  const [sessionDay, setSessionDay] = useState("1");

  const openEditSheet = useCallback(() => {
    if (plan) {
      setEditName(plan.name);
      setEditDescription(plan.description ?? "");
    }
    setEditSheetVisible(true);
  }, [plan]);

  const handleUpdatePlan = useCallback(() => {
    if (!plan || !editName.trim()) return;
    updatePlan.mutate(
      {
        planId: plan.id,
        athleteId: plan.athleteId,
        data: { name: editName.trim(), description: editDescription.trim() || undefined },
      },
      {
        onSuccess: () => {
          setEditSheetVisible(false);
          refetch();
        },
      }
    );
  }, [plan, editName, editDescription, updatePlan, refetch]);

  const handleAddSession = useCallback(() => {
    if (!sessionTitle.trim() || !sessionType.trim()) return;
    const dayNum = parseInt(sessionDay, 10);
    if (isNaN(dayNum) || dayNum < 1 || dayNum > 7) return;
    createSession.mutate(
      {
        title: sessionTitle.trim(),
        type: sessionType.trim(),
        dayOfWeek: dayNum,
        order: (plan?.sessions?.filter((s) => s.dayOfWeek === dayNum).length ?? 0) + 1,
      },
      {
        onSuccess: () => {
          setAddSessionVisible(false);
          setSessionTitle("");
          setSessionType("");
          setSessionDay("1");
          refetch();
        },
      }
    );
  }, [sessionTitle, sessionType, sessionDay, plan, createSession, refetch]);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-[#0a0a0a]">
        <View className="px-5 pt-4">
          <SkeletonCard lines={2} />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </View>
      </SafeAreaView>
    );
  }

  if (!plan) {
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
          title="Plan not found"
          description="This plan may have been removed."
        />
      </SafeAreaView>
    );
  }

  const sections = groupByDay(plan.sessions ?? []);

  return (
    <SafeAreaView className="flex-1 bg-[#0a0a0a]">
      {/* Header */}
      <View className="flex-row items-center px-5 pt-4 pb-2">
        <Pressable onPress={() => router.back()} className="mr-3 p-1">
          <ArrowLeft size={24} color="#fff" />
        </Pressable>
        <View className="flex-1">
          <View className="flex-row items-center">
            <Text className="text-xl font-bold text-white mr-2" numberOfLines={1}>
              {plan.name}
            </Text>
            <Badge label={plan.status} variant={statusVariant[plan.status]} />
          </View>
          {plan.description ? (
            <Text className="text-sm text-gray-400 mt-1" numberOfLines={2}>
              {plan.description}
            </Text>
          ) : null}
        </View>
        <Pressable onPress={openEditSheet} className="p-2 active:opacity-70">
          <Edit3 size={20} color="#fff" />
        </Pressable>
      </View>

      {/* Sessions by day */}
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderSectionHeader={({ section }) => (
          <Text className="text-sm font-semibold text-gray-400 px-5 pt-4 pb-2">
            {section.title}
          </Text>
        )}
        renderItem={({ item }) => (
          <View className="px-5">
            <SessionCard session={item} />
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
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
            title="No sessions yet"
            description="Add sessions to build this training plan."
            action={{
              label: "Add Session",
              onPress: () => setAddSessionVisible(true),
            }}
          />
        }
      />

      {/* Floating Add Session Button */}
      <Pressable
        onPress={() => setAddSessionVisible(true)}
        className="absolute bottom-8 right-5 bg-blue-600 rounded-full w-14 h-14 items-center justify-center shadow-lg active:bg-blue-700"
      >
        <Plus size={24} color="#fff" />
      </Pressable>

      {/* Edit Plan Bottom Sheet */}
      <BottomSheet
        visible={editSheetVisible}
        onClose={() => setEditSheetVisible(false)}
        title="Edit Plan"
      >
        <Text className="text-sm font-medium text-gray-300 mb-2">Name</Text>
        <TextInput
          value={editName}
          onChangeText={setEditName}
          className="bg-neutral-800 text-white rounded-lg px-4 py-3 mb-4 text-base"
          placeholderTextColor="#6b7280"
          placeholder="Plan name"
        />
        <Text className="text-sm font-medium text-gray-300 mb-2">
          Description
        </Text>
        <TextInput
          value={editDescription}
          onChangeText={setEditDescription}
          className="bg-neutral-800 text-white rounded-lg px-4 py-3 mb-6 text-base"
          placeholderTextColor="#6b7280"
          placeholder="Optional description"
          multiline
          numberOfLines={3}
        />
        <Pressable
          onPress={handleUpdatePlan}
          disabled={updatePlan.isPending || !editName.trim()}
          className={`rounded-lg py-3 items-center ${
            updatePlan.isPending || !editName.trim()
              ? "bg-blue-600/50"
              : "bg-blue-600 active:bg-blue-700"
          }`}
        >
          <Text className="text-base font-semibold text-white">
            {updatePlan.isPending ? "Saving..." : "Save Changes"}
          </Text>
        </Pressable>
      </BottomSheet>

      {/* Add Session Bottom Sheet */}
      <BottomSheet
        visible={addSessionVisible}
        onClose={() => setAddSessionVisible(false)}
        title="Add Session"
      >
        <Text className="text-sm font-medium text-gray-300 mb-2">Title</Text>
        <TextInput
          value={sessionTitle}
          onChangeText={setSessionTitle}
          className="bg-neutral-800 text-white rounded-lg px-4 py-3 mb-4 text-base"
          placeholderTextColor="#6b7280"
          placeholder="e.g. Upper Body Strength"
        />
        <Text className="text-sm font-medium text-gray-300 mb-2">Type</Text>
        <TextInput
          value={sessionType}
          onChangeText={setSessionType}
          className="bg-neutral-800 text-white rounded-lg px-4 py-3 mb-4 text-base"
          placeholderTextColor="#6b7280"
          placeholder="e.g. Strength, Cardio, Recovery"
        />
        <Text className="text-sm font-medium text-gray-300 mb-2">
          Day of Week (1=Mon, 7=Sun)
        </Text>
        <TextInput
          value={sessionDay}
          onChangeText={setSessionDay}
          className="bg-neutral-800 text-white rounded-lg px-4 py-3 mb-6 text-base"
          placeholderTextColor="#6b7280"
          placeholder="1"
          keyboardType="number-pad"
          maxLength={1}
        />
        <Pressable
          onPress={handleAddSession}
          disabled={
            createSession.isPending ||
            !sessionTitle.trim() ||
            !sessionType.trim()
          }
          className={`rounded-lg py-3 items-center ${
            createSession.isPending || !sessionTitle.trim() || !sessionType.trim()
              ? "bg-blue-600/50"
              : "bg-blue-600 active:bg-blue-700"
          }`}
        >
          <Text className="text-base font-semibold text-white">
            {createSession.isPending ? "Adding..." : "Add Session"}
          </Text>
        </Pressable>
      </BottomSheet>
    </SafeAreaView>
  );
}
