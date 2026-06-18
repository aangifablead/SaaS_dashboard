import { NextResponse } from "next/server";
import { auth } from "@/auth";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role?.toUpperCase() !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { host, port, secure, user, password, fromName, fromEmail, testEmail } = await req.json();

    if (!testEmail) {
      return new NextResponse("Test email address is required", { status: 400 });
    }
    
    if (!host || !port || !user || !password) {
      return new NextResponse("Please fill in all SMTP Server Connection fields before testing.", { status: 400 });
    }
    
    const finalFromName = fromName || "SaaS Dashboard Team";
    const finalFromEmail = fromEmail || user;

    const transporter = nodemailer.createTransport({
      host: host,
      port: parseInt(port),
      secure: secure === true,
      auth: {
        user: user,
        pass: password,
      },
    });

    const sender = `"${finalFromName}" <${finalFromEmail}>`;

    await transporter.sendMail({
      from: sender,
      to: testEmail,
      subject: "Test Email from SaaS Dashboard",
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>SMTP Configuration Successful!</h2>
          <p>If you are seeing this email, it means your SMTP settings are working perfectly.</p>
          <br/>
          <p>Best regards,<br/>${fromName}</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[SMTP_TEST_ERROR]", error);
    return new NextResponse(error.message || String(error), { status: 500 });
  }
}
