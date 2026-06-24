import { headers } from "next/headers";
import crypto from "crypto";
import dbConnect from "./mongoose";
import { ApiKey } from "@/models/ApiKey";
import { User } from "@/models/User";

export async function authenticateApiRequest() {
  const headersList = await headers();
  const authHeader = headersList.get("authorization");
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { error: "Missing or invalid Authorization header", status: 401 };
  }

  const rawKey = authHeader.split(" ")[1];
  const hashedKey = crypto.createHash("sha256").update(rawKey).digest("hex");
  
  await dbConnect();
  const apiKeyDoc = await ApiKey.findOne({ key: hashedKey });
  
  if (!apiKeyDoc) {
    return { error: "Invalid API key", status: 401 };
  }

  // Update lastUsedAt timestamp asynchronously
  apiKeyDoc.lastUsedAt = new Date();
  await apiKeyDoc.save().catch(console.error);

  const user = await User.findById(apiKeyDoc.userId);
  if (!user) {
    return { error: "User associated with API key not found", status: 401 };
  }

  return { user, permissions: apiKeyDoc.permissions, status: 200 };
}
