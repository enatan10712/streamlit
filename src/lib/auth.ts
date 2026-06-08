import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "./prisma";
import bcrypt from "bcryptjs";

export const authOptions: AuthOptions = {
  // @ts-expect-error - PrismaAdapter type mismatch in NextAuth v4/Prisma 7
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) throw new Error("Invalid credentials");
        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user || !user.hashedPassword) throw new Error("Invalid credentials");
        const isCorrectPassword = await bcrypt.compare(credentials.password, user.hashedPassword);
        if (!isCorrectPassword) throw new Error("Invalid credentials");
        return user;
      },
    }),
  ],
  pages: { signIn: "/auth/login" },
  debug: process.env.NODE_ENV === "development",
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }) {
      if (token?.sub && session.user) {
        session.user.id = token.sub;
        const dbUser = await prisma.user.findUnique({ where: { id: token.sub } });
        if (dbUser) session.user.role = dbUser.role;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
  },
};
