"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  Building2, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Plus, 
  Download,
  Users
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Generate mock organizations
const mockOrgs = [
  { id: "org_1", name: "TechCorp India", slug: "techcorp-india", owner: "Rahul Mehta", members: 12, plan: "Pro", revenue: "₹11,988", created: "Jan 2025", status: "Active" },
  { id: "org_2", name: "StartupXYZ", slug: "startupxyz", owner: "Priya Shah", members: 5, plan: "Pro", revenue: "₹4,995", created: "Feb 2025", status: "Active" },
  { id: "org_3", name: "BigCorp Ltd", slug: "bigcorp-ltd", owner: "Amit Patel", members: 48, plan: "Enterprise", revenue: "Custom", created: "Mar 2025", status: "Active" },
  { id: "org_4", name: "DesignStudio", slug: "designstudio", owner: "Sneha Joshi", members: 3, plan: "Free", revenue: "₹0", created: "Apr 2025", status: "Active" },
  { id: "org_5", name: "Innovate Labs", slug: "innovate-labs", owner: "Vikram Singh", members: 24, plan: "Enterprise", revenue: "Custom", created: "Jan 2025", status: "Active" },
  { id: "org_6", name: "WebSolutions", slug: "websolutions", owner: "Karan Desai", members: 8, plan: "Pro", revenue: "₹7,992", created: "May 2025", status: "Inactive" },
  { id: "org_7", name: "AppMakers", slug: "appmakers", owner: "Divya Reddy", members: 15, plan: "Pro", revenue: "₹14,985", created: "Feb 2025", status: "Active" },
  { id: "org_8", name: "DataSys", slug: "datasys", owner: "Sanjay Kumar", members: 32, plan: "Enterprise", revenue: "Custom", created: "Jun 2025", status: "Active" },
  { id: "org_9", name: "CloudNet", slug: "cloudnet", owner: "Pooja Verma", members: 6, plan: "Free", revenue: "₹0", created: "Jan 2025", status: "Active" },
  { id: "org_10", name: "AI Ventures", slug: "ai-ventures", owner: "Rohan Gupta", members: 18, plan: "Pro", revenue: "₹17,982", created: "Mar 2025", status: "Active" },
  { id: "org_11", name: "NextGen Tech", slug: "nextgen-tech", owner: "Meera Nair", members: 4, plan: "Free", revenue: "₹0", created: "Apr 2025", status: "Inactive" },
  { id: "org_12", name: "Global Trade", slug: "global-trade", owner: "Arjun Iyer", members: 55, plan: "Enterprise", revenue: "Custom", created: "May 2025", status: "Active" },
  { id: "org_13", name: "EduPlatform", slug: "eduplatform", owner: "Anjali Rao", members: 21, plan: "Pro", revenue: "₹20,979", created: "Jan 2025", status: "Active" },
  { id: "org_14", name: "HealthConnect", slug: "healthconnect", owner: "Nitin Sharma", members: 9, plan: "Pro", revenue: "₹8,991", created: "Feb 2025", status: "Active" },
  { id: "org_15", name: "FinServe", slug: "finserve", owner: "Neha Agarwal", members: 42, plan: "Enterprise", revenue: "Custom", created: "Mar 2025", status: "Active" },
  { id: "org_16", name: "MediaHouse", slug: "mediahouse", owner: "Aditya Jain", members: 11, plan: "Pro", revenue: "₹10,989", created: "Jun 2025", status: "Active" },
  { id: "org_17", name: "RetailFlow", slug: "retailflow", owner: "Kavya Menon", members: 7, plan: "Free", revenue: "₹0", created: "Apr 2025", status: "Active" },
  { id: "org_18", name: "LogisticsPro", slug: "logisticspro", owner: "Rajesh Das", members: 28, plan: "Enterprise", revenue: "Custom", created: "May 2025", status: "Active" },
  { id: "org_19", name: "GreenEnergy", slug: "greenenergy", owner: "Sneha Patil", members: 14, plan: "Pro", revenue: "₹13,986", created: "Jan 2025", status: "Inactive" },
  { id: "org_20", name: "SmartHome", slug: "smarthome", owner: "Tariq Ali", members: 5, plan: "Free", revenue: "₹0", created: "Feb 2025", status: "Active" }
]

export default function OrganizationsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  const filteredOrgs = mockOrgs.filter(org => 
    org.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    org.owner.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6 pb-10">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-[#0f172a]">Organizations</h1>
          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-[#64748b]">
            284 total
          </span>
        </div>
        <button className="inline-flex items-center justify-center rounded-md bg-[#6366f1] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#4f46e5] transition-colors">
          <Plus className="mr-2 h-4 w-4" />
          Add Organization
        </button>
      </div>

      {/* MINI STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <p className="text-xs font-medium text-[#64748b] uppercase tracking-wider">Total Orgs</p>
          <p className="text-2xl font-bold text-[#0f172a] mt-1">284</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <p className="text-xs font-medium text-[#64748b] uppercase tracking-wider">Active Orgs</p>
          <p className="text-2xl font-bold text-green-600 mt-1">271</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <p className="text-xs font-medium text-[#64748b] uppercase tracking-wider">Pro Orgs</p>
          <p className="text-2xl font-bold text-[#6366f1] mt-1">159</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <p className="text-xs font-medium text-[#64748b] uppercase tracking-wider">Enterprise Orgs</p>
          <p className="text-2xl font-bold text-purple-600 mt-1">35</p>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input 
            type="text"
            placeholder="Search organizations or owners..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md border border-gray-300 pl-10 pr-4 py-2 text-sm focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1] outline-none"
          />
        </div>
        <div className="flex gap-2">
          <button className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            <Filter className="mr-2 h-4 w-4" />
            Plan
          </button>
          <button className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            <Filter className="mr-2 h-4 w-4" />
            Status
          </button>
          <button className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            <Download className="mr-2 h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* ORGS TABLE */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
              <tr>
                <th className="px-6 py-3">Organization</th>
                <th className="px-6 py-3">Owner</th>
                <th className="px-6 py-3">Members</th>
                <th className="px-6 py-3">Plan</th>
                <th className="px-6 py-3">Revenue</th>
                <th className="px-6 py-3">Created</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrgs.map(org => (
                <tr key={org.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-md bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 font-bold shrink-0">
                        {org.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{org.name}</div>
                        <div className="text-xs text-gray-500">{org.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700 font-medium">
                    {org.owner}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-gray-600">
                      <Users className="h-4 w-4 mr-1.5 text-gray-400" />
                      {org.members}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold ${
                      org.plan === 'Enterprise' ? 'bg-purple-100 text-purple-700' : 
                      org.plan === 'Pro' ? 'bg-indigo-100 text-indigo-700' : 
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {org.plan}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 font-medium">
                    {org.revenue}
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {org.created}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="relative inline-block text-left">
                      <button 
                        onClick={() => setActiveDropdown(activeDropdown === org.id ? null : org.id)}
                        className="p-1.5 hover:bg-gray-100 rounded-md text-gray-500 transition-colors"
                      >
                        <MoreHorizontal className="h-5 w-5" />
                      </button>
                      
                      {activeDropdown === org.id && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setActiveDropdown(null)} />
                          <div className="absolute right-0 top-full mt-1 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none z-20">
                            <Link href={`/admin/organizations/${org.id}`} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">View Details</Link>
                            <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Edit</button>
                            <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Change Plan</button>
                            <div className="my-1 border-t border-gray-100" />
                            <button className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium">Delete</button>
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border-t border-gray-200 bg-gray-50 px-6 py-3 flex items-center justify-between text-sm text-gray-500">
          Showing 1 to {filteredOrgs.length} of {mockOrgs.length} organizations
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-gray-300 rounded bg-white disabled:opacity-50" disabled>Previous</button>
            <button className="px-3 py-1 border border-gray-300 rounded bg-white">Next</button>
          </div>
        </div>
      </div>
      
    </div>
  )
}
