import { View, Text, Modal, Pressable, ScrollView } from "react-native";
import type { ReactNode } from "react";

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export function BottomSheet({ visible, onClose, title, children }: BottomSheetProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end">
        {/* Overlay */}
        <Pressable
          className="absolute inset-0 bg-black/60"
          onPress={onClose}
        />

        {/* Sheet */}
        <View className="bg-gray-900 rounded-t-2xl max-h-[85%]">
          {/* Drag indicator */}
          <View className="items-center pt-3 pb-2">
            <View className="w-10 h-1 rounded-full bg-gray-600" />
          </View>

          {/* Header */}
          {title && (
            <View className="px-5 pb-3 border-b border-gray-800">
              <Text className="text-lg font-semibold text-white">
                {title}
              </Text>
            </View>
          )}

          {/* Content */}
          <ScrollView className="px-5 py-4">{children}</ScrollView>
        </View>
      </View>
    </Modal>
  );
}
