import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

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
  trustHost: true,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        // Try database first, fall back to mock users if unreachable
        let user: { id: string; email: string; name: string; role: string; passwordHash: string } | null = null;

        try {
          user = await prisma.user.findUnique({ where: { email } });
        } catch {
          console.log("[AUTH] DB unreachable, using fallback users");
          const fallback = FALLBACK_USERS.find((u) => u.email === email);
          if (fallback) {
            user = { ...fallback };
          }
        }

        if (!user) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role as "COACH" | "ATHLETE",
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "COACH" | "ATHLETE";
      }
      return session;
    },
  },
});
