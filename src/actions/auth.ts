"use server"

import dbConnect from "@/lib/mongoose"
import { User } from "@/models/User"
import { PlatformSetting } from "@/models/PlatformSetting"
import { hash } from "bcryptjs"

export async function registerUser(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    throw new Error("Email and password are required")
  }

  await dbConnect()
  
  const allowRegistration = await PlatformSetting.findOne({ key: "allowPublicRegistration" })
  if (allowRegistration?.value === "false") {
    throw new Error("Public registration is currently disabled.")
  }

  const existingUser = await User.findOne({ email })

  if (existingUser) {
    throw new Error("This account already exists. Please login instead.")
  }

  const passwordHash = await hash(password, 10)

    const data = {
      name,
      email,
      password: passwordHash,
    }
    const user = await User.create(data)

  return { success: true, userId: user.id }
}

export async function loginUser(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const redirectTo = (formData.get("redirectTo") as string) || "/"

  if (!email || !password) {
    throw new Error("Email and password are required")
  }

  const { signIn } = await import("@/auth")
  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo,
    })
    return { success: true }
  } catch (error: any) {
    if (error.name === "AuthError" || error.type?.includes("CredentialsSignin")) {
      return { success: false, error: "Invalid email or password" }
    }
    // If it's a Next.js redirect error, the login was successful. Return success so the client component can redirect.
    if (error.message && error.message.includes("NEXT_REDIRECT")) {
      return { success: true }
    }
    return { success: false, error: "An unexpected error occurred" }
  }
}
