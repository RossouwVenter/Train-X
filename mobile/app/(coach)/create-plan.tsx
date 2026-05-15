import { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { useCreatePlan } from "@/hooks/api";

export default function CreatePlanScreen() {
  const router = useRouter();
  const { athleteId, athleteName } = useLocalSearchParams<{
    athleteId: string;
    athleteName?: string;
  }>();

  const createPlan = useCreatePlan();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [weekStartDate, setWeekStartDate] = useState("");

  const handleSubmit = useCallback(() => {
    if (!name.trim()) {
      Alert.alert("Validation", "Plan name is required.");
      return;
    }
    if (!weekStartDate.trim()) {
      Alert.alert("Validation", "Week start date is required.");
      return;
    }
    if (!athleteId) {
      Alert.alert("Error", "No athlete selected.");
      return;
    }

    createPlan.mutate(
      {
        athleteId,
        name: name.trim(),
        description: description.trim() || undefined,
        weekStartDate: weekStartDate.trim(),
      },
      {
        onSuccess: (res) => {
          const planId = res.data.id;
          router.replace(`/(coach)/plan/${planId}`);
        },
        onError: (err) => {
          Alert.alert("Error", err.message || "Failed to create plan.");
        },
      }
    );
  }, [name, description, weekStartDate, athleteId, createPlan, router]);

  return (
    <SafeAreaView className="flex-1 bg-[#0a0a0a]">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        {/* Header */}
        <View className="flex-row items-center px-5 pt-4 pb-2">
          <Pressable onPress={() => router.back()} className="mr-3 p-1">
            <ArrowLeft size={24} color="#fff" />
          </Pressable>
          <Text className="text-xl font-bold text-white">Create Plan</Text>
        </View>

        <ScrollView className="flex-1 px-5" keyboardShouldPersistTaps="handled">
          {/* Athlete context */}
          {athleteName && (
            <View className="bg-neutral-900 rounded-lg px-4 py-3 mb-6 mt-2">
              <Text className="text-xs text-gray-500 mb-1">Athlete</Text>
              <Text className="text-base text-white font-medium">
                {athleteName}
              </Text>
            </View>
          )}

          {/* Name */}
          <Text className="text-sm font-medium text-gray-300 mb-2 mt-2">
            Plan Name *
          </Text>
          <TextInput
            value={name}
            onChangeText={setName}
            className="bg-neutral-800 text-white rounded-lg px-4 py-3 mb-4 text-base"
            placeholderTextColor="#6b7280"
            placeholder="e.g. Pre-Season Strength Block"
          />

          {/* Description */}
          <Text className="text-sm font-medium text-gray-300 mb-2">
            Description
          </Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            className="bg-neutral-800 text-white rounded-lg px-4 py-3 mb-4 text-base"
            placeholderTextColor="#6b7280"
            placeholder="Optional description"
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />

          {/* Week Start Date */}
          <Text className="text-sm font-medium text-gray-300 mb-2">
            Week Start Date *
          </Text>
          <TextInput
            value={weekStartDate}
            onChangeText={setWeekStartDate}
            className="bg-neutral-800 text-white rounded-lg px-4 py-3 mb-2 text-base"
            placeholderTextColor="#6b7280"
            placeholder="YYYY-MM-DD"
            keyboardType="default"
            autoCapitalize="none"
          />
          <Text className="text-xs text-gray-500 mb-6">
            Format: YYYY-MM-DD (e.g. 2026-05-18)
          </Text>

          {/* Submit */}
          <Pressable
            onPress={handleSubmit}
            disabled={createPlan.isPending}
            className={`rounded-lg py-4 items-center mb-8 ${
              createPlan.isPending
                ? "bg-blue-600/50"
                : "bg-blue-600 active:bg-blue-700"
            }`}
          >
            <Text className="text-base font-semibold text-white">
              {createPlan.isPending ? "Creating..." : "Create Plan"}
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
