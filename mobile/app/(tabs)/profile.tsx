import { View, Text, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/hooks/useAuth";
import { LogOut, Trash2, User } from "lucide-react-native";

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

  return (
    <SafeAreaView className="flex-1 bg-[#0a0a0a]">
      <View className="px-5 pt-4 pb-2">
        <Text className="text-2xl font-bold text-white">Profile</Text>
      </View>

      {/* User Info */}
      <View className="px-5 mt-4">
        <View className="bg-[#1a1a1a] rounded-2xl p-5 flex-row items-center">
          <View className="w-14 h-14 rounded-full bg-[#2a2a2a] items-center justify-center">
            <User size={24} color="#888" />
          </View>
          <View className="ml-4 flex-1">
            <Text className="text-white text-lg font-semibold">
              {user?.name || "User"}
            </Text>
            <Text className="text-muted-foreground text-sm">
              {user?.email}
            </Text>
            <View className="mt-1 bg-primary/20 self-start px-2 py-0.5 rounded">
              <Text className="text-primary text-xs font-medium">
                {user?.role}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Actions */}
      <View className="px-5 mt-6">
        <TouchableOpacity
          className="bg-[#1a1a1a] rounded-xl p-4 flex-row items-center mb-3"
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <LogOut size={20} color="#fff" />
          <Text className="text-white ml-3 text-base font-medium">
            Sign Out
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 flex-row items-center"
          onPress={handleDeleteAccount}
          activeOpacity={0.7}
        >
          <Trash2 size={20} color="#ef4444" />
          <Text className="text-destructive ml-3 text-base font-medium">
            Delete Account
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
