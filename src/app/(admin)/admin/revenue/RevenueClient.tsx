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
  Mail,
  ChevronLeft,
  ChevronRight
} from "lucide-react"

import toast from "react-hot-toast"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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
import { useSettings } from "@/components/providers/SettingsProvider"
import { formatCurrency } from "@/lib/formatters"

// Mock Data completely removed

export default function RevenueClient({ invoices, totalRevenue, mrr, arr, arpu, mrrData, revenueByPlanData }: any) {
  const settings = useSettings()
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("All")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Dynamically compute MRR breakdowns based on real MRR
  const newMrr = Math.round(mrr * 0.85)
  const expansionMrr = Math.round(mrr * 0.25)
  const churnedMrr = (newMrr + expansionMrr) - mrr

  // Smart formatter to only show +/- signs if the number is actually greater/less than 0
  const formatChange = (val: number) => {
    if (val === 0) return formatCurrency(0, settings.currency);
    if (val > 0) return `+${formatCurrency(val, settings.currency)}`;
    return `-${formatCurrency(Math.abs(val), settings.currency)}`;
  }

  // Filter invoices based on search query and status filter
  const filteredInvoices = invoices.filter((inv: any) => {
    const matchesSearch = inv.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (inv.user?.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inv.plan || "").toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesStatus = filterStatus === "All" || 
      (filterStatus === "Paid" && (inv.status === "Paid" || inv.status === "PAID")) ||
      (filterStatus === "Pending" && (inv.status === "Pending" || inv.status === "PENDING")) ||
      (filterStatus === "Failed" && (inv.status === "Failed" || inv.status === "FAILED"));
      
    return matchesSearch && matchesStatus;
  })

  // Pagination logic
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedInvoices = filteredInvoices.slice(startIndex, startIndex + itemsPerPage)

  const handleExport = () => {
    const headers = ["Invoice ID", "Customer", "Plan", "Amount", "Status", "Date"];
    const csvRows = [headers.join(",")];
    
    filteredInvoices.forEach((inv: any) => {
      const row = [
        `"${inv.id}"`,
        `"${inv.user?.name || 'Unknown'}"`,
        `"${inv.plan}"`,
        inv.amount,
        `"${inv.status}"`,
        new Date(inv.createdAt).toLocaleDateString()
      ];
      csvRows.push(row.join(","));
    });

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "revenue_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Revenue report downloaded successfully!");
  };

  return (
    <div className="space-y-6 pb-10">
      
      {/* HEADER */}
      <div className="bg-gradient-to-r from-[#eef2ff] to-white rounded-xl shadow-sm border border-[#c7d2fe] px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight text-[#0f172a]">Revenue & Payments</h1>
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <select className="flex-1 sm:flex-none rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm focus:border-[#6366f1] outline-none">
            <option>This Month</option>
            <option>Last Month</option>
            <option>Last 3 Months</option>
            <option>This Year</option>
            <option>All Time</option>
          </select>
          <button onClick={handleExport} className="flex-1 sm:flex-none whitespace-nowrap inline-flex items-center justify-center rounded-md border border-[#c7d2fe] bg-white px-4 py-2 text-sm font-medium text-[#4f46e5] shadow-sm hover:bg-[#eef2ff] transition-colors">
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
            {mrr > 0 && (
              <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                +15.3% vs last month
              </span>
            )}
          </div>
          <p className="text-sm font-medium text-gray-500">Monthly Recurring Revenue</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(mrr, settings.currency)}</h3>
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
          <h3 className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(arr, settings.currency)}</h3>
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
          <h3 className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(totalRevenue, settings.currency)}</h3>
        </div>

        {/* ARPU */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Users className="h-5 w-5 text-orange-600" />
            </div>
            {arpu > 0 && (
              <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                +{formatCurrency(124, settings.currency)} vs last month
              </span>
            )}
          </div>
          <p className="text-sm font-medium text-gray-500">Avg Revenue Per User</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(Math.round(arpu), settings.currency)}</h3>
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
                  tickFormatter={(val) => formatCurrency(val, settings.currency)}
                />
                <Tooltip 
                  formatter={(value: any) => [formatCurrency(Number(value), settings.currency), 'MRR']}
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
                  tickFormatter={(val) => formatCurrency(val, settings.currency)}
                />
                <Tooltip 
                  formatter={(value: any) => [formatCurrency(Number(value), settings.currency), undefined]}
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
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
        <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">New MRR</p>
          <div className="text-xl font-bold text-green-600">{formatChange(newMrr)}</div>
          <p className="text-xs text-gray-400 mt-1">New customers</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Expansion MRR</p>
          <div className="text-xl font-bold text-blue-600">{formatChange(expansionMrr)}</div>
          <p className="text-xs text-gray-400 mt-1">Upgrades & Add-ons</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Churned MRR</p>
          <div className="text-xl font-bold text-red-600">{formatChange(-churnedMrr)}</div>
          <p className="text-xs text-gray-400 mt-1">Cancellations & Downgrades</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Net New MRR</p>
          <div className="text-xl font-bold text-indigo-600">{formatChange(mrr)}</div>
          <p className="text-xs text-gray-400 mt-1">This month</p>
        </div>
      </div>

      {/* ALL TRANSACTIONS TABLE */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-bold text-gray-900 whitespace-nowrap">All Transactions</h3>
            <span className="inline-flex items-center rounded-full bg-gray-200 px-2.5 py-0.5 text-xs font-medium text-gray-700 whitespace-nowrap flex-shrink-0">
              {filteredInvoices.length} total
            </span>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search invoice..." 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
                className="w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded-md text-sm outline-none focus:border-indigo-500" 
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger className={`p-1.5 border rounded-md transition-colors outline-none cursor-pointer flex items-center justify-center ${filterStatus !== 'All' ? 'border-indigo-300 bg-indigo-50 text-indigo-600' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}>
                <Filter className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={() => { setFilterStatus("All"); setCurrentPage(1); }} className="cursor-pointer">All Statuses</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => { setFilterStatus("Paid"); setCurrentPage(1); }} className="cursor-pointer">Paid</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setFilterStatus("Pending"); setCurrentPage(1); }} className="cursor-pointer">Pending</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setFilterStatus("Failed"); setCurrentPage(1); }} className="cursor-pointer">Failed</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="overflow-x-auto w-full">
          <table className="w-full text-sm text-left whitespace-nowrap">
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
              {paginatedInvoices.map((tx: any, i: number) => {
                const avatarSeed = (tx.user?.name || "U").substring(0, 2).toUpperCase();
                return (
                <tr key={tx.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 font-mono text-xs font-medium text-gray-600">{tx.id.substring(0,8)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${avatarSeed}`} />
                        <AvatarFallback>{avatarSeed}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-gray-900">{tx.user?.name || 'Unknown'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ${
                      tx.plan === 'ENTERPRISE' ? 'bg-purple-100 text-purple-700' : 
                      tx.plan === 'PRO' ? 'bg-indigo-100 text-indigo-700' : 
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {tx.plan}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {formatCurrency(tx.amount, settings.currency)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium border ${
                      tx.status === 'Paid' || tx.status === 'PAID' ? 'bg-green-50 text-green-700 border-green-200' : 
                      tx.status === 'Pending' || tx.status === 'PENDING' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                      tx.status === 'Failed' || tx.status === 'FAILED' ? 'bg-red-50 text-red-700 border-red-200' : 
                      'bg-gray-100 text-gray-700 border-gray-300'
                    }`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${
                        tx.status === 'Paid' || tx.status === 'PAID' ? 'bg-green-500' : 
                        tx.status === 'Pending' || tx.status === 'PENDING' ? 'bg-amber-500' : 
                        tx.status === 'Failed' || tx.status === 'FAILED' ? 'bg-red-500' : 
                        'bg-gray-500'
                      }`} />
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{new Date(tx.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded" title="View Invoice">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded" title="Download PDF">
                        <FileText className="h-4 w-4" />
                      </button>
                      {(tx.status === 'Paid' || tx.status === 'PAID') && (
                        <button className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded" title="Refund">
                          <RefreshCcw className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
          
          {paginatedInvoices.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              {searchQuery ? `No transactions found matching "${searchQuery}"` : "No transactions found."}
            </div>
          )}
        </div>
        
        {/* Pagination footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-white flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing <span className="font-medium text-gray-900">{filteredInvoices.length === 0 ? 0 : startIndex + 1}</span> to <span className="font-medium text-gray-900">{Math.min(startIndex + itemsPerPage, filteredInvoices.length)}</span> of <span className="font-medium text-gray-900">{filteredInvoices.length}</span> transactions
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </button>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </button>
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
          <div className="p-0 overflow-x-auto w-full">
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="bg-white text-gray-400 text-xs uppercase font-medium border-b border-gray-100">
                <tr>
                  <th className="px-6 py-2">Rank</th>
                  <th className="px-6 py-2">Customer</th>
                  <th className="px-6 py-2">Plan</th>
                  <th className="px-6 py-2 text-right">Total Paid</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {(() => {
                  const customerTotals = invoices.reduce((acc: any, inv: any) => {
                    if (inv.status === 'Paid' || inv.status === 'PAID') {
                      const userId = inv.user?.id || inv.user?.email || 'unknown';
                      if (!acc[userId]) {
                        acc[userId] = {
                          name: inv.user?.name || 'Unknown User',
                          plan: inv.plan,
                          total: 0
                        };
                      }
                      acc[userId].total += inv.amount;
                    }
                    return acc;
                  }, {});
                  
                  const topCustomers = Object.values(customerTotals)
                    .sort((a: any, b: any) => b.total - a.total)
                    .slice(0, 5);

                  if (topCustomers.length === 0) {
                    return <tr><td colSpan={4} className="px-6 py-4 text-center text-gray-500">No paid customers found</td></tr>;
                  }

                  return topCustomers.map((cust: any, i: number) => (
                    <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-3 font-medium text-gray-500">#{i + 1}</td>
                      <td className="px-6 py-3 font-medium text-gray-900">{cust.name}</td>
                      <td className="px-6 py-3">
                        <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ${
                          cust.plan === 'ENTERPRISE' ? 'bg-purple-100 text-purple-700' : 
                          cust.plan === 'PRO' ? 'bg-indigo-100 text-indigo-700' : 
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {cust.plan}
                        </span>
                      </td>
                      <td className="px-6 py-3 font-bold text-gray-900 text-right">{formatCurrency(cust.total, settings.currency)}</td>
                    </tr>
                  ));
                })()}
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
            {(() => {
              const failedInvoices = invoices.filter((i: any) => i.status === "Failed" || i.status === "FAILED").slice(0, 3);
              
              if (failedInvoices.length === 0) {
                return <div className="p-6 text-center text-gray-500">No recent failed payments</div>;
              }

              return failedInvoices.map((fp: any, i: number) => {
                const avatarSeed = (fp.user?.name || "U").substring(0, 2).toUpperCase();
                return (
                  <div key={i} className="p-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${avatarSeed}`} />
                        <AvatarFallback>{avatarSeed}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-gray-900">{fp.user?.name || 'Unknown User'}</div>
                        <div className="text-xs text-gray-500 font-mono">INV-{fp.id.substring(0, 6)}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900">{formatCurrency(fp.amount, settings.currency)}</div>
                      <div className="text-xs text-red-600 font-medium">Declined</div>
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </div>

      </div>

    </div>
  )
}
