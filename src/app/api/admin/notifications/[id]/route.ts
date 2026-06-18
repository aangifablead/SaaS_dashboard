import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongoose";
import { Notification } from "@/models/Notification";

export async function PATCH(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role?.toUpperCase() !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await props.params;

    await dbConnect();
    const updated = await Notification.findByIdAndUpdate(id, { isRead: true }, { new: true });
    
    if (!updated) {
      return new NextResponse("Not Found", { status: 404 });
    }

    return NextResponse.json({ success: true, notification: updated });
  } catch (error) {
    console.error("[ADMIN_NOTIFICATION_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role?.toUpperCase() !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await props.params;

    await dbConnect();
    const deleted = await Notification.findByIdAndDelete(id);
    
    if (!deleted) {
      return new NextResponse("Not Found", { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[ADMIN_NOTIFICATION_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
