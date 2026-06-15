"use server"

import { prisma } from "@/lib/prisma"
import nodemailer from "nodemailer"
import crypto from "crypto"
import { hash } from "bcryptjs"

export async function sendPasswordResetEmail(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      // Return success even if user not found to prevent email enumeration
      return { success: true }
    }

    // Generate a secure reset token
    const token = crypto.randomBytes(32).toString("hex")
    
    // Set expiration to 1 hour from now
    const expires = new Date()
    expires.setHours(expires.getHours() + 1)

    // Save token in the database
    await prisma.passwordResetToken.create({
      data: {
        email,
        token,
        expires,
      },
    })

    // Construct the reset link
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/new-password?token=${token}`

    if (!process.env.SMTP_HOST) {
      console.log("\n=================================================")
      console.log("No SMTP_HOST found in .env file.")
      console.log("Here is the reset link you requested:")
      console.log(resetLink)
      console.log("=================================================\n")
      return { success: true }
    }

    // Configure Nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    })

    // HTML Email Template
    const htmlTemplate = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
  <style>
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #f8fafc;
      margin: 0;
      padding: 0;
      line-height: 1.6;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
    .header {
      background-color: #0f172a;
      padding: 32px 24px;
      text-align: center;
    }
    .header h1 {
      color: #ffffff;
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }
    .content {
      padding: 32px 40px;
      color: #334155;
    }
    .content h2 {
      margin-top: 0;
      color: #0f172a;
      font-size: 20px;
    }
    .content p {
      font-size: 16px;
      color: #475569;
      margin-bottom: 24px;
    }
    .button-container {
      text-align: center;
      margin: 32px 0;
    }
    .button {
      display: inline-block;
      padding: 14px 32px;
      background-color: #3b82f6;
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 16px;
      transition: background-color 0.2s;
    }
    .footer {
      background-color: #f1f5f9;
      padding: 24px;
      text-align: center;
      font-size: 14px;
      color: #64748b;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>SaaS Dashboard</h1>
    </div>
    <div class="content">
      <h2>Password Reset Request</h2>
      <p>Hello,</p>
      <p>We received a request to reset the password for your account. If you made this request, please click the button below to choose a new password.</p>
      
      <div class="button-container">
        <a href="${resetLink}" class="button">Reset Password</a>
      </div>
      
      <p style="font-size: 14px; color: #94a3b8; margin-top: 40px;">
        If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged. The link is valid for 1 hour.
      </p>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} SaaS Dashboard. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
    `

    // Send the email
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"SaaS Kit" <noreply@yourdomain.com>',
      to: email,
      subject: "Action Required: Reset your password",
      html: htmlTemplate,
    })

    return { success: true }
  } catch (error) {
    console.error("Failed to send reset email:", error)
    return { success: false, error: "Failed to send reset email. Please try again." }
  }
}

export async function resetPassword(formData: FormData) {
  const token = formData.get("token") as string
  const password = formData.get("password") as string

  if (!token || !password) {
    return { success: false, error: "Missing token or password." }
  }

  try {
    // Find valid token
    const existingToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    })

    if (!existingToken) {
      return { success: false, error: "Invalid token!" }
    }

    // Check if token is expired
    if (new Date() > new Date(existingToken.expires)) {
      return { success: false, error: "Token has expired!" }
    }

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email: existingToken.email },
    })

    if (!user) {
      return { success: false, error: "User does not exist!" }
    }

    // Hash the new password
    const hashedPassword = await hash(password, 10)

    // Update user password
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    })

    // Delete the used token
    await prisma.passwordResetToken.delete({
      where: { id: existingToken.id },
    })

    return { success: true }
  } catch (error) {
    console.error("Failed to reset password:", error)
    return { success: false, error: "An error occurred while resetting password." }
  }
}
