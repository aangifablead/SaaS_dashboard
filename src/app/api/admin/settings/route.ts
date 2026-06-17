import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongoose";
import { PlatformSetting } from "@/models/PlatformSetting";

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    // Assuming body is an object of key-value pairs representing settings
    
    await dbConnect();
    
    const updatePromises = Object.entries(body).map(([key, value]) => {
      return PlatformSetting.findOneAndUpdate(
        { key },
        { value: String(value) },
        { upsert: true, new: true }
      );
    });

    await Promise.all(updatePromises);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[ADMIN_SETTINGS_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
