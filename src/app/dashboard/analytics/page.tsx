import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar, ChevronDown, MousePointerClick, Eye, Clock, ArrowUpRight } from "lucide-react"
import { TrafficOverviewChart, SignupsChart, TrafficSourcesChart } from "@/components/analytics-charts"
import { DatePickerWithRange } from "@/components/date-range-picker"
import Link from "next/link"
import { getAnalyticsData } from "@/lib/analytics"
import { auth } from "@/auth"

export default async function AnalyticsPage(props: { searchParams: Promise<{ range?: string }> }) {
  const searchParams = await props.searchParams;
  const range = searchParams?.range || "30d";
  const session = await auth();

  const data = await getAnalyticsData(range, session?.user?.id);
  
  
  const stats = [
    { title: "Total Sessions", value: data.stats.totalSessions.value, change: data.stats.totalSessions.change, isPositive: data.stats.totalSessions.isPositive, icon: MousePointerClick, color: "text-primary", bg: "bg-primary/10" },
    { title: "Pageviews", value: data.stats.pageviews.value, change: data.stats.pageviews.change, isPositive: data.stats.pageviews.isPositive, icon: Eye, color: "text-success", bg: "bg-success/10" },
    { title: "Bounce Rate", value: data.stats.bounceRate.value, change: data.stats.bounceRate.change, isPositive: data.stats.bounceRate.isPositive, icon: ArrowUpRight, color: "text-warning", bg: "bg-warning/10" },
    { title: "Avg Session Duration", value: data.stats.avgSessionDuration.value, change: data.stats.avgSessionDuration.change, isPositive: data.stats.avgSessionDuration.isPositive, icon: Clock, color: "text-[#a855f7]", bg: "bg-[#faf5ff]" },
  ];

  return (
    <div className="flex flex-col gap-8 pb-8">
      {/* HEADER */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Analytics</h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">
            Detailed breakdown of your traffic and users
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-card border border-border rounded-lg shadow-sm p-1">
            <Link href="?range=7d">
              <Button variant="ghost" size="sm" className={`h-8 ${range === '7d' ? 'bg-muted text-foreground font-medium shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>Last 7d</Button>
            </Link>
            <Link href="?range=30d">
              <Button variant="ghost" size="sm" className={`h-8 ${range === '30d' ? 'bg-muted text-foreground font-medium shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>30d</Button>
            </Link>
            <Link href="?range=90d"><Button variant={range === "90d" ? "default" : "ghost"} size="sm" className="h-8">90d</Button></Link>
          </div>
          <DatePickerWithRange />
        </div>
      </div>

      {/* ROW 1: STATS CARDS */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i} className="shadow-sm">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">{stat.title}</div>
                  <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                </div>
                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${stat.bg} ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <Badge className={`${stat.isPositive ? 'bg-success/15 text-success' : 'bg-destructive/15 text-destructive'} hover:bg-transparent border-none font-semibold px-2 py-0.5`}>
                  {stat.change}
                </Badge>
                <span className="text-xs text-muted-foreground font-medium">vs last period</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ROW 2: TRAFFIC OVERVIEW */}
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-base font-semibold">Traffic Overview</CardTitle>
          </div>
          <Button variant="outline" size="sm" className="h-8 gap-1 text-xs">
            Export <ChevronDown className="h-3 w-3" />
          </Button>
        </CardHeader>
        <CardContent className="pt-4">
          <TrafficOverviewChart data={data.trafficData} />
        </CardContent>
      </Card>

      {/* ROW 3: TWO COLUMNS */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Signups by Month */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Signups by Month</CardTitle>
          </CardHeader>
          <CardContent>
            <SignupsChart data={data.signupsData} />
          </CardContent>
        </Card>

        {/* Top Devices */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Top Devices</CardTitle>
          </CardHeader>
          <CardContent>
            <TrafficSourcesChart data={data.sourcesData} />
          </CardContent>
        </Card>
      </div>

      {/* ROW 4: TWO COLUMNS */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Recent Logins Table */}
        <Card className="shadow-sm overflow-hidden flex flex-col">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Recent Logins</CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex-1 flex flex-col">
            <div className="px-0 pb-6 flex-1 flex flex-col">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-border bg-accent/30 hover:bg-accent/30">
                    <TableHead className="text-xs font-semibold text-muted-foreground h-9 pl-6">IP Address</TableHead>
                    <TableHead className="text-xs font-semibold text-muted-foreground h-9 text-right">Date</TableHead>
                    <TableHead className="text-xs font-semibold text-muted-foreground h-9 text-right">Time</TableHead>
                    <TableHead className="text-xs font-semibold text-muted-foreground h-9 text-right pr-6">Device</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.topPages.map((row, i) => (
                    <TableRow key={i} className="hover:bg-accent/50 border-border cursor-pointer transition-colors">
                      <TableCell className="py-3 pl-6 font-medium text-sm text-foreground">{row.url}</TableCell>
                      <TableCell className="text-right text-sm">{row.views}</TableCell>
                      <TableCell className="text-right text-sm">{row.bounce}</TableCell>
                      <TableCell className="text-right text-sm pr-6 text-muted-foreground">{row.time}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* World Map Placeholder */}
        <Card className="shadow-sm flex flex-col">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Users by Country</CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex-1 flex flex-col">
            <div className="px-6 pb-6 flex-1 flex flex-col items-center justify-center">
              <div className="w-full max-w-sm aspect-video bg-muted/30 rounded-xl border border-dashed border-border flex items-center justify-center relative overflow-hidden mb-8">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />
                <div className="text-center">
                  <span className="text-3xl mb-2 block">🗺️</span>
                  <span className="text-sm font-medium text-muted-foreground">Interactive Map</span>
                </div>
              </div>
              
              <div className="w-full space-y-4 max-w-sm">
                {data.usersByCountry.map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <span className="text-lg">{item.flag}</span>
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="font-medium">{item.country}</span>
                        <span className="font-semibold">{item.value}</span>
                      </div>
                      <div className="h-1.5 w-full bg-accent rounded-full overflow-hidden">
                        <div className={`h-full ${item.color} rounded-full`} style={{ width: item.value }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
