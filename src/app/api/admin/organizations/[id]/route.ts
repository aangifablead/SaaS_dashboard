import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongoose";
import { Organization } from "@/models/Organization";
import { User } from "@/models/User";
import { Invite } from "@/models/Invite";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await params;
    await dbConnect();
    const organization = await Organization.findById(id).lean();

    if (!organization) {
      return new NextResponse("Organization not found", { status: 404 });
    }

    const membersRaw = await User.find({ organizationId: id }).select("name email role isActive");
    const members = membersRaw.map(m => {
      const obj = m.toObject();
      return { ...obj, id: obj._id };
    });
    
    const invites = await Invite.find({ organizationId: id });

    return NextResponse.json({ ...organization, id: organization._id, members, invites });
  } catch (error) {
    console.error("[ADMIN_ORG_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await params;
    await dbConnect();

    await Promise.all([
      User.updateMany({ organizationId: id }, { $unset: { organizationId: "" } }),
      Invite.deleteMany({ organizationId: id }),
      Organization.findByIdAndDelete(id)
    ]);

    return new NextResponse("Organization deleted", { status: 200 });
  } catch (error) {
    console.error("[ADMIN_ORG_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
