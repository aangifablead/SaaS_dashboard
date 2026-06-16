"use client"

import { useState } from "react"
import { 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  Users,
  Download,
  Search,
  Filter,
  Eye,
  FileText,
  RefreshCcw,
  AlertTriangle,
  Mail
} from "lucide-react"

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Mock Data
const mrrData = [
  { month: "Jul", value: 185000 },
  { month: "Aug", value: 192000 },
  { month: "Sep", value: 198000 },
  { month: "Oct", value: 205000 },
  { month: "Nov", value: 215000 },
  { month: "Dec", value: 224775 }
]

const revenueByPlanData = [
  { month: "Jan", free: 0, pro: 45000, enterprise: 85000 },
  { month: "Feb", free: 0, pro: 48000, enterprise: 92000 },
  { month: "Mar", free: 0, pro: 52000, enterprise: 98000 },
  { month: "Apr", free: 0, pro: 58000, enterprise: 105000 },
  { month: "May", free: 0, pro: 65000, enterprise: 110000 },
  { month: "Jun", free: 0, pro: 72000, enterprise: 120000 }
]

const mockTransactions = Array.from({ length: 20 }).map((_, i) => ({
  id: `INV-2025-${1000 + i}`,
  customer: {
    name: ["Rahul Mehta", "Priya Shah", "Amit Patel", "Sneha Joshi", "Vikram Singh"][i % 5],
    avatar: ["RM", "PS", "AP", "SJ", "VS"][i % 5]
  },
  plan: ["Pro", "Enterprise", "Pro", "Free", "Enterprise"][i % 5],
  amount: [11988, 95904, 4995, 0, 150000][i % 5],
  status: i === 3 ? "Failed" : i === 7 ? "Refunded" : i === 12 ? "Pending" : "Paid",
  date: `2025-06-${String(20 - i).padStart(2, '0')}`
}))

const topCustomers = [
  { rank: 1, name: "Amit Patel", org: "BigCorp Ltd", plan: "Enterprise", paid: "₹1,19,880", since: "Jan 2024", avatar: "AP" },
  { rank: 2, name: "Vikram Singh", org: "Innovate Labs", plan: "Enterprise", paid: "₹95,904", since: "Mar 2024", avatar: "VS" },
  { rank: 3, name: "Rahul Mehta", org: "TechCorp India", plan: "Pro", paid: "₹47,952", since: "Jan 2024", avatar: "RM" },
  { rank: 4, name: "Sanjay Kumar", org: "DataSys", plan: "Enterprise", paid: "₹35,964", since: "Jun 2024", avatar: "SK" },
  { rank: 5, name: "Priya Shah", org: "StartupXYZ", plan: "Pro", paid: "₹19,980", since: "Feb 2024", avatar: "PS" }
]

const failedPayments = [
  { name: "Karan Desai", org: "WebSolutions", amount: "₹7,992", date: "2 days ago", avatar: "KD" },
  { name: "Sneha Patil", org: "GreenEnergy", amount: "₹13,986", date: "4 days ago", avatar: "SP" },
  { name: "Meera Nair", org: "NextGen Tech", amount: "₹4,995", date: "1 week ago", avatar: "MN" }
]

export default function RevenuePage() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="space-y-6 pb-10">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight text-[#0f172a]">Revenue & Payments</h1>
        <div className="flex items-center gap-3">
          <select className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm focus:border-[#6366f1] outline-none">
            <option>This Month</option>
            <option>Last Month</option>
            <option>Last 3 Months</option>
            <option>This Year</option>
            <option>All Time</option>
          </select>
          <button className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* TOP STATS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* MRR */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
            <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
              +15.3% vs last month
            </span>
          </div>
          <p className="text-sm font-medium text-gray-500">Monthly Recurring Revenue</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">₹2,24,775</h3>
        </div>

        {/* ARR */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
              Projected
            </span>
          </div>
          <p className="text-sm font-medium text-gray-500">Annual Recurring Revenue</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">₹26,97,300</h3>
        </div>

        {/* Total Revenue */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
            <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
              All Time
            </span>
          </div>
          <p className="text-sm font-medium text-gray-500">Total Revenue</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">₹37,54,231.89</h3>
        </div>

        {/* ARPU */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Users className="h-5 w-5 text-orange-600" />
            </div>
            <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
              +₹124 vs last month
            </span>
          </div>
          <p className="text-sm font-medium text-gray-500">Avg Revenue Per User</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">₹1,598</h3>
        </div>
      </div>

      {/* CHARTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* MRR Trend */}
        <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-gray-900">MRR Growth</h3>
              <p className="text-sm text-gray-500">Monthly recurring revenue over time</p>
            </div>
            <select className="rounded-md border border-gray-200 text-sm px-2 py-1 text-gray-600 outline-none">
              <option>Last 6 Months</option>
              <option>Last 12 Months</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mrrData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  tickFormatter={(val) => `₹${val / 1000}k`}
                />
                <Tooltip 
                  formatter={(value: any) => [`₹${Number(value).toLocaleString()}`, 'MRR']}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#4f46e5" 
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                  activeDot={{ r: 6, strokeWidth: 0, fill: '#4f46e5' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue by Plan */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="mb-6">
            <h3 className="font-bold text-gray-900">Revenue by Plan</h3>
            <p className="text-sm text-gray-500">Distribution across tiers</p>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueByPlanData} margin={{ top: 5, right: 0, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  tickFormatter={(val) => `₹${val / 1000}k`}
                />
                <Tooltip 
                  formatter={(value: any) => [`₹${Number(value).toLocaleString()}`, undefined]}
                  cursor={{ fill: '#f3f4f6' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                <Bar dataKey="free" name="Free" fill="#d1d5db" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pro" name="Pro" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                <Bar dataKey="enterprise" name="Enterprise" fill="#9333ea" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* FULL WIDTH: Churn & Growth Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
        <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">New MRR</p>
          <div className="text-xl font-bold text-green-600">+₹34,965</div>
          <p className="text-xs text-gray-400 mt-1">New customers</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Expansion MRR</p>
          <div className="text-xl font-bold text-blue-600">+₹12,450</div>
          <p className="text-xs text-gray-400 mt-1">Upgrades & Add-ons</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Churned MRR</p>
          <div className="text-xl font-bold text-red-600">-₹8,234</div>
          <p className="text-xs text-gray-400 mt-1">Cancellations & Downgrades</p>
        </div>
        <div className="p-4 bg-indigo-600 rounded-lg shadow-sm border border-indigo-700 text-white">
          <p className="text-xs font-bold text-indigo-200 uppercase tracking-wider mb-1">Net New MRR</p>
          <div className="text-xl font-bold">+₹39,181</div>
          <p className="text-xs text-indigo-200 mt-1">This month</p>
        </div>
      </div>

      {/* ALL TRANSACTIONS TABLE */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-gray-900">All Transactions</h3>
            <span className="inline-flex items-center rounded-full bg-gray-200 px-2.5 py-0.5 text-xs font-medium text-gray-700">
              1,245 total
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input type="text" placeholder="Search invoice..." className="pl-9 pr-3 py-1.5 border border-gray-300 rounded-md text-sm outline-none focus:border-indigo-500" />
            </div>
            <button className="p-1.5 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50">
              <Filter className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-white text-gray-500 font-medium border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 font-medium">Invoice #</th>
                <th className="px-6 py-3 font-medium">Customer</th>
                <th className="px-6 py-3 font-medium">Plan</th>
                <th className="px-6 py-3 font-medium">Amount</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {mockTransactions.map((tx, i) => (
                <tr key={tx.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 font-mono text-xs font-medium text-gray-600">{tx.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${tx.customer.avatar}`} />
                        <AvatarFallback>{tx.customer.avatar}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-gray-900">{tx.customer.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ${
                      tx.plan === 'Enterprise' ? 'bg-purple-100 text-purple-700' : 
                      tx.plan === 'Pro' ? 'bg-indigo-100 text-indigo-700' : 
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {tx.plan}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    ₹{tx.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium border ${
                      tx.status === 'Paid' ? 'bg-green-50 text-green-700 border-green-200' : 
                      tx.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                      tx.status === 'Failed' ? 'bg-red-50 text-red-700 border-red-200' : 
                      'bg-gray-100 text-gray-700 border-gray-300'
                    }`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${
                        tx.status === 'Paid' ? 'bg-green-500' : 
                        tx.status === 'Pending' ? 'bg-amber-500' : 
                        tx.status === 'Failed' ? 'bg-red-500' : 
                        'bg-gray-500'
                      }`} />
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{tx.date}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded" title="View Invoice">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded" title="Download PDF">
                        <FileText className="h-4 w-4" />
                      </button>
                      {tx.status === 'Paid' && (
                        <button className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded" title="Refund">
                          <RefreshCcw className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border-t border-gray-100 px-6 py-3 flex items-center justify-between text-sm text-gray-500">
          Showing 1 to 20 of 1,245 transactions
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-gray-300 rounded bg-white disabled:opacity-50" disabled>Previous</button>
            <button className="px-3 py-1 border border-gray-300 rounded bg-white">Next</button>
          </div>
        </div>
      </div>

      {/* BOTTOM ROW: Top Customers & Failed Payments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Top Paying Customers */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <h3 className="font-bold text-gray-900">Top Paying Customers</h3>
          </div>
          <div className="p-0">
            <table className="w-full text-sm text-left">
              <thead className="bg-white text-gray-400 text-xs uppercase font-medium border-b border-gray-100">
                <tr>
                  <th className="px-6 py-2">Rank</th>
                  <th className="px-6 py-2">Customer</th>
                  <th className="px-6 py-2">Plan</th>
                  <th className="px-6 py-2 text-right">Total Paid</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {topCustomers.map(cust => (
                  <tr key={cust.rank} className="hover:bg-gray-50">
                    <td className="px-6 py-3 font-bold text-gray-400">#{cust.rank}</td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${cust.avatar}`} />
                          <AvatarFallback>{cust.avatar}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-gray-900">{cust.name}</div>
                          <div className="text-xs text-gray-500">{cust.org}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        cust.plan === 'Enterprise' ? 'bg-purple-100 text-purple-700' : 'bg-indigo-100 text-indigo-700'
                      }`}>
                        {cust.plan}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-right font-bold text-gray-900">{cust.paid}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Failed Payments */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
            <h3 className="font-bold text-gray-900">Recent Failed Payments</h3>
            <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
              Action Required
            </span>
          </div>
          <div className="divide-y divide-gray-100">
            {failedPayments.map((fp, i) => (
              <div key={i} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-red-50 rounded-full flex items-center justify-center">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 flex items-center gap-2">
                      {fp.name} 
                      <span className="text-xs font-normal text-gray-500">({fp.org})</span>
                    </div>
                    <div className="text-sm text-red-600 font-medium">
                      Failed charge of {fp.amount} <span className="text-gray-400 font-normal">· {fp.date}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 border border-gray-200 rounded-md bg-white text-gray-600 hover:text-indigo-600 hover:border-indigo-200 shadow-sm transition-colors" title="Send reminder email">
                    <Mail className="h-4 w-4" />
                  </button>
                  <button className="px-3 py-1.5 border border-gray-200 rounded-md bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 shadow-sm">
                    Retry
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  )
}
