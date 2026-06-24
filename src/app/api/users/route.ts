import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongoose";
import { User } from "@/models/User";

export async function DELETE(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("id");

    if (!userId) {
      return new NextResponse("User ID is required", { status: 400 });
    }

    await dbConnect();

    // Verify sender is admin or has rights
    const sender = await User.findById(session.user.id);
    if (!sender) {
      return new NextResponse("User not found", { status: 404 });
    }

    const orgId = sender.organizationId || sender._id;

    // Verify the target user belongs to the same organization
    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return new NextResponse("Target user not found", { status: 404 });
    }

    if (targetUser.organizationId?.toString() !== orgId.toString() && targetUser._id.toString() !== orgId.toString()) {
      return new NextResponse("Unauthorized to delete this user", { status: 403 });
    }

    // Don't allow user to delete themselves through this endpoint
    if (userId === session.user.id) {
      return new NextResponse("Cannot delete yourself", { status: 400 });
    }

    await User.findByIdAndDelete(userId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[USER_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("id");

    if (!userId) {
      return new NextResponse("User ID is required", { status: 400 });
    }

    const body = await req.json();
    const { name, email, role, plan, isActive } = body;

    await dbConnect();

    // Verify sender is admin or has rights
    const sender = await User.findById(session.user.id);
    if (!sender) {
      return new NextResponse("User not found", { status: 404 });
    }

    const orgId = sender.organizationId || sender._id;

    // Verify the target user belongs to the same organization
    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return new NextResponse("Target user not found", { status: 404 });
    }

    if (targetUser.organizationId?.toString() !== orgId.toString() && targetUser._id.toString() !== orgId.toString()) {
      return new NextResponse("Unauthorized to modify this user", { status: 403 });
    }

    // Update user
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (role !== undefined) updateData.role = role;
    if (plan !== undefined) updateData.plan = plan;
    if (isActive !== undefined) updateData.isActive = isActive;

    await User.findByIdAndUpdate(userId, updateData);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[USER_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
