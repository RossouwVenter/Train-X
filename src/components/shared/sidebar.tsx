"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  UserCircle,
  Calendar,
  TrendingUp,
  LogOut,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type Role = "COACH" | "ATHLETE";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const coachNavItems: NavItem[] = [
  { label: "Dashboard", href: "/coach", icon: LayoutDashboard },
  { label: "Athletes", href: "/coach/athletes", icon: Users },
  { label: "Plans", href: "/coach/plans", icon: ClipboardList },
  { label: "Profile", href: "/coach/profile", icon: UserCircle },
];

const athleteNavItems: NavItem[] = [
  { label: "My Week", href: "/athlete", icon: Calendar },
  { label: "Progress", href: "/athlete/progress", icon: TrendingUp },
  { label: "Profile", href: "/athlete/profile", icon: UserCircle },
];

interface SidebarProps {
  role: Role;
  open: boolean;
  onClose: () => void;
  userName?: string;
  userEmail?: string;
}

export function Sidebar({ role, open, onClose, userName, userEmail }: SidebarProps) {
  const pathname = usePathname();
  const navItems = role === "COACH" ? coachNavItems : athleteNavItems;

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border/40 bg-card/80 backdrop-blur-xl transition-transform duration-300 lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-border/40 px-6">
          <Link href={role === "COACH" ? "/coach" : "/athlete"} className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-amber-600">
              <span className="text-sm font-bold text-white">TX</span>
            </div>
            <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-lg font-bold tracking-tight text-transparent">
              TrainX
            </span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-secondary text-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                )}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-110",
                    isActive ? "text-orange-400" : "text-muted-foreground group-hover:text-foreground"
                  )}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className="border-t border-border/40 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-amber-600">
              <span className="text-xs font-semibold text-white">
                {userName ? userName.charAt(0).toUpperCase() : (role === "COACH" ? "C" : "A")}
              </span>
            </div>
            <div className="flex-1 truncate">
              <p className="truncate text-sm font-medium text-foreground">
                {userName || (role === "COACH" ? "Coach" : "Athlete")}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {userEmail || ""}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0 text-muted-foreground hover:text-foreground"
              aria-label="Log out"
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
