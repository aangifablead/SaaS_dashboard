import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongoose";
import { Invoice } from "@/models/Invoice";
import { User } from "@/models/User";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role?.toUpperCase() !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    await dbConnect();

    const [allInvoices, paginatedInvoicesRaw, totalInvoices] = await Promise.all([
      Invoice.find({ status: "paid" }).select("amount createdAt"),
      Invoice.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("userId", "name email"),
      Invoice.countDocuments(),
    ]);

    const paginatedInvoices = paginatedInvoicesRaw.map(inv => {
      const obj = inv.toObject();
      return {
        ...obj,
        user: obj.userId,
      }
    });

    const mrr = allInvoices.reduce((acc, curr) => acc + curr.amount, 0) / 12; // simplified MRR
    const arr = mrr * 12;
    const arpu = allInvoices.length > 0 ? (arr / allInvoices.length) : 0;
    const churnRate = 2.5; // Example churn rate

    // Group invoices by month for chart data
    const chartDataMap = allInvoices.reduce((acc: Record<string, number>, curr) => {
      const month = curr.createdAt.toLocaleString('default', { month: 'short' });
      acc[month] = (acc[month] || 0) + curr.amount;
      return acc;
    }, {});

    const chartData = Object.entries(chartDataMap).map(([name, revenue]) => ({
      name,
      revenue,
    }));

    return NextResponse.json({
      metrics: {
        mrr: Math.round(mrr),
        arr: Math.round(arr),
        arpu: Math.round(arpu),
        churnRate,
      },
      invoices: paginatedInvoices,
      pagination: {
        totalCount: totalInvoices,
        totalPages: Math.ceil(totalInvoices / limit),
        currentPage: page,
      },
      chartData,
    });
  } catch (error) {
    console.error("[ADMIN_REVENUE_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
