import { redirect } from "next/navigation"
import { auth } from "@/auth"
import dbConnect from "@/lib/mongoose"
import { User } from "@/models/User"
import ProfileClient from "./ProfileClient"

export default async function ProfilePage() {
  const session = await auth()

  if (!session || !session.user || !session.user.email) {
    redirect("/login")
  }

  await dbConnect()
  const dbUser = await User.findOne({ email: session.user.email })

  if (!dbUser) {
    redirect("/login")
  }

  const userData = {
    name: dbUser.name || "",
    email: dbUser.email || "",
    image: dbUser.image || "",
    role: dbUser.role || "USER",
    plan: dbUser.plan || "FREE",
    createdAt: dbUser.createdAt,
    hasPassword: !!dbUser.password // Boolean to determine if they logged in with Google/GitHub and don't have a password yet
  }

  return <ProfileClient user={JSON.parse(JSON.stringify(userData))} />
}
