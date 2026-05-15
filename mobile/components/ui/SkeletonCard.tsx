import { useEffect, useRef } from "react";
import { View, Animated } from "react-native";

interface SkeletonCardProps {
  lines?: number;
}

export function SkeletonCard({ lines = 3 }: SkeletonCardProps) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <View className="rounded-xl bg-gray-800 p-4 mb-3">
      {Array.from({ length: lines }).map((_, i) => (
        <Animated.View
          key={i}
          style={{ opacity }}
          className={`rounded bg-gray-700 h-4 mb-3 ${
            i === 0 ? "w-3/4" : i === lines - 1 ? "w-1/2" : "w-full"
          }`}
        />
      ))}
    </View>
  );
}
