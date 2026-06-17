import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongoose";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const plan = searchParams.get("plan");
    const role = searchParams.get("role");
    const status = searchParams.get("status");

    const skip = (page - 1) * limit;

    const filter: any = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }
    if (plan) {
      filter.plan = plan;
    }
    if (role) {
      filter.role = role;
    }
    if (status) {
      filter.isActive = status === "active";
    }

    await dbConnect();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [usersRaw, totalCount, newUsersToday] = await Promise.all([
      User.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("organizationId", "name")
        .select("name email role plan isActive createdAt organizationId"),
      User.countDocuments(filter),
      User.countDocuments({ createdAt: { $gte: today } }),
    ]);

    const users = usersRaw.map(u => {
      const obj = u.toObject();
      return {
        ...obj,
        id: obj._id,
        organization: obj.organizationId
      }
    });

    return NextResponse.json({
      users,
      totalCount,
      newUsersToday,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("[ADMIN_USERS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name, email, password, role, plan } = body;

    if (!email || !password) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    await dbConnect();
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return new NextResponse("User already exists", { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "USER",
      plan: plan || "FREE",
    });

    // TODO: Send welcome email here using resend or nodemailer

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      plan: user.plan,
    });
  } catch (error) {
    console.error("[ADMIN_USERS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
