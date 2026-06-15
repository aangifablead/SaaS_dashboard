import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Plus, IndianRupee, Users, Activity, Zap, ChevronDown, MoreHorizontal } from "lucide-react"
import { DashboardRevenueChart, DashboardPlanChart, SparklineChart } from "@/components/dashboard-charts"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8 pb-8">
      {/* 1. PAGE HEADER */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Good morning, John 👋</h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">
            Here's what's happening with your business today
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2 bg-card hover:bg-muted text-foreground border-border shadow-sm">
            <Download className="h-4 w-4" />
            Download Report
          </Button>
          <Button className="gap-2 shadow-sm">
            <Plus className="h-4 w-4" />
            Add Widget
          </Button>
        </div>
      </div>

      {/* 2. STATS CARDS ROW */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Revenue Card */}
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
                  <div className="h-6 w-6 rounded bg-[#a855f7] flex items-center justify-center text-white shrink-0">
                    <IndianRupee className="h-3.5 w-3.5" />
                  </div>
                  Total Revenue
                </div>
                <div className="text-2xl font-bold text-foreground">₹37,54,231.89</div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-success/15 text-success hover:bg-success/20 border-none font-semibold px-1.5 py-0">
                    +20.1%
                  </Badge>
                </div>
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
                  Subscriptions
                </div>
                <div className="text-2xl font-bold text-foreground">2,350</div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-success/15 text-success hover:bg-success/20 border-none font-semibold px-1.5 py-0">
                    +180.1%
                  </Badge>
                </div>
              </div>
              <SparklineChart data={[10, 15, 25, 40, 80, 120, 150]} color="#6366f1" />
            </div>
          </CardContent>
        </Card>

        {/* Active Users Card */}
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
                  <div className="h-6 w-6 rounded bg-success flex items-center justify-center text-white shrink-0">
                    <Activity className="h-3.5 w-3.5" />
                  </div>
                  Active Users
                </div>
                <div className="text-2xl font-bold text-foreground">12,234</div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-success/15 text-success hover:bg-success/20 border-none font-semibold px-1.5 py-0">
                    +19%
                  </Badge>
                </div>
              </div>
              <SparklineChart data={[40, 50, 45, 60, 55, 70, 75]} color="#22c55e" />
            </div>
          </CardContent>
        </Card>

        {/* Active Now Card */}
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
                  <div className="h-6 w-6 rounded bg-warning flex items-center justify-center text-white shrink-0">
                    <Zap className="h-3.5 w-3.5" />
                  </div>
                  Active Now
                </div>
                <div className="text-2xl font-bold text-foreground">573</div>
                <div className="text-xs text-muted-foreground font-medium mt-1 inline-block">
                  Since last hour
                </div>
              </div>
              <SparklineChart data={[60, 55, 75, 40, 80, 90, 85]} color="#f59e0b" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3. MIDDLE ROW */}
      <div className="grid gap-4 lg:grid-cols-5">
        {/* Revenue Overview Chart */}
        <Card className="lg:col-span-3 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base font-semibold">Revenue Overview</CardTitle>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span className="text-muted-foreground font-medium">Revenue</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-destructive" />
                  <span className="text-muted-foreground font-medium">Expenses</span>
                </div>
              </div>
              <Button variant="outline" size="sm" className="h-8 gap-1 text-xs">
                Last 6 Months <ChevronDown className="h-3 w-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <DashboardRevenueChart />
          </CardContent>
        </Card>

        {/* Top Plans */}
        <Card className="lg:col-span-2 shadow-sm flex flex-col">
          <CardHeader className="pb-0">
            <CardTitle className="text-base font-semibold">Plan Distribution</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col pt-4">
            <DashboardPlanChart />
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                  <span className="font-medium">Pro</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-muted-foreground">1,200</span>
                  <span className="font-semibold w-10 text-right">51%</span>
                </div>
              </div>
              <div className="h-1.5 w-full bg-accent rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: '51%' }} />
              </div>

              <div className="flex items-center justify-between text-sm mt-3">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-muted-foreground" />
                  <span className="font-medium">Free</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-muted-foreground">850</span>
                  <span className="font-semibold w-10 text-right">36%</span>
                </div>
              </div>
              <div className="h-1.5 w-full bg-accent rounded-full overflow-hidden">
                <div className="h-full bg-muted-foreground rounded-full" style={{ width: '36%' }} />
              </div>

              <div className="flex items-center justify-between text-sm mt-3">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-[#a855f7]" />
                  <span className="font-medium">Enterprise</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-muted-foreground">300</span>
                  <span className="font-semibold w-10 text-right">13%</span>
                </div>
              </div>
              <div className="h-1.5 w-full bg-accent rounded-full overflow-hidden">
                <div className="h-full bg-[#a855f7] rounded-full" style={{ width: '13%' }} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 4. BOTTOM ROW */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Recent Transactions */}
        <Card className="lg:col-span-2 shadow-sm flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-base font-semibold">Recent Transactions</CardTitle>
            <Link href="/billing">
              <Button variant="link" className="text-sm text-primary h-auto p-0 font-medium">View all</Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0 flex-1 flex flex-col">
            <div className="px-6 pb-6">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-border bg-accent/30 hover:bg-accent/30">
                    <TableHead className="text-xs font-semibold text-muted-foreground h-9">Customer</TableHead>
                    <TableHead className="text-xs font-semibold text-muted-foreground h-9">Plan</TableHead>
                    <TableHead className="text-xs font-semibold text-muted-foreground h-9">Amount</TableHead>
                    <TableHead className="text-xs font-semibold text-muted-foreground h-9">Status</TableHead>
                    <TableHead className="text-xs font-semibold text-muted-foreground h-9 text-right">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { name: "Acme Corp", email: "billing@acme.com", plan: "Enterprise", planColor: "bg-[#faf5ff] text-[#a855f7]", amount: "₹83,000", status: "Paid", statusColor: "bg-success/15 text-success", date: "Today, 10:23 AM" },
                    { name: "Sarah Johnson", email: "sarah.j@example.com", plan: "Pro", planColor: "bg-primary/10 text-primary", amount: "₹999", status: "Paid", statusColor: "bg-success/15 text-success", date: "Today, 9:45 AM" },
                    { name: "TechStart Inc", email: "accounts@techstart.io", plan: "Pro", planColor: "bg-primary/10 text-primary", amount: "₹9,990", status: "Pending", statusColor: "bg-warning/15 text-warning", date: "Yesterday" },
                    { name: "Michael Chen", email: "m.chen@designco.com", plan: "Free", planColor: "bg-accent text-muted-foreground", amount: "₹0", status: "Paid", statusColor: "bg-success/15 text-success", date: "Yesterday" },
                    { name: "Global Systems", email: "finance@global.net", plan: "Enterprise", planColor: "bg-[#faf5ff] text-[#a855f7]", amount: "₹1,25,000", status: "Failed", statusColor: "bg-destructive/15 text-destructive", date: "Oct 12, 2026" },
                  ].slice(0, 5).map((row, i) => (
                    <TableRow key={i} className="hover:bg-accent/50 border-border cursor-pointer transition-colors">
                      <TableCell className="py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xs shrink-0">
                            {row.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium text-sm text-foreground">{row.name}</div>
                            <div className="text-xs text-muted-foreground">{row.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={`${row.planColor} hover:bg-transparent border-none font-semibold px-2 py-0.5`}>
                          {row.plan}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium text-sm">{row.amount}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={`${row.statusColor} hover:bg-transparent border-none font-semibold px-2 py-0.5`}>
                          {row.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-sm text-muted-foreground whitespace-nowrap">{row.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="shadow-sm flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
            <Link href="/analytics">
              <Button variant="link" className="text-sm text-primary h-auto p-0 font-medium">View all</Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0 flex-1 flex flex-col">
            <div className="px-6 pb-6 flex-1 flex flex-col">
              <div className="relative border-l border-border ml-3 flex-1 flex flex-col justify-between">
                {[
                  { title: "New user registered", desc: "Sarah Johnson", time: "2 min ago", color: "bg-success", dotColor: "border-success", icon: <Users className="h-3 w-3 text-white" /> },
                  { title: "Pro plan upgraded", desc: "Mike Chen", time: "15 min ago", color: "bg-primary", dotColor: "border-primary", icon: <Zap className="h-3 w-3 text-white" /> },
                  { title: "Payment pending", desc: "Alex Kumar", time: "1 hr ago", color: "bg-warning", dotColor: "border-warning", icon: <IndianRupee className="h-3 w-3 text-white" /> },
                  { title: "Subscription cancelled", desc: "Rita Patel", time: "2 hrs ago", color: "bg-destructive", dotColor: "border-destructive", icon: <Activity className="h-3 w-3 text-white" /> },
                  { title: "New user registered", desc: "Tom Wilson", time: "3 hrs ago", color: "bg-success", dotColor: "border-success", icon: <Users className="h-3 w-3 text-white" /> },
                ].map((activity, i) => (
                  <div key={i} className="relative pl-6">
                    <div className={`absolute -left-3.5 top-0 h-7 w-7 rounded-full border-4 border-card ${activity.color} flex items-center justify-center`}>
                      {activity.icon}
                    </div>
                    <div className="flex flex-col -mt-0.5">
                      <span className="text-sm font-semibold text-foreground">{activity.title}</span>
                      <span className="text-sm text-muted-foreground">{activity.desc} <span className="mx-1">•</span> <span className="text-xs">{activity.time}</span></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 5. QUICK STATS ROW */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { title: "Conversion Rate", value: "3.24%", subtitle: "vs last month" },
          { title: "Avg Revenue Per User", value: "₹1,598", subtitle: "vs last month" },
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
