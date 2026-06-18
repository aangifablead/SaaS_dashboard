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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import toast from "react-hot-toast"

import useSWR from "swr"
import { useSettings } from "@/components/providers/SettingsProvider"
import { formatCurrency } from "@/lib/formatters"

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function OrganizationDetailPage() {
  const params = useParams()
  const orgId = params.id as string
  const { data: orgData, error, isLoading, mutate } = useSWR(`/api/admin/organizations/${orgId}`, fetcher)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const settings = useSettings()
  
  // Role Change State
  const [roleModalMember, setRoleModalMember] = useState<any>(null)
  const [isChangingRole, setIsChangingRole] = useState(false)

  const handleEditOrganization = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsEditing(true);
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const plan = formData.get("plan") as string;

    try {
      const res = await fetch(`/api/admin/organizations/${orgId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, plan })
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText);
      }

      setEditModalOpen(false);
      mutate(); // Instantly refresh the page data
      toast.success("Organization updated successfully");
    } catch (error: any) {
      console.error("Failed to edit organization:", error);
      toast.error("Error updating organization: " + error.message);
    } finally {
      setIsEditing(false);
    }
  };

  const handleRoleChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!roleModalMember) return;
    setIsChangingRole(true);
    const formData = new FormData(e.currentTarget);
    const role = formData.get("role") as string;

    try {
      const res = await fetch(`/api/admin/users/${roleModalMember.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role })
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText);
      }

      setRoleModalMember(null);
      mutate();
      toast.success(`Role updated successfully`);
    } catch (error: any) {
      console.error("Failed to change role:", error);
      toast.error("Error updating role: " + error.message);
    } finally {
      setIsChangingRole(false);
    }
  };

  const handleRemoveMember = async (member: any) => {
    if (member.role === "ADMIN" || member.role === "Admin" || member.role === "OWNER" || member.role === "Owner") {
      toast.error("You can't delete admin in organization", { duration: 4000 });
      return;
    }

    if (!confirm(`Are you sure you want to remove ${member.name} from this organization?`)) {
      return;
    }

    try {
      // Unset organizationId for this user using your PATCH route or dedicated route
      const res = await fetch(`/api/admin/users/${member.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ organizationId: null }) // Requires API support for unset
      });

      if (!res.ok) throw new Error(await res.text());
      mutate();
      toast.success(`${member.name} removed from organization`);
    } catch (error: any) {
      console.error("Failed to remove member:", error);
      toast.error("Error removing member: " + error.message);
    }
  };

  if (isLoading) return <div className="p-10 text-center text-gray-500">Loading organization details...</div>
  if (error || !orgData) return <div className="p-10 text-center text-red-500">Failed to load organization</div>

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
                {orgData.name.substring(0, 2).toUpperCase()}
              </div>
              <h1 className="text-xl font-bold text-gray-900">{orgData.name}</h1>
              <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 mt-2 mb-4 font-mono">
                {orgData.slug}
              </span>
              <div className="flex gap-2 mb-6">
                <span className="inline-flex items-center rounded-md bg-indigo-100 px-2.5 py-0.5 text-xs font-semibold text-indigo-700">
                  {orgData.plan === "FREE" ? "Free" : orgData.plan === "PRO" ? "Pro" : "Enterprise"} Plan
                </span>
                <span className="inline-flex items-center rounded-md bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                  Created {new Date(orgData.createdAt).toLocaleDateString()}
                </span>
              </div>
              <button onClick={() => setEditModalOpen(true)} className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition-colors">
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
                  <AvatarFallback>{orgData.owner.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold text-gray-900">{orgData.owner.name}</div>
                  <div className="text-sm text-gray-500">{orgData.owner.email}</div>
                </div>
              </div>
              <Link href="/admin/users" className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
                View User Profile &rarr;
              </Link>
            </div>
          </div>

          {/* Subscription Usage Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-semibold text-gray-900 text-sm">Subscription Usage</h3>
            </div>
            <div className="p-6 space-y-6">
              
              {/* Storage Progress */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Storage Limit</span>
                  <span className="text-sm font-semibold text-gray-900">0 GB <span className="text-gray-400 font-normal">/ 100 GB</span></span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full transition-all duration-1000" style={{ width: '0%' }}></div>
                </div>
              </div>

              {/* API Calls Progress */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">API Requests</span>
                  <span className="text-sm font-semibold text-gray-900">0 <span className="text-gray-400 font-normal">/ 2M</span></span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#6366f1] rounded-full transition-all duration-1000" style={{ width: '0%' }}></div>
                </div>
              </div>

              {/* Members Limit */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Team Members</span>
                  <span className="text-sm font-semibold text-gray-900">{orgData.members.length} <span className="text-gray-400 font-normal">/ {orgData.plan === 'ENTERPRISE' ? 'Unlimited' : orgData.plan === 'PRO' ? '20' : '5'}</span></span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full transition-all duration-1000" style={{ 
                    width: orgData.plan === 'ENTERPRISE' ? '100%' : `${Math.min((orgData.members.length / (orgData.plan === 'PRO' ? 20 : 5)) * 100, 100)}%` 
                  }}></div>
                </div>
              </div>

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
              <div className="text-2xl font-bold text-gray-900">{orgData.members.length}</div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center gap-2 text-gray-500 mb-2">
                <CreditCard className="h-4 w-4" />
                <span className="text-xs font-medium uppercase tracking-wider">Revenue</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{orgData.plan === "FREE" ? formatCurrency(0, settings.currency) : orgData.plan === "PRO" ? formatCurrency(4995, settings.currency) : "Custom"}</div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center gap-2 text-gray-500 mb-2">
                <HardDrive className="h-4 w-4" />
                <span className="text-xs font-medium uppercase tracking-wider">Storage</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">0 GB</div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center gap-2 text-gray-500 mb-2">
                <Activity className="h-4 w-4" />
                <span className="text-xs font-medium uppercase tracking-wider">API Calls</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">0</div>
            </div>
          </div>

          {/* Members Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <h3 className="font-semibold text-gray-900">Team Members</h3>
              <span className="text-xs font-medium text-gray-500 bg-white border border-gray-200 px-2 py-1 rounded-md">{orgData.members.length} Total</span>
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
                  {orgData.members.map((member: any) => (
                    <tr key={member.id} className="hover:bg-gray-50">
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 border border-gray-200">
                            <AvatarFallback>{member.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-gray-900">{member.name}</div>
                            <div className="text-xs text-gray-500">{member.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${
                          member.role === 'OWNER' || member.role === 'Owner' ? 'bg-purple-100 text-purple-700' : 
                          member.role === 'ADMIN' || member.role === 'Admin' ? 'bg-indigo-100 text-indigo-700' : 
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {member.role}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-gray-500">
                        {member.joined}
                      </td>
                      <td className="px-6 py-3 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger className="p-1 hover:bg-gray-200 rounded text-gray-500 transition-colors outline-none cursor-pointer inline-flex items-center justify-center">
                            <MoreHorizontal className="h-4 w-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem onClick={() => setRoleModalMember(member)} className="cursor-pointer">Change Role</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleRemoveMember(member)} className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 font-medium">
                              Remove Member
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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
                  {orgData.invites.map((invite: any, i: number) => (
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
      
      {/* EDIT ORG MODAL */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity" onClick={() => setEditModalOpen(false)} />
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md z-10 overflow-hidden animate-in zoom-in-95">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-[#f8fafc]">
              <h2 className="text-xl font-bold text-[#0f172a]">Edit Organization</h2>
              <button onClick={() => setEditModalOpen(false)} className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Close</span>
                &times;
              </button>
            </div>
            <form onSubmit={handleEditOrganization} autoComplete="off">
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#0f172a] mb-1">Organization Name</label>
                  <input type="text" name="name" defaultValue={orgData.name} required className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0f172a] mb-1">Plan</label>
                  <select name="plan" defaultValue={orgData.plan === "PRO" ? "PRO" : orgData.plan === "ENTERPRISE" ? "ENTERPRISE" : "FREE"} className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#6366f1] outline-none">
                    <option value="FREE">Free</option>
                    <option value="PRO">Pro</option>
                    <option value="ENTERPRISE">Enterprise</option>
                  </select>
                </div>
              </div>
              <div className="px-6 py-4 bg-[#f8fafc] border-t border-gray-100 flex justify-end gap-3">
                <button type="button" onClick={() => setEditModalOpen(false)} className="px-4 py-2 text-sm font-medium text-[#0f172a] bg-white border border-gray-300 rounded-md hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={isEditing} className="px-4 py-2 text-sm font-medium text-white bg-[#6366f1] rounded-md hover:bg-[#4f46e5] disabled:opacity-70">
                  {isEditing ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CHANGE ROLE MODAL */}
      {roleModalMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity" onClick={() => setRoleModalMember(null)} />
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm z-10 overflow-hidden animate-in zoom-in-95">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-[#f8fafc]">
              <h2 className="text-xl font-bold text-[#0f172a]">Change User Role</h2>
              <button onClick={() => setRoleModalMember(null)} className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Close</span>
                &times;
              </button>
            </div>
            <form onSubmit={handleRoleChange} autoComplete="off">
              <div className="p-6 space-y-4">
                <p className="text-sm text-gray-600 mb-4">
                  Select a new role for <strong>{roleModalMember.name}</strong>:
                </p>
                <div>
                  <label className="block text-sm font-medium text-[#0f172a] mb-1">System Role</label>
                  <select name="role" defaultValue={roleModalMember.role} className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#6366f1] outline-none">
                    <option value="MEMBER">Member</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
              </div>
              <div className="px-6 py-4 bg-[#f8fafc] border-t border-gray-100 flex justify-end gap-3">
                <button type="button" onClick={() => setRoleModalMember(null)} className="px-4 py-2 text-sm font-medium text-[#0f172a] bg-white border border-gray-300 rounded-md hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={isChangingRole} className="px-4 py-2 text-sm font-medium text-white bg-[#6366f1] rounded-md hover:bg-[#4f46e5] disabled:opacity-70">
                  {isChangingRole ? "Saving..." : "Save Role"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
