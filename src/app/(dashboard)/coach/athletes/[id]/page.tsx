"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Mail,
  Trophy,
  Calendar,
  Activity,
  Flame,
  BarChart3,
  Zap,
  Clock,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Send,
  Star,
  CheckCircle2,
  XCircle,
  ClipboardList,
  Plus,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  Save,
  Pencil,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ──────────────────────────────────────────────────────────────────

interface FeedbackMessage {
  id: string;
  sender: "coach" | "athlete";
  message: string;
  timestamp: string;
  sessionId?: string;
  rating?: "Great" | "Good" | "Needs Work";
}

interface WeeklySession {
  id: string;
  day: string;
  name: string;
  workout: string;
}

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const QUICK_TYPES = [
  { label: "🏊 Swim", name: "Swim" },
  { label: "🚴 Bike", name: "Bike" },
  { label: "🏃 Run", name: "Run" },
  { label: "🏋️ Strength", name: "Strength" },
];

const initialWeeklySessions: WeeklySession[] = [
  { id: "ws1", day: "Monday", name: "Easy Run", workout: "45min Zone 2, flat route. Keep HR below 145bpm." },
  { id: "ws2", day: "Tuesday", name: "Swim Intervals", workout: "Warm-up 400m easy. Main: 10 x 100m @ 1:40, 20s rest. Cool-down 200m." },
  { id: "ws3", day: "Wednesday", name: "Bike Tempo", workout: "1hr ride. 20min warm-up, 2x15min @ threshold, 10min cool-down." },
  { id: "ws4", day: "Thursday", name: "Strength", workout: "Upper body focus:\nBench 4x8\nRows 4x10\nShoulder press 3x10\nCore circuit 3 rounds" },
  { id: "ws5", day: "Friday", name: "Brick Session", workout: "45min bike @ Z3 then immediately 15min run @ race pace." },
  { id: "ws6", day: "Saturday", name: "Long Run", workout: "90min easy with last 20min at marathon pace." },
];

interface SessionExercise {
  name: string;
  workout: string;
}

interface SessionHistory {
  id: string;
  date: string;
  name: string;
  rpe: number;
  completed: boolean;
  duration: string;
  exercises: SessionExercise[];
  athleteNotes?: string;
}

// ─── Mock Data ──────────────────────────────────────────────────────────────

const mockAthletes = [
  {
    id: "1",
    name: "Sam Torres",
    email: "sam.torres@email.com",
    sport: "Track & Field",
    status: "active" as const,
    completionRate: 92,
    lastActive: "2026-05-04",
    joinedDate: "2025-09-15",
    sessionsThisWeek: 4,
    avgRpe: 7.2,
    currentStreak: 12,
  },
  {
    id: "2",
    name: "Maria Chen",
    email: "maria.chen@email.com",
    sport: "Swimming",
    status: "active" as const,
    completionRate: 85,
    lastActive: "2026-05-03",
    joinedDate: "2025-11-02",
    sessionsThisWeek: 3,
    avgRpe: 6.8,
    currentStreak: 7,
  },
  {
    id: "3",
    name: "Jake Wilson",
    email: "jake.wilson@email.com",
    sport: "CrossFit",
    status: "active" as const,
    completionRate: 78,
    lastActive: "2026-05-01",
    joinedDate: "2026-01-10",
    sessionsThisWeek: 2,
    avgRpe: 8.1,
    currentStreak: 3,
  },
  {
    id: "4",
    name: "Aisha Patel",
    email: "aisha.patel@email.com",
    sport: "Yoga",
    status: "inactive" as const,
    completionRate: 45,
    lastActive: "2026-04-10",
    joinedDate: "2025-08-20",
    sessionsThisWeek: 0,
    avgRpe: 4.5,
    currentStreak: 0,
  },
  {
    id: "5",
    name: "Carlos Ruiz",
    email: "carlos.ruiz@email.com",
    sport: "Boxing",
    status: "active" as const,
    completionRate: 88,
    lastActive: "2026-05-05",
    joinedDate: "2025-12-01",
    sessionsThisWeek: 5,
    avgRpe: 7.8,
    currentStreak: 18,
  },
];

const mockSessions: SessionHistory[] = [
  {
    id: "s1",
    date: "2026-05-04",
    name: "Upper Body Strength",
    rpe: 8,
    completed: true,
    duration: "62 min",
    exercises: [
      { name: "Bench Press", workout: "4 x 8 @ 80kg" },
      { name: "Overhead Press", workout: "3 x 10 @ 45kg" },
      { name: "Pull-Ups", workout: "4 x 12" },
      { name: "Dumbbell Rows", workout: "3 x 10 @ 30kg" },
    ],
    athleteNotes: "Felt strong today. Bench PR attempt next week.",
  },
  {
    id: "s2",
    date: "2026-05-03",
    name: "Speed & Agility",
    rpe: 7,
    completed: true,
    duration: "45 min",
    exercises: [
      { name: "Sprint Intervals", workout: "8 x 100m, rest 60s between" },
      { name: "Ladder Drills", workout: "4 x 3 min" },
      { name: "Box Jumps", workout: "3 x 8" },
    ],
    athleteNotes: "Good session. Improved 100m split by 0.2s.",
  },
  {
    id: "s3",
    date: "2026-05-02",
    name: "Lower Body Power",
    rpe: 9,
    completed: true,
    duration: "70 min",
    exercises: [
      { name: "Back Squat", workout: "5 x 5 @ 120kg" },
      { name: "Romanian Deadlift", workout: "4 x 8 @ 90kg" },
      { name: "Bulgarian Split Squat", workout: "3 x 10 @ 24kg" },
      { name: "Calf Raises", workout: "4 x 15 @ 60kg" },
    ],
    athleteNotes: "Squats felt heavy. Left knee slightly tight after set 4.",
  },
  {
    id: "s4",
    date: "2026-04-30",
    name: "Active Recovery",
    rpe: 3,
    completed: true,
    duration: "35 min",
    exercises: [
      { name: "Light Jog", workout: "15 min easy pace" },
      { name: "Foam Rolling", workout: "10 min full body" },
      { name: "Stretching", workout: "10 min" },
    ],
  },
  {
    id: "s5",
    date: "2026-04-29",
    name: "Core & Conditioning",
    rpe: 7,
    completed: true,
    duration: "50 min",
    exercises: [
      { name: "Plank Hold", workout: "3 x 60s" },
      { name: "Russian Twists", workout: "3 x 20 @ 10kg" },
      { name: "Hanging Leg Raises", workout: "3 x 12" },
      { name: "Battle Ropes", workout: "4 x 30s" },
    ],
    athleteNotes: "Core is getting stronger. No issues.",
  },
  {
    id: "s6",
    date: "2026-04-28",
    name: "Technique Work",
    rpe: 5,
    completed: true,
    duration: "55 min",
    exercises: [
      { name: "Block Starts", workout: "10 x 30m" },
      { name: "Hurdle Drills", workout: "6 x 3 reps" },
      { name: "Form Running", workout: "4 x 80m" },
    ],
    athleteNotes: "Block start timing improved. Coach suggested wider stance.",
  },
  {
    id: "s7",
    date: "2026-04-26",
    name: "Upper Body Hypertrophy",
    rpe: 8,
    completed: false,
    duration: "40 min",
    exercises: [
      { name: "Incline Dumbbell Press", workout: "4 x 12 @ 28kg" },
      { name: "Cable Flyes", workout: "3 x 15" },
      { name: "Face Pulls", workout: "3 x 15" },
    ],
    athleteNotes: "Had to cut short — shoulder felt off after set 2 of incline.",
  },
  {
    id: "s8",
    date: "2026-04-25",
    name: "Endurance Run",
    rpe: 6,
    completed: true,
    duration: "48 min",
    exercises: [
      { name: "Steady-State Run", workout: "8km steady pace" },
      { name: "Cool-Down Walk", workout: "5 min" },
    ],
    athleteNotes: "Paced well. HR stayed in zone 2 throughout.",
  },
];

const initialFeedback: FeedbackMessage[] = [
  {
    id: "f1",
    sender: "coach",
    message:
      "Great work this week Sam! Your consistency is really showing in the numbers. Keep pushing on the sprint splits.",
    timestamp: "2026-05-04T10:30:00",
  },
  {
    id: "f2",
    sender: "athlete",
    message:
      "Thanks Coach! Feeling confident about the 100m improvements. Should I increase volume on speed days?",
    timestamp: "2026-05-04T11:15:00",
  },
  {
    id: "f3",
    sender: "coach",
    message:
      "Not yet — let's keep volume steady and focus on technique for the next two weeks. Quality over quantity.",
    timestamp: "2026-05-04T12:00:00",
  },
  {
    id: "f4",
    sender: "athlete",
    message:
      "Got it. Also wanted to mention my left knee felt a bit tight during heavy squats yesterday. Nothing sharp, just tightness.",
    timestamp: "2026-05-03T09:45:00",
  },
  {
    id: "f5",
    sender: "coach",
    message:
      "Thanks for flagging. Let's add extra knee mobility work to your warm-up. If it persists beyond this week, we should get it checked.",
    timestamp: "2026-05-03T10:20:00",
  },
];

const recentActivity = [
  { text: "Completed Upper Body Strength session", time: "Today, 9:30 AM", type: "session" as const },
  { text: "Hit 12-day training streak", time: "Today, 9:30 AM", type: "streak" as const },
  { text: "Completed Speed & Agility session", time: "Yesterday, 7:00 AM", type: "session" as const },
  { text: "Logged RPE 9 on Lower Body Power", time: "May 2, 6:15 PM", type: "alert" as const },
  { text: "Completed Active Recovery", time: "Apr 30, 10:00 AM", type: "session" as const },
];

const avatarColors = [
  "from-orange-500 to-amber-600",
  "from-amber-500 to-yellow-600",
  "from-rose-500 to-orange-600",
  "from-yellow-500 to-amber-600",
  "from-red-500 to-orange-600",
];

// ─── Helpers ────────────────────────────────────────────────────────────────

function rpeColor(rpe: number) {
  if (rpe <= 4) return "text-emerald-400";
  if (rpe <= 6) return "text-orange-400";
  if (rpe <= 8) return "text-amber-400";
  return "text-red-400";
}

function ratingColor(rating: string) {
  if (rating === "Great") return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
  if (rating === "Good") return "bg-orange-500/10 text-orange-400 border-orange-500/20";
  return "bg-amber-500/10 text-amber-400 border-amber-500/20";
}

const tabMotion = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.2, ease: "easeInOut" },
};

// ─── Component ──────────────────────────────────────────────────────────────

export default function AthleteProfilePage() {
  const params = useParams();
  const router = useRouter();
  const athlete = mockAthletes.find((a) => a.id === params.id);

  const [activeTab, setActiveTab] = useState("overview");
  const [feedbackMessages, setFeedbackMessages] = useState<FeedbackMessage[]>(initialFeedback);
  const [newMessage, setNewMessage] = useState("");
  const [expandedSession, setExpandedSession] = useState<string | null>(null);

  // Session feedback dialog state
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [feedbackSessionId, setFeedbackSessionId] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackRating, setFeedbackRating] = useState<"Great" | "Good" | "Needs Work" | null>(null);

  // Weekly sessions state
  const [weekSessions, setWeekSessions] = useState<WeeklySession[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [newSessionDay, setNewSessionDay] = useState("");
  const [newSessionName, setNewSessionName] = useState("");
  const [newSessionWorkout, setNewSessionWorkout] = useState("");
  const [weekOffset, setWeekOffset] = useState(0);
  const [saved, setSaved] = useState(false);
  const [editingSession, setEditingSession] = useState<WeeklySession | null>(null);
  const [editDay, setEditDay] = useState("");
  const [editName, setEditName] = useState("");
  const [editWorkout, setEditWorkout] = useState("");

  const getWeekStart = useCallback((offset: number) => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const monday = new Date(now);
    monday.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1) + offset * 7);
    monday.setHours(0, 0, 0, 0);
    return monday.toISOString().split("T")[0];
  }, []);

  const loadSessions = useCallback(async () => {
    setLoadingSessions(true);
    try {
      const weekStart = getWeekStart(weekOffset);
      const res = await fetch(`/api/sessions?athleteId=${params.id}&weekStart=${weekStart}`);
      if (res.ok) {
        const json = await res.json();
        const sessions: WeeklySession[] = (json.data?.sessions || []).map((s: { id: string; dayOfWeek: number; title: string; notes: string | null }) => ({
          id: s.id,
          day: DAYS_OF_WEEK[s.dayOfWeek],
          name: s.title,
          workout: s.notes || "",
        }));
        setWeekSessions(sessions);
      } else {
        setWeekSessions([]);
      }
    } catch {
      setWeekSessions([]);
    } finally {
      setLoadingSessions(false);
    }
  }, [params.id, weekOffset, getWeekStart]);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  const todayIndex = new Date().getDay();
  const todayName = DAYS_OF_WEEK[todayIndex === 0 ? 6 : todayIndex - 1];

  const getWeekLabel = () => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const monday = new Date(now);
    monday.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1) + weekOffset * 7);
    return monday.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const addSession = () => {
    if (!newSessionDay || !newSessionName.trim()) return;
    const session: WeeklySession = {
      id: Math.random().toString(36).substring(2, 9),
      day: newSessionDay,
      name: newSessionName.trim(),
      workout: newSessionWorkout.trim(),
    };
    setWeekSessions((prev) => [...prev, session]);
    setNewSessionDay("");
    setNewSessionName("");
    setNewSessionWorkout("");
  };

  const deleteSession = (id: string) => {
    setWeekSessions((prev) => prev.filter((s) => s.id !== id));
  };

  const handleSaveWeek = async () => {
    const weekStart = getWeekStart(weekOffset);
    const sessionsPayload = weekSessions.map((s) => ({
      dayOfWeek: DAYS_OF_WEEK.indexOf(s.day),
      title: s.name,
      type: "General",
      notes: s.workout,
    }));

    try {
      const res = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          athleteId: params.id,
          weekStart,
          sessions: sessionsPayload,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        const updated: WeeklySession[] = (json.data?.sessions || []).map((s: { id: string; dayOfWeek: number; title: string; notes: string | null }) => ({
          id: s.id,
          day: DAYS_OF_WEEK[s.dayOfWeek],
          name: s.title,
          workout: s.notes || "",
        }));
        setWeekSessions(updated);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      } else {
        alert("Failed to save sessions");
      }
    } catch {
      alert("Failed to save sessions");
    }
  };

  const openEditSession = (session: WeeklySession) => {
    setEditingSession(session);
    setEditDay(session.day);
    setEditName(session.name);
    setEditWorkout(session.workout);
  };

  const handleUpdateSession = () => {
    if (!editingSession || !editName.trim()) return;
    setWeekSessions((prev) =>
      prev.map((s) =>
        s.id === editingSession.id
          ? { ...s, day: editDay, name: editName.trim(), workout: editWorkout.trim() }
          : s
      )
    );
    setEditingSession(null);
  };

  if (!athlete) {
    return (
      <div className="space-y-6">
        <Button
          variant="ghost"
          className="gap-2"
          onClick={() => router.push("/coach/athletes")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Athletes
        </Button>
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-lg font-medium text-foreground">
            Athlete not found
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            This athlete doesn&apos;t exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  const initials = athlete.name
    .split(" ")
    .map((n) => n[0])
    .join("");
  const colorIndex = parseInt(athlete.id, 10) % avatarColors.length;

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    const msg: FeedbackMessage = {
      id: `f${Date.now()}`,
      sender: "coach",
      message: newMessage.trim(),
      timestamp: new Date().toISOString(),
    };
    setFeedbackMessages((prev) => [...prev, msg]);
    setNewMessage("");
  };

  const handleSessionFeedback = () => {
    if (!feedbackText.trim() || !feedbackSessionId) return;
    const session = mockSessions.find((s) => s.id === feedbackSessionId);
    const msg: FeedbackMessage = {
      id: `f${Date.now()}`,
      sender: "coach",
      message: feedbackText.trim(),
      timestamp: new Date().toISOString(),
      sessionId: feedbackSessionId,
      rating: feedbackRating ?? undefined,
    };
    setFeedbackMessages((prev) => [...prev, msg]);
    setFeedbackText("");
    setFeedbackRating(null);
    setFeedbackSessionId(null);
    setFeedbackDialogOpen(false);
  };

  const openSessionFeedback = (sessionId: string) => {
    setFeedbackSessionId(sessionId);
    setFeedbackText("");
    setFeedbackRating(null);
    setFeedbackDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Button
        variant="ghost"
        className="gap-2"
        onClick={() => router.push("/coach/athletes")}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Athletes
      </Button>

      {/* ─── Athlete Header ───────────────────────────────────────────── */}
      <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
        <div
          className={cn(
            "flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br text-2xl font-bold text-white",
            avatarColors[colorIndex]
          )}
        >
          {initials}
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {athlete.name}
            </h1>
            <span
              className={cn(
                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                athlete.status === "active"
                  ? "bg-emerald-500/10 text-emerald-500"
                  : "bg-zinc-500/10 text-zinc-400"
              )}
            >
              {athlete.status === "active" ? "Active" : "Inactive"}
            </span>
          </div>
          <p className="text-muted-foreground">{athlete.sport}</p>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            <Mail className="h-3.5 w-3.5" />
            {athlete.email}
          </p>
        </div>
      </div>

      {/* ─── Tabs ─────────────────────────────────────────────────────── */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start sm:w-auto">
          <TabsTrigger value="overview" className="gap-1.5">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-1.5">
            <Clock className="h-4 w-4" />
            <span className="hidden sm:inline">Training History</span>
          </TabsTrigger>
          <TabsTrigger value="feedback" className="gap-1.5">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Feedback</span>
          </TabsTrigger>
          <TabsTrigger value="weekly-sessions" className="gap-1.5">
            <ClipboardList className="h-4 w-4" />
            <span className="hidden sm:inline">Weekly Sessions</span>
          </TabsTrigger>
        </TabsList>

        {/* ─── Overview Tab ─────────────────────────────────────────── */}
        <TabsContent value="overview">
          <AnimatePresence mode="wait">
            <motion.div key="overview" {...tabMotion} className="space-y-6 pt-4">
              {/* Stats cards */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Completion Rate
                    </CardTitle>
                    <Trophy className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{athlete.completionRate}%</div>
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-500"
                        style={{ width: `${athlete.completionRate}%` }}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Sessions This Week
                    </CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{athlete.sessionsThisWeek}</div>
                    <p className="mt-1 text-xs text-muted-foreground">of 5 planned</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Avg RPE
                    </CardTitle>
                    <Zap className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className={cn("text-2xl font-bold", rpeColor(athlete.avgRpe))}>
                      {athlete.avgRpe}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">last 7 sessions</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Current Streak
                    </CardTitle>
                    <Flame className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{athlete.currentStreak} days</div>
                    <p className="mt-1 text-xs text-muted-foreground">personal best: 21</p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div
                          className={cn(
                            "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                            item.type === "session" && "bg-orange-500/10 text-orange-400",
                            item.type === "streak" && "bg-amber-500/10 text-amber-400",
                            item.type === "alert" && "bg-red-500/10 text-red-400"
                          )}
                        >
                          {item.type === "session" && <CheckCircle2 className="h-4 w-4" />}
                          {item.type === "streak" && <Flame className="h-4 w-4" />}
                          {item.type === "alert" && <Zap className="h-4 w-4" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">{item.text}</p>
                          <p className="text-xs text-muted-foreground">{item.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </TabsContent>

        {/* ─── Training History Tab ─────────────────────────────────── */}
        <TabsContent value="history">
          <AnimatePresence mode="wait">
            <motion.div key="history" {...tabMotion} className="space-y-3 pt-4">
              {mockSessions.map((session) => {
                const isExpanded = expandedSession === session.id;
                return (
                  <Card key={session.id} className="overflow-hidden">
                    <button
                      onClick={() =>
                        setExpandedSession(isExpanded ? null : session.id)
                      }
                      className="flex w-full items-center gap-4 p-4 text-left transition-colors hover:bg-muted/50"
                    >
                      <div
                        className={cn(
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                          session.completed
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-zinc-500/10 text-zinc-400"
                        )}
                      >
                        {session.completed ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : (
                          <XCircle className="h-5 w-5" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">
                          {session.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(session.date).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })}{" "}
                          · {session.duration}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge
                          variant="outline"
                          className={cn("hidden sm:inline-flex", rpeColor(session.rpe))}
                        >
                          RPE {session.rpe}
                        </Badge>
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    </button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="border-t border-border px-4 pb-4 pt-3 space-y-3">
                            {/* Exercises table */}
                            <div className="rounded-md border border-border overflow-x-auto">
                              <table className="w-full text-sm">
                                <thead>
                                  <tr className="border-b border-border bg-muted/50">
                                    <th className="px-3 py-2 text-left font-medium text-muted-foreground">
                                      Exercise
                                    </th>
                                    <th className="px-3 py-2 text-left font-medium text-muted-foreground">
                                      Workout
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {session.exercises.map((ex, i) => (
                                    <tr
                                      key={i}
                                      className="border-b border-border last:border-0"
                                    >
                                      <td className="px-3 py-2 font-medium">
                                        {ex.name}
                                      </td>
                                      <td className="px-3 py-2 text-muted-foreground">
                                        {ex.workout}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>

                            {/* Athlete notes */}
                            {session.athleteNotes && (
                              <div className="rounded-md bg-muted/50 p-3">
                                <p className="text-xs font-medium text-muted-foreground mb-1">
                                  Athlete&apos;s Notes
                                </p>
                                <p className="text-sm text-foreground">
                                  {session.athleteNotes}
                                </p>
                              </div>
                            )}

                            {/* Leave Feedback button */}
                            {session.completed && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="gap-1.5"
                                onClick={() => openSessionFeedback(session.id)}
                              >
                                <MessageSquare className="h-3.5 w-3.5" />
                                Leave Feedback
                              </Button>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </TabsContent>

        {/* ─── Feedback Tab ─────────────────────────────────────────── */}
        <TabsContent value="feedback">
          <AnimatePresence mode="wait">
            <motion.div key="feedback" {...tabMotion} className="pt-4">
              <Card className="flex flex-col" style={{ height: "min(600px, 70vh)" }}>
                {/* Messages area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {feedbackMessages.map((msg) => {
                    const isCoach = msg.sender === "coach";
                    const sessionName = msg.sessionId
                      ? mockSessions.find((s) => s.id === msg.sessionId)?.name
                      : null;
                    return (
                      <div
                        key={msg.id}
                        className={cn(
                          "flex",
                          isCoach ? "justify-end" : "justify-start"
                        )}
                      >
                        <div
                          className={cn(
                            "max-w-[80%] rounded-2xl px-4 py-2.5 space-y-1",
                            isCoach
                              ? "bg-orange-600 text-white rounded-br-md"
                              : "bg-muted text-foreground rounded-bl-md"
                          )}
                        >
                          {sessionName && (
                            <p
                              className={cn(
                                "text-xs font-medium",
                                isCoach ? "text-orange-200" : "text-muted-foreground"
                              )}
                            >
                              Re: {sessionName}
                            </p>
                          )}
                          {msg.rating && (
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-[10px]",
                                ratingColor(msg.rating)
                              )}
                            >
                              <Star className="mr-1 h-3 w-3" />
                              {msg.rating}
                            </Badge>
                          )}
                          <p className="text-sm leading-relaxed">{msg.message}</p>
                          <p
                            className={cn(
                              "text-[10px]",
                              isCoach ? "text-orange-200" : "text-muted-foreground"
                            )}
                          >
                            {new Date(msg.timestamp).toLocaleString("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Message input */}
                <div className="border-t border-border p-4">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendMessage();
                    }}
                    className="flex items-end gap-2"
                  >
                    <Textarea
                      placeholder="Type your feedback..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="min-h-[44px] max-h-32 resize-none"
                      rows={1}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button
                      type="submit"
                      size="icon"
                      disabled={!newMessage.trim()}
                      className="shrink-0"
                    >
                      <Send className="h-4 w-4" />
                      <span className="sr-only">Send feedback</span>
                    </Button>
                  </form>
                </div>
              </Card>
            </motion.div>
          </AnimatePresence>
        </TabsContent>
        {/* ─── Weekly Sessions Tab ──────────────────────────────── */}
        <TabsContent value="weekly-sessions">
          <AnimatePresence mode="wait">
            <motion.div key="weekly-sessions" {...tabMotion} className="space-y-6 pt-4">
              {/* Quick-add form */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Add Session</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Day of Week</Label>
                      <Select value={newSessionDay} onValueChange={setNewSessionDay}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select day" />
                        </SelectTrigger>
                        <SelectContent>
                          {DAYS_OF_WEEK.map((day) => (
                            <SelectItem key={day} value={day}>
                              {day}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Session Name</Label>
                      <Input
                        placeholder="e.g., Easy Run, Swim Intervals, Strength"
                        value={newSessionName}
                        onChange={(e) => setNewSessionName(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Quick-type buttons */}
                  <div className="flex flex-wrap gap-2">
                    {QUICK_TYPES.map((qt) => (
                      <button
                        key={qt.name}
                        type="button"
                        onClick={() => setNewSessionName(qt.name)}
                        className={cn(
                          "rounded-full px-3 py-1.5 text-sm font-medium transition-all",
                          newSessionName === qt.name
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                        )}
                      >
                        {qt.label}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <Label>Workout</Label>
                    <Textarea
                      placeholder="Describe the session (e.g., 45min Z2 run, or 10x100m swim @ 1:40 with 20s rest)"
                      value={newSessionWorkout}
                      onChange={(e) => setNewSessionWorkout(e.target.value)}
                      rows={3}
                      className="resize-none"
                    />
                  </div>

                  <Button
                    onClick={addSession}
                    disabled={!newSessionDay || !newSessionName.trim()}
                    className="gap-1.5"
                  >
                    <Plus className="h-4 w-4" />
                    Add Session
                  </Button>
                </CardContent>
              </Card>

              {/* Week view */}
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setWeekOffset((prev) => prev - 1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Previous week</span>
                  </Button>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Week of {getWeekLabel()}
                  </h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setWeekOffset((prev) => prev + 1)}
                  >
                    <ChevronRight className="h-4 w-4" />
                    <span className="sr-only">Next week</span>
                  </Button>
                </div>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-7">
                  {DAYS_OF_WEEK.map((day) => {
                    const daySessions = weekSessions.filter((s) => s.day === day);
                    const isToday = day === todayName;
                    return (
                      <div
                        key={day}
                        className={cn(
                          "rounded-lg border p-2 min-h-[100px] transition-colors",
                          isToday
                            ? "border-primary/50 bg-primary/5"
                            : "border-border bg-card"
                        )}
                      >
                        <p
                          className={cn(
                            "text-xs font-semibold mb-1.5",
                            isToday ? "text-primary" : "text-muted-foreground"
                          )}
                        >
                          {day.slice(0, 3)}
                          {isToday && (
                            <span className="ml-1 text-[10px] font-normal">(today)</span>
                          )}
                        </p>
                        {daySessions.length > 0 ? (
                          <div className="space-y-1.5">
                            {daySessions.map((session) => (
                              <div
                                key={session.id}
                                className="group relative rounded-md bg-muted/50 p-1.5 cursor-pointer transition-colors hover:bg-muted"
                                onClick={() => openEditSession(session)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    openEditSession(session);
                                  }
                                }}
                              >
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteSession(session.id);
                                  }}
                                  className="absolute -right-1 -top-1 hidden h-4 w-4 items-center justify-center rounded-full bg-destructive text-destructive-foreground group-hover:flex"
                                  aria-label="Delete session"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                                <p className="text-xs font-medium text-foreground leading-tight">
                                  {session.name}
                                </p>
                                {session.workout && (
                                  <p className="mt-0.5 text-[10px] text-muted-foreground line-clamp-2 leading-tight">
                                    {session.workout}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-[10px] text-muted-foreground/60 italic">
                            Rest
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Save Week button */}
              <div className="flex items-center gap-3">
                <Button onClick={handleSaveWeek} className="gap-1.5">
                  <Save className="h-4 w-4" />
                  Save Week
                </Button>
                <AnimatePresence>
                  {saved && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-sm font-medium text-emerald-500"
                    >
                      Week saved!
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </AnimatePresence>
        </TabsContent>
      </Tabs>

      {/* ─── Session Feedback Dialog ──────────────────────────────────── */}
      <Dialog open={feedbackDialogOpen} onOpenChange={setFeedbackDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Leave Feedback</DialogTitle>
            <DialogDescription>
              {feedbackSessionId &&
                `Feedback for ${mockSessions.find((s) => s.id === feedbackSessionId)?.name ?? "session"}`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {/* Rating selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Rating (optional)
              </label>
              <div className="flex gap-2">
                {(["Great", "Good", "Needs Work"] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() =>
                      setFeedbackRating(feedbackRating === r ? null : r)
                    }
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                      feedbackRating === r
                        ? ratingColor(r)
                        : "border-border text-muted-foreground hover:border-foreground/20"
                    )}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Feedback text */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Message
              </label>
              <Textarea
                placeholder="Write your feedback for this session..."
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setFeedbackDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSessionFeedback}
              disabled={!feedbackText.trim()}
              className="gap-1.5"
            >
              <Send className="h-3.5 w-3.5" />
              Send Feedback
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Edit Session Dialog ─────────────────────────────────────── */}
      <Dialog open={!!editingSession} onOpenChange={(open) => !open && setEditingSession(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Session</DialogTitle>
            <DialogDescription>
              Update the session details below.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Session Name</Label>
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Session name"
              />
            </div>
            <div className="space-y-2">
              <Label>Day of Week</Label>
              <Select value={editDay} onValueChange={setEditDay}>
                <SelectTrigger>
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent>
                  {DAYS_OF_WEEK.map((day) => (
                    <SelectItem key={day} value={day}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Workout</Label>
              <Textarea
                value={editWorkout}
                onChange={(e) => setEditWorkout(e.target.value)}
                placeholder="Describe the workout"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditingSession(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateSession} disabled={!editName.trim()} className="gap-1.5">
              <Pencil className="h-3.5 w-3.5" />
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
