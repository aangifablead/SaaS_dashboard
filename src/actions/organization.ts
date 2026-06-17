"use server"

import dbConnect from "@/lib/mongoose"
import { Organization } from "@/models/Organization"
import { User } from "@/models/User"
import { auth } from "@/auth"

export async function createOrganization(name: string, slug: string) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  await dbConnect()
  const existingOrg = await Organization.findOne({ slug })

  if (existingOrg) {
    throw new Error("Organization with this slug already exists")
  }

  const org = await Organization.create({
    name,
    slug,
    ownerId: session.user.id,
  })

  await User.findByIdAndUpdate(session.user.id, { organizationId: org._id })

  return { success: true, orgId: org._id.toString() }
}

export async function getUserOrganizations() {
  const session = await auth()
  if (!session?.user?.id) {
    return []
  }

  await dbConnect()
  
  // Find organization they belong to
  const user = await User.findById(session.user.id).populate("organizationId").lean()

  // Find organizations they own
  const ownedOrgs = await Organization.find({ ownerId: session.user.id }).lean()

  const orgs = new Map()
  if (user?.organizationId) {
    const org = user.organizationId as any;
    org.id = org._id.toString();
    orgs.set(org.id, org)
  }
  ownedOrgs.forEach((org: any) => {
    org.id = org._id.toString();
    orgs.set(org.id, org)
  })

  return Array.from(orgs.values())
}
