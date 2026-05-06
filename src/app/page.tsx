import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    redirect(session.user.role === "COACH" ? "/coach" : "/athlete");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background via-background to-secondary/20 px-4">
      {/* Logo */}
      <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600">
        <span className="text-2xl font-bold text-white">TX</span>
      </div>

      <h1 className="mt-4 bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-4xl font-bold tracking-tight text-transparent">
        TrainX
      </h1>

      <p className="mt-2 max-w-xs text-center text-muted-foreground">
        The modern platform for coaches and athletes to train smarter.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button
          asChild
          className="bg-gradient-to-r from-orange-600 to-amber-600 text-white transition-opacity hover:opacity-90"
          size="lg"
        >
          <Link href="/register">Get Started</Link>
        </Button>

        <Button asChild variant="outline" size="lg">
          <Link href="/login">Sign In</Link>
        </Button>
      </div>
    </main>
  );
}
