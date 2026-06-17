"use client"

import React, { useState, Fragment } from "react"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// mockOrgs removed
import toast from "react-hot-toast"

import { useRouter } from "next/navigation"

export default function OrganizationsClient({ organizations }: { organizations: any[] }) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  
  // Filters
  const [filterPlan, setFilterPlan] = useState<string>("All")
  const [filterStatus, setFilterStatus] = useState<string>("All")
  
  // Edit State
  const [editingOrg, setEditingOrg] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)

  const filteredOrgs = organizations.filter(org => {
    const matchesSearch = org.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          org.owner.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlan = filterPlan === "All" || org.plan.toLowerCase() === filterPlan.toLowerCase();
    // Assuming status logic could be based on something later, right now let's just make it fake true or add a check if exists
    const matchesStatus = filterStatus === "All" || (filterStatus === "Active" ? true : false); // Mocking active for now since all are active
    
    return matchesSearch && matchesPlan && matchesStatus;
  });

  const handleExport = () => {
    const headers = ["Sr.No", "Organization Name", "Slug", "Owner", "Members", "Plan", "Created At"];
    const csvRows = [headers.join(",")];
    
    filteredOrgs.forEach((org, index) => {
      const row = [
        index + 1,
        `"${org.name}"`,
        `"${org.slug}"`,
        `"${org.owner}"`,
        org.members,
        org.plan,
        org.created
      ];
      csvRows.push(row.join(","));
    });

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "organizations_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Export downloaded successfully!");
  };

  const toggleRowExpanded = (id: string) => {
    const newSet = new Set(expandedRows)
    if (newSet.has(id)) newSet.delete(id)
    else newSet.add(id)
    setExpandedRows(newSet)
  }

  const handleAddOrganization = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsAdding(true);
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const ownerEmail = formData.get("ownerEmail") as string;
    const plan = formData.get("plan") as string;

    try {
      const res = await fetch("/api/admin/organizations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, ownerEmail, plan: plan.toUpperCase() })
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText);
      }

      setAddModalOpen(false);
      router.refresh();
    } catch (error: any) {
      console.error("Failed to add organization:", error);
      alert("Error creating organization: " + error.message);
    } finally {
      setIsAdding(false);
    }
  };

  const handleEditOrganization = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingOrg) return;
    setIsEditing(true);
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const plan = formData.get("plan") as string;

    try {
      const res = await fetch(`/api/admin/organizations/${editingOrg.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, plan })
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText);
      }

      setEditingOrg(null);
      router.refresh();
    } catch (error: any) {
      console.error("Failed to edit organization:", error);
      alert("Error updating organization: " + error.message);
    } finally {
      setIsEditing(false);
    }
  };

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
        <button onClick={() => setAddModalOpen(true)} className="inline-flex items-center justify-center rounded-md bg-[#6366f1] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#4f46e5] transition-colors">
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
          
          {/* Plan Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger className={`inline-flex items-center justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium outline-none transition-colors hover:bg-gray-50 ${filterPlan !== 'All' ? 'bg-[#6366f1]/10 text-[#6366f1] border-[#6366f1]/20' : 'bg-white text-gray-700'}`}>
              <Filter className="mr-2 h-4 w-4" />
              Plan {filterPlan !== 'All' && `(${filterPlan})`}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => setFilterPlan("All")} className="cursor-pointer">All Plans</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setFilterPlan("Free")} className="cursor-pointer">Free</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterPlan("Pro")} className="cursor-pointer">Pro</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterPlan("Enterprise")} className="cursor-pointer">Enterprise</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Status Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger className={`inline-flex items-center justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium outline-none transition-colors hover:bg-gray-50 ${filterStatus !== 'All' ? 'bg-[#6366f1]/10 text-[#6366f1] border-[#6366f1]/20' : 'bg-white text-gray-700'}`}>
              <Filter className="mr-2 h-4 w-4" />
              Status {filterStatus !== 'All' && `(${filterStatus})`}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => setFilterStatus("All")} className="cursor-pointer">All Statuses</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setFilterStatus("Active")} className="cursor-pointer">Active</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("Inactive")} className="cursor-pointer">Inactive</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <button onClick={handleExport} className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            <Download className="mr-2 h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* ORGS TABLE */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 w-16 font-semibold">Sr.No</th>
                <th className="px-6 py-3">Organization</th>
                <th className="px-6 py-3 hidden lg:table-cell">Owner</th>
                <th className="px-6 py-3 hidden lg:table-cell">Members</th>
                <th className="px-6 py-3 hidden lg:table-cell">Plan</th>
                <th className="px-6 py-3 hidden lg:table-cell">Revenue</th>
                <th className="px-6 py-3 hidden lg:table-cell">Created</th>
                <th className="px-6 py-3 hidden lg:table-cell text-right w-24">Actions</th>
                <th className="px-6 py-3 w-16 text-center lg:hidden">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrgs.map((org, index) => (
                <Fragment key={org.id}>
                  <tr className="hover:bg-gray-50/50">
                    <td className="px-6 py-4 text-gray-500 font-medium">
                      #{index + 1}
                    </td>
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
                    <td className="px-6 py-4 text-gray-700 font-medium hidden lg:table-cell">
                      {org.owner}
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <div className="flex items-center text-gray-600">
                        <Users className="h-4 w-4 mr-1.5 text-gray-400" />
                        {org.members}
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold ${
                        org.plan === 'Enterprise' ? 'bg-purple-100 text-purple-700' : 
                        org.plan === 'Pro' ? 'bg-indigo-100 text-indigo-700' : 
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {org.plan}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-medium hidden lg:table-cell">
                      {org.revenue}
                    </td>
                    <td className="px-6 py-4 text-gray-500 hidden lg:table-cell">
                      {org.created}
                    </td>
                    <td className="px-6 py-4 text-right hidden lg:table-cell">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="p-1.5 hover:bg-gray-100 rounded-md text-gray-500 transition-colors outline-none cursor-pointer flex items-center justify-center float-right">
                          <MoreHorizontal className="h-5 w-5" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem onClick={() => router.push(`/admin/organizations/${org.id}`)} className="cursor-pointer">
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setEditingOrg(org)} className="cursor-pointer">Edit</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setEditingOrg(org)} className="cursor-pointer">Change Plan</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 font-medium">
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                    <td className="px-6 py-4 text-center lg:hidden">
                      <button 
                        onClick={() => toggleRowExpanded(org.id)}
                        className={`h-8 w-8 rounded-full flex items-center justify-center transition-all mx-auto ${
                          expandedRows.has(org.id) 
                            ? 'bg-[#6366f1] text-white shadow-sm' 
                            : 'bg-[#eef2ff] text-[#6366f1] hover:bg-[#e0e7ff]'
                        }`}
                      >
                        {expandedRows.has(org.id) ? <span className="font-bold">-</span> : <span className="font-bold">+</span>}
                      </button>
                    </td>
                  </tr>

                  {/* Expanded Row for Mobile */}
                  {expandedRows.has(org.id) && (
                    <tr className="lg:hidden bg-gray-50/80 border-b border-gray-100">
                      <td colSpan={100} className="px-6 py-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="block text-xs font-medium text-gray-400 uppercase mb-1">Owner</span>
                            <span className="text-[#0f172a]">{org.owner}</span>
                          </div>
                          <div>
                            <span className="block text-xs font-medium text-gray-400 uppercase mb-1">Members</span>
                            <span className="text-[#0f172a]">{org.members}</span>
                          </div>
                          <div>
                            <span className="block text-xs font-medium text-gray-400 uppercase mb-1">Plan</span>
                            <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold ${
                              org.plan === 'Enterprise' ? 'bg-purple-100 text-purple-700' : 
                              org.plan === 'Pro' ? 'bg-indigo-100 text-indigo-700' : 
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {org.plan}
                            </span>
                          </div>
                          <div>
                            <span className="block text-xs font-medium text-gray-400 uppercase mb-1">Created</span>
                            <span className="text-[#0f172a]">{org.created}</span>
                          </div>
                          
                          {/* Mobile Actions */}
                          <div className="col-span-2 pt-3 mt-2 border-t border-gray-200 flex flex-wrap gap-2">
                            <Link href={`/admin/organizations/${org.id}`} className="flex items-center px-3 py-1.5 text-xs font-medium bg-white border border-gray-200 rounded hover:bg-gray-50 text-gray-700">
                              View Details
                            </Link>
                            <button onClick={() => setEditingOrg(org)} className="flex items-center px-3 py-1.5 text-xs font-medium bg-white border border-gray-200 rounded hover:bg-gray-50 text-gray-700">
                              Edit
                            </button>
                            <button className="flex items-center px-3 py-1.5 text-xs font-medium bg-red-50 border border-red-100 rounded hover:bg-red-100 text-red-600">
                              Delete
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 bg-white px-4 sm:px-6 py-3 gap-3">
          <div className="text-sm text-[#64748b] text-center sm:text-left w-full sm:w-auto">
            Showing 1 to {filteredOrgs.length} of {organizations.length} organizations
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-gray-300 rounded text-sm bg-white hover:bg-gray-50 disabled:opacity-50" disabled>Previous</button>
            <button className="px-3 py-1 border border-gray-300 rounded text-sm bg-white hover:bg-gray-50">Next</button>
          </div>
        </div>
      </div>
      
      {/* ADD ORG MODAL */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity" onClick={() => setAddModalOpen(false)} />
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md z-10 overflow-hidden animate-in zoom-in-95">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-[#f8fafc]">
              <h2 className="text-xl font-bold text-[#0f172a]">Add Organization</h2>
              <button onClick={() => setAddModalOpen(false)} className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Close</span>
                &times;
              </button>
            </div>
            <form onSubmit={handleAddOrganization} autoComplete="off">
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#0f172a] mb-1">Organization Name</label>
                  <input type="text" name="name" required placeholder="Acme Corp" className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0f172a] mb-1">Owner Email</label>
                  <input type="email" name="ownerEmail" required placeholder="owner@example.com" className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1] outline-none" />
                  <p className="text-xs text-gray-500 mt-1">Must belong to an existing user.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0f172a] mb-1">Plan</label>
                  <select name="plan" className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#6366f1] outline-none">
                    <option value="Free">Free</option>
                    <option value="Pro">Pro</option>
                    <option value="Enterprise">Enterprise</option>
                  </select>
                </div>
              </div>
              <div className="px-6 py-4 bg-[#f8fafc] border-t border-gray-100 flex justify-end gap-3">
                <button type="button" onClick={() => setAddModalOpen(false)} className="px-4 py-2 text-sm font-medium text-[#0f172a] bg-white border border-gray-300 rounded-md hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={isAdding} className="px-4 py-2 text-sm font-medium text-white bg-[#6366f1] rounded-md hover:bg-[#4f46e5] disabled:opacity-70">
                  {isAdding ? "Creating..." : "Create Org"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT ORG MODAL */}
      {editingOrg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity" onClick={() => setEditingOrg(null)} />
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md z-10 overflow-hidden animate-in zoom-in-95">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-[#f8fafc]">
              <h2 className="text-xl font-bold text-[#0f172a]">Edit Organization</h2>
              <button onClick={() => setEditingOrg(null)} className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Close</span>
                &times;
              </button>
            </div>
            <form onSubmit={handleEditOrganization} autoComplete="off">
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#0f172a] mb-1">Organization Name</label>
                  <input type="text" name="name" defaultValue={editingOrg.name} required className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0f172a] mb-1">Plan</label>
                  <select name="plan" defaultValue={editingOrg.plan === "Pro" ? "PRO" : editingOrg.plan === "Enterprise" ? "ENTERPRISE" : "FREE"} className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#6366f1] outline-none">
                    <option value="FREE">Free</option>
                    <option value="PRO">Pro</option>
                    <option value="ENTERPRISE">Enterprise</option>
                  </select>
                </div>
              </div>
              <div className="px-6 py-4 bg-[#f8fafc] border-t border-gray-100 flex justify-end gap-3">
                <button type="button" onClick={() => setEditingOrg(null)} className="px-4 py-2 text-sm font-medium text-[#0f172a] bg-white border border-gray-300 rounded-md hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={isEditing} className="px-4 py-2 text-sm font-medium text-white bg-[#6366f1] rounded-md hover:bg-[#4f46e5] disabled:opacity-70">
                  {isEditing ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
    </div>
  )
}
