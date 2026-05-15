import { useRef, useEffect } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { ChevronLeft, ChevronRight } from "lucide-react-native";

interface WeekStripProps {
  /** Monday of the current week (YYYY-MM-DD) */
  weekStart: string;
  /** Currently selected day (1=Mon, 7=Sun) */
  selectedDay: number;
  /** Callback when a day is tapped */
  onSelectDay: (day: number) => void;
  /** Navigate to previous week */
  onPrevWeek: () => void;
  /** Navigate to next week */
  onNextWeek: () => void;
  /** Set of days that have sessions */
  activeDays?: Set<number>;
  /** Set of days that have completed sessions */
  completedDays?: Set<number>;
}

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function addDays(dateStr: string, days: number): Date {
  const d = new Date(dateStr + "T00:00:00");
  d.setDate(d.getDate() + days);
  return d;
}

function formatDate(date: Date): string {
  return date.getDate().toString();
}

function formatMonthYear(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function isToday(dateStr: string, dayIndex: number): boolean {
  const date = addDays(dateStr, dayIndex);
  const today = new Date();
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

export function WeekStrip({
  weekStart,
  selectedDay,
  onSelectDay,
  onPrevWeek,
  onNextWeek,
  activeDays = new Set(),
  completedDays = new Set(),
}: WeekStripProps) {
  return (
    <View className="bg-[#0a0a0a]">
      {/* Month/Year header with arrows */}
      <View className="flex-row items-center justify-between px-5 pt-3 pb-2">
        <Pressable
          onPress={onPrevWeek}
          hitSlop={12}
          className="p-1 active:opacity-50"
        >
          <ChevronLeft size={20} color="#9ca3af" />
        </Pressable>

        <Text className="text-sm font-semibold text-gray-300">
          {formatMonthYear(weekStart)}
        </Text>

        <Pressable
          onPress={onNextWeek}
          hitSlop={12}
          className="p-1 active:opacity-50"
        >
          <ChevronRight size={20} color="#9ca3af" />
        </Pressable>
      </View>

      {/* Day pills */}
      <View className="flex-row justify-between px-4 pb-3">
        {DAY_LABELS.map((label, i) => {
          const dayNum = i + 1;
          const isSelected = selectedDay === dayNum;
          const hasSession = activeDays.has(dayNum);
          const isDone = completedDays.has(dayNum);
          const isTodayDate = isToday(weekStart, i);
          const dateLabel = formatDate(addDays(weekStart, i));

          return (
            <Pressable
              key={dayNum}
              onPress={() => onSelectDay(dayNum)}
              className={`items-center rounded-xl py-2 px-2.5 min-w-[44px] ${
                isSelected
                  ? "bg-blue-600"
                  : isTodayDate
                  ? "bg-neutral-800"
                  : ""
              }`}
            >
              <Text
                className={`text-[10px] font-medium mb-1 ${
                  isSelected ? "text-blue-100" : "text-gray-500"
                }`}
              >
                {label}
              </Text>
              <Text
                className={`text-base font-bold ${
                  isSelected ? "text-white" : "text-gray-300"
                }`}
              >
                {dateLabel}
              </Text>

              {/* Dot indicator */}
              {hasSession && (
                <View
                  className={`w-1.5 h-1.5 rounded-full mt-1 ${
                    isDone
                      ? "bg-green-400"
                      : isSelected
                      ? "bg-white"
                      : "bg-blue-400"
                  }`}
                />
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
