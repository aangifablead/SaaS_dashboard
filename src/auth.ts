import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import clientPromise from "./lib/mongodb"
import { compare } from "bcryptjs"
import dbConnect from "./lib/mongoose"
import { User } from "./models/User"
import { LoginEvent } from "./models/LoginEvent"
import { headers } from "next/headers"

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  session: { strategy: "jwt" },
  providers: [
    GitHub,
    Google,
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        await dbConnect()
        const user = await User.findOne({ email: credentials.email as string })

        if (!user || !user.password) {
          return null
        }

        const isPasswordValid = await compare(
          credentials.password as string,
          user.password
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        // Add role to token
        token.role = (user as any).role || "USER"
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        // Add role to session
        ;(session.user as any).role = token.role as string
      }
      return session
    },
  },
  events: {
    async signIn({ user }) {
      try {
        const headersList = await headers();
        const ipAddress = headersList.get("x-forwarded-for") || "127.0.0.1";
        const userAgent = headersList.get("user-agent") || "Unknown Device";
        const city = headersList.get("x-vercel-ip-city");
        const country = headersList.get("x-vercel-ip-country");
        
        let os = "Unknown OS";
        if (userAgent.includes("Mac OS X")) os = "Mac OS";
        else if (userAgent.includes("Windows")) os = "Windows";
        else if (userAgent.includes("iPhone")) os = "iPhone";
        else if (userAgent.includes("Android")) os = "Android";
        else if (userAgent.includes("Linux")) os = "Linux";

        let browser = "Browser";
        if (userAgent.includes("Chrome") || userAgent.includes("CriOS")) browser = "Chrome";
        else if (userAgent.includes("Safari")) browser = "Safari";
        else if (userAgent.includes("Firefox")) browser = "Firefox";

        const device = `${browser} on ${os}`;
        const location = city && country ? `${city}, ${country}` : "Unknown Location";

        await dbConnect();
        await LoginEvent.create({
          userId: user.id,
          device,
          location,
          ipAddress
        });
      } catch (e) {
        console.error("Failed to log sign in event", e);
      }
    }
  }
})
