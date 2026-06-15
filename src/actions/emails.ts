"use server"

import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendInvitationEmail(email: string, orgName: string, inviteUrl: string) {
  try {
    const data = await resend.emails.send({
      from: "SaaS Kit <noreply@yourdomain.com>",
      to: [email],
      subject: `You have been invited to join ${orgName}`,
      html: `
        <div>
          <h1>Invitation to join ${orgName}</h1>
          <p>You have been invited to join ${orgName} on our platform.</p>
          <a href="${inviteUrl}">Click here to accept the invitation</a>
        </div>
      `,
    })

    return { success: true, data }
  } catch (error) {
    return { success: false, error }
  }
}
