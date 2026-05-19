import { View, Text } from "react-native";
import Svg, { Circle } from "react-native-svg";

interface CompletionRingProps {
  percentage: number;
  completed: number;
  total: number;
  size?: number;
}

export function CompletionRing({
  percentage,
  completed,
  total,
  size = 120,
}: CompletionRingProps) {
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(percentage, 100);
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const color =
    progress >= 80 ? "#22c55e" : progress >= 50 ? "#facc15" : "#f97316";

  return (
    <View className="items-center">
      <View style={{ width: size, height: size }}>
        <Svg width={size} height={size}>
          {/* Background circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </Svg>
        {/* Center text */}
        <View
          className="absolute items-center justify-center"
          style={{ width: size, height: size }}
        >
          <Text className="text-2xl font-bold text-white">{progress}%</Text>
          <Text className="text-[10px] text-gray-500">
            {completed}/{total}
          </Text>
        </View>
      </View>
    </View>
  );
}
