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
    if (!session || (session.user as any).role?.toUpperCase() !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await params;
    await dbConnect();
    const organizationRaw = await Organization.findById(id).lean();

    if (!organizationRaw) {
      return new NextResponse("Organization not found", { status: 404 });
    }

    const owner = await User.findById(organizationRaw.ownerId).select("name email").lean();
    const organization = {
      ...organizationRaw,
      owner: owner || { name: "Unknown", email: "Unknown" }
    };

    const membersRaw = await User.find({ organizationId: id }).select("name email role isActive");
    const members = membersRaw.map(m => {
      const obj = m.toObject();
      return { ...obj, id: obj._id };
    });
    
    const invites = await Invite.find({ organizationId: id }).populate("senderId", "name").lean();

    const formattedInvites = invites.map((inv: any) => ({
      email: inv.email,
      inviter: inv.senderId ? inv.senderId.name : "System",
      status: inv.accepted ? "Accepted" : (new Date() > new Date(inv.expiresAt) ? "Expired" : "Pending"),
      sent: new Date(inv.createdAt).toLocaleDateString(),
      expiry: new Date(inv.expiresAt).toLocaleDateString()
    }));

    return NextResponse.json({ ...organization, id: organization._id, members, invites: formattedInvites });
  } catch (error) {
    console.error("[ADMIN_ORG_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role?.toUpperCase() !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { name, plan } = body;

    await dbConnect();
    
    const org = await Organization.findByIdAndUpdate(
      id,
      { $set: { name, plan } },
      { new: true }
    );

    if (!org) {
      return new NextResponse("Organization not found", { status: 404 });
    }

    return NextResponse.json({ id: org._id, name: org.name, plan: org.plan });
  } catch (error) {
    console.error("[ADMIN_ORG_PUT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role?.toUpperCase() !== "ADMIN") {
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
