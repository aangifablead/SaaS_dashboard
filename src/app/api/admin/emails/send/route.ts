import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongoose";
import { User } from "@/models/User";
import { EmailHistory } from "@/models/EmailHistory";
import { Resend } from "resend";

// Ensure you have RESEND_API_KEY in your .env
const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy");

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { to, subject, body: emailBody } = body;

    if (!to || !subject || !emailBody) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    let recipients: string[] = [];

    await dbConnect();
    // Determine recipients based on 'to' value
    if (to === "all") {
      const users = await User.find().select("email");
      recipients = users.map((u: any) => u.email).filter(Boolean) as string[];
    } else if (to === "pro") {
      const users = await User.find({ plan: "PRO" }).select("email");
      recipients = users.map((u: any) => u.email).filter(Boolean) as string[];
    } else if (to === "free") {
      const users = await User.find({ plan: "FREE" }).select("email");
      recipients = users.map((u: any) => u.email).filter(Boolean) as string[];
    } else if (to === "enterprise") {
      const users = await User.find({ plan: "ENTERPRISE" }).select("email");
      recipients = users.map((u: any) => u.email).filter(Boolean) as string[];
    } else {
      // Assuming it's a custom email address
      recipients = [to];
    }

    if (recipients.length === 0) {
      return new NextResponse("No recipients found", { status: 404 });
    }

    // Send emails via Resend
    // Resend batch sending limit is usually 100 per request, we'll send a single test for now or batch them
    const { data, error } = await resend.emails.send({
      from: "Admin <admin@yourdomain.com>",
      to: recipients,
      subject: subject,
      html: emailBody,
    });

    if (error) {
      return new NextResponse(error.message, { status: 400 });
    }

    // Save to history
    await EmailHistory.create({
      to: to,
      subject,
      body: emailBody,
      status: "SENT",
    });

    return NextResponse.json({ success: true, count: recipients.length });
  } catch (error) {
    console.error("[ADMIN_EMAILS_SEND_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
