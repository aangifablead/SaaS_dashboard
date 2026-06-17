import dbConnect from "@/lib/mongoose"
import { EmailHistory } from "@/models/EmailHistory"
import EmailsClient from "./EmailsClient"

export default async function EmailsPage() {
  await dbConnect()
  const emailHistoryRaw = await EmailHistory.find().sort({ createdAt: -1 }).lean()

  const formattedHistory = emailHistoryRaw.map((e: any) => ({
    id: e._id.toString(),
    subject: e.subject,
    recipients: e.to === "All Users" ? "All Users" : e.to.split(',').length + " User(s)",
    sentBy: "Admin", // simplified
    date: new Date(e.createdAt).toLocaleString(),
    openRate: "-", // simplified
    status: e.status === "SENT" ? "Sent" : e.status === "FAILED" ? "Failed" : e.status === "DRAFT" ? "Draft" : "Scheduled"
  }))

  return (
    <EmailsClient initialHistory={formattedHistory} />
  )
}
