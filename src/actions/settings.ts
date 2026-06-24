"use server";

import { auth } from "@/auth";
import dbConnect from "@/lib/mongoose";
import { User } from "@/models/User";
import { ApiKey } from "@/models/ApiKey";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { revalidatePath } from "next/cache";

// PROFILE
export async function getProfileData() {
  const session = await auth();
  if (!session?.user?.email) return null;

  await dbConnect();
  const user = await User.findOne({ email: session.user.email }).lean();
  if (!user) return null;

  return {
    name: user.name || "",
    email: user.email || "",
    emailVerified: user.emailVerified || null,
    phone: user.phone || "",
    company: user.company || "",
    role: user.role || "",
    bio: user.bio || "",
  };
}

export async function updateProfile(data: { name: string; phone: string; company: string; role: string; bio: string }) {
  const session = await auth();
  if (!session?.user?.email) return { error: "Unauthorized" };

  await dbConnect();
  await User.updateOne({ email: session.user.email }, { $set: data });
  revalidatePath("/dashboard/settings");
  return { success: true };
}

// SECURITY
export async function changePassword(current: string, newPass: string) {
  const session = await auth();
  if (!session?.user?.email) return { error: "Unauthorized" };

  await dbConnect();
  const user = await User.findOne({ email: session.user.email });
  if (!user) return { error: "User not found" };

  // If user signed up with Google/Github they might not have a password
  if (!user.password) {
    return { error: "Account uses OAuth login. Cannot change password." };
  }

  const isMatch = await bcrypt.compare(current, user.password);
  if (!isMatch) return { error: "Current password is incorrect" };

  const hashedPassword = await bcrypt.hash(newPass, 10);
  user.password = hashedPassword;
  await user.save();

  return { success: true };
}

// API KEYS
export async function getApiKeys() {
  const session = await auth();
  if (!session?.user?.email) return [];

  await dbConnect();
  const user = await User.findOne({ email: session.user.email });
  if (!user) return [];

  const keys = await ApiKey.find({ userId: user._id }).sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(keys));
}

export async function createApiKey(name: string, permissions: string) {
  const session = await auth();
  if (!session?.user?.email) return { error: "Unauthorized" };

  await dbConnect();
  const user = await User.findOne({ email: session.user.email });
  if (!user) return { error: "User not found" };

  // Generate a key e.g. sk_live_randomstring
  const rawKey = crypto.randomBytes(24).toString("hex");
  const prefix = permissions === "Read Only" ? "sk_test_" : "sk_live_";
  const key = prefix + rawKey;

  const hashedKey = crypto.createHash("sha256").update(key).digest("hex");
  const partialKey = prefix + "..." + rawKey.slice(-4);

  await ApiKey.create({
    userId: user._id,
    name,
    key: hashedKey,
    partialKey,
    permissions,
  });

  revalidatePath("/dashboard/settings");
  return { success: true, key };
}

import { LoginEvent } from "@/models/LoginEvent";

export async function getLoginHistory() {
  const session = await auth();
  if (!session?.user?.email) return [];

  await dbConnect();
  const user = await User.findOne({ email: session.user.email });
  if (!user) return [];

  const history = await LoginEvent.find({ userId: user._id })
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();
    
  return JSON.parse(JSON.stringify(history));
}

export async function revokeApiKey(keyId: string) {
  const session = await auth();
  if (!session?.user?.email) return { error: "Unauthorized" };

  await dbConnect();
  const user = await User.findOne({ email: session.user.email });
  if (!user) return { error: "User not found" };

  await ApiKey.deleteOne({ _id: keyId, userId: user._id });
  revalidatePath("/dashboard/settings");
  return { success: true };
}

export async function deleteAccount() {
  const session = await auth();
  if (!session?.user?.email) return { error: "Unauthorized" };

  await dbConnect();
  const user = await User.findOne({ email: session.user.email });
  if (!user) return { error: "User not found" };

  // Delete all user API keys
  await ApiKey.deleteMany({ userId: user._id });
  
  // Delete the user
  await User.deleteOne({ _id: user._id });

  return { success: true };
}
