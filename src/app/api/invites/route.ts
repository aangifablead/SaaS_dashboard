import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongoose";
import { User } from "@/models/User";
import { Invite } from "@/models/Invite";
import crypto from "crypto";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { email, role } = await req.json();

    if (!email) {
      return new NextResponse("Email is required", { status: 400 });
    }

    await dbConnect();

    const sender = await User.findById(session.user.id);
    if (!sender) {
       return new NextResponse("User not found", { status: 404 });
    }

    // Default to the sender's user ID if they don't have an organization ID yet
    const orgId = sender.organizationId || sender._id;

    // Check if user with email already exists in this organization
    const existingUser = await User.findOne({ email, organizationId: orgId });
    if (existingUser) {
        return new NextResponse("User is already in your team", { status: 400 });
    }

    // Check if invite exists
    const existingInvite = await Invite.findOne({ email, organizationId: orgId });
    if (existingInvite) {
      return new NextResponse("Invite already sent to this email", { status: 400 });
    }

    const token = crypto.randomBytes(32).toString("hex");

    const invite = await Invite.create({
      email,
      role: role || "Member",
      organizationId: orgId,
      senderId: sender._id,
      token,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    });

    // Send email using nodemailer
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.mailtrap.io",
      port: Number(process.env.SMTP_PORT) || 2525,
      auth: {
        user: process.env.SMTP_USER || "test",
        pass: process.env.SMTP_PASSWORD || "test",
      },
    });

    const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/invite/${token}`;
    const senderName = sender.name || sender.email || "Someone";

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.SMTP_FROM || process.env.SMTP_USER || '"SaaS Kit" <noreply@saaskit.com>',
      to: email,
      subject: `You have been invited to join ${senderName}'s workspace`,
      html: `
        <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; padding: 20px;">
          <h2>You've been invited!</h2>
          <p><strong>${senderName}</strong> has invited you to join their workspace as a <strong>${role || 'Member'}</strong>.</p>
          <div style="margin: 30px 0;">
            <a href="${inviteUrl}" style="background-color: #0f172a; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Accept Invitation</a>
          </div>
          <p style="color: #666; font-size: 14px; margin-top: 20px;">If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="color: #666; font-size: 14px; word-break: break-all;">${inviteUrl}</p>
          <p style="color: #666; font-size: 14px; margin-top: 30px;">This invitation will expire in 7 days.</p>
        </div>
      `
    });

    return NextResponse.json({ success: true, invite });
  } catch (error) {
    console.error("[INVITE_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const inviteId = searchParams.get("id");

    if (!inviteId) {
      return new NextResponse("Invite ID is required", { status: 400 });
    }

    await dbConnect();

    const sender = await User.findById(session.user.id);
    if (!sender) {
       return new NextResponse("User not found", { status: 404 });
    }

    const orgId = sender.organizationId || sender._id;

    // Ensure they only delete invites from their organization
    const invite = await Invite.findOneAndDelete({ _id: inviteId, organizationId: orgId });

    if (!invite) {
      return new NextResponse("Invite not found", { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[INVITE_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
