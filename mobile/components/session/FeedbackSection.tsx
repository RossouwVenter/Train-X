import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { MessageCircle, Send } from "lucide-react-native";
import { useFeedback, useSendFeedback } from "@/hooks/api";
import type { Feedback } from "@shared/types";

interface FeedbackSectionProps {
  sessionLogId: string;
  /** Whether the current user can post feedback */
  canPost: boolean;
}

function formatTime(dateStr: string): string {
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

function FeedbackBubble({ feedback }: { feedback: Feedback }) {
  const isCoach = feedback.user?.role === "COACH";

  return (
    <View className="mb-3">
      <View className="flex-row items-center mb-1">
        <View
          className="w-6 h-6 rounded-full items-center justify-center mr-2"
          style={{
            backgroundColor: isCoach
              ? "rgba(59,130,246,0.2)"
              : "rgba(34,197,94,0.2)",
          }}
        >
          <Text
            className="text-[10px] font-bold"
            style={{ color: isCoach ? "#3b82f6" : "#22c55e" }}
          >
            {feedback.user?.name?.charAt(0)?.toUpperCase() ?? "?"}
          </Text>
        </View>
        <Text className="text-xs font-medium text-gray-400">
          {feedback.user?.name ?? "Unknown"}
        </Text>
        <Text className="text-xs text-gray-600 ml-2">
          {formatTime(feedback.createdAt)}
        </Text>
      </View>
      <View
        className="rounded-lg px-3 py-2 ml-8"
        style={{
          backgroundColor: isCoach
            ? "rgba(59,130,246,0.08)"
            : "rgba(255,255,255,0.05)",
        }}
      >
        <Text className="text-sm text-gray-300 leading-5">
          {feedback.content}
        </Text>
      </View>
    </View>
  );
}

export function FeedbackSection({ sessionLogId, canPost }: FeedbackSectionProps) {
  const { data: feedbacks, isLoading } = useFeedback(sessionLogId);
  const sendFeedback = useSendFeedback();
  const [text, setText] = useState("");

  function handleSend() {
    if (!text.trim()) return;
    sendFeedback.mutate(
      { sessionLogId, content: text.trim() },
      { onSuccess: () => setText("") }
    );
  }

  if (isLoading) {
    return (
      <View className="mt-4 py-4 items-center">
        <ActivityIndicator color="#6b7280" size="small" />
      </View>
    );
  }

  const hasFeedback = feedbacks && feedbacks.length > 0;

  return (
    <View className="mt-4">
      {/* Header */}
      <View className="flex-row items-center mb-3">
        <MessageCircle size={16} color="#6b7280" />
        <Text className="text-sm font-semibold text-gray-400 ml-2">
          Feedback{hasFeedback ? ` (${feedbacks.length})` : ""}
        </Text>
      </View>

      {/* Feedback list */}
      {hasFeedback &&
        feedbacks.map((f) => <FeedbackBubble key={f.id} feedback={f} />)}

      {!hasFeedback && !canPost && (
        <Text className="text-xs text-gray-600 ml-1">
          No feedback yet
        </Text>
      )}

      {/* Input */}
      {canPost && (
        <View className="flex-row items-end mt-1">
          <TextInput
            className="flex-1 rounded-lg bg-neutral-800 text-white px-3 py-2.5 text-sm"
            placeholder="Write feedback..."
            placeholderTextColor="#6b7280"
            value={text}
            onChangeText={setText}
            multiline
            maxLength={500}
          />
          <Pressable
            onPress={handleSend}
            disabled={!text.trim() || sendFeedback.isPending}
            className="ml-2 p-2.5 rounded-lg"
            style={{
              backgroundColor: text.trim() ? "#3b82f6" : "rgba(255,255,255,0.05)",
            }}
          >
            {sendFeedback.isPending ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Send size={18} color={text.trim() ? "#fff" : "#6b7280"} />
            )}
          </Pressable>
        </View>
      )}
    </View>
  );
}
