import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe auth config (no Prisma, no Node.js-only deps).
 * Used by middleware to verify JWT sessions without importing Prisma.
 */
export const authConfig: NextAuthConfig = {
  trustHost: true,
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
  providers: [], // Providers added in auth.ts (needs Node.js runtime)
};
