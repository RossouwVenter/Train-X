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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Mail,
  Shield,
  Users,
  ClipboardList,
  CalendarCheck,
  TrendingUp,
  Settings,
  Bell,
  BellOff,
  Check,
  Sun,
  Moon,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/components/theme-provider";
import { signOut } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const SPECIALIZATIONS = [
  "Strength & Conditioning",
  "Hypertrophy",
  "Athletic Performance",
  "Rehabilitation",
];

const stats = [
  { label: "Total Athletes", value: "12", icon: Users, color: "text-orange-500" },
  { label: "Active Plans", value: "8", icon: ClipboardList, color: "text-amber-500" },
  { label: "Sessions Created", value: "164", icon: CalendarCheck, color: "text-emerald-500" },
  { label: "Avg Compliance", value: "87%", icon: TrendingUp, color: "text-amber-500" },
];

export default function CoachProfilePage() {
  const { data: session } = useSession();
  const [athleteCount, setAthleteCount] = useState(0);
  const [planDuration, setPlanDuration] = useState("8");
  const [sessionsPerWeek, setSessionsPerWeek] = useState(4);
  const [feedbackReminders, setFeedbackReminders] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const { theme, setTheme } = useTheme();

  const userName = session?.user?.name || "Coach";
  const userEmail = session?.user?.email || "";
  const initials = userName.split(" ").map((n) => n[0]).join("").toUpperCase();

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/athletes");
      if (res.ok) {
        const json = await res.json();
        setAthleteCount((json.data || []).length);
      }
    } catch {}
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  function handleSaveSettings() {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Profile
        </h1>
        <p className="text-muted-foreground">
          Manage your account and coaching settings
        </p>
      </div>

      {/* Profile card */}
      <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-amber-600 text-2xl font-bold text-white shadow-lg">
              {initials}
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-xl font-semibold text-foreground">
                {userName}
              </h2>
              <p className="text-sm text-muted-foreground">
                {userEmail}
              </p>
              <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
                {SPECIALIZATIONS.map((spec) => (
                  <Badge
                    key={spec}
                    variant="secondary"
                    className="text-[10px]"
                  >
                    {spec}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 border-t border-border/40 pt-4 sm:grid-cols-3">
            <div className="flex items-center gap-3 rounded-lg bg-muted/30 p-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                  Email
                </p>
                <p className="text-sm text-foreground">{userEmail}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-muted/30 p-3">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                  Role
                </p>
                <p className="text-sm text-foreground">Coach</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-muted/30 p-3">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                  Athletes
                </p>
                <p className="text-sm text-foreground">{athleteCount} active</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Coaching stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: i * 0.05 }}
          >
            <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
              <CardContent className="flex flex-col items-center p-4 text-center">
                <stat.icon className={cn("h-5 w-5 mb-2", stat.color)} />
                <p className="text-2xl font-bold text-foreground">
                  {stat.value}
                </p>
                <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                  {stat.label}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Settings */}
      <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-lg">Coaching Settings</CardTitle>
          </div>
          <CardDescription>
            Defaults for new training plans and reminders
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Default plan duration */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Default Plan Duration
            </Label>
            <Select value={planDuration} onValueChange={setPlanDuration}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="4">4 weeks</SelectItem>
                <SelectItem value="6">6 weeks</SelectItem>
                <SelectItem value="8">8 weeks</SelectItem>
                <SelectItem value="12">12 weeks</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Default sessions per week */}
          <div className="space-y-2">
            <Label htmlFor="sessions-week" className="text-sm font-medium">
              Default Sessions Per Week
            </Label>
            <Input
              id="sessions-week"
              type="number"
              min={1}
              max={7}
              value={sessionsPerWeek}
              onChange={(e) =>
                setSessionsPerWeek(
                  Math.max(1, Math.min(7, Number(e.target.value)))
                )
              }
              className="w-32"
            />
          </div>

          {/* Theme toggle */}
          <div className="flex items-center justify-between rounded-lg border border-border/40 p-4">
            <div className="flex items-center gap-3">
              {theme === "dark" ? (
                <Moon className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Sun className="h-4 w-4 text-muted-foreground" />
              )}
              <div>
                <p className="text-sm font-medium text-foreground">Theme</p>
                <p className="text-xs text-muted-foreground">
                  {theme === "dark" ? "Dark mode is active" : "Light mode is active"}
                </p>
              </div>
            </div>
            <div className="flex gap-1 rounded-lg border border-border/40 p-1">
              <button
                onClick={() => setTheme("light")}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all",
                  theme === "light"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Sun className="h-3.5 w-3.5" />
                Light
              </button>
              <button
                onClick={() => setTheme("dark")}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all",
                  theme === "dark"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Moon className="h-3.5 w-3.5" />
                Dark
              </button>
            </div>
          </div>

          {/* Feedback reminders toggle */}
          <div className="flex items-center justify-between rounded-lg border border-border/40 p-4">
            <div className="flex items-center gap-3">
              {feedbackReminders ? (
                <Bell className="h-4 w-4 text-muted-foreground" />
              ) : (
                <BellOff className="h-4 w-4 text-muted-foreground" />
              )}
              <div>
                <p className="text-sm font-medium text-foreground">
                  Auto-Assign Feedback Reminders
                </p>
                <p className="text-xs text-muted-foreground">
                  {feedbackReminders
                    ? "You'll be reminded to review completed sessions"
                    : "Feedback reminders are turned off"}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFeedbackReminders(!feedbackReminders)}
              className={cn(
                feedbackReminders &&
                  "border-emerald-500/30 text-emerald-500 hover:text-emerald-600"
              )}
            >
              {feedbackReminders ? "Enabled" : "Disabled"}
            </Button>
          </div>

          {/* Save button */}
          <div className="flex items-center gap-3">
            <Button onClick={handleSaveSettings} className="gap-2">
              {saveSuccess ? (
                <>
                  <Check className="h-4 w-4" />
                  Saved
                </>
              ) : (
                "Save Settings"
              )}
            </Button>
            <AnimatePresence>
              {saveSuccess && (
                <motion.span
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-sm text-emerald-500"
                >
                  Settings updated successfully
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>

      {/* Delete Account */}
      <DeleteAccountSection />
    </div>
  );
}

function DeleteAccountSection() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    try {
      const res = await fetch("/api/auth/delete-account", { method: "DELETE" });
      if (res.ok) {
        await signOut({ callbackUrl: "/login" });
      }
    } catch {
      setIsDeleting(false);
    }
  }

  return (
    <Card className="border-destructive/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <Trash2 className="h-5 w-5" />
          Danger Zone
        </CardTitle>
        <CardDescription>
          Permanently delete your account and all associated data
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          variant="destructive"
          onClick={() => setDialogOpen(true)}
        >
          Delete Account
        </Button>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Account</DialogTitle>
              <DialogDescription>
                This will permanently delete your account, all athletes, training
                plans, and data. This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2 py-2">
              <Label>Type <span className="font-mono font-bold">DELETE</span> to confirm</Label>
              <Input
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="DELETE"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                disabled={confirmText !== "DELETE" || isDeleting}
                onClick={handleDelete}
              >
                {isDeleting ? "Deleting..." : "Permanently Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
