import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PlanScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#0a0a0a]">
      <View className="px-5 pt-4 pb-2">
        <Text className="text-2xl font-bold text-white">Plans</Text>
        <Text className="text-muted-foreground mt-1">
          Your training plans
        </Text>
      </View>

      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-muted-foreground text-center text-base">
          Training plans will appear here
        </Text>
      </View>
    </SafeAreaView>
  );
}
