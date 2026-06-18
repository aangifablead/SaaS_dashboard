import dbConnect from "@/lib/mongoose"
import { EmailHistory } from "@/models/EmailHistory"
import EmailsClient from "./EmailsClient"

export default async function EmailsPage() {
  await dbConnect()
  const emailHistoryRaw = await EmailHistory.find().sort({ createdAt: -1 }).lean()

  const formattedHistory = emailHistoryRaw.map((e: any) => {
    let recipientsDisplay = e.to;
    if (e.to === "all") recipientsDisplay = "All Users";
    else if (e.to === "pro") recipientsDisplay = "Pro Only";
    else if (e.to === "free") recipientsDisplay = "Free Only";
    else if (e.to === "enterprise") recipientsDisplay = "Enterprise Only";
    // otherwise it's custom email

    return {
      id: e._id.toString(),
      subject: e.subject,
      body: e.body,
      recipients: recipientsDisplay,
      rawTo: e.to,
      sentBy: "Admin", // simplified
      date: new Date(e.createdAt).toLocaleString(),
      openRate: "-", // simplified
      status: e.status === "SENT" ? "Sent" : e.status === "FAILED" ? "Failed" : e.status === "DRAFT" ? "Draft" : "Scheduled"
    };
  })

  return (
    <EmailsClient initialHistory={formattedHistory} />
  )
}
