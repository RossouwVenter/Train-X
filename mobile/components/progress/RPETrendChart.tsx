import { View, Text } from "react-native";
import Svg, { Polyline, Line, Circle as SvgCircle } from "react-native-svg";

interface RPETrendChartProps {
  data: { week: string; avgRpe: number; count: number }[];
}

const CHART_W = 280;
const CHART_H = 120;
const PADDING = 20;

export function RPETrendChart({ data }: RPETrendChartProps) {
  if (!data.length || data.every((d) => d.avgRpe === 0)) {
    return (
      <View className="items-center py-6">
        <Text className="text-sm text-gray-500">No RPE data yet</Text>
      </View>
    );
  }

  const maxRpe = 10;
  const plotW = CHART_W - PADDING * 2;
  const plotH = CHART_H - PADDING * 2;

  const points = data.map((d, i) => {
    const x = PADDING + (i / Math.max(data.length - 1, 1)) * plotW;
    const y = PADDING + plotH - (d.avgRpe / maxRpe) * plotH;
    return { x, y, ...d };
  });

  const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(" ");

  function rpeColor(rpe: number): string {
    if (rpe <= 3) return "#22c55e";
    if (rpe <= 5) return "#facc15";
    if (rpe <= 7) return "#f97316";
    return "#ef4444";
  }

  // Format week label: "May 11"
  function formatWeek(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }

  return (
    <View className="items-center">
      <Svg width={CHART_W} height={CHART_H + 20}>
        {/* Grid lines */}
        {[2, 4, 6, 8].map((rpe) => {
          const y = PADDING + plotH - (rpe / maxRpe) * plotH;
          return (
            <Line
              key={rpe}
              x1={PADDING}
              y1={y}
              x2={CHART_W - PADDING}
              y2={y}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth={1}
            />
          );
        })}

        {/* Trend line */}
        <Polyline
          points={polylinePoints}
          fill="none"
          stroke="#3b82f6"
          strokeWidth={2.5}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Data points */}
        {points.map((p, i) => (
          <SvgCircle
            key={i}
            cx={p.x}
            cy={p.y}
            r={p.avgRpe > 0 ? 5 : 0}
            fill={rpeColor(p.avgRpe)}
            stroke="#0a0a0a"
            strokeWidth={2}
          />
        ))}
      </Svg>

      {/* Week labels */}
      <View className="flex-row justify-between w-full px-5 -mt-1">
        {points.map((p, i) => (
          <Text key={i} className="text-[9px] text-gray-600">
            {formatWeek(p.week)}
          </Text>
        ))}
      </View>
    </View>
  );
}
