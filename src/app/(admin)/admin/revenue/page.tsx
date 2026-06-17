import dbConnect from "@/lib/mongoose"
import { Invoice } from "@/models/Invoice"
import { User } from "@/models/User"
import RevenueClient from "./RevenueClient"

export default async function RevenuePage() {
  await dbConnect()
  const allInvoicesRaw = await Invoice.find()
    .populate({
      path: 'userId',
      select: 'name organizationId',
      populate: { path: 'organizationId', select: 'name' }
    })
    .sort({ createdAt: -1 })
    .lean()

  const allInvoices = allInvoicesRaw.map((inv: any) => ({
    ...inv,
    id: inv._id.toString(),
    user: inv.userId ? {
      name: inv.userId.name,
      organization: inv.userId.organizationId ? { name: inv.userId.organizationId.name } : null
    } : null
  }))

  // Calculate Total Revenue
  const totalRevenue = allInvoices.filter((i: any) => i.status === "Paid").reduce((acc: number, curr: any) => acc + curr.amount, 0)
  
  // Very rough MRR calculation for current month (mock logic for demo if no real complex subscription handling)
  const currentMonthInvoices = allInvoices.filter((i: any) => {
    const d = new Date(i.createdAt)
    const now = new Date()
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear() && i.status === "Paid"
  })
  
  const mrr = currentMonthInvoices.reduce((acc: number, curr: any) => acc + curr.amount, 0)
  const arr = mrr * 12
  
  const activeUsersCount = await User.countDocuments({ isActive: true })
  const arpu = activeUsersCount > 0 ? (totalRevenue / activeUsersCount) : 0

  // Calculate MRR Trend (last 6 months)
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const currentMonth = new Date().getMonth();
  
  const mrrData: { month: string; value: number; monthIndex: number; year: number }[] = [];
  const revenueByPlanData: { month: string; free: number; pro: number; enterprise: number; monthIndex: number; year: number }[] = [];
  
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(currentMonth - i);
    mrrData.push({
      month: months[d.getMonth()],
      value: 0,
      monthIndex: d.getMonth(),
      year: d.getFullYear()
    });
    revenueByPlanData.push({
      month: months[d.getMonth()],
      free: 0,
      pro: 0,
      enterprise: 0,
      monthIndex: d.getMonth(),
      year: d.getFullYear()
    });
  }

  allInvoices.forEach((inv: any) => {
    if (inv.status !== "Paid" && inv.status !== "PAID") return;
    
    const d = new Date(inv.createdAt);
    
    // MRR trend
    const mrrItem = mrrData.find(r => r.monthIndex === d.getMonth() && r.year === d.getFullYear());
    if (mrrItem) mrrItem.value += inv.amount;
    
    // Plan revenue trend
    const planItem = revenueByPlanData.find(r => r.monthIndex === d.getMonth() && r.year === d.getFullYear());
    if (planItem) {
      if (inv.plan === "FREE") planItem.free += inv.amount;
      else if (inv.plan === "PRO") planItem.pro += inv.amount;
      else if (inv.plan === "ENTERPRISE") planItem.enterprise += inv.amount;
    }
  });

  return (
    <RevenueClient 
      invoices={allInvoices} 
      totalRevenue={totalRevenue} 
      mrr={mrr} 
      arr={arr} 
      arpu={arpu} 
      mrrData={mrrData}
      revenueByPlanData={revenueByPlanData}
    />
  )
}
