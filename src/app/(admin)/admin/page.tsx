"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { IndianRupee, Users, CreditCard, UserPlus } from "lucide-react"
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

// Mock Data
const revenueData = [
  { name: 'Jan', total: 120000 },
  { name: 'Feb', total: 145000 },
  { name: 'Mar', total: 130000 },
  { name: 'Apr', total: 160000 },
  { name: 'May', total: 180000 },
  { name: 'Jun', total: 175000 },
  { name: 'Jul', total: 200000 },
  { name: 'Aug', total: 220000 },
  { name: 'Sep', total: 215000 },
  { name: 'Oct', total: 250000 },
  { name: 'Nov', total: 280000 },
  { name: 'Dec', total: 320000 },
]

const planData = [
  { name: 'Free', value: 450, color: '#94a3b8' },
  { name: 'Pro', value: 200, color: '#6366f1' },
  { name: 'Enterprise', value: 50, color: '#a855f7' },
]

const recentUsers = [
  { id: 1, name: "Alice Smith", email: "alice@example.com", plan: "Pro", role: "User", joined: "2024-03-15", initial: "AS" },
  { id: 2, name: "Bob Johnson", email: "bob@example.com", plan: "Enterprise", role: "Admin", joined: "2024-03-14", initial: "BJ" },
  { id: 3, name: "Charlie Brown", email: "charlie@example.com", plan: "Free", role: "User", joined: "2024-03-14", initial: "CB" },
  { id: 4, name: "Diana Prince", email: "diana@example.com", plan: "Pro", role: "User", joined: "2024-03-12", initial: "DP" },
  { id: 5, name: "Evan Wright", email: "evan@example.com", plan: "Free", role: "User", joined: "2024-03-11", initial: "EW" },
]

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground">Here&apos;s what&apos;s happening with your platform today.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <IndianRupee className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">₹24,15,000</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">+700</div>
            <p className="text-xs text-muted-foreground">+180 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Subs</CardTitle>
            <CreditCard className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">+250</div>
            <p className="text-xs text-muted-foreground">+19% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">New This Month</CardTitle>
            <UserPlus className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">+50</div>
            <p className="text-xs text-muted-foreground">+2 since yesterday</p>
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
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value / 1000}k`} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <Tooltip />
                <Area type="monotone" dataKey="total" stroke="#a855f7" fillOpacity={1} fill="url(#colorTotal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentUsers.map(user => (
                <div key={user.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.initial}`} />
                      <AvatarFallback>{user.initial}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${user.plan === 'Pro' ? 'bg-indigo-100 text-indigo-800' :
                        user.plan === 'Enterprise' ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'
                      }`}>
                      {user.plan}
                    </span>
                    <span className="text-xs text-muted-foreground w-20 text-right">{user.joined}</span>
                  </div>
                </div>
              ))}
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
                    {planData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex gap-4 mt-4">
              {planData.map(plan => (
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
