import dbConnect from "@/lib/mongoose"
import { Organization } from "@/models/Organization"
import { User } from "@/models/User"
import OrganizationsClient from "./OrganizationsClient"

export default async function OrganizationsPage() {
  await dbConnect()
  const organizations = await Organization.find().sort({ createdAt: -1 }).lean()

  const ownerIds = organizations.map((o: any) => o.ownerId)
  const owners = await User.find({ _id: { $in: ownerIds } }).select("name").lean()
  const ownerMap = new Map(owners.map((o: any) => [o._id.toString(), o.name]))

  const formattedOrgs = await Promise.all(organizations.map(async (org: any) => {
    const memberCount = await User.countDocuments({ organizationId: org._id });
    return {
      id: org._id.toString(),
      name: org.name,
      slug: org.slug,
      owner: ownerMap.get(org.ownerId.toString()) || "Unknown",
      members: memberCount,
      plan: org.plan === "FREE" ? "Free" : org.plan === "PRO" ? "Pro" : "Enterprise",
      revenue: org.plan === "FREE" ? "₹0" : org.plan === "PRO" ? "₹4,995" : "Custom", // Simplified mock logic
      created: new Date(org.createdAt).toLocaleDateString(),
      status: "Active"
    }
  }))

  return (
    <OrganizationsClient organizations={formattedOrgs} />
  )
}
