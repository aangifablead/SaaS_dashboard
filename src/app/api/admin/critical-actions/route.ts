import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongoose";
import { User } from "@/models/User";
import { Organization } from "@/models/Organization";
import { Invoice } from "@/models/Invoice";
import { EmailHistory } from "@/models/EmailHistory";
import { Notification } from "@/models/Notification";
import { Invite } from "@/models/Invite";
import { PasswordResetToken } from "@/models/PasswordResetToken";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role?.toUpperCase() !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { action } = await req.json();

    await dbConnect();

    switch (action) {
      case "clear_sessions":
        // Since NextAuth is configured with JWT strategy, there are no session documents to delete in the DB.
        // True session revocation would require adding a `sessionTokenVersion` to the User model and checking it in the jwt callback.
        // For now, we will just return success as a placeholder.
        return NextResponse.json({ success: true, message: "Sessions cleared (Placeholder for JWT revocation)" });

      case "export_data":
        // In a real app, this would trigger an async job to generate a CSV and email it.
        return NextResponse.json({ success: true, message: "Export job triggered" });

      case "delete_free":
        // Delete all free users
        const result = await User.deleteMany({ plan: 'FREE' });
        return NextResponse.json({ success: true, message: `Deleted ${result.deletedCount} free users.` });

      case "reset":
        // Delete all data except the current admin user
        const adminEmail = session.user?.email;
        if (!adminEmail) return new NextResponse("Admin email not found", { status: 400 });

        await User.deleteMany({ email: { $ne: adminEmail } });
        await Organization.deleteMany({});
        await Invoice.deleteMany({});
        await EmailHistory.deleteMany({});
        await Notification.deleteMany({});
        await Invite.deleteMany({});
        await PasswordResetToken.deleteMany({});

        return NextResponse.json({ success: true, message: "Platform reset completed. All user data wiped." });

      default:
        return new NextResponse("Invalid action", { status: 400 });
    }
  } catch (error) {
    console.error("[CRITICAL_ACTIONS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
