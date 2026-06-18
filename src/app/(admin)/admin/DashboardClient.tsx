"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, CreditCard, UserPlus, DollarSign } from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSettings } from "@/components/providers/SettingsProvider"
import { formatCurrency, formatDate } from "@/lib/formatters"

export default function DashboardClient({ totalUsers, activeSubs, newUsers, totalRevenue, recentUsers, planData, revenueData, revenuePercent, usersDiff, activeSubsPercent, newUsersPercent }: any) {
  const settings = useSettings()

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-[#eef2ff] to-white rounded-xl shadow-sm border border-[#c7d2fe] px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0f172a]">Dashboard Overview</h1>
          <p className="text-sm text-[#4f46e5] font-medium mt-1">Here&apos;s what&apos;s happening with your platform today.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{formatCurrency(totalRevenue, settings.currency)}</div>
            <p className="text-xs text-muted-foreground">
              {Number(revenuePercent) >= 0 ? '+' : ''}{revenuePercent}% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {Number(usersDiff) >= 0 ? '+' : ''}{usersDiff} from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Subs</CardTitle>
            <CreditCard className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeSubs}</div>
            <p className="text-xs text-muted-foreground">
              {Number(activeSubsPercent) >= 0 ? '+' : ''}{activeSubsPercent}% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">New This Month</CardTitle>
            <UserPlus className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{newUsers}</div>
            <p className="text-xs text-muted-foreground">
              {Number(newUsersPercent) >= 0 ? '+' : ''}{newUsersPercent}% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Revenue Overview</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => formatCurrency(value, settings.currency)} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <Tooltip />
                <Area type="monotone" dataKey="total" stroke="#a855f7" fillOpacity={1} fill="url(#colorTotal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentUsers.map((user: any) => {
                const getAvatarSrc = (image?: string) => {
                  if (!image) return "";
                  return image.startsWith("http") ? image : "";
                };
                const getInitials = (name: string) => {
                  if (!name) return "U";
                  const parts = name.trim().split(" ");
                  if (parts.length >= 2) {
                    return (parts[0][0] + parts[1][0]).toUpperCase();
                  }
                  return parts[0][0].toUpperCase();
                };
                const nameStr = user.name || "Unknown";
                const initial = getInitials(nameStr);
                const planName = user.plan === 'PRO' ? 'Pro' : user.plan === 'ENTERPRISE' ? 'Enterprise' : 'Free';
                return (
                <div key={user.id} className="flex items-center justify-between gap-2 overflow-hidden">
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar className="shrink-0">
                      {/* Removed dicebear AvatarImage to show initials fallback */}
                      <AvatarImage src={getAvatarSrc(user.image)} />
                      <AvatarFallback className="bg-indigo-100 text-indigo-700 font-semibold">{initial}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium leading-none truncate">{user.name}</p>
                      <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] sm:text-xs font-semibold shrink-0 ${user.plan === 'PRO' ? 'bg-indigo-100 text-indigo-800' :
                        user.plan === 'ENTERPRISE' ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'
                      }`}>
                      {planName}
                    </span>
                    <span className="hidden sm:inline text-xs text-muted-foreground w-20 text-right shrink-0">{formatDate(user.createdAt, settings.dateFormat, settings.timezone)}</span>
                  </div>
                </div>
              )})}
            </div>
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Plan Distribution</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={planData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {planData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex gap-4 mt-4">
              {planData.map((plan: any) => (
                <div key={plan.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: plan.color }} />
                  <span className="text-sm text-muted-foreground">{plan.name} ({plan.value})</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
