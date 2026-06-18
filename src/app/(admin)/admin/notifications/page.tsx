import { auth } from "@/auth"
import { redirect } from "next/navigation"
import NotificationsClient from "./NotificationsClient"

export default async function NotificationsPage() {
  const session = await auth()
  
  if (!session || (session.user as any).role?.toUpperCase() !== "ADMIN") {
    redirect("/login")
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 w-full">

      <NotificationsClient />
    </div>
  )
}
