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

// mockOrgs removed

export default function OrganizationsClient({ organizations }: { organizations: any[] }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  const filteredOrgs = organizations.filter(org => 
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
            {organizations.length} total
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
          <p className="text-2xl font-bold text-[#0f172a] mt-1">{organizations.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <p className="text-xs font-medium text-[#64748b] uppercase tracking-wider">Active Orgs</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{organizations.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <p className="text-xs font-medium text-[#64748b] uppercase tracking-wider">Pro Orgs</p>
          <p className="text-2xl font-bold text-[#6366f1] mt-1">{organizations.filter((o:any) => o.plan === "Pro").length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <p className="text-xs font-medium text-[#64748b] uppercase tracking-wider">Enterprise Orgs</p>
          <p className="text-2xl font-bold text-purple-600 mt-1">{organizations.filter((o:any) => o.plan === "Enterprise").length}</p>
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
          Showing 1 to {filteredOrgs.length} of {organizations.length} organizations
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-gray-300 rounded bg-white disabled:opacity-50" disabled>Previous</button>
            <button className="px-3 py-1 border border-gray-300 rounded bg-white">Next</button>
          </div>
        </div>
      </div>
      
    </div>
  )
}
