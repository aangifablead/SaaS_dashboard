import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongoose";
import { Organization } from "@/models/Organization";
import { User } from "@/models/User";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role?.toUpperCase() !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const plan = searchParams.get("plan");

    const skip = (page - 1) * limit;

    const filter: any = {};

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }
    if (plan) {
      filter.plan = plan;
    }

    await dbConnect();

    const [organizationsRaw, totalCount] = await Promise.all([
      Organization.aggregate([
        { $match: filter },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "organizationId",
            as: "members"
          }
        }
      ]),
      Organization.countDocuments(filter),
    ]);

    const formattedOrgs = organizationsRaw.map((org: any) => ({
      id: org._id,
      name: org.name,
      plan: org.plan,
      createdAt: org.createdAt,
      ownerId: org.ownerId,
      memberCount: org.members.length,
    }));

    return NextResponse.json({
      organizations: formattedOrgs,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("[ADMIN_ORGS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role?.toUpperCase() !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name, ownerEmail, plan } = body;

    if (!name || !ownerEmail) {
      return new NextResponse("Name and Owner Email are required", { status: 400 });
    }

    await dbConnect();
    
    // Find the owner user
    const owner = await User.findOne({ email: ownerEmail });
    if (!owner) {
      return new NextResponse("Owner user not found with that email", { status: 404 });
    }

    // Generate slug
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.random().toString(36).substring(2, 6);

    const organization = await Organization.create({
      name,
      slug,
      ownerId: owner._id,
      plan: plan || "FREE",
    });

    // Update the owner to belong to this organization if they don't have one
    if (!owner.organizationId) {
      owner.organizationId = organization._id;
      await owner.save();
    }

    return NextResponse.json({
      id: organization._id,
      name: organization.name,
    });
  } catch (error: any) {
    console.error("[ADMIN_ORGS_POST]", error);
    if (error.code === 11000) {
      return new NextResponse("Organization slug already exists", { status: 400 });
    }
    return new NextResponse("Internal Error", { status: 500 });
  }
}
