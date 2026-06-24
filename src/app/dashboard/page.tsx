import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Plus, IndianRupee, Users, Activity, Zap, ChevronDown, MoreHorizontal } from "lucide-react"
import { SparklineChart } from "@/components/dashboard-charts"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"
import { auth } from "@/auth"
import dbConnect from "@/lib/mongoose"
import { PlatformSetting } from "@/models/PlatformSetting"
import { User } from "@/models/User"
import { Invoice } from "@/models/Invoice"
import { Notification } from "@/models/Notification"
import { formatCurrency } from "@/lib/formatters"

export default async function DashboardPage() {
  const session = await auth()
  const userName = session?.user?.name?.split(" ")[0] || "User"
  
  await dbConnect();
  const currencySetting = await PlatformSetting.findOne({ key: "defaultCurrency" });
  const currency = currencySetting?.value || "USD ($)";
  
  const hour = new Date().getHours()
  let greeting = "Good evening"
  if (hour < 12) greeting = "Good morning"
  else if (hour < 18) greeting = "Good afternoon"

  const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  const today = new Date().toLocaleDateString('en-US', dateOptions)
  const user = await User.findOne({ email: session?.user?.email }).lean()
  if (!user) return null;

  const invoices = await Invoice.find({ userId: user._id }).sort({ createdAt: -1 }).lean() as any[];
  const notifications = await Notification.find({ userId: user._id }).sort({ createdAt: -1 }).limit(5).lean() as any[];

  const totalSpent = invoices.filter(inv => inv.status.toUpperCase() === "PAID").reduce((sum, inv) => sum + inv.amount, 0);
  const activePlan = user.plan || "FREE";
  const totalInvoices = invoices.length;
  
  // Calculate usage days
  const joinDate = new Date(user.createdAt || new Date());
  const daysActive = Math.max(1, Math.floor((new Date().getTime() - joinDate.getTime()) / (1000 * 3600 * 24)));

  return (
    <div className="flex flex-col gap-8 pb-8">
      {/* 1. PAGE HEADER */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{greeting}, {userName} 👋</h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">
            {today}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a href="/api/user/report" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="gap-2 bg-card hover:bg-muted text-foreground border-border shadow-sm">
              <Download className="h-4 w-4" />
              Download Report
            </Button>
          </a>
        </div>
      </div>

      {/* 2. STATS CARDS ROW */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Spent Card */}
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
                  <div className="h-6 w-6 rounded bg-[#a855f7] flex items-center justify-center text-white shrink-0">
                    <IndianRupee className="h-3.5 w-3.5" />
                  </div>
                  Total Spent
                </div>
                <div className="text-2xl font-bold text-foreground">{formatCurrency(totalSpent, currency)}</div>
              </div>
              <SparklineChart data={[20, 35, 45, 30, 55, 75, 80]} color="#a855f7" />
            </div>
          </CardContent>
        </Card>

        {/* Subscriptions Card */}
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
                  <div className="h-6 w-6 rounded bg-primary flex items-center justify-center text-white shrink-0">
                    <Users className="h-3.5 w-3.5" />
                  </div>
                  Active Plan
                </div>
                <div className="text-2xl font-bold text-foreground capitalize">{activePlan.toLowerCase()}</div>
              </div>
              <SparklineChart data={[10, 15, 25, 40, 80, 120, 150]} color="#6366f1" />
            </div>
          </CardContent>
        </Card>

        {/* Invoices Card */}
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
                  <div className="h-6 w-6 rounded bg-success flex items-center justify-center text-white shrink-0">
                    <Activity className="h-3.5 w-3.5" />
                  </div>
                  Total Invoices
                </div>
                <div className="text-2xl font-bold text-foreground">{totalInvoices}</div>
              </div>
              <SparklineChart data={[40, 50, 45, 60, 55, 70, 75]} color="#22c55e" />
            </div>
          </CardContent>
        </Card>

        {/* Account Age Card */}
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
                  <div className="h-6 w-6 rounded bg-warning flex items-center justify-center text-white shrink-0">
                    <Zap className="h-3.5 w-3.5" />
                  </div>
                  Account Age
                </div>
                <div className="text-2xl font-bold text-foreground">{daysActive} {daysActive === 1 ? 'day' : 'days'}</div>
              </div>
              <SparklineChart data={[60, 55, 75, 40, 80, 90, 85]} color="#f59e0b" />
            </div>
          </CardContent>
        </Card>
      </div>



      {/* 4. BOTTOM ROW */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Recent Transactions */}
        <Card className="lg:col-span-2 shadow-sm flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-base font-semibold">Recent Invoices</CardTitle>
            <Link href="/dashboard/billing">
              <Button variant="link" className="text-sm text-primary h-auto p-0 font-medium">View all</Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0 flex-1 flex flex-col">
            <div className="px-6 pb-6">
              {invoices.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm border rounded-lg border-dashed">
                  No invoices found.
                </div>
              ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-border bg-accent/30 hover:bg-accent/30">
                    <TableHead className="text-xs font-semibold text-muted-foreground h-9">Invoice ID</TableHead>
                    <TableHead className="text-xs font-semibold text-muted-foreground h-9">Plan</TableHead>
                    <TableHead className="text-xs font-semibold text-muted-foreground h-9">Amount</TableHead>
                    <TableHead className="text-xs font-semibold text-muted-foreground h-9">Status</TableHead>
                    <TableHead className="text-xs font-semibold text-muted-foreground h-9 text-right">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.slice(0, 5).map((row, i) => (
                    <TableRow key={i} className="hover:bg-accent/50 border-border transition-colors">
                      <TableCell className="py-3">
                        <span className="font-medium text-sm">{row.stripeInvoiceId ? row.stripeInvoiceId.substring(0, 12) + "..." : "N/A"}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={`bg-primary/10 text-primary hover:bg-transparent border-none font-semibold px-2 py-0.5 capitalize`}>
                          {row.plan.toLowerCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium text-sm">{formatCurrency(row.amount, currency)}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={`${row.status?.toUpperCase() === 'PAID' ? 'bg-success/15 text-success' : 'bg-destructive/15 text-destructive'} hover:bg-transparent border-none font-semibold px-2 py-0.5 capitalize`}>
                          {row.status.toLowerCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-sm text-muted-foreground whitespace-nowrap">
                        {new Date(row.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="shadow-sm flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex-1 flex flex-col">
            <div className="px-6 pb-6 flex-1 flex flex-col">
              {notifications.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm border rounded-lg border-dashed">
                  No recent activity.
                </div>
              ) : (
              <div className="relative border-l border-border ml-3 flex-1 flex flex-col gap-6">
                {notifications.map((activity, i) => {
                  const isSuccess = activity.type === 'success' || activity.message?.toLowerCase().includes("success");
                  const isWarning = activity.type === 'warning';
                  const isError = activity.type === 'error';
                  const colorClass = isSuccess ? 'bg-success border-success' : isWarning ? 'bg-warning border-warning' : isError ? 'bg-destructive border-destructive' : 'bg-primary border-primary';

                  return (
                  <div key={i} className="relative pl-6">
                    <div className={`absolute -left-3.5 top-0 h-7 w-7 rounded-full border-4 border-card ${colorClass} flex items-center justify-center`}>
                      <Activity className="h-3 w-3 text-white" />
                    </div>
                    <div className="flex flex-col -mt-0.5">
                      <span className="text-sm font-semibold text-foreground">{activity.title}</span>
                      <span className="text-sm text-muted-foreground">{activity.message}</span>
                      <span className="text-xs text-muted-foreground mt-1">{new Date(activity.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                )})}
              </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 5. QUICK STATS ROW */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { title: "Conversion Rate", value: "3.24%", subtitle: "vs last month" },
          { title: "Avg Revenue Per User", value: formatCurrency(1598, currency), subtitle: "vs last month" },
          { title: "Churn Rate", value: "1.2%", subtitle: "vs last month" },
          { title: "Net Promoter Score", value: "72", subtitle: "vs last quarter" },
        ].map((stat, i) => (
          <Card key={i} className="shadow-sm">
            <CardContent className="p-4 flex flex-col justify-center items-center text-center">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{stat.title}</span>
              <span className="text-2xl font-bold mt-1 text-foreground">{stat.value}</span>
              <span className="text-xs text-muted-foreground mt-1">{stat.subtitle}</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
