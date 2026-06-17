import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongoose";
import { User } from "@/models/User";
import { Invoice } from "@/models/Invoice";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await dbConnect();
    const [totalUsers, activeSubs, newThisMonth, invoices] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ plan: { $ne: "FREE" }, isActive: true }),
      User.countDocuments({
        createdAt: {
          $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      }),
      Invoice.find({ status: "paid" }).select("amount createdAt"),
    ]);

    const totalRevenue = invoices.reduce((acc, curr) => acc + curr.amount, 0);

    // Group invoices by month for chart data
    const chartDataMap = invoices.reduce((acc: Record<string, number>, curr) => {
      const month = curr.createdAt.toLocaleString('default', { month: 'short' });
      acc[month] = (acc[month] || 0) + curr.amount;
      return acc;
    }, {});

    const chartData = Object.entries(chartDataMap).map(([name, total]) => ({
      name,
      total,
    }));

    return NextResponse.json({
      totalRevenue,
      totalUsers,
      activeSubs,
      newThisMonth,
      chartData,
    });
  } catch (error) {
    console.error("[ADMIN_STATS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
