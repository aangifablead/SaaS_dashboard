import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongoose";
import { User } from "@/models/User";
import { EmailHistory } from "@/models/EmailHistory";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role?.toUpperCase() !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { id, to, subject, body: emailBody, isDraft } = body;

    if (!to || !subject || !emailBody) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    let targetUsers: any[] = [];

    await dbConnect();
    // Determine recipients based on 'to' value
    if (to === "all") {
      targetUsers = await User.find().populate("organizationId");
    } else if (to === "pro") {
      targetUsers = await User.find({ plan: "PRO" }).populate("organizationId");
    } else if (to === "free") {
      targetUsers = await User.find({ plan: "FREE" }).populate("organizationId");
    } else if (to === "enterprise") {
      targetUsers = await User.find({ plan: "ENTERPRISE" }).populate("organizationId");
    } else {
      // Assuming it's a custom email address
      const user = await User.findOne({ email: to }).populate("organizationId");
      if (user) {
        targetUsers = [user];
      } else {
        // Fallback if custom email doesn't exist in DB
        targetUsers = [{ email: to, name: "Valued User", plan: "Free" }];
      }
    }

    if (targetUsers.length === 0) {
      return new NextResponse("No recipients found", { status: 404 });
    }

    const replaceTags = (text: string, user: any) => {
      const date = new Date().toLocaleDateString();
      const orgName = user.organizationId?.name || "Our Platform";
      return text
        .replace(/\[User Name\]/gi, user.name || "Valued User")
        .replace(/\[User Email\]/gi, user.email || "")
        .replace(/\[Plan Name\]/gi, user.plan || "Free")
        .replace(/\[Organization Name\]/gi, orgName)
        .replace(/\[Account Name\]/gi, orgName !== "Our Platform" ? orgName : (user.name || "Your Account"))
        .replace(/\[Current Date\]/gi, date);
    };

    const emailTemplate = (content: string, title: string) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 40px 20px; color: #0f172a; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03); border: 1px solid #e2e8f0; }
        .header { background-color: #6366f1; padding: 28px 32px; color: #ffffff; font-size: 22px; font-weight: 700; text-align: center; letter-spacing: -0.5px; }
        .content { padding: 32px; font-size: 16px; line-height: 1.6; color: #334155; }
        .content h1, .content h2, .content h3 { color: #0f172a; margin-top: 0; }
        .content p { margin-bottom: 16px; }
        .content a { color: #6366f1; text-decoration: none; font-weight: 500; }
        .footer { background-color: #f8fafc; padding: 24px 32px; text-align: center; font-size: 13px; color: #64748b; border-top: 1px solid #f1f5f9; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          SaaS Dashboard
        </div>
        <div class="content">
          ${content}
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} SaaS Dashboard. All rights reserved.<br/>
          You are receiving this email because you are a registered user.
        </div>
      </div>
    </body>
    </html>
    `;

    // Send emails individually to personalize tags only if not a draft
    if (!isDraft) {
      const sendPromises = targetUsers.map(user => {
        if (!user.email) return Promise.resolve();
        
        const personalizedSubject = replaceTags(subject, user);
        const personalizedBody = replaceTags(emailBody, user);
        
        return transporter.sendMail({
          from: process.env.EMAIL_FROM || `"SaaS Dashboard Team" <${process.env.SMTP_USER}>`,
          to: user.email,
          subject: personalizedSubject,
          html: emailTemplate(personalizedBody, personalizedSubject),
        });
      });

      await Promise.all(sendPromises);
    }

    // Save to history
    if (id) {
      await EmailHistory.findByIdAndUpdate(id, {
        to: to,
        subject,
        body: emailBody,
        status: isDraft ? "DRAFT" : "SENT",
      });
    } else {
      await EmailHistory.create({
        to: to,
        subject,
        body: emailBody,
        status: isDraft ? "DRAFT" : "SENT",
      });
    }

    return NextResponse.json({ success: true, count: isDraft ? 0 : targetUsers.length });
  } catch (error) {
    console.error("[ADMIN_EMAILS_SEND_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
