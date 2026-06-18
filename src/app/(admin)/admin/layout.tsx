import { redirect } from "next/navigation"
import { auth } from "@/auth"
import AdminLayoutClient from "./AdminLayoutClient"
import dbConnect from "@/lib/mongoose"
import { PlatformSetting } from "@/models/PlatformSetting"
import { User } from "@/models/User"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  if (!session || !session.user) {
    redirect("/login")
  }

  // Check if role is admin
  if ((session.user as any).role?.toUpperCase() !== "ADMIN" && session.user.email !== "admin@gmail.com") {
    redirect("/dashboard") // Or wherever normal users go
  }

  await dbConnect();
  
  // Fetch fresh user data from DB to avoid stale session data (e.g. outdated profile images)
  const dbUser = await User.findOne({ email: session.user.email }).lean();

  // Pass user info to client layout
  const user = {
    name: dbUser?.name || session.user.name || "Administrator",
    email: dbUser?.email || session.user.email || "admin@saas.com",
    image: dbUser?.image || session.user.image || ""
  }


  const [settingName, settingLogo] = await Promise.all([
    PlatformSetting.findOne({ key: "platformName" }),
    PlatformSetting.findOne({ key: "logo" })
  ]);
  const platformName = settingName?.value || "Admin";
  const logo = settingLogo?.value || "";

  return <AdminLayoutClient user={user} platformName={platformName} logo={logo}>{children}</AdminLayoutClient>
}
