import { View, Text, FlatList, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/hooks/useAuth";

export default function HomeScreen() {
  const { user } = useAuth();
  const isCoach = user?.role === "COACH";

  return (
    <SafeAreaView className="flex-1 bg-[#0a0a0a]">
      <View className="px-5 pt-4 pb-2">
        <Text className="text-2xl font-bold text-white">
          {isCoach ? "Your Athletes" : "This Week"}
        </Text>
        <Text className="text-muted-foreground mt-1">
          {isCoach
            ? "Manage your athletes and their training"
            : "Your training schedule"}
        </Text>
      </View>

      {/* Placeholder for content - will be built in Sprint M2 */}
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-muted-foreground text-center text-base">
          {isCoach
            ? "Your athlete list will appear here"
            : "Your weekly training plan will appear here"}
        </Text>
      </View>
    </SafeAreaView>
  );
}
