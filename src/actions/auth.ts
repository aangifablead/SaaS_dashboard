"use server"

import { prisma } from "@/lib/prisma"
import { hash } from "bcryptjs"

export async function registerUser(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    throw new Error("Email and password are required")
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    throw new Error("This account already exists. Please login instead.")
  }

  const passwordHash = await hash(password, 10)

    const data = {
      name,
      email,
      password: passwordHash,
    }
    const user = await prisma.user.create({
      data,
    })

  return { success: true, userId: user.id }
}

export async function loginUser(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    throw new Error("Email and password are required")
  }

  // We are using Credentials provider, so we can use NextAuth signIn server action
  const { signIn } = await import("@/auth")
  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    })
    return { success: true }
  } catch (err: any) {
    throw new Error("Invalid credentials")
  }
}
