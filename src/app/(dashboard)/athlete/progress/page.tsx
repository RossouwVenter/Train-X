"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Target,
  TrendingUp,
  MessageSquare,
  Trophy,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

// ── Types ──────────────────────────────────────────────────────────

interface RpeDataPoint {
  date: string;
  rpe: number;
  sessionName: string;
}

interface WeeklyVolumeData {
  weekLabel: string;
  completed: number;
  planned: number;
}

type SessionStatus = "completed" | "missed" | "partial";

interface SessionRecord {
  id: string;
  date: string;
  name: string;
  exercises: number;
  rpe: number | null;
  status: SessionStatus;
  coachFeedback: string | null;
}

interface PersonalRecord {
  label: string;
  value: string;
  detail: string;
}

// ── Mock Data ──────────────────────────────────────────────────────

const rpeData: RpeDataPoint[] = [
  { date: "Apr 7", rpe: 6.5, sessionName: "Upper Body Strength" },
  { date: "Apr 8", rpe: 7.0, sessionName: "Lower Body Power" },
  { date: "Apr 9", rpe: 5.5, sessionName: "Active Recovery" },
  { date: "Apr 11", rpe: 7.5, sessionName: "Push & Core" },
  { date: "Apr 12", rpe: 8.0, sessionName: "Full Body Conditioning" },
  { date: "Apr 14", rpe: 7.0, sessionName: "Upper Body Strength" },
  { date: "Apr 15", rpe: 7.5, sessionName: "Lower Body Power" },
  { date: "Apr 16", rpe: 6.0, sessionName: "Active Recovery" },
  { date: "Apr 18", rpe: 8.5, sessionName: "Push & Core" },
  { date: "Apr 19", rpe: 7.0, sessionName: "Full Body Conditioning" },
  { date: "Apr 21", rpe: 6.5, sessionName: "Upper Body Strength" },
  { date: "Apr 22", rpe: 7.0, sessionName: "Lower Body Power" },
  { date: "Apr 23", rpe: 5.0, sessionName: "Active Recovery" },
  { date: "Apr 25", rpe: 7.5, sessionName: "Push & Core" },
  { date: "Apr 26", rpe: 8.0, sessionName: "Full Body Conditioning" },
  { date: "Apr 28", rpe: 7.0, sessionName: "Upper Body Strength" },
  { date: "Apr 29", rpe: 7.5, sessionName: "Lower Body Power" },
  { date: "Apr 30", rpe: 4.0, sessionName: "Active Recovery" },
  { date: "May 2", rpe: 8.0, sessionName: "Push & Core" },
  { date: "May 3", rpe: 7.2, sessionName: "Full Body Conditioning" },
];

const weeklyVolumeData: WeeklyVolumeData[] = [
  { weekLabel: "Mar 10", completed: 3, planned: 4 },
  { weekLabel: "Mar 17", completed: 4, planned: 5 },
  { weekLabel: "Mar 24", completed: 5, planned: 5 },
  { weekLabel: "Mar 31", completed: 4, planned: 5 },
  { weekLabel: "Apr 7", completed: 4, planned: 5 },
  { weekLabel: "Apr 14", completed: 5, planned: 5 },
  { weekLabel: "Apr 21", completed: 4, planned: 5 },
  { weekLabel: "Apr 28", completed: 4, planned: 5 },
];

const sessionHistory: SessionRecord[] = [
  { id: "sh1", date: "May 3", name: "Full Body Conditioning", exercises: 3, rpe: 7.2, status: "completed", coachFeedback: "Great session! Really solid effort on the conditioning work." },
  { id: "sh2", date: "May 2", name: "Push & Core", exercises: 4, rpe: 8.0, status: "completed", coachFeedback: "Push volume is looking good. Consider adding a set to planks." },
  { id: "sh3", date: "Apr 30", name: "Active Recovery", exercises: 3, rpe: 4.0, status: "completed", coachFeedback: null },
  { id: "sh4", date: "Apr 29", name: "Lower Body Power", exercises: 4, rpe: 7.5, status: "completed", coachFeedback: "Squat depth was excellent. Keep it up." },
  { id: "sh5", date: "Apr 28", name: "Upper Body Strength", exercises: 4, rpe: 7.0, status: "completed", coachFeedback: null },
  { id: "sh6", date: "Apr 26", name: "Full Body Conditioning", exercises: 3, rpe: 8.0, status: "completed", coachFeedback: "Great intensity! Watch the rest periods." },
  { id: "sh7", date: "Apr 25", name: "Push & Core", exercises: 4, rpe: 7.5, status: "partial", coachFeedback: "Missed the last set on dips — that's okay, listen to your body." },
  { id: "sh8", date: "Apr 24", name: "Pull & Arms", exercises: 4, rpe: null, status: "missed", coachFeedback: "Rest is important too. Let's catch up next week." },
  { id: "sh9", date: "Apr 23", name: "Active Recovery", exercises: 3, rpe: 5.0, status: "completed", coachFeedback: null },
  { id: "sh10", date: "Apr 22", name: "Lower Body Power", exercises: 4, rpe: 7.0, status: "completed", coachFeedback: null },
  { id: "sh11", date: "Apr 21", name: "Upper Body Strength", exercises: 4, rpe: 6.5, status: "completed", coachFeedback: "Try increasing bench weight by 2.5kg next session." },
  { id: "sh12", date: "Apr 19", name: "Full Body Conditioning", exercises: 3, rpe: 7.0, status: "completed", coachFeedback: null },
  { id: "sh13", date: "Apr 18", name: "Push & Core", exercises: 4, rpe: 8.5, status: "completed", coachFeedback: "RPE was high — make sure to eat well tonight." },
  { id: "sh14", date: "Apr 17", name: "Pull & Arms", exercises: 4, rpe: null, status: "missed", coachFeedback: null },
  { id: "sh15", date: "Apr 16", name: "Active Recovery", exercises: 3, rpe: 6.0, status: "completed", coachFeedback: null },
  { id: "sh16", date: "Apr 15", name: "Lower Body Power", exercises: 4, rpe: 7.5, status: "completed", coachFeedback: "Volume looks great this week." },
  { id: "sh17", date: "Apr 14", name: "Upper Body Strength", exercises: 4, rpe: 7.0, status: "completed", coachFeedback: null },
  { id: "sh18", date: "Apr 12", name: "Full Body Conditioning", exercises: 3, rpe: 8.0, status: "completed", coachFeedback: null },
  { id: "sh19", date: "Apr 11", name: "Push & Core", exercises: 4, rpe: 7.5, status: "partial", coachFeedback: "No worries on the partial — still solid work." },
  { id: "sh20", date: "Apr 9", name: "Active Recovery", exercises: 3, rpe: 5.5, status: "completed", coachFeedback: null },
];

const personalRecords: PersonalRecord[] = [
  { label: "Best Streak", value: "21 days", detail: "Mar 3 – Mar 23" },
  { label: "Highest Compliance Week", value: "100%", detail: "Week of Apr 14" },
  { label: "Most Improved Exercise", value: "Bench Press +15kg", detail: "60kg → 75kg since Feb" },
];

// ── Summary stats ──────────────────────────────────────────────────

const summaryStats = {
  sessionsCompleted: 18,
  sessionsPlanned: 22,
  currentStreak: 12,
  averageRpe: 7.2,
  weeklyCompliance: 85,
  complianceTrend: "up" as "up" | "down",
};

// ── Circular Progress Component ────────────────────────────────────

function CircularProgress({
  value,
  max,
  size = 44,
  strokeWidth = 4,
}: {
  value: number;
  max: number;
  size?: number;
  strokeWidth?: number;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(value / max, 1);
  const offset = circumference * (1 - progress);

  return (
    <svg width={size} height={size} className="shrink-0 -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="text-muted/30"
      />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="url(#progressGradient)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
      <defs>
        <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// ── RPE Trend Line Chart ───────────────────────────────────────────

function RpeTrendChart({ data }: { data: RpeDataPoint[] }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const padding = { top: 20, right: 20, bottom: 40, left: 40 };
  const width = 600;
  const height = 280;
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const yMin = 1;
  const yMax = 10;
  const yTicks = [2, 4, 6, 8, 10];

  const points = data.map((d, i) => ({
    x: padding.left + (i / (data.length - 1)) * chartW,
    y: padding.top + chartH - ((d.rpe - yMin) / (yMax - yMin)) * chartH,
    ...d,
  }));

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${padding.top + chartH} L ${points[0].x} ${padding.top + chartH} Z`;

  return (
    <div className="relative w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="rpeLineGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#34d399" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#34d399" stopOpacity="0.02" />
          </linearGradient>
          <linearGradient id="rpeStrokeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6ee7b7" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {yTicks.map((tick) => {
          const y = padding.top + chartH - ((tick - yMin) / (yMax - yMin)) * chartH;
          return (
            <g key={tick}>
              <line
                x1={padding.left}
                y1={y}
                x2={padding.left + chartW}
                y2={y}
                stroke="currentColor"
                strokeOpacity={0.08}
                strokeDasharray="4 4"
              />
              <text
                x={padding.left - 8}
                y={y + 4}
                textAnchor="end"
                className="fill-muted-foreground"
                fontSize={11}
              >
                {tick}
              </text>
            </g>
          );
        })}

        {/* X-axis labels — every 4th */}
        {points.map((p, i) =>
          i % 4 === 0 || i === points.length - 1 ? (
            <text
              key={i}
              x={p.x}
              y={padding.top + chartH + 20}
              textAnchor="middle"
              className="fill-muted-foreground"
              fontSize={10}
            >
              {p.date}
            </text>
          ) : null
        )}

        {/* Area fill */}
        <motion.path
          d={areaPath}
          fill="url(#rpeLineGradient)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        />

        {/* Line */}
        <motion.path
          d={linePath}
          fill="none"
          stroke="url(#rpeStrokeGradient)"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        />

        {/* Data points */}
        {points.map((p, i) => (
          <g key={i}>
            <motion.circle
              cx={p.x}
              cy={p.y}
              r={hoveredIndex === i ? 6 : 4}
              fill={hoveredIndex === i ? "#10b981" : "#1f2937"}
              stroke="#10b981"
              strokeWidth={2}
              className="cursor-pointer"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: 0.8 + i * 0.03 }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            />
            {/* Invisible larger hit area */}
            <circle
              cx={p.x}
              cy={p.y}
              r={14}
              fill="transparent"
              className="cursor-pointer"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            />
          </g>
        ))}
      </svg>

      {/* Tooltip */}
      <AnimatePresence>
        {hoveredIndex !== null && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className="pointer-events-none absolute rounded-lg border border-border bg-popover px-3 py-2 shadow-lg"
            style={{
              left: `${(points[hoveredIndex].x / width) * 100}%`,
              top: `${(points[hoveredIndex].y / height) * 100 - 16}%`,
              transform: "translate(-50%, -100%)",
            }}
          >
            <p className="text-xs font-medium text-foreground">
              RPE {data[hoveredIndex].rpe}
            </p>
            <p className="text-[10px] text-muted-foreground">
              {data[hoveredIndex].date} · {data[hoveredIndex].sessionName}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Weekly Volume Bar Chart ────────────────────────────────────────

function WeeklyVolumeChart({ data }: { data: WeeklyVolumeData[] }) {
  const padding = { top: 20, right: 20, bottom: 40, left: 40 };
  const width = 600;
  const height = 250;
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const maxVal = Math.max(...data.map((d) => d.planned));
  const barGroupWidth = chartW / data.length;
  const barWidth = barGroupWidth * 0.5;
  const yTicks = Array.from({ length: maxVal + 1 }, (_, i) => i).filter(
    (v) => v % 1 === 0
  );

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="barFillGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
      </defs>

      {/* Y-axis grid */}
      {yTicks.map((tick) => {
        const y = padding.top + chartH - (tick / maxVal) * chartH;
        return (
          <g key={tick}>
            <line
              x1={padding.left}
              y1={y}
              x2={padding.left + chartW}
              y2={y}
              stroke="currentColor"
              strokeOpacity={0.08}
              strokeDasharray="4 4"
            />
            <text
              x={padding.left - 8}
              y={y + 4}
              textAnchor="end"
              className="fill-muted-foreground"
              fontSize={11}
            >
              {tick}
            </text>
          </g>
        );
      })}

      {data.map((d, i) => {
        const x = padding.left + i * barGroupWidth + (barGroupWidth - barWidth) / 2;
        const plannedH = (d.planned / maxVal) * chartH;
        const completedH = (d.completed / maxVal) * chartH;
        const plannedY = padding.top + chartH - plannedH;
        const completedY = padding.top + chartH - completedH;

        return (
          <g key={i}>
            {/* Planned bar (outline) */}
            <rect
              x={x}
              y={plannedY}
              width={barWidth}
              height={plannedH}
              fill="none"
              stroke="currentColor"
              strokeOpacity={0.15}
              strokeWidth={1.5}
              rx={4}
            />

            {/* Completed bar (filled) */}
            <motion.rect
              x={x}
              y={completedY}
              width={barWidth}
              height={completedH}
              fill="url(#barFillGradient)"
              rx={4}
              initial={{ height: 0, y: padding.top + chartH }}
              animate={{ height: completedH, y: completedY }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: "easeOut" }}
              fillOpacity={0.85}
            />

            {/* X-axis label */}
            <text
              x={x + barWidth / 2}
              y={padding.top + chartH + 20}
              textAnchor="middle"
              className="fill-muted-foreground"
              fontSize={10}
            >
              {d.weekLabel}
            </text>

            {/* Count label on bar */}
            <motion.text
              x={x + barWidth / 2}
              y={completedY - 6}
              textAnchor="middle"
              className="fill-foreground"
              fontSize={11}
              fontWeight={600}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.6 + i * 0.08 }}
            >
              {d.completed}/{d.planned}
            </motion.text>
          </g>
        );
      })}
    </svg>
  );
}

// ── Status Badge helper ────────────────────────────────────────────

function StatusBadge({ status }: { status: SessionStatus }) {
  const config: Record<SessionStatus, { label: string; className: string }> = {
    completed: {
      label: "Completed",
      className: "bg-emerald-500/15 text-emerald-500 border-emerald-500/20",
    },
    missed: {
      label: "Missed",
      className: "bg-red-500/15 text-red-500 border-red-500/20",
    },
    partial: {
      label: "Partial",
      className: "bg-amber-500/15 text-amber-500 border-amber-500/20",
    },
  };

  const c = config[status];
  return <Badge className={cn("text-[11px]", c.className)}>{c.label}</Badge>;
}

// ── RPE color helper ───────────────────────────────────────────────

function rpeColor(rpe: number): string {
  if (rpe < 6) return "text-emerald-400";
  if (rpe <= 8) return "text-amber-400";
  return "text-red-400";
}

function rpeBgColor(rpe: number): string {
  if (rpe < 6) return "bg-emerald-500/15";
  if (rpe <= 8) return "bg-amber-500/15";
  return "bg-red-500/15";
}

// ── Main Page ──────────────────────────────────────────────────────

export default function ProgressPage() {
  const [statusFilter, setStatusFilter] = useState<"all" | SessionStatus>("all");
  const [expandedFeedbackId, setExpandedFeedbackId] = useState<string | null>(null);

  const filteredSessions = useMemo(
    () =>
      statusFilter === "all"
        ? sessionHistory
        : sessionHistory.filter((s) => s.status === statusFilter),
    [statusFilter]
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Progress
        </h1>
        <p className="text-muted-foreground">
          Track your training history and trends
        </p>
      </div>

      {/* ── Summary Strip ─────────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Sessions Completed */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="transition-all duration-200 hover:shadow-md hover:shadow-black/10">
            <CardContent className="flex items-center gap-4 pt-6">
              <CircularProgress
                value={summaryStats.sessionsCompleted}
                max={summaryStats.sessionsPlanned}
              />
              <div>
                <p className="text-2xl font-bold">
                  {summaryStats.sessionsCompleted}/{summaryStats.sessionsPlanned}
                </p>
                <p className="text-xs text-muted-foreground">
                  Sessions Completed
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Current Streak */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
        >
          <Card className="transition-all duration-200 hover:shadow-md hover:shadow-black/10">
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-orange-500/10">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <defs>
                    <linearGradient id="flameGrad" x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#f97316" />
                      <stop offset="1" stopColor="#ef4444" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M12 2C12 2 7 8 7 13a5 5 0 0 0 10 0c0-5-5-11-5-11Z"
                    fill="url(#flameGrad)"
                    opacity="0.9"
                  />
                  <path
                    d="M12 10c0 0-2.5 3-2.5 5.5a2.5 2.5 0 0 0 5 0c0-2.5-2.5-5.5-2.5-5.5Z"
                    fill="#fbbf24"
                    opacity="0.8"
                  />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {summaryStats.currentStreak} days
                </p>
                <p className="text-xs text-muted-foreground">Current Streak</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Average RPE */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card className="transition-all duration-200 hover:shadow-md hover:shadow-black/10">
            <CardContent className="flex items-center gap-4 pt-6">
              <div
                className={cn(
                  "flex h-11 w-11 items-center justify-center rounded-lg",
                  rpeBgColor(summaryStats.averageRpe)
                )}
              >
                <Target
                  className={cn(
                    "h-5 w-5",
                    rpeColor(summaryStats.averageRpe)
                  )}
                />
              </div>
              <div>
                <p className={cn("text-2xl font-bold", rpeColor(summaryStats.averageRpe))}>
                  {summaryStats.averageRpe}
                </p>
                <p className="text-xs text-muted-foreground">Average RPE</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Weekly Compliance */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <Card className="transition-all duration-200 hover:shadow-md hover:shadow-black/10">
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-orange-500/10">
                <TrendingUp className="h-5 w-5 text-orange-400" />
              </div>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold">
                  {summaryStats.weeklyCompliance}%
                </p>
                {summaryStats.complianceTrend === "up" ? (
                  <ArrowUpRight className="h-4 w-4 text-emerald-400" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-400" />
                )}
              </div>
              <p className="sr-only">Weekly Compliance</p>
            </CardContent>
            <div className="px-6 pb-4">
              <p className="text-xs text-muted-foreground">
                Weekly Compliance
              </p>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* ── Charts ────────────────────────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* RPE Trend */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">RPE Trend</CardTitle>
              <CardDescription>
                Rate of perceived exertion over the last 20 sessions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RpeTrendChart data={rpeData} />
            </CardContent>
          </Card>
        </motion.div>

        {/* Weekly Volume */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Weekly Volume</CardTitle>
              <CardDescription>
                Sessions completed vs. planned per week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <WeeklyVolumeChart data={weeklyVolumeData} />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ── Session History ───────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.35 }}
      >
        <Card>
          <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-lg">Session History</CardTitle>
              <CardDescription>Your last 20 training sessions</CardDescription>
            </div>
            <Tabs
              value={statusFilter}
              onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}
            >
              <TabsList>
                <TabsTrigger value="all" className="text-xs">
                  All
                </TabsTrigger>
                <TabsTrigger value="completed" className="text-xs">
                  Completed
                </TabsTrigger>
                <TabsTrigger value="missed" className="text-xs">
                  Missed
                </TabsTrigger>
                <TabsTrigger value="partial" className="text-xs">
                  Partial
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <div className="max-h-[420px] overflow-y-auto">
              {/* Desktop table header */}
              <div className="hidden border-b border-border/50 pb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground sm:grid sm:grid-cols-[100px_1fr_70px_60px_90px_40px]">
                <span>Date</span>
                <span>Session</span>
                <span className="text-center">Exercises</span>
                <span className="text-center">RPE</span>
                <span className="text-center">Status</span>
                <span />
              </div>

              <AnimatePresence mode="popLayout">
                {filteredSessions.map((session) => (
                  <motion.div
                    key={session.id}
                    layout
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* Row */}
                    <div className="grid items-center gap-2 border-b border-border/30 py-3 text-sm sm:grid-cols-[100px_1fr_70px_60px_90px_40px]">
                      <span className="text-muted-foreground">
                        {session.date}
                      </span>
                      <span className="font-medium">{session.name}</span>
                      <span className="text-center text-muted-foreground">
                        {session.exercises}
                      </span>
                      <span
                        className={cn(
                          "text-center font-medium",
                          session.rpe !== null
                            ? rpeColor(session.rpe)
                            : "text-muted-foreground"
                        )}
                      >
                        {session.rpe !== null ? session.rpe : "—"}
                      </span>
                      <div className="flex justify-center">
                        <StatusBadge status={session.status} />
                      </div>
                      <div className="flex justify-center">
                        {session.coachFeedback && (
                          <button
                            onClick={() =>
                              setExpandedFeedbackId(
                                expandedFeedbackId === session.id
                                  ? null
                                  : session.id
                              )
                            }
                            className={cn(
                              "rounded-md p-1 transition-colors hover:bg-accent",
                              expandedFeedbackId === session.id &&
                                "bg-accent text-accent-foreground"
                            )}
                            aria-label="Toggle coach feedback"
                          >
                            <MessageSquare className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Coach feedback bubble */}
                    <AnimatePresence>
                      {expandedFeedbackId === session.id &&
                        session.coachFeedback && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="relative mb-2 ml-4 mt-1 max-w-md rounded-lg rounded-tl-none border border-border/50 bg-accent/50 px-3 py-2 sm:ml-[100px]">
                              <p className="text-xs text-muted-foreground">
                                <span className="mr-1 font-medium text-foreground">
                                  Coach:
                                </span>
                                {session.coachFeedback}
                              </p>
                            </div>
                          </motion.div>
                        )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </AnimatePresence>

              {filteredSessions.length === 0 && (
                <div className="py-12 text-center text-sm text-muted-foreground">
                  No sessions match this filter.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ── Personal Records ──────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Trophy className="h-5 w-5 text-amber-400" />
              Personal Records
            </CardTitle>
            <CardDescription>Your best achievements so far</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              {personalRecords.map((pr) => (
                <div
                  key={pr.label}
                  className="rounded-lg border border-border/50 bg-accent/30 p-4"
                >
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {pr.label}
                  </p>
                  <p className="mt-1 text-lg font-bold text-foreground">
                    {pr.value}
                  </p>
                  <p className="text-xs text-muted-foreground">{pr.detail}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
