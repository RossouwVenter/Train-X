"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Mail, Lock, User, ClipboardList, Activity, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Role = "COACH" | "ATHLETE";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<Role | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isValidEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name || !email || !password || !confirmPassword || !role) {
      setError("Please fill in all fields and select a role.");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed. Please try again.");
        setIsLoading(false);
        return;
      }

      // Auto sign-in after registration
      const signInResult = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (signInResult?.error) {
        // Registration succeeded but sign-in failed — redirect to login
        window.location.href = "/login";
        return;
      }

      window.location.href = role === "COACH" ? "/coach" : "/athlete";
    } catch {
      setError("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  }

  return (
    <Card className="border-border/50">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold tracking-tight">
          Create your account
        </CardTitle>
        <CardDescription>Get started with TrainX</CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-9"
                disabled={isLoading}
                autoComplete="name"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9"
                disabled={isLoading}
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="Min. 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9"
                disabled={isLoading}
                autoComplete="new-password"
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Repeat password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-9"
                disabled={isLoading}
                autoComplete="new-password"
              />
            </div>
          </div>

          {/* Role Selector */}
          <div className="space-y-2">
            <Label>I am a…</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole("COACH")}
                disabled={isLoading}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-lg border border-border bg-background p-4 text-sm font-medium transition-all hover:border-orange-500/50 hover:bg-secondary/50",
                  role === "COACH" &&
                    "border-orange-500 bg-orange-500/10 shadow-[0_0_12px_-3px] shadow-orange-500/30"
                )}
              >
                <ClipboardList
                  className={cn(
                    "h-6 w-6 text-muted-foreground transition-colors",
                    role === "COACH" && "text-orange-400"
                  )}
                />
                <span
                  className={cn(
                    "text-muted-foreground transition-colors",
                    role === "COACH" && "text-foreground"
                  )}
                >
                  Coach
                </span>
              </button>

              <button
                type="button"
                onClick={() => setRole("ATHLETE")}
                disabled={isLoading}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-lg border border-border bg-background p-4 text-sm font-medium transition-all hover:border-amber-500/50 hover:bg-secondary/50",
                  role === "ATHLETE" &&
                    "border-amber-500 bg-amber-500/10 shadow-[0_0_12px_-3px] shadow-amber-500/30"
                )}
              >
                <Activity
                  className={cn(
                    "h-6 w-6 text-muted-foreground transition-colors",
                    role === "ATHLETE" && "text-amber-400"
                  )}
                />
                <span
                  className={cn(
                    "text-muted-foreground transition-colors",
                    role === "ATHLETE" && "text-foreground"
                  )}
                >
                  Athlete
                </span>
              </button>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button
            type="submit"
            className={cn(
              "w-full bg-gradient-to-r from-orange-600 to-amber-600 text-white transition-opacity hover:opacity-90",
              isLoading && "opacity-70"
            )}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account…
              </>
            ) : (
              "Create Account"
            )}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-primary underline-offset-4 transition-colors hover:underline"
            >
              Sign in
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
