import dbConnect from "@/lib/mongoose"
import { User } from "@/models/User"
import { Invoice } from "@/models/Invoice"
import DashboardClient from "./DashboardClient"

export default async function AdminDashboardPage() {
  await dbConnect()
  const now = new Date()
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999)
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const startOfYesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1)
  const endOfYesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 23, 59, 59, 999)

  const usersCount = await User.countDocuments()
  const activeSubsCount = await User.countDocuments({ isActive: true, plan: { $ne: 'FREE' } })
  const newUsersCount = await User.countDocuments({
    createdAt: { $gte: startOfThisMonth }
  })
  
  // 1. Users Diff
  const totalUsersLastMonth = await User.countDocuments({ createdAt: { $lte: endOfLastMonth } })
  const usersDiff = usersCount - totalUsersLastMonth

  // 2. Active Subs Percent
  const activeSubsLastMonth = await User.countDocuments({ isActive: true, plan: { $ne: 'FREE' }, createdAt: { $lte: endOfLastMonth } })
  const activeSubsDiff = activeSubsCount - activeSubsLastMonth
  const activeSubsPercent = activeSubsLastMonth === 0 ? (activeSubsCount > 0 ? 100 : 0) : ((activeSubsDiff / activeSubsLastMonth) * 100).toFixed(1)

  // 3. New Users Percent
  const newUsersLastMonth = await User.countDocuments({
    createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }
  })
  const newUsersDiff = newUsersCount - newUsersLastMonth
  const newUsersPercent = newUsersLastMonth === 0 ? (newUsersCount > 0 ? 100 : 0) : ((newUsersDiff / newUsersLastMonth) * 100).toFixed(1)

  const invoices = await Invoice.find({ status: { $in: ['Paid', 'PAID'] } }).lean()
  const totalRevenue = invoices.reduce((acc: number, curr: any) => acc + curr.amount, 0)
  
  // 4. Revenue Percent
  const thisMonthInvoices = invoices.filter((inv: any) => new Date(inv.createdAt) >= startOfThisMonth)
  const lastMonthInvoices = invoices.filter((inv: any) => new Date(inv.createdAt) >= startOfLastMonth && new Date(inv.createdAt) <= endOfLastMonth)
  const thisMonthRevenue = thisMonthInvoices.reduce((acc: number, curr: any) => acc + curr.amount, 0)
  const lastMonthRevenue = lastMonthInvoices.reduce((acc: number, curr: any) => acc + curr.amount, 0)
  const revenueDiff = thisMonthRevenue - lastMonthRevenue
  const revenuePercent = lastMonthRevenue === 0 ? (thisMonthRevenue > 0 ? 100 : 0) : ((revenueDiff / lastMonthRevenue) * 100).toFixed(1)

  // Calculate real revenue data for charts (last 6 months)
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const currentMonth = new Date().getMonth();
  
  const revenueData: { name: string; total: number; monthIndex: number; year: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(currentMonth - i);
    revenueData.push({
      name: months[d.getMonth()],
      total: 0,
      monthIndex: d.getMonth(),
      year: d.getFullYear()
    });
  }

  invoices.forEach((inv: any) => {
    const d = new Date(inv.createdAt);
    const item = revenueData.find(r => r.monthIndex === d.getMonth() && r.year === d.getFullYear());
    if (item) {
      item.total += inv.amount;
    }
  });

  // Recent Users
  const recentUsersRaw = await User.find().sort({ createdAt: -1 }).limit(5).lean()
  const recentUsers = JSON.parse(JSON.stringify(recentUsersRaw)).map((u: any) => ({ ...u, id: u._id }))

  // Plan Distribution
  const planCounts = await User.aggregate([
    { $group: { _id: "$plan", count: { $sum: 1 } } }
  ])
  
  const formattedPlanData = planCounts.map((p: any) => ({
    name: p._id === 'FREE' ? 'Free' : p._id === 'PRO' ? 'Pro' : 'Enterprise',
    value: p.count,
    color: p._id === 'FREE' ? '#94a3b8' : p._id === 'PRO' ? '#6366f1' : '#a855f7'
  }))

  return (
    <DashboardClient 
      totalUsers={usersCount}
      activeSubs={activeSubsCount}
      newUsers={newUsersCount}
      totalRevenue={totalRevenue}
      revenuePercent={revenuePercent}
      usersDiff={usersDiff}
      activeSubsPercent={activeSubsPercent}
      newUsersPercent={newUsersPercent}
      recentUsers={recentUsers}
      revenueData={revenueData}
      planData={formattedPlanData.length > 0 ? formattedPlanData : [
        { name: 'Free', value: 0, color: '#94a3b8' },
        { name: 'Pro', value: 0, color: '#6366f1' },
        { name: 'Enterprise', value: 0, color: '#a855f7' }
      ]}
    />
  )
}
