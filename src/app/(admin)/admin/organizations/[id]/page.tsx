"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { 
  ArrowLeft,
  Building2,
  Users,
  CreditCard,
  HardDrive,
  Activity,
  MoreHorizontal,
  Mail,
  ShieldAlert,
  Trash2,
  AlertTriangle
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Mock data for the specific org
const mockOrg = {
  id: "org_1",
  name: "TechCorp India",
  slug: "techcorp-india",
  created: "Jan 15, 2025",
  plan: "Pro",
  owner: {
    name: "Rahul Mehta",
    email: "rahul@techcorp.in",
    avatar: "RM"
  },
  stats: {
    members: 12,
    mrr: "₹11,988",
    storage: "45.2 GB",
    apiCalls: "1.2M"
  },
  members: [
    { id: "m1", name: "Rahul Mehta", email: "rahul@techcorp.in", role: "Owner", plan: "Pro", joined: "Jan 15, 2025", avatar: "RM" },
    { id: "m2", name: "Priya Singh", email: "priya@techcorp.in", role: "Admin", plan: "Pro", joined: "Jan 16, 2025", avatar: "PS" },
    { id: "m3", name: "Amit Kumar", email: "amit@techcorp.in", role: "Member", plan: "Pro", joined: "Feb 02, 2025", avatar: "AK" },
    { id: "m4", name: "Sneha Patel", email: "sneha@techcorp.in", role: "Member", plan: "Pro", joined: "Feb 10, 2025", avatar: "SP" }
  ],
  invites: [
    { email: "vikram@techcorp.in", inviter: "Rahul Mehta", status: "Pending", sent: "Mar 10, 2025", expiry: "Mar 17, 2025" },
    { email: "neha@techcorp.in", inviter: "Priya Singh", status: "Expired", sent: "Feb 01, 2025", expiry: "Feb 08, 2025" },
    { email: "amit@techcorp.in", inviter: "Rahul Mehta", status: "Accepted", sent: "Feb 01, 2025", expiry: "-" }
  ]
}

export default function OrganizationDetailPage() {
  const params = useParams()
  const orgId = params.id as string
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  return (
    <div className="space-y-6 pb-10 max-w-6xl mx-auto">
      
      {/* Back button */}
      <div>
        <Link href="/admin/organizations" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Organizations
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: Org Info & Owner */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Org Info Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 flex flex-col items-center text-center border-b border-gray-100">
              <div className="h-20 w-20 rounded-xl bg-indigo-50 border-2 border-indigo-100 flex items-center justify-center text-indigo-700 text-2xl font-bold mb-4 shadow-sm">
                {mockOrg.name.substring(0, 2).toUpperCase()}
              </div>
              <h1 className="text-xl font-bold text-gray-900">{mockOrg.name}</h1>
              <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 mt-2 mb-4 font-mono">
                {mockOrg.slug}
              </span>
              <div className="flex gap-2 mb-6">
                <span className="inline-flex items-center rounded-md bg-indigo-100 px-2.5 py-0.5 text-xs font-semibold text-indigo-700">
                  {mockOrg.plan} Plan
                </span>
                <span className="inline-flex items-center rounded-md bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                  Created {mockOrg.created}
                </span>
              </div>
              <button className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm">
                Edit Organization
              </button>
            </div>
          </div>

          {/* Owner Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-semibold text-gray-900 text-sm">Organization Owner</h3>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="h-12 w-12 border border-gray-200 shadow-sm">
                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${mockOrg.owner.avatar}`} />
                  <AvatarFallback>{mockOrg.owner.avatar}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold text-gray-900">{mockOrg.owner.name}</div>
                  <div className="text-sm text-gray-500">{mockOrg.owner.email}</div>
                </div>
              </div>
              <Link href="/admin/users" className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
                View User Profile &rarr;
              </Link>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-50 rounded-xl shadow-sm border border-red-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-red-100 bg-red-100/50 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <h3 className="font-semibold text-red-800 text-sm">Danger Zone</h3>
            </div>
            <div className="p-6">
              <p className="text-sm text-red-600 mb-4">
                This will permanently delete the organization, remove all members, and destroy all associated data.
              </p>
              <button className="w-full px-4 py-2 bg-red-600 rounded-md text-sm font-medium text-white hover:bg-red-700 shadow-sm">
                Delete Organization
              </button>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Stats & Tables */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center gap-2 text-gray-500 mb-2">
                <Users className="h-4 w-4" />
                <span className="text-xs font-medium uppercase tracking-wider">Members</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{mockOrg.stats.members}</div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center gap-2 text-gray-500 mb-2">
                <CreditCard className="h-4 w-4" />
                <span className="text-xs font-medium uppercase tracking-wider">Revenue</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{mockOrg.stats.mrr}</div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center gap-2 text-gray-500 mb-2">
                <HardDrive className="h-4 w-4" />
                <span className="text-xs font-medium uppercase tracking-wider">Storage</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{mockOrg.stats.storage}</div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center gap-2 text-gray-500 mb-2">
                <Activity className="h-4 w-4" />
                <span className="text-xs font-medium uppercase tracking-wider">API Calls</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{mockOrg.stats.apiCalls}</div>
            </div>
          </div>

          {/* Members Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <h3 className="font-semibold text-gray-900">Team Members</h3>
              <span className="text-xs font-medium text-gray-500 bg-white border border-gray-200 px-2 py-1 rounded-md">{mockOrg.members.length} Active</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-white text-gray-500 font-medium border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-3 font-medium">User</th>
                    <th className="px-6 py-3 font-medium">Role</th>
                    <th className="px-6 py-3 font-medium">Joined</th>
                    <th className="px-6 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {mockOrg.members.map(member => (
                    <tr key={member.id} className="hover:bg-gray-50">
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 border border-gray-200">
                            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${member.avatar}`} />
                            <AvatarFallback>{member.avatar}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-gray-900">{member.name}</div>
                            <div className="text-xs text-gray-500">{member.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${
                          member.role === 'Owner' ? 'bg-purple-100 text-purple-700' : 
                          member.role === 'Admin' ? 'bg-indigo-100 text-indigo-700' : 
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {member.role}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-gray-500">
                        {member.joined}
                      </td>
                      <td className="px-6 py-3 text-right">
                        <div className="relative inline-block text-left">
                          <button 
                            onClick={() => setActiveDropdown(activeDropdown === member.id ? null : member.id)}
                            className="p-1 hover:bg-gray-200 rounded text-gray-500"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                          {activeDropdown === member.id && (
                            <>
                              <div className="fixed inset-0 z-10" onClick={() => setActiveDropdown(null)} />
                              <div className="absolute right-0 top-full mt-1 w-40 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none z-20">
                                <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Change Role</button>
                                <button className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium">Remove Member</button>
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
          </div>

          {/* Invite History */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-semibold text-gray-900">Invite History</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-white text-gray-500 font-medium border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-3 font-medium">Email</th>
                    <th className="px-6 py-3 font-medium">Invited By</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium">Sent Date</th>
                    <th className="px-6 py-3 font-medium">Expiry</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {mockOrg.invites.map((invite, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-6 py-3 font-medium text-gray-900">{invite.email}</td>
                      <td className="px-6 py-3 text-gray-600">{invite.inviter}</td>
                      <td className="px-6 py-3">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium border ${
                          invite.status === 'Accepted' ? 'bg-green-50 text-green-700 border-green-200' : 
                          invite.status === 'Pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 
                          'bg-red-50 text-red-700 border-red-200'
                        }`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${
                            invite.status === 'Accepted' ? 'bg-green-500' : 
                            invite.status === 'Pending' ? 'bg-yellow-500' : 
                            'bg-red-500'
                          }`} />
                          {invite.status}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-gray-500">{invite.sent}</td>
                      <td className="px-6 py-3 text-gray-500">{invite.expiry}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
      
    </div>
  )
}
