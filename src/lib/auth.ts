import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { authConfig } from "@/lib/auth.config";

// Offline fallback users when DB is unreachable
const FALLBACK_USERS = [
  {
    id: "coach-1",
    email: "demo.coach@trainx.dev",
    name: "Jordan Rivera",
    role: "COACH" as const,
    passwordHash: bcrypt.hashSync("Tr@1nX!c0ach", 10),
  },
  {
    id: "athlete-1",
    email: "demo.athlete@trainx.dev",
    name: "Sam Torres",
    role: "ATHLETE" as const,
    passwordHash: bcrypt.hashSync("Tr@1nX!4thlt", 10),
  },
];

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("[AUTH] authorize called with email:", credentials?.email);

        if (!credentials?.email || !credentials?.password) {
          console.log("[AUTH] Missing credentials");
          return null;
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        // Try database first, fall back to mock users if unreachable
        let user: { id: string; email: string; name: string; role: string; passwordHash: string } | null = null;

        try {
          user = await prisma.user.findUnique({ where: { email } });
          console.log("[AUTH] DB query result:", user ? `Found user ${user.id} (${user.role})` : "No user found");
        } catch (err) {
          console.log("[AUTH] DB unreachable, using fallback users. Error:", err);
          const fallback = FALLBACK_USERS.find((u) => u.email === email);
          if (fallback) {
            user = { ...fallback };
          }
        }

        if (!user) {
          console.log("[AUTH] No user found for email:", email);
          return null;
        }

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        console.log("[AUTH] Password valid:", isPasswordValid);

        if (!isPasswordValid) {
          console.log("[AUTH] Invalid password for:", email);
          return null;
        }

        console.log("[AUTH] Login successful for:", email, "role:", user.role);
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role as "COACH" | "ATHLETE",
        };
      },
    }),
  ],
});
