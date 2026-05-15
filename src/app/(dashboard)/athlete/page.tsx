"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  ChevronDown,
  CheckCircle2,
  Circle,
  Clock,
  Dumbbell,
  Loader2,
  MessageSquare,
  MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

// ── Types ──────────────────────────────────────────────────────────

interface Exercise {
  id: string;
  name: string;
  workout: string;
  completed: boolean;
  rpe: number | null;
  notes: string;
}

interface CoachFeedback {
  message: string;
  rating: "Great" | "Good" | "Needs Work";
  timestamp: string;
  read: boolean;
}

interface Session {
  id: string;
  name: string;
  dayIndex: number; // 0=Mon … 6=Sun
  exercises: Exercise[];
  status: "not_started" | "in_progress" | "completed";
  estimatedMinutes: number;
  overallRpe: number | null;
  completionComment: string;
  coachFeedback: CoachFeedback | null;
}

interface WeekDay {
  name: string;
  dateNumber: number;
  fullDate: Date;
  isToday: boolean;
  hasSessions: boolean;
}

// ── Mock data helpers ──────────────────────────────────────────────

function getWeekDays(): WeekDay[] {
  const today = new Date();
  const currentDay = today.getDay(); // 0=Sun
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((currentDay + 6) % 7));

  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return {
      name: dayNames[i],
      dateNumber: date.getDate(),
      fullDate: date,
      isToday: date.toDateString() === today.toDateString(),
      hasSessions: false, // filled after mock data init
    };
  });
}

function createMockSessions(): Session[] {
  return [
    {
      id: "s1",
      name: "Easy Run",
      dayIndex: 0,
      estimatedMinutes: 45,
      status: "completed",
      overallRpe: 4,
      completionComment: "",
      coachFeedback: {
        message: "Perfect pacing Sam — HR data looks clean. Keep this consistent.",
        rating: "Great",
        timestamp: "2026-05-04T14:30:00Z",
        read: false,
      },
      exercises: [
        { id: "e1", name: "Easy Run", workout: "45min Zone 2, flat route. Keep HR below 145bpm.", completed: true, rpe: 4, notes: "" },
      ],
    },
    {
      id: "s2",
      name: "Swim Intervals",
      dayIndex: 1,
      estimatedMinutes: 60,
      status: "completed",
      overallRpe: 7,
      completionComment: "",
      coachFeedback: {
        message: "Good splits. Let's aim for 1:38 average next week.",
        rating: "Good",
        timestamp: "2026-05-04T15:10:00Z",
        read: true,
      },
      exercises: [
        { id: "e2", name: "Warm-up", workout: "400m easy freestyle, 4x50m drill (catch-up, fingertip drag)", completed: true, rpe: 3, notes: "" },
        { id: "e3", name: "Main Set", workout: "10 x 100m @ 1:40 pace, 20s rest between. Focus on high elbow catch.", completed: true, rpe: 7, notes: "Felt smooth until rep 8" },
      ],
    },
    {
      id: "s3",
      name: "Bike Tempo",
      dayIndex: 2,
      estimatedMinutes: 60,
      status: "in_progress",
      overallRpe: null,
      completionComment: "",
      coachFeedback: null,
      exercises: [
        { id: "e4", name: "Bike Tempo", workout: "1hr ride: 20min warm-up, 2 x 15min @ threshold (280-290W), 10min cool-down.", completed: false, rpe: null, notes: "" },
      ],
    },
    {
      id: "s4",
      name: "Strength",
      dayIndex: 3,
      estimatedMinutes: 45,
      status: "not_started",
      overallRpe: null,
      completionComment: "",
      coachFeedback: null,
      exercises: [
        { id: "e5", name: "Upper Body & Core", workout: "Bench press 4x8\nBent-over rows 4x10\nShoulder press 3x10\nPlank 3x60s\nRussian twists 3x20", completed: false, rpe: null, notes: "" },
      ],
    },
    {
      id: "s5",
      name: "Brick Session",
      dayIndex: 4,
      estimatedMinutes: 65,
      status: "not_started",
      overallRpe: null,
      completionComment: "",
      coachFeedback: null,
      exercises: [
        { id: "e6", name: "Bike", workout: "45min @ Zone 3 (steady state, 250-260W)", completed: false, rpe: null, notes: "" },
        { id: "e7", name: "Transition Run", workout: "15min immediately off the bike @ race pace (4:30/km). Focus on quick cadence.", completed: false, rpe: null, notes: "" },
      ],
    },
  ];
}

// ── Status helpers ─────────────────────────────────────────────────

const statusConfig = {
  not_started: { label: "Not Started", icon: Circle, className: "text-muted-foreground" },
  in_progress: { label: "In Progress", icon: Loader2, className: "text-amber-500" },
  completed: { label: "Completed", icon: CheckCircle2, className: "text-emerald-500" },
} as const;

const feedbackRatingConfig = {
  Great: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  Good: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  "Needs Work": "bg-amber-500/10 text-amber-500 border-amber-500/20",
} as const;

// ── Component ──────────────────────────────────────────────────────

export default function AthleteDashboard() {
  const [sessions, setSessions] = useState<Session[]>(createMockSessions);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(() => {
    const today = new Date().getDay();
    return (today + 6) % 7; // convert Sun=0 → Mon=0
  });
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null);

  // Complete-session dialog state
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
  const [completingSessionId, setCompletingSessionId] = useState<string | null>(null);
  const [completeRpe, setCompleteRpe] = useState(5);
  const [completeComment, setCompleteComment] = useState("");

  // ── Derived ──────────────────────────────────────────────────────

  const weekDays = useMemo(() => {
    const days = getWeekDays();
    const sessionDaySet = new Set(sessions.map((s) => s.dayIndex));
    return days.map((d, i) => ({ ...d, hasSessions: sessionDaySet.has(i) }));
  }, [sessions]);

  const daySessions = useMemo(
    () => sessions.filter((s) => s.dayIndex === selectedDayIndex),
    [sessions, selectedDayIndex]
  );

  const completedCount = sessions.filter((s) => s.status === "completed").length;
  const totalCount = sessions.length;

  // ── Handlers ─────────────────────────────────────────────────────

  function toggleExercise(sessionId: string, exerciseId: string) {
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id !== sessionId) return s;
        const exercises = s.exercises.map((ex) =>
          ex.id === exerciseId ? { ...ex, completed: !ex.completed } : ex
        );
        const allDone = exercises.every((ex) => ex.completed);
        const anyDone = exercises.some((ex) => ex.completed);
        return {
          ...s,
          exercises,
          status: allDone ? "completed" : anyDone ? "in_progress" : "not_started",
        };
      })
    );
  }

  function updateExerciseRpe(sessionId: string, exerciseId: string, rpe: number) {
    setSessions((prev) =>
      prev.map((s) =>
        s.id !== sessionId
          ? s
          : {
              ...s,
              exercises: s.exercises.map((ex) =>
                ex.id === exerciseId ? { ...ex, rpe } : ex
              ),
            }
      )
    );
  }

  function updateExerciseNotes(sessionId: string, exerciseId: string, notes: string) {
    setSessions((prev) =>
      prev.map((s) =>
        s.id !== sessionId
          ? s
          : {
              ...s,
              exercises: s.exercises.map((ex) =>
                ex.id === exerciseId ? { ...ex, notes } : ex
              ),
            }
      )
    );
  }

  function openCompleteDialog(sessionId: string) {
    setCompletingSessionId(sessionId);
    setCompleteRpe(5);
    setCompleteComment("");
    setCompleteDialogOpen(true);
  }

  function confirmComplete() {
    if (!completingSessionId) return;
    setSessions((prev) =>
      prev.map((s) =>
        s.id !== completingSessionId
          ? s
          : {
              ...s,
              status: "completed" as const,
              overallRpe: completeRpe,
              completionComment: completeComment,
              exercises: s.exercises.map((ex) => ({ ...ex, completed: true })),
            }
      )
    );
    setCompleteDialogOpen(false);
    setCompletingSessionId(null);
  }

  // ── Render ───────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          My Week
        </h1>
        <p className="text-muted-foreground">Your training schedule</p>
      </div>

      {/* Weekly summary strip */}
      <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
        <CardContent className="flex items-center gap-4 p-4">
          <div className="relative h-12 w-12 shrink-0">
            <svg className="h-12 w-12 -rotate-90" viewBox="0 0 36 36">
              <circle
                cx="18"
                cy="18"
                r="15.5"
                fill="none"
                className="stroke-secondary"
                strokeWidth="3"
              />
              <circle
                cx="18"
                cy="18"
                r="15.5"
                fill="none"
                className="stroke-emerald-500 transition-all duration-500"
                strokeWidth="3"
                strokeDasharray={`${(completedCount / totalCount) * 97.4} 97.4`}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-foreground">
              {completedCount}/{totalCount}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              {completedCount} of {totalCount} sessions completed this week
            </p>
            <p className="text-xs text-muted-foreground">
              {totalCount - completedCount === 0
                ? "All sessions done — great work!"
                : `${totalCount - completedCount} remaining`}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Weekly calendar row */}
      <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2 min-w-[320px]">
        {weekDays.map((day, i) => (
          <button
            key={day.name}
            onClick={() => setSelectedDayIndex(i)}
            className={cn(
              "flex flex-col items-center rounded-xl border p-2 sm:p-3 text-center transition-all duration-200",
              i === selectedDayIndex
                ? "border-primary bg-primary/10 shadow-sm"
                : "border-border/40 bg-card hover:border-border hover:bg-card/80",
              day.isToday && i !== selectedDayIndex && "border-primary/40"
            )}
          >
            <span
              className={cn(
                "text-[10px] sm:text-xs font-medium uppercase",
                i === selectedDayIndex ? "text-primary" : "text-muted-foreground"
              )}
            >
              {day.name}
            </span>
            <span
              className={cn(
                "mt-0.5 text-base sm:text-lg font-semibold",
                i === selectedDayIndex ? "text-foreground" : "text-foreground/70",
                day.isToday && "text-primary"
              )}
            >
              {day.dateNumber}
            </span>
            <div
              className={cn(
                "mt-1 h-1.5 w-1.5 rounded-full transition-colors",
                day.hasSessions
                  ? i === selectedDayIndex
                    ? "bg-primary"
                    : "bg-emerald-500"
                  : "bg-transparent"
              )}
            />
          </button>
        ))}
        </div>
      </div>

      {/* Sessions for selected day */}
      <div className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground">
          {weekDays[selectedDayIndex]?.name}&apos;s Sessions
        </h2>

        {daySessions.length === 0 ? (
          <Card className="border-dashed border-border/40">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
                <Dumbbell className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground">Rest day</p>
              <p className="mt-1 text-xs text-muted-foreground">
                No sessions scheduled — enjoy the recovery.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {daySessions.map((session) => {
              const isExpanded = expandedSessionId === session.id;
              const StatusIcon = statusConfig[session.status].icon;
              const completedExercises = session.exercises.filter(
                (e) => e.completed
              ).length;

              return (
                <Card
                  key={session.id}
                  className={cn(
                    "overflow-hidden border-border/40 transition-all duration-200",
                    session.status === "completed" &&
                      "border-emerald-500/20 bg-emerald-500/5"
                  )}
                >
                  {/* Session header — clickable */}
                  <button
                    onClick={() =>
                      setExpandedSessionId(isExpanded ? null : session.id)
                    }
                    className="flex w-full items-center justify-between gap-3 p-4 text-left transition-colors hover:bg-muted/30"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative shrink-0">
                        <StatusIcon
                          className={cn(
                            "h-5 w-5",
                            statusConfig[session.status].className,
                            session.status === "in_progress" && "animate-spin"
                          )}
                        />
                        {session.coachFeedback && !session.coachFeedback.read && (
                          <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-orange-500 ring-2 ring-card" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-foreground">
                          {session.name}
                        </p>
                        <div className="mt-0.5 flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Dumbbell className="h-3 w-3" />
                            {session.exercises.length} exercises
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {session.estimatedMinutes} min
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {session.status === "completed" && (
                        <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-500">
                          Completed
                        </span>
                      )}
                      <span className="text-[10px] text-muted-foreground">
                        {completedExercises}/{session.exercises.length}
                      </span>
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 text-muted-foreground transition-transform duration-200",
                          isExpanded && "rotate-180"
                        )}
                      />
                    </div>
                  </button>

                  {/* Expanded exercise list */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-border/40 px-4 pb-4 pt-3">
                          <div className="space-y-3">
                            {session.exercises.map((exercise) => (
                              <div
                                key={exercise.id}
                                className={cn(
                                  "rounded-lg border border-border/30 bg-muted/20 p-3 transition-colors",
                                  exercise.completed && "bg-emerald-500/5 border-emerald-500/20"
                                )}
                              >
                                {/* Exercise top row */}
                                <div className="flex items-start gap-3">
                                  <Checkbox
                                    checked={exercise.completed}
                                    onCheckedChange={() =>
                                      toggleExercise(session.id, exercise.id)
                                    }
                                    className="mt-0.5 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                                    aria-label={`Mark ${exercise.name} complete`}
                                  />
                                  <div className="flex-1 min-w-0">
                                    <p
                                      className={cn(
                                        "text-sm font-medium",
                                        exercise.completed
                                          ? "text-muted-foreground line-through"
                                          : "text-foreground"
                                      )}
                                    >
                                      {exercise.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {exercise.workout}
                                    </p>
                                  </div>
                                </div>

                                {/* RPE slider */}
                                <div className="mt-3 flex items-center gap-3">
                                  <label className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground shrink-0 w-7">
                                    RPE
                                  </label>
                                  <Slider
                                    value={[exercise.rpe ?? 5]}
                                    onValueChange={([v]) =>
                                      updateExerciseRpe(session.id, exercise.id, v)
                                    }
                                    min={1}
                                    max={10}
                                    step={1}
                                    className="flex-1"
                                    aria-label={`RPE for ${exercise.name}`}
                                  />
                                  <span className="w-5 text-right text-xs font-semibold text-foreground">
                                    {exercise.rpe ?? "–"}
                                  </span>
                                </div>

                                {/* Notes */}
                                <div className="mt-2">
                                  <div className="flex items-center gap-1.5 mb-1">
                                    <MessageSquare className="h-3 w-3 text-muted-foreground" />
                                    <label className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                                      Notes
                                    </label>
                                  </div>
                                  <textarea
                                    value={exercise.notes}
                                    onChange={(e) =>
                                      updateExerciseNotes(
                                        session.id,
                                        exercise.id,
                                        e.target.value
                                      )
                                    }
                                    placeholder="Add notes…"
                                    rows={1}
                                    className="w-full resize-none rounded-md border border-input bg-background px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                  />
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Mark session complete button */}
                          {session.status !== "completed" && (
                            <Button
                              onClick={() => openCompleteDialog(session.id)}
                              className="mt-4 w-full gap-2 bg-emerald-600 text-white hover:bg-emerald-700"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                              Mark Session Complete
                            </Button>
                          )}

                          {/* Coach Feedback section */}
                          {session.status === "completed" && (
                            <div className="mt-4">
                              <div className="flex items-center gap-2 mb-2">
                                <MessageCircle className="h-4 w-4 text-orange-400" />
                                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                  Coach Feedback
                                </span>
                              </div>
                              {session.coachFeedback ? (
                                <motion.div
                                  initial={{ opacity: 0, y: 4 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="rounded-lg border-l-4 border-l-orange-500 bg-orange-500/5 p-3"
                                >
                                  <div className="flex items-center gap-2 mb-2">
                                    <Badge
                                      className={cn(
                                        "text-[10px] font-semibold",
                                        feedbackRatingConfig[session.coachFeedback.rating]
                                      )}
                                    >
                                      {session.coachFeedback.rating}
                                    </Badge>
                                    <span className="text-[10px] text-muted-foreground">
                                      {new Date(session.coachFeedback.timestamp).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                    </span>
                                  </div>
                                  <p className="text-sm text-foreground/90 leading-relaxed">
                                    {session.coachFeedback.message}
                                  </p>
                                </motion.div>
                              ) : (
                                <p className="text-xs italic text-muted-foreground/60 pl-3">
                                  Awaiting coach feedback
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Complete session dialog */}
      <Dialog open={completeDialogOpen} onOpenChange={setCompleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Session</DialogTitle>
            <DialogDescription>
              Rate your overall effort and leave an optional comment.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Overall RPE
              </label>
              <div className="flex items-center gap-3">
                <Slider
                  value={[completeRpe]}
                  onValueChange={([v]) => setCompleteRpe(v)}
                  min={1}
                  max={10}
                  step={1}
                  className="flex-1"
                  aria-label="Overall RPE"
                />
                <span className="w-8 text-center text-lg font-bold text-foreground">
                  {completeRpe}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                1 = very easy · 10 = maximal effort
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Comment <span className="text-muted-foreground">(optional)</span>
              </label>
              <Input
                value={completeComment}
                onChange={(e) => setCompleteComment(e.target.value)}
                placeholder="How did it feel?"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setCompleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmComplete}
              className="gap-2 bg-emerald-600 text-white hover:bg-emerald-700"
            >
              <CheckCircle2 className="h-4 w-4" />
              Complete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
