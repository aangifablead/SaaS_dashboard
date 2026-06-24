import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongoose";
import { User } from "@/models/User";
import { Invoice } from "@/models/Invoice";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await dbConnect();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const invoices = await Invoice.find({ userId: user._id }).sort({ createdAt: -1 }).lean();

    // Create CSV header
    const csvRows = [
      ["Date", "Invoice ID", "Plan", "Amount", "Currency", "Status"].join(",")
    ];

    // Add rows
    for (const inv of invoices as any[]) {
      csvRows.push([
        new Date(inv.createdAt).toLocaleDateString(),
        inv.stripeInvoiceId || "-",
        inv.plan,
        inv.amount.toString(),
        inv.currency.toUpperCase(),
        inv.status
      ].join(","));
    }

    const csvString = csvRows.join("\n");

    return new NextResponse(csvString, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="billing_report_${new Date().toISOString().split("T")[0]}.csv"`
      }
    });
  } catch (error) {
    console.error("Error generating report:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
