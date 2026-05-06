"use client";

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

// ─── Mock Data ──────────────────────────────────────────────────────────────

const DAYS_SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const avatarColors = [
  "from-orange-500 to-amber-600",
  "from-amber-500 to-yellow-600",
  "from-rose-500 to-orange-600",
  "from-yellow-500 to-amber-600",
];

const mockAthleteWeeks: AthleteWeek[] = [
  {
    id: "1",
    name: "Sam Torres",
    sessions: [
      { day: "Mon", name: "Easy Run" },
      { day: "Tue", name: "Swim Intervals" },
      { day: "Wed", name: "Bike Tempo" },
      { day: "Thu", name: "Strength" },
      { day: "Fri", name: "Brick Session" },
      { day: "Sat", name: "Long Run" },
    ],
  },
  {
    id: "2",
    name: "Maria Chen",
    sessions: [
      { day: "Mon", name: "Swim Endurance" },
      { day: "Tue", name: "Bike Intervals" },
      { day: "Wed", name: "Easy Run" },
      { day: "Thu", name: "Swim Speed" },
      { day: "Fri", name: "Strength" },
      { day: "Sat", name: "Long Bike" },
    ],
  },
  {
    id: "3",
    name: "Jake Wilson",
    sessions: [
      { day: "Mon", name: "Run Intervals" },
      { day: "Wed", name: "Bike Tempo" },
      { day: "Thu", name: "Swim Drills" },
      { day: "Sat", name: "Long Run" },
    ],
  },
  {
    id: "5",
    name: "Carlos Ruiz",
    sessions: [
      { day: "Mon", name: "Swim Technique" },
      { day: "Tue", name: "Strength" },
      { day: "Wed", name: "Bike Endurance" },
      { day: "Thu", name: "Run Tempo" },
      { day: "Fri", name: "Swim Intervals" },
      { day: "Sat", name: "Brick Session" },
      { day: "Sun", name: "Easy Run" },
    ],
  },
];

// ─── Component ──────────────────────────────────────────────────────────────

export default function PlansPage() {
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
      <div className="grid gap-4 sm:grid-cols-2">
        {mockAthleteWeeks.map((athlete, idx) => {
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
    </div>
  );
}
