import { View, Text } from "react-native";
import { MotiView } from "moti";
import { WifiOff } from "lucide-react-native";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";

export function OfflineBanner() {
  const { isConnected } = useNetworkStatus();

  if (isConnected) return null;

  return (
    <MotiView
      from={{ opacity: 0, translateY: -40 }}
      animate={{ opacity: 1, translateY: 0 }}
      exit={{ opacity: 0, translateY: -40 }}
      transition={{ type: "timing", duration: 300 }}
    >
      <View className="bg-red-900/90 flex-row items-center justify-center py-2 px-4">
        <WifiOff size={14} color="#fca5a5" />
        <Text className="text-red-200 text-xs font-medium ml-2">
          No internet connection
        </Text>
      </View>
    </MotiView>
  );
}
