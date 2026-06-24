import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongoose";
import { EmailTemplate } from "@/models/EmailTemplate";

export async function GET() {
  try {
    const session = await auth();
    if (!session || (session.user as any).role?.toUpperCase() !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await dbConnect();
    const templates = await EmailTemplate.find().sort({ createdAt: -1 });

    return NextResponse.json(templates);
  } catch (error) {
    console.error("[EMAIL_TEMPLATES_GET]", error);
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
    const { name, desc, subject, body: emailBody } = body;

    if (!name || !subject || !emailBody) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    await dbConnect();

    const template = await EmailTemplate.create({
      name,
      desc: desc || "Custom user-created template",
      subject,
      body: emailBody,
      // Optional defaults could be passed in body, otherwise rely on schema defaults
      icon: body.icon || 'FileText',
      color: body.color || 'text-indigo-600',
      bg: body.bg || 'bg-indigo-50'
    });

    return NextResponse.json(template);
  } catch (error) {
    console.error("[EMAIL_TEMPLATES_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
