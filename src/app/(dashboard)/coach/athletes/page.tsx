"use client";

import { useState, useMemo } from "react";
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
  status: "active" | "inactive";
  completionRate: number;
  lastActive: string;
}

const initialAthletes: Athlete[] = [
  {
    id: "1",
    name: "Sam Torres",
    email: "sam.torres@email.com",
    sport: "Track & Field",
    status: "active",
    completionRate: 92,
    lastActive: "2026-05-04",
  },
  {
    id: "2",
    name: "Maria Chen",
    email: "maria.chen@email.com",
    sport: "Swimming",
    status: "active",
    completionRate: 85,
    lastActive: "2026-05-03",
  },
  {
    id: "3",
    name: "Jake Wilson",
    email: "jake.wilson@email.com",
    sport: "CrossFit",
    status: "active",
    completionRate: 78,
    lastActive: "2026-05-01",
  },
  {
    id: "4",
    name: "Aisha Patel",
    email: "aisha.patel@email.com",
    sport: "Yoga",
    status: "inactive",
    completionRate: 45,
    lastActive: "2026-04-10",
  },
  {
    id: "5",
    name: "Carlos Ruiz",
    email: "carlos.ruiz@email.com",
    sport: "Boxing",
    status: "active",
    completionRate: 88,
    lastActive: "2026-05-05",
  },
];

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
  const [athletes, setAthletes] = useState<Athlete[]>(initialAthletes);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [athleteToRemove, setAthleteToRemove] = useState<Athlete | null>(null);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newSport, setNewSport] = useState("");

  const filteredAthletes = useMemo(
    () =>
      athletes.filter((a) =>
        a.name.toLowerCase().includes(search.toLowerCase())
      ),
    [athletes, search]
  );

  function handleAddAthlete(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim() || !newSport.trim()) return;

    const athlete: Athlete = {
      id: crypto.randomUUID(),
      name: newName.trim(),
      email: newEmail.trim(),
      sport: newSport.trim(),
      status: "active",
      completionRate: 0,
      lastActive: new Date().toISOString().split("T")[0],
    };

    setAthletes((prev) => [...prev, athlete]);
    setNewName("");
    setNewEmail("");
    setNewSport("");
    setDialogOpen(false);
  }

  function handleRemoveAthlete() {
    if (!athleteToRemove) return;
    setAthletes((prev) => prev.filter((a) => a.id !== athleteToRemove.id));
    setAthleteToRemove(null);
    setRemoveDialogOpen(false);
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
                <Button type="submit">Add Athlete</Button>
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
      {filteredAthletes.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAthletes.map((athlete) => {
            const initials = athlete.name
              .split(" ")
              .map((n) => n[0])
              .join("");
            const colorIndex =
              parseInt(athlete.id, 10) % avatarColors.length || 0;

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
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                      athlete.status === "active"
                        ? "bg-emerald-500/10 text-emerald-500"
                        : "bg-zinc-500/10 text-zinc-400"
                    )}
                  >
                    {athlete.status === "active" ? "Active" : "Inactive"}
                  </span>
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
                  <div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Completion rate
                      </span>
                      <span className="font-medium">
                        {athlete.completionRate}%
                      </span>
                    </div>
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-500"
                        style={{ width: `${athlete.completionRate}%` }}
                      />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Last active: {formatLastActive(athlete.lastActive)}
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
            >
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
