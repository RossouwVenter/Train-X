"use client";

import { useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Mail,
  Shield,
  UserCircle,
  Calendar,
  Trophy,
  Lock,
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

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

export default function AthleteProfilePage() {
  const { data: session } = useSession();
  const userName = session?.user?.name || "Athlete";
  const userEmail = session?.user?.email || "";
  const initials = userName.split(" ").map((n) => n[0]).join("").toUpperCase();

  // Training preferences state
  const [preferredDays, setPreferredDays] = useState<boolean[]>([
    true,
    true,
    true,
    false,
    true,
    false,
    false,
  ]);
  const [maxSessions, setMaxSessions] = useState(4);
  const [injuryNotes, setInjuryNotes] = useState(
    "Minor left knee discomfort during deep squats"
  );
  const [notifications, setNotifications] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const { theme, setTheme } = useTheme();

  function toggleDay(index: number) {
    setPreferredDays((prev) => prev.map((v, i) => (i === index ? !v : v)));
  }

  function handleSavePreferences() {
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
          Manage your account and training preferences
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
              <div className="mt-3 flex flex-wrap justify-center gap-3 sm:justify-start">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Trophy className="h-3.5 w-3.5" />
                  <span>Strength Training</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <UserCircle className="h-3.5 w-3.5" />
                  <span>Coach: Jordan Rivera</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Joined Jan 2026</span>
                </div>
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
                <p className="text-sm text-foreground">
                  {userEmail}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-muted/30 p-3">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                  Role
                </p>
                <p className="text-sm text-foreground">Athlete</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-muted/30 p-3">
              <UserCircle className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                  Coach
                </p>
                <p className="text-sm text-foreground">Jordan Rivera</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Training preferences */}
      <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg">Training Preferences</CardTitle>
          <CardDescription>
            Customize your training schedule and notes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Preferred training days */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Preferred Training Days
            </Label>
            <div className="grid grid-cols-7 gap-1.5">
              {DAYS.map((day, i) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(i)}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-lg border p-2 text-center transition-all duration-150",
                    preferredDays[i]
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border/40 bg-muted/20 text-muted-foreground hover:border-border hover:bg-muted/40"
                  )}
                >
                  <span className="text-[10px] font-medium uppercase">
                    {day}
                  </span>
                  <Checkbox
                    checked={preferredDays[i]}
                    onCheckedChange={() => toggleDay(i)}
                    className="pointer-events-none data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    aria-label={`Train on ${day}`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Max sessions per week */}
          <div className="space-y-2">
            <Label htmlFor="max-sessions" className="text-sm font-medium">
              Max Sessions Per Week
            </Label>
            <Input
              id="max-sessions"
              type="number"
              min={1}
              max={14}
              value={maxSessions}
              onChange={(e) =>
                setMaxSessions(
                  Math.max(1, Math.min(14, Number(e.target.value)))
                )
              }
              className="w-32"
            />
          </div>

          {/* Injury notes */}
          <div className="space-y-2">
            <Label htmlFor="injury-notes" className="text-sm font-medium">
              Injury Notes
            </Label>
            <Textarea
              id="injury-notes"
              value={injuryNotes}
              onChange={(e) => setInjuryNotes(e.target.value)}
              placeholder="Any injuries or areas to be careful with…"
              rows={3}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Your coach can see these notes when creating plans.
            </p>
          </div>

          {/* Save button */}
          <div className="flex items-center gap-3">
            <Button onClick={handleSavePreferences} className="gap-2">
              {saveSuccess ? (
                <>
                  <Check className="h-4 w-4" />
                  Saved
                </>
              ) : (
                "Save Preferences"
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
                  Preferences updated successfully
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>

      {/* Account section */}
      <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg">Account</CardTitle>
          <CardDescription>Security and notification settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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

          <div className="flex items-center justify-between rounded-lg border border-border/40 p-4">
            <div className="flex items-center gap-3">
              <Lock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-foreground">Password</p>
                <p className="text-xs text-muted-foreground">
                  Last changed 3 months ago
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Change Password
            </Button>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border/40 p-4">
            <div className="flex items-center gap-3">
              {notifications ? (
                <Bell className="h-4 w-4 text-muted-foreground" />
              ) : (
                <BellOff className="h-4 w-4 text-muted-foreground" />
              )}
              <div>
                <p className="text-sm font-medium text-foreground">
                  Notifications
                </p>
                <p className="text-xs text-muted-foreground">
                  {notifications
                    ? "Receiving email and push notifications"
                    : "Notifications are disabled"}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setNotifications(!notifications)}
              className={cn(
                notifications &&
                  "border-emerald-500/30 text-emerald-500 hover:text-emerald-600"
              )}
            >
              {notifications ? "Enabled" : "Disabled"}
            </Button>
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
                This will permanently delete your account, training history,
                and all data. This action cannot be undone.
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
