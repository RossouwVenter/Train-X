import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

// ── Mock users for testing (no database needed) ──────────
const MOCK_USERS = [
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

        const user = MOCK_USERS.find((u) => u.email === email);

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
          role: user.role,
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
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
});
