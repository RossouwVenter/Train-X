import { View, Text, Pressable, Alert, ScrollView, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/hooks/useAuth";
import {
  LogOut,
  Trash2,
  User,
  ChevronRight,
  Shield,
  Info,
  Mail,
} from "lucide-react-native";
import { HapticPressable } from "@/components/ui/HapticPressable";
import Constants from "expo-constants";

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign Out", style: "destructive", onPress: logout },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "This action is permanent and cannot be undone. All your data will be deleted.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            // TODO: Call delete API then logout
          },
        },
      ]
    );
  };

  const appVersion = Constants.expoConfig?.version ?? "1.0.0";

  return (
    <SafeAreaView className="flex-1 bg-[#0a0a0a]">
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="px-5 pt-4 pb-2">
          <Text className="text-2xl font-bold text-white">Profile</Text>
        </View>

        {/* User Info */}
        <View className="px-5 mt-4">
          <View className="bg-neutral-900 rounded-2xl p-5 flex-row items-center">
            <View className="w-16 h-16 rounded-full bg-blue-600/20 items-center justify-center">
              <Text className="text-2xl font-bold text-blue-400">
                {user?.name?.charAt(0)?.toUpperCase() ?? "?"}
              </Text>
            </View>
            <View className="ml-4 flex-1">
              <Text className="text-white text-lg font-semibold">
                {user?.name || "User"}
              </Text>
              <Text className="text-gray-400 text-sm">{user?.email}</Text>
              <View className="mt-1.5 bg-blue-600/20 self-start px-2.5 py-0.5 rounded-full">
                <Text className="text-blue-400 text-xs font-medium">
                  {user?.role === "COACH" ? "Coach" : "Athlete"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Menu items */}
        <View className="px-5 mt-6">
          <Text className="text-xs font-semibold text-gray-500 mb-2 ml-1">
            ACCOUNT
          </Text>

          <View className="bg-neutral-900 rounded-xl overflow-hidden">
            <HapticPressable
              haptic="light"
              className="flex-row items-center px-4 py-3.5 border-b border-neutral-800"
              onPress={handleLogout}
            >
              <LogOut size={18} color="#9ca3af" />
              <Text className="text-white ml-3 flex-1 text-[15px]">
                Sign Out
              </Text>
              <ChevronRight size={16} color="#4b5563" />
            </HapticPressable>

            <HapticPressable
              haptic="light"
              className="flex-row items-center px-4 py-3.5"
              onPress={handleDeleteAccount}
            >
              <Trash2 size={18} color="#ef4444" />
              <Text className="text-red-400 ml-3 flex-1 text-[15px]">
                Delete Account
              </Text>
              <ChevronRight size={16} color="#4b5563" />
            </HapticPressable>
          </View>
        </View>

        {/* About section */}
        <View className="px-5 mt-6">
          <Text className="text-xs font-semibold text-gray-500 mb-2 ml-1">
            ABOUT
          </Text>

          <View className="bg-neutral-900 rounded-xl overflow-hidden">
            <View className="flex-row items-center px-4 py-3.5 border-b border-neutral-800">
              <Info size={18} color="#9ca3af" />
              <Text className="text-white ml-3 flex-1 text-[15px]">
                Version
              </Text>
              <Text className="text-gray-500 text-sm">{appVersion}</Text>
            </View>

            <HapticPressable
              haptic="light"
              className="flex-row items-center px-4 py-3.5 border-b border-neutral-800"
              onPress={() => Linking.openURL("https://trainx.app/privacy")}
            >
              <Shield size={18} color="#9ca3af" />
              <Text className="text-white ml-3 flex-1 text-[15px]">
                Privacy Policy
              </Text>
              <ChevronRight size={16} color="#4b5563" />
            </HapticPressable>

            <HapticPressable
              haptic="light"
              className="flex-row items-center px-4 py-3.5"
              onPress={() => Linking.openURL("mailto:support@trainx.app")}
            >
              <Mail size={18} color="#9ca3af" />
              <Text className="text-white ml-3 flex-1 text-[15px]">
                Contact Support
              </Text>
              <ChevronRight size={16} color="#4b5563" />
            </HapticPressable>
          </View>
        </View>

        {/* Footer */}
        <View className="items-center mt-8">
          <Text className="text-xs text-gray-600">
            TrainX v{appVersion}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
