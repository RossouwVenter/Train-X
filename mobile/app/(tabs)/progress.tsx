import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProgressScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#0a0a0a]">
      <View className="px-5 pt-4 pb-2">
        <Text className="text-2xl font-bold text-white">Progress</Text>
        <Text className="text-muted-foreground mt-1">
          Track your training progress
        </Text>
      </View>

      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-muted-foreground text-center text-base">
          Progress charts will appear here
        </Text>
      </View>
    </SafeAreaView>
  );
}
