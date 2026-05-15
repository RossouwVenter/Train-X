"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserPlus, Search, Users, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Athlete {
  id: string;
  name: string;
  email: string;
  sport: string;
  createdAt: string;
}

const avatarColors = [
  "from-orange-500 to-amber-600",
  "from-amber-500 to-yellow-600",
  "from-rose-500 to-orange-600",
  "from-yellow-500 to-amber-600",
  "from-red-500 to-orange-600",
];

function formatLastActive(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function AthletesPage() {
  const router = useRouter();
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [athleteToRemove, setAthleteToRemove] = useState<Athlete | null>(null);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newSport, setNewSport] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchAthletes = useCallback(async () => {
    try {
      const res = await fetch("/api/athletes");
      if (res.ok) {
        const json = await res.json();
        setAthletes(json.data || []);
      }
    } catch {
      // silent fail — list stays empty
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAthletes();
  }, [fetchAthletes]);

  const filteredAthletes = useMemo(
    () =>
      athletes.filter((a) =>
        a.name?.toLowerCase().includes(search.toLowerCase())
      ),
    [athletes, search]
  );

  async function handleAddAthlete(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim() || !newSport.trim()) return;
    setSubmitting(true);

    try {
      const res = await fetch("/api/athletes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName.trim(),
          email: newEmail.trim(),
          sport: newSport.trim(),
        }),
      });

      if (res.ok) {
        const json = await res.json();
        setAthletes((prev) => [...prev, json.data]);
        setNewName("");
        setNewEmail("");
        setNewSport("");
        setDialogOpen(false);
      } else {
        const json = await res.json();
        alert(json.error || "Failed to add athlete");
      }
    } catch {
      alert("Failed to add athlete");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleRemoveAthlete() {
    if (!athleteToRemove) return;
    setSubmitting(true);

    try {
      const res = await fetch("/api/athletes", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ athleteProfileId: athleteToRemove.id }),
      });

      if (res.ok) {
        setAthletes((prev) => prev.filter((a) => a.id !== athleteToRemove.id));
      } else {
        const json = await res.json();
        alert(json.error || "Failed to remove athlete");
      }
    } catch {
      alert("Failed to remove athlete");
    } finally {
      setAthleteToRemove(null);
      setRemoveDialogOpen(false);
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Athletes
          </h1>
          <p className="text-muted-foreground">
            Manage your athletes and track their progress
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <UserPlus className="h-4 w-4" />
              Add Athlete
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleAddAthlete}>
              <DialogHeader>
                <DialogTitle>Add New Athlete</DialogTitle>
                <DialogDescription>
                  Add an athlete to your roster. They&apos;ll appear in your
                  athletes list.
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Full name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="athlete@example.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sport">Sport</Label>
                  <Input
                    id="sport"
                    placeholder="e.g. Swimming, CrossFit"
                    value={newSport}
                    onChange={(e) => setNewSport(e.target.value)}
                    required
                  />
                </div>
              </div>
              <DialogFooter className="mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Adding..." : "Add Athlete"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search athletes by name..."
          className="pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Athletes grid */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <p className="text-muted-foreground">Loading athletes...</p>
        </div>
      ) : filteredAthletes.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAthletes.map((athlete, idx) => {
            const initials = (athlete.name || "?")
              .split(" ")
              .map((n) => n[0])
              .join("");
            const colorIndex = idx % avatarColors.length;

            return (
              <Card
                key={athlete.id}
                className="group cursor-pointer transition-all duration-200 hover:shadow-md hover:shadow-black/10 hover:border-primary/20"
                onClick={() => router.push(`/coach/athletes/${athlete.id}`)}
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br text-sm font-bold text-white",
                        avatarColors[colorIndex]
                      )}
                    >
                      {initials}
                    </div>
                    <div>
                      <CardTitle className="text-base">
                        {athlete.name}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        {athlete.sport}
                      </CardDescription>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setAthleteToRemove(athlete);
                      setRemoveDialogOpen(true);
                    }}
                    className="ml-2 rounded-md p-1.5 text-muted-foreground opacity-0 transition-opacity hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                    title="Remove athlete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-xs text-muted-foreground">
                    {athlete.email}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Added: {formatLastActive(athlete.createdAt)}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        /* Empty state */
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16">
          <Users className="h-12 w-12 text-muted-foreground/40" />
          <p className="mt-4 text-lg font-medium text-foreground">
            No athletes found
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {search
              ? `No athletes matching "${search}"`
              : "Add your first athlete to get started"}
          </p>
          {search && (
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setSearch("")}
            >
              Clear search
            </Button>
          )}
        </div>
      )}

      {/* Remove Athlete Confirmation Dialog */}
      <Dialog open={removeDialogOpen} onOpenChange={setRemoveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Athlete</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove{" "}
              <span className="font-semibold">{athleteToRemove?.name}</span> from
              your roster? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setRemoveDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleRemoveAthlete}
              disabled={submitting}
            >
              {submitting ? "Removing..." : "Remove"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
