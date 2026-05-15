"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ──────────────────────────────────────────────────────────────────

interface AthleteWeek {
  id: string;
  name: string;
  sessions: { day: string; name: string }[];
}

// ─── Constants ──────────────────────────────────────────────────────────────

const DAYS_SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const avatarColors = [
  "from-orange-500 to-amber-600",
  "from-amber-500 to-yellow-600",
  "from-rose-500 to-orange-600",
  "from-yellow-500 to-amber-600",
];

// ─── Component ──────────────────────────────────────────────────────────────

export default function PlansPage() {
  const [athleteWeeks, setAthleteWeeks] = useState<AthleteWeek[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPlans = useCallback(async () => {
    try {
      // Get athletes
      const athleteRes = await fetch("/api/athletes");
      if (!athleteRes.ok) {
        setAthleteWeeks([]);
        return;
      }
      const athleteJson = await athleteRes.json();
      const athletes = athleteJson.data || [];

      if (athletes.length === 0) {
        setAthleteWeeks([]);
        return;
      }

      // Get this week's start date
      const now = new Date();
      const dayOfWeek = now.getDay();
      const monday = new Date(now);
      monday.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
      monday.setHours(0, 0, 0, 0);
      const weekStart = monday.toISOString().split("T")[0];

      // Fetch sessions for each athlete
      const weeks: AthleteWeek[] = await Promise.all(
        athletes.map(async (a: { id: string; name: string }) => {
          try {
            const res = await fetch(`/api/sessions?athleteId=${a.id}&weekStart=${weekStart}`);
            if (res.ok) {
              const json = await res.json();
              const sessions = (json.data?.sessions || []).map((s: { dayOfWeek: number; title: string }) => ({
                day: DAYS_SHORT[s.dayOfWeek],
                name: s.title,
              }));
              return { id: a.id, name: a.name, sessions };
            }
          } catch {}
          return { id: a.id, name: a.name, sessions: [] };
        })
      );

      setAthleteWeeks(weeks);
    } catch {
      setAthleteWeeks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-muted-foreground" />
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Weekly Sessions
          </h1>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage this week&apos;s training for your athletes
        </p>
      </div>

      {/* Athlete cards */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <p className="text-muted-foreground">Loading plans...</p>
        </div>
      ) : athleteWeeks.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16">
          <Calendar className="h-12 w-12 text-muted-foreground/40" />
          <p className="mt-4 text-lg font-medium text-foreground">No plans yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Add athletes and create sessions to see them here
          </p>
        </div>
      ) : (
      <div className="grid gap-4 sm:grid-cols-2">
        {athleteWeeks.map((athlete, idx) => {
          const initials = athlete.name
            .split(" ")
            .map((n) => n[0])
            .join("");
          const colorIdx = idx % avatarColors.length;

          return (
            <Card key={athlete.id} className="overflow-hidden">
              <CardHeader className="flex flex-row items-center gap-3 pb-3">
                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-sm font-bold text-white",
                    avatarColors[colorIdx]
                  )}
                >
                  {initials}
                </div>
                <CardTitle className="text-base">{athlete.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Compact session list */}
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm">
                  {DAYS_SHORT.map((day) => {
                    const session = athlete.sessions.find((s) => s.day === day);
                    return (
                      <span key={day} className="inline-flex items-center gap-1">
                        <span className="font-medium text-muted-foreground">
                          {day}:
                        </span>
                        <span
                          className={cn(
                            "text-foreground",
                            !session && "text-muted-foreground/50 italic"
                          )}
                        >
                          {session ? session.name : "Rest"}
                        </span>
                      </span>
                    );
                  })}
                </div>

                <Link href={`/coach/athletes/${athlete.id}`}>
                  <Button variant="outline" size="sm" className="gap-1.5 mt-1">
                    Manage
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>
      )}
    </div>
  );
}
