import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongoose";
import { User } from "@/models/User";

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role?.toUpperCase() !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { userIds, updates } = body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return new NextResponse("Missing user IDs", { status: 400 });
    }

    await dbConnect();
    
    await User.updateMany(
      { _id: { $in: userIds } },
      { $set: updates }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[ADMIN_USERS_BULK]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
