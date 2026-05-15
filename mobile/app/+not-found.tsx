import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center bg-[#0a0a0a] px-6">
      <Text className="text-4xl font-bold text-white mb-2">404</Text>
      <Text className="text-muted-foreground text-center mb-6">
        This screen doesn't exist.
      </Text>
      <TouchableOpacity
        className="bg-primary rounded-xl px-6 py-3"
        onPress={() => router.replace("/")}
      >
        <Text className="text-primary-foreground font-semibold">
          Go Home
        </Text>
      </TouchableOpacity>
    </View>
  );
}
