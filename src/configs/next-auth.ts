import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import { getRouter } from "@/utils/router";

const prisma = new PrismaClient();

export const AUTH_OPTIONS: AuthOptions = {
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: {
            email: credentials?.email,
          }
        });

        if (!user || !credentials?.password) return null;
        
        const isValid = credentials.password === user.password;
        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          role: user.role,
          name: user.name ?? null,
          image: user.image ?? null
        };
      },
    })
  ],
  pages: {
    signIn: getRouter("login"),
    error: getRouter("login"),
  },
  adapter: PrismaAdapter(prisma),
  callbacks: {
    async signIn({ user }) {
      if (!user) return false;
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.role = (user as any).role;
        token.email = user.email ?? "";
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.role = token.role;
      }
      return session;
    }
  }
};

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      email: string;
    };
    role?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    email: string;
    role?: string;
    id?: string;
  }
}
