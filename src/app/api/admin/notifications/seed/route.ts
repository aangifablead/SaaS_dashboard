import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongoose";
import { Notification } from "@/models/Notification";

export async function POST(req: Request) {
  try {
    const session = await auth();
    // Allow without auth just for quick testing if needed, or keep auth
    if (!session || (session.user as any).role?.toUpperCase() !== "ADMIN") {
      // return new NextResponse("Unauthorized", { status: 401 });
    }

    await dbConnect();
    
    await Notification.create([
      {
        title: "New User Registered",
        message: "A new user John Doe has signed up for the Pro plan.",
        type: "success",
        isRead: false
      },
      {
        title: "High Server Load",
        message: "CPU utilization has exceeded 80% for the last 5 minutes.",
        type: "warning",
        isRead: false
      },
      {
        title: "Payment Failed",
        message: "Subscription renewal failed for user admin@example.com.",
        type: "error",
        isRead: false
      }
    ]);

    return NextResponse.json({ success: true, message: "Seed successful" });
  } catch (error) {
    console.error("[ADMIN_NOTIFICATION_SEED]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
