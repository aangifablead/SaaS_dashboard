import dbConnect from "./mongoose";
import { User } from "@/models/User";

export const PLAN_LIMITS: Record<string, { apiCalls: number; storageUsed: number; teamMembers: number }> = {
  FREE: { apiCalls: 1000, storageUsed: 1, teamMembers: 1 }, // 1GB
  PRO: { apiCalls: 10000, storageUsed: 10, teamMembers: 10 }, // 10GB
  ENTERPRISE: { apiCalls: Infinity, storageUsed: Infinity, teamMembers: Infinity },
};

/**
 * Atomically checks if the user has enough limits for a specific metric and increments it.
 * Uses MongoDB $lt and $inc for race-condition-free enforcement.
 */
export async function checkAndIncrementUsage(
  userId: string,
  metric: "apiCalls" | "storageUsed" | "teamMembers",
  incrementBy = 1
): Promise<boolean> {
  await dbConnect();
  
  const user = await User.findById(userId).select("plan").lean();
  if (!user) return false;
  
  const plan = (user.plan || "FREE") as keyof typeof PLAN_LIMITS;
  const limit = PLAN_LIMITS[plan]?.[metric] || 0;
  
  if (limit === Infinity) {
    // Just increment without limit check
    await User.updateOne(
      { _id: userId },
      { $inc: { [`usageCounters.${metric}`]: incrementBy } }
    );
    return true;
  }
  
  // Find a user where current usage + incrementBy <= limit
  // Note: we check if current < limit - incrementBy + 1
  const updatedUser = await User.findOneAndUpdate(
    { 
      _id: userId,
      [`usageCounters.${metric}`]: { $lte: limit - incrementBy }
    },
    { 
      $inc: { [`usageCounters.${metric}`]: incrementBy } 
    },
    { new: true }
  );
  
  // If updatedUser is null, they hit the limit
  return !!updatedUser;
}
