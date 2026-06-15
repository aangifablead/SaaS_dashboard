"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export async function createOrganization(name: string, slug: string) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const existingOrg = await prisma.organization.findUnique({
    where: { slug },
  })

  if (existingOrg) {
    throw new Error("Organization with this slug already exists")
  }

  const org = await prisma.organization.create({
    data: {
      name,
      slug,
      members: {
        create: {
          userId: session.user.id,
          role: "OWNER",
        },
      },
    },
  })

  return { success: true, orgId: org.id }
}

export async function getUserOrganizations() {
  const session = await auth()
  if (!session?.user?.id) {
    return []
  }

  const memberships = await prisma.organizationMember.findMany({
    where: { userId: session.user.id },
    include: { organization: true },
  })

  return memberships.map((m: any) => m.organization)
}
