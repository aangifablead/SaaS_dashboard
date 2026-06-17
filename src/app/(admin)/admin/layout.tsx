import { redirect } from "next/navigation"
import { auth } from "@/auth"
import AdminLayoutClient from "./AdminLayoutClient"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  if (!session || !session.user) {
    redirect("/login")
  }

  // Check if role is admin
  if ((session.user as any).role?.toUpperCase() !== "ADMIN" && session.user.email !== "admin@gmail.com") {
    redirect("/dashboard") // Or wherever normal users go
  }

  // Pass user info to client layout
  const user = {
    name: session.user.name || "Administrator",
    email: session.user.email || "admin@saas.com",
    image: session.user.image || ""
  }

  return <AdminLayoutClient user={user}>{children}</AdminLayoutClient>
}
