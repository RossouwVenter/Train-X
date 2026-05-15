"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  ClipboardList,
  CalendarDays,
  TrendingUp,
  Plus,
  UserPlus,
  CheckCircle2,
  MessageSquare,
  XCircle,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

export default function CoachDashboard() {
  const { data: session } = useSession();
  const [athleteCount, setAthleteCount] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/athletes");
      if (res.ok) {
        const json = await res.json();
        setAthleteCount((json.data || []).length);
      }
    } catch {}
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const firstName = session?.user?.name?.split(" ")[0] || "Coach";

  const stats = [
    {
      title: "Total Athletes",
      value: String(athleteCount),
      icon: Users,
    },
    {
      title: "Active Plans",
      value: "—",
      icon: ClipboardList,
    },
    {
      title: "Sessions This Week",
      value: "—",
      icon: CalendarDays,
    },
    {
      title: "Avg Compliance",
      value: "—",
      icon: TrendingUp,
    },
  ];

  const recentActivity = [
    {
      text: "Activity data loads from sessions",
      time: "—",
      type: "completed" as const,
    },
  ];

  const upcomingSessions: { name: string; athlete: string; date: string; status: "upcoming" | "scheduled" }[] = [];

  const activityIcons = {
    completed: CheckCircle2,
    feedback: MessageSquare,
    missed: XCircle,
  };

  const activityColors = {
    completed: "bg-emerald-500",
    feedback: "bg-orange-500",
    missed: "bg-red-500",
  };

  return (
    <motion.div
      className="space-y-8"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Header */}
      <motion.div variants={item}>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Dashboard
        </h1>
        <p className="text-muted-foreground">Welcome back, {firstName}</p>
      </motion.div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <motion.div key={stat.title} variants={item}>
            <Card className="group transition-all duration-200 hover:shadow-md hover:shadow-black/10">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardDescription className="text-sm font-medium">
                  {stat.title}
                </CardDescription>
                <div className="rounded-md bg-muted p-2">
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Two-column layout */}
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* Left column */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <motion.div variants={item}>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
                <CardDescription>Latest updates from your team</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, i) => {
                    const Icon = activityIcons[activity.type];
                    return (
                      <div
                        key={i}
                        className="flex items-start gap-3 border-b border-border/40 pb-3 last:border-0 last:pb-0"
                      >
                        <div className="mt-0.5 flex items-center gap-2">
                          <span
                            className={`inline-block h-2 w-2 rounded-full ${activityColors[activity.type]}`}
                          />
                          <Icon className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-foreground">
                            {activity.text}
                          </p>
                          <span className="text-xs text-muted-foreground">
                            {activity.time}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <motion.div variants={item}>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3">
                <Button asChild className="w-full justify-start gap-2">
                  <Link href="/coach/plans">
                    <Plus className="h-4 w-4" />
                    New Training Plan
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="secondary"
                  className="w-full justify-start gap-2"
                >
                  <Link href="/coach/athletes">
                    <UserPlus className="h-4 w-4" />
                    Add Athlete
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Upcoming Sessions */}
          <motion.div variants={item}>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Upcoming Sessions</CardTitle>
                <CardDescription>Next scheduled sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingSessions.length > 0 ? upcomingSessions.map((session, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 rounded-md border border-border/50 p-3 transition-colors hover:bg-muted/50"
                    >
                      <div className="rounded-md bg-muted p-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {session.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {session.athlete}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs font-medium text-foreground">
                          {session.date}
                        </p>
                        <span
                          className={`inline-block mt-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-medium ${
                            session.status === "upcoming"
                              ? "bg-emerald-500/10 text-emerald-500"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {session.status}
                        </span>
                      </div>
                    </div>
                  )) : (
                    <p className="text-sm text-muted-foreground">No upcoming sessions</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
