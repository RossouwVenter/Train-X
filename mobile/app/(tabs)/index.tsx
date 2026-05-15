import { useState, useMemo, useCallback } from "react";
import { View, Text, FlatList, RefreshControl, TextInput, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Search, Users, Calendar, Dumbbell } from "lucide-react-native";
import { useAuth } from "@/hooks/useAuth";
import { useAthletes, useWeekSessions, useWeekSessionLogs, usePlans } from "@/hooks/api";
import { AthleteCard } from "@/components/training/AthleteCard";
import { SessionCard } from "@/components/session/SessionCard";
import { WeekStrip } from "@/components/shared/WeekStrip";
import { SkeletonCard } from "@/components/ui/SkeletonCard";
import { EmptyState } from "@/components/ui/EmptyState";
import type { AthleteWithProfile, PlanSession } from "@shared/types";

function CoachHome() {
  const router = useRouter();
  const { user } = useAuth();
  const { data: athletes, isLoading, refetch, isRefetching } = useAthletes();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!athletes) return [];
    if (!search.trim()) return athletes;
    const q = search.toLowerCase();
    return athletes.filter((a) => a.name.toLowerCase().includes(q));
  }, [athletes, search]);

  const renderItem = useCallback(
    ({ item }: { item: AthleteWithProfile }) => (
      <AthleteCard
        athlete={item}
        onPress={() => router.push(`/(coach)/athlete/${item.id}`)}
      />
    ),
    [router]
  );

  return (
    <SafeAreaView className="flex-1 bg-[#0a0a0a]">
      {/* Greeting */}
      <View className="px-5 pt-4 pb-1">
        <Text className="text-2xl font-bold text-white">
          Hey, {user?.name?.split(" ")[0] ?? "Coach"}!
        </Text>
        <Text className="text-sm text-gray-400 mt-1">
          Manage your athletes and their training
        </Text>
      </View>

      {/* Search */}
      <View className="px-5 py-3">
        <View className="flex-row items-center bg-neutral-900 rounded-lg px-3 py-2">
          <Search size={18} color="#6b7280" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search athletes..."
            placeholderTextColor="#6b7280"
            className="flex-1 ml-2 text-white text-base"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
      </View>

      {/* Athlete List */}
      {isLoading ? (
        <View className="px-5">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </View>
      ) : (
        <FlatList
          data={filtered}
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
            search.trim() ? (
              <EmptyState
                icon={Search}
                title="No results"
                description={`No athletes matching "${search}"`}
              />
            ) : (
              <EmptyState
                icon={Users}
                title="No athletes yet"
                description="Athletes will appear here once they join your team."
              />
            )
          }
        />
      )}
    </SafeAreaView>
  );
}

/** Get the Monday of the week containing a given date */
function getMonday(date: Date): string {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return d.toISOString().slice(0, 10);
}

/** Shift a YYYY-MM-DD string by N days */
function shiftWeek(dateStr: string, days: number): string {
  const d = new Date(dateStr + "T00:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function AthleteHome() {
  const { user } = useAuth();
  const router = useRouter();

  // Week state
  const [weekStart, setWeekStart] = useState(() => getMonday(new Date()));
  const today = new Date();
  const todayDow = today.getDay() === 0 ? 7 : today.getDay(); // 1=Mon..7=Sun
  const [selectedDay, setSelectedDay] = useState(todayDow);

  // Fetch active plan sessions for this week
  const {
    data: sessions,
    isLoading: loadingSessions,
    refetch,
    isRefetching,
  } = useWeekSessions(user?.id, weekStart);

  // Fetch completion logs for this week
  const { data: logs } = useWeekSessionLogs(user?.id, weekStart);

  // Build completed session IDs set
  const completedIds = useMemo(() => {
    if (!logs) return new Set<string>();
    return new Set(logs.map((l) => l.sessionId));
  }, [logs]);

  // Active / completed day sets for the strip
  const { activeDays, completedDays } = useMemo(() => {
    const active = new Set<number>();
    const done = new Set<number>();
    sessions?.forEach((s) => {
      active.add(s.dayOfWeek);
      if (completedIds.has(s.id)) done.add(s.dayOfWeek);
    });
    return { activeDays: active, completedDays: done };
  }, [sessions, completedIds]);

  // Filter sessions for selected day
  const daySessions = useMemo(
    () => sessions?.filter((s) => s.dayOfWeek === selectedDay) ?? [],
    [sessions, selectedDay]
  );

  // Quick stats
  const totalSessions = sessions?.length ?? 0;
  const completedCount = sessions?.filter((s) => completedIds.has(s.id)).length ?? 0;

  const handleSessionPress = useCallback(
    (session: PlanSession) => {
      router.push(`/session/${session.planId}/${session.id}`);
    },
    [router]
  );

  return (
    <SafeAreaView className="flex-1 bg-[#0a0a0a]">
      {/* Greeting */}
      <View className="px-5 pt-4 pb-1">
        <Text className="text-2xl font-bold text-white">
          Hey, {user?.name?.split(" ")[0] ?? "Athlete"}!
        </Text>
        <Text className="text-sm text-gray-400 mt-1">
          Your training schedule
        </Text>
      </View>

      {/* Week strip */}
      <WeekStrip
        weekStart={weekStart}
        selectedDay={selectedDay}
        onSelectDay={setSelectedDay}
        onPrevWeek={() => setWeekStart((w) => shiftWeek(w, -7))}
        onNextWeek={() => setWeekStart((w) => shiftWeek(w, 7))}
        activeDays={activeDays}
        completedDays={completedDays}
      />

      {/* Quick Stats */}
      <View className="flex-row px-5 py-3">
        <View className="flex-1 rounded-xl bg-neutral-900 p-3 mr-2 items-center">
          <Text className="text-xl font-bold text-white">
            {completedCount}/{totalSessions}
          </Text>
          <Text className="text-[10px] text-gray-500 mt-0.5">This Week</Text>
        </View>
        <View className="flex-1 rounded-xl bg-neutral-900 p-3 ml-2 items-center">
          <Text className="text-xl font-bold text-white">
            {daySessions.length}
          </Text>
          <Text className="text-[10px] text-gray-500 mt-0.5">
            {selectedDay === todayDow && weekStart === getMonday(new Date())
              ? "Today"
              : "Selected Day"}
          </Text>
        </View>
      </View>

      {/* Session list */}
      {loadingSessions ? (
        <View className="px-5">
          <SkeletonCard />
          <SkeletonCard />
        </View>
      ) : (
        <FlatList
          data={daySessions}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor="#fff"
            />
          }
          renderItem={({ item }) => (
            <Pressable onPress={() => handleSessionPress(item)}>
              <SessionCard
                session={item}
                isCompleted={completedIds.has(item.id)}
              />
            </Pressable>
          )}
          ListEmptyComponent={
            <EmptyState
              icon={Dumbbell}
              title="Rest day"
              description="No sessions scheduled for this day. Enjoy the recovery!"
            />
          }
        />
      )}
    </SafeAreaView>
  );
}

export default function HomeScreen() {
  const { user } = useAuth();
  return user?.role === "COACH" ? <CoachHome /> : <AthleteHome />;
}
