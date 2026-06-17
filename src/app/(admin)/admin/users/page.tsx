"use client"

import React, { useState, useMemo, Fragment } from "react"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then(res => res.json())
import { 
  Search, 
  Plus, 
  Download, 
  Filter, 
  MoreHorizontal,
  X,
  Eye,
  Edit,
  RefreshCw,
  ShieldAlert,
  PauseCircle,
  Mail,
  Trash2,
  Calendar as CalendarIcon,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  Minus
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Mock data removed in favor of SWR fetch

export default function AdminUsersPage() {
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set())
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [viewDrawerOpen, setViewDrawerOpen] = useState(false)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<any>(null)
  const [viewingUser, setViewingUser] = useState<any>(null)
  const [userToDelete, setUserToDelete] = useState<any>(null)
  const [showToast, setShowToast] = useState(false)
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [isAdding, setIsAdding] = useState(false)

  // Filters State
  const [searchQuery, setSearchQuery] = useState("")
  const [planFilter, setPlanFilter] = useState("All Plans")
  const [roleFilter, setRoleFilter] = useState("All Roles")
  const [statusFilter, setStatusFilter] = useState("All Status")
  
  // Dropdown state
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [bulkPlanDropdownOpen, setBulkPlanDropdownOpen] = useState(false)

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 15

  // Fetch Logic
  const query = new URLSearchParams({
    page: currentPage.toString(),
    limit: rowsPerPage.toString(),
    search: searchQuery,
    plan: planFilter === "All Plans" ? "" : planFilter.toUpperCase(),
    role: roleFilter === "All Roles" ? "" : roleFilter.toUpperCase(),
    status: statusFilter === "All Status" ? "" : statusFilter.toLowerCase()
  }).toString();

  const { data, isLoading, mutate } = useSWR(`/api/admin/users?${query}`, fetcher);
  const { data: orgData } = useSWR(`/api/admin/organizations`, fetcher);

  const currentData = useMemo(() => {
    if (!data?.users) return [];
    return data.users.map((u: any) => ({
      id: u.id,
      name: u.name || 'Unknown',
      email: u.email,
      role: u.role === 'ADMIN' ? 'Admin' : 'User',
      plan: u.plan === 'FREE' ? 'Free' : u.plan === 'PRO' ? 'Pro' : 'Enterprise',
      status: u.isActive ? 'Active' : 'Inactive',
      joinedDate: u.createdAt ? new Date(u.createdAt).toISOString().split('T')[0] : 'N/A',
      lastActive: 'Active recently',
      avatarInitial: (u.name || 'U').substring(0, 2).toUpperCase(),
      organizationId: u.organization ? (u.organization._id || u.organization.id) : null
    }));
  }, [data]);

  const totalPages = data?.totalPages || 1;
  const totalCount = data?.totalCount || 0;
  const newUsersToday = data?.newUsersToday || 0;


  const toggleAll = () => {
    if (selectedUsers.size === currentData.length) {
      setSelectedUsers(new Set())
    } else {
      setSelectedUsers(new Set(currentData.map((u: any) => u.id)))
    }
  }

  const toggleUser = (id: string) => {
    const newSet = new Set(selectedUsers)
    if (newSet.has(id)) newSet.delete(id)
    else newSet.add(id)
    setSelectedUsers(newSet)
  }

  const toggleRowExpanded = (id: string) => {
    const newSet = new Set(expandedRows)
    if (newSet.has(id)) newSet.delete(id)
    else newSet.add(id)
    setExpandedRows(newSet)
  }

  const openEditDrawer = (user: any) => {
    setEditingUser(user)
    setDrawerOpen(true)
  }

  const openViewDrawer = (user: any) => {
    setViewingUser(user)
    setViewDrawerOpen(true)
  }

  const openDeleteModal = (user: any) => {
    setUserToDelete(user)
    setDeleteModalOpen(true)
  }

  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editingUser) return

    const formData = new FormData(e.currentTarget)
    const updates = {
      name: formData.get("name"),
      email: formData.get("email"),
      role: formData.get("role") === "Admin" ? "ADMIN" : "USER",
      plan: formData.get("plan")?.toString().toUpperCase(),
      isActive: formData.get("isActive") === "on",
      organizationId: formData.get("organizationId") === "none" ? null : formData.get("organizationId")
    }

    setIsSaving(true)
    try {
      const res = await fetch(`/api/admin/users/${editingUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates)
      })
      if (res.ok) {
        setDrawerOpen(false)
        setShowToast(true)
        mutate() // Refresh data
        setTimeout(() => setShowToast(false), 3000)
      } else {
        alert("Failed to update user")
      }
    } catch (err) {
      alert("An error occurred")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!userToDelete) return
    setIsDeleting(true)
    try {
      await fetch(`/api/admin/users/${userToDelete.id}`, { method: "DELETE" })
      await mutate()
      setDeleteModalOpen(false)
    } catch (error) {
      console.error("Failed to delete user:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleExportCSV = () => {
    if (!data?.users || data.users.length === 0) return;
    
    const headers = ["Name", "Email", "Role", "Plan", "Status", "Joined Date"];
    const rows = data.users.map((user: any) => [
      user.name,
      user.email,
      user.role,
      user.plan,
      user.isActive ? "Active" : "Inactive",
      new Date(user.createdAt).toLocaleDateString()
    ]);
    
    const csvContent = [
      headers.join(","),
      ...rows.map((row: any[]) => row.map((cell: any) => `"${cell}"`).join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `users_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsAdding(true);
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const role = formData.get("role") as string;
    const plan = formData.get("plan") as string;

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name, 
          email, 
          password, 
          role: role.toUpperCase(), 
          plan: plan.toUpperCase() 
        })
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText);
      }

      await mutate();
      setAddModalOpen(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error: any) {
      console.error("Failed to add user:", error);
      alert("Error creating user: " + error.message);
    } finally {
      setIsAdding(false);
    }
  };

  const handleToggleStatus = async (user: any) => {
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: user.status !== "Active" })
      })
      if (res.ok) {
        mutate()
      }
    } catch (err) {
      alert("An error occurred")
    }
  }

  return (
    <div className="space-y-6 bg-[#f8fafc] min-h-full pb-10">
      
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 z-[100] flex items-center gap-2 bg-white border border-green-200 shadow-lg rounded-lg px-4 py-3 animate-in slide-in-from-top-2">
          <CheckCircle2 className="h-5 w-5 text-green-500" />
          <p className="text-sm font-medium text-gray-900">User updated successfully</p>
        </div>
      )}

      {/* HEADER */}
      <div className="bg-gradient-to-r from-[#eef2ff] to-white rounded-xl shadow-sm border border-[#c7d2fe] px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-[#0f172a]">All Users</h1>
          <span className="inline-flex items-center rounded-full bg-white border border-[#c7d2fe] px-2.5 py-0.5 text-xs font-semibold text-[#4f46e5]">
            {totalCount} total
          </span>
        </div>
        <div className="flex items-center gap-3">
            <button onClick={handleExportCSV} className="flex items-center gap-2 px-4 py-2 bg-white border border-[#c7d2fe] rounded-lg text-sm font-medium text-[#4f46e5] hover:bg-[#eef2ff] transition-colors shadow-sm">
              <Download className="h-4 w-4" />
              Export CSV
            </button>
          <button onClick={() => setAddModalOpen(true)} className="inline-flex items-center justify-center rounded-md bg-[#6366f1] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#4f46e5] transition-colors">
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </button>
        </div>
      </div>

      {/* MINI STATS ROW */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-transparent">
          <p className="text-xs font-medium text-[#64748b] uppercase tracking-wider">Total</p>
          <p className="text-2xl font-bold text-[#0f172a] mt-1">{totalCount}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-transparent">
          <p className="text-xs font-medium text-[#64748b] uppercase tracking-wider">Active</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{totalCount}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-transparent">
          <p className="text-xs font-medium text-[#64748b] uppercase tracking-wider">Inactive</p>
          <p className="text-2xl font-bold text-red-600 mt-1">0</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-transparent">
          <p className="text-xs font-medium text-[#64748b] uppercase tracking-wider">New Today</p>
          <p className="text-2xl font-bold text-[#6366f1] mt-1">{newUsersToday}</p>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-transparent">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search users..." 
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-transparent transition-all"
            />
          </div>
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 w-full lg:w-auto">
            <select 
              value={planFilter}
              onChange={(e) => { setPlanFilter(e.target.value); setCurrentPage(1); }}
              className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#6366f1] w-full sm:w-auto"
            >
              <option>All Plans</option>
              <option>Free</option>
              <option>Pro</option>
              <option>Enterprise</option>
            </select>
            <select 
              value={roleFilter}
              onChange={(e) => { setRoleFilter(e.target.value); setCurrentPage(1); }}
              className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#6366f1] w-full sm:w-auto"
            >
              <option>All Roles</option>
              <option>User</option>
              <option>Admin</option>
            </select>
            <select 
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#6366f1] w-full sm:w-auto"
            >
              <option>All Status</option>
              <option>Active</option>
              <option>Inactive</option>
              <option>Suspended</option>
            </select>
            <div className="relative w-full sm:w-auto col-span-2 sm:col-span-1">
              <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input type="text" placeholder="Joined date" className="w-full sm:w-40 pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6366f1]" />
            </div>
            <button 
              onClick={() => {
                setSearchQuery("");
                setPlanFilter("All Plans");
                setRoleFilter("All Roles");
                setStatusFilter("All Status");
                setCurrentPage(1);
              }}
              className="text-sm font-medium text-[#6366f1] hover:underline px-2 col-span-2 sm:col-span-1 text-center sm:text-left"
            >
              Reset filters
            </button>
          </div>
        </div>
      </div>

      {/* BULK ACTIONS */}
      {selectedUsers.size > 0 && (
        <div className="bg-[#eef2ff] border border-[#c7d2fe] rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3 animate-in slide-in-from-top-2">
          <span className="text-sm font-medium text-[#4f46e5] px-2">{selectedUsers.size} users selected</span>
          <div className="flex flex-wrap gap-2 justify-center sm:justify-end w-full sm:w-auto">
            <button className="flex items-center px-3 py-1.5 text-sm font-medium text-[#4f46e5] bg-white border border-[#c7d2fe] rounded-lg hover:bg-[#eef2ff]">
              Change Plan <ChevronDown className="ml-1 h-4 w-4" />
            </button>
            <button className="flex items-center px-3 py-1.5 text-sm font-medium text-[#4f46e5] bg-white border border-[#c7d2fe] rounded-lg hover:bg-[#eef2ff]">
              Export Selected
            </button>
            <button className="flex items-center px-3 py-1.5 text-sm font-medium text-orange-600 bg-white border border-orange-200 rounded-lg hover:bg-orange-50">
              Suspend
            </button>
            <button className="flex items-center px-3 py-1.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 shadow-sm border border-transparent">
              Delete Selected
            </button>
          </div>
        </div>
      )}

      {/* USERS TABLE */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden flex flex-col mt-4">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#f8fafc] text-[#64748b] font-semibold border-b border-gray-200">
              <tr>
                <th className="px-4 py-3.5 w-12 text-center">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300 text-[#6366f1] focus:ring-[#6366f1]"
                    checked={selectedUsers.size === currentData.length && currentData.length > 0}
                    onChange={toggleAll}
                  />
                </th>
                <th className="px-4 py-3.5">User</th>
                <th className="px-4 py-3.5 hidden lg:table-cell">Role</th>
                <th className="px-4 py-3.5 hidden lg:table-cell">Plan</th>
                <th className="px-4 py-3.5 hidden lg:table-cell">Status</th>
                <th className="px-4 py-3.5 hidden lg:table-cell">Joined</th>
                <th className="px-4 py-3.5 hidden lg:table-cell">Last Active</th>
                <th className="px-4 py-3.5 hidden lg:table-cell text-right w-24">Actions</th>
                <th className="px-4 py-3.5 w-16 text-center lg:hidden">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentData.length > 0 ? currentData.map((user: any) => (
                <Fragment key={user.id}>
                  <tr className="hover:bg-[#f8fafc] transition-colors">
                    <td className="px-4 py-3 text-center">
                      <input 
                        type="checkbox" 
                        className="rounded border-gray-300 text-[#6366f1] focus:ring-[#6366f1]"
                        checked={selectedUsers.has(user.id)}
                        onChange={() => toggleUser(user.id)}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.avatarInitial}&backgroundColor=e2e8f0`} />
                          <AvatarFallback className="bg-gray-200 text-gray-700">{user.avatarInitial}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold text-[#0f172a]">{user.name}</div>
                          <div className="text-xs text-[#64748b]">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                        user.role === 'Admin' ? 'bg-[#faf5ff] text-[#a855f7]' : 'bg-[#f1f5f9] text-[#64748b]'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold ${
                        user.plan === 'Enterprise' ? 'bg-[#faf5ff] text-[#a855f7]' : 
                        user.plan === 'Pro' ? 'bg-[#e0e7ff] text-[#6366f1]' : 
                        'bg-[#f1f5f9] text-[#64748b]'
                      }`}>
                        {user.plan}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <div className="flex items-center gap-1.5">
                        <div className={`h-2 w-2 rounded-full ${
                          user.status === 'Active' ? 'bg-[#22c55e]' : 
                          user.status === 'Inactive' ? 'bg-[#ef4444]' : 'bg-[#f59e0b]'
                        }`} />
                        <span className="text-[#0f172a] font-medium">{user.status}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[#64748b] hidden lg:table-cell">{user.joinedDate}</td>
                    <td className="px-4 py-3 text-[#64748b] hidden lg:table-cell">{user.lastActive}</td>
                    <td className="px-4 py-3 text-right hidden lg:table-cell">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="p-1.5 hover:bg-gray-100 rounded-md text-gray-500 transition-colors outline-none cursor-pointer flex items-center justify-center float-right">
                          <MoreHorizontal className="h-5 w-5" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                          <DropdownMenuItem className="cursor-pointer text-gray-700 hover:text-[#6366f1] focus:text-[#6366f1]" onClick={() => openViewDrawer(user)}>
                            <Eye className="mr-2 h-4 w-4" /> View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer text-gray-700 hover:text-[#6366f1] focus:text-[#6366f1]" onClick={() => openEditDrawer(user)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit User
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer text-gray-700 hover:text-[#6366f1] focus:text-[#6366f1]" onClick={() => openEditDrawer(user)}>
                            <RefreshCw className="mr-2 h-4 w-4" /> Change Plan
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer text-gray-700 hover:text-[#6366f1] focus:text-[#6366f1]" onClick={() => openEditDrawer(user)}>
                            <ShieldAlert className="mr-2 h-4 w-4" /> Change Role
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer text-gray-700 hover:text-orange-600 focus:text-orange-600" onClick={() => handleToggleStatus(user)}>
                            <PauseCircle className="mr-2 h-4 w-4" /> {user.status === 'Active' ? 'Suspend Account' : 'Activate Account'}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer text-gray-700 hover:text-[#6366f1] focus:text-[#6366f1]" onClick={() => window.location.href = `mailto:${user.email}`}>
                            <Mail className="mr-2 h-4 w-4" /> Send Email
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="cursor-pointer text-red-600 font-medium hover:text-red-700 focus:text-red-700 focus:bg-red-50" onClick={() => openDeleteModal(user)}>
                            <Trash2 className="mr-2 h-4 w-4" /> Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                    <td className="px-4 py-3 text-center lg:hidden">
                      <button 
                        onClick={() => toggleRowExpanded(user.id)}
                        className={`h-8 w-8 rounded-full flex items-center justify-center transition-all mx-auto ${
                          expandedRows.has(user.id) 
                            ? 'bg-[#6366f1] text-white shadow-sm' 
                            : 'bg-[#eef2ff] text-[#6366f1] hover:bg-[#e0e7ff]'
                        }`}
                      >
                        {expandedRows.has(user.id) ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                      </button>
                    </td>
                  </tr>
                  
                  {expandedRows.has(user.id) && (
                    <tr className="lg:hidden bg-gray-50/80 border-b border-gray-100">
                      <td colSpan={100} className="px-4 py-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="block text-xs font-medium text-gray-400 uppercase mb-1">Role</span>
                            <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${
                              user.role === 'Admin' ? 'bg-[#faf5ff] text-[#a855f7]' : 'bg-white border border-gray-200 text-[#64748b]'
                            }`}>
                              {user.role}
                            </span>
                          </div>
                          <div>
                            <span className="block text-xs font-medium text-gray-400 uppercase mb-1">Plan</span>
                            <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ${
                              user.plan === 'Enterprise' ? 'bg-[#faf5ff] text-[#a855f7]' : 
                              user.plan === 'Pro' ? 'bg-[#e0e7ff] text-[#6366f1]' : 
                              'bg-white border border-gray-200 text-[#64748b]'
                            }`}>
                              {user.plan}
                            </span>
                          </div>
                          <div>
                            <span className="block text-xs font-medium text-gray-400 uppercase mb-1">Status</span>
                            <div className="flex items-center gap-1.5">
                              <div className={`h-2 w-2 rounded-full ${
                                user.status === 'Active' ? 'bg-[#22c55e]' : 
                                user.status === 'Inactive' ? 'bg-[#ef4444]' : 'bg-[#f59e0b]'
                              }`} />
                              <span className="text-[#0f172a] font-medium">{user.status}</span>
                            </div>
                          </div>
                          <div>
                            <span className="block text-xs font-medium text-gray-400 uppercase mb-1">Joined</span>
                            <span className="text-[#0f172a]">{user.joinedDate}</span>
                          </div>
                          <div className="col-span-2">
                            <span className="block text-xs font-medium text-gray-400 uppercase mb-1">Last Active</span>
                            <span className="text-[#0f172a]">{user.lastActive}</span>
                          </div>
                          
                          {/* Mobile Actions */}
                          <div className="col-span-2 pt-3 mt-2 border-t border-gray-200 flex flex-wrap gap-2">
                            <button onClick={() => openViewDrawer(user)} className="flex items-center px-3 py-1.5 text-xs font-medium bg-white border border-gray-200 rounded hover:bg-gray-50 text-gray-700">
                              <Eye className="mr-1.5 h-3.5 w-3.5" /> View Profile
                            </button>
                            <button onClick={() => openEditDrawer(user)} className="flex items-center px-3 py-1.5 text-xs font-medium bg-white border border-gray-200 rounded hover:bg-gray-50 text-gray-700">
                              <Edit className="mr-1.5 h-3.5 w-3.5" /> Edit
                            </button>
                            <button onClick={() => handleToggleStatus(user)} className="flex items-center px-3 py-1.5 text-xs font-medium bg-white border border-gray-200 rounded hover:bg-gray-50 text-gray-700">
                              <PauseCircle className="mr-1.5 h-3.5 w-3.5" /> {user.status === 'Active' ? 'Suspend' : 'Activate'}
                            </button>
                            <button onClick={() => openDeleteModal(user)} className="flex items-center px-3 py-1.5 text-xs font-medium bg-red-50 border border-red-100 rounded hover:bg-red-100 text-red-600">
                              <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Delete
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              )) : (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-[#64748b]">
                    No users match the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* PAGINATION */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 bg-white px-4 sm:px-6 py-3 gap-3">
          <div className="text-sm text-[#64748b] text-center sm:text-left w-full sm:w-auto">
            Showing {currentData.length === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1}-{Math.min(currentPage * rowsPerPage, totalCount)} of {totalCount}
          </div>
          <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <span className="text-sm text-[#64748b] hidden sm:inline">Rows per page:</span>
              <span className="text-sm text-[#64748b] sm:hidden">Rows:</span>
              <select className="border border-gray-200 rounded px-2 py-1.5 text-sm bg-white focus:ring-[#6366f1] outline-none">
                <option>15</option>
                <option>30</option>
                <option>50</option>
              </select>
            </div>
            <div className="flex gap-1">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-sm font-medium text-[#0f172a] bg-white border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white"
              >
                Previous
              </button>
              <div className="hidden sm:flex">
                {Array.from({ length: Math.min(3, totalPages) }).map((_, i) => (
                  <button 
                    key={i + 1} 
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1.5 text-sm font-medium border-y border-r first:border-l first:rounded-l-md last:rounded-r-md ${
                      currentPage === i + 1 ? 'bg-[#6366f1] text-white border-[#6366f1]' : 'bg-white text-[#0f172a] border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                {totalPages > 3 && (
                  <>
                    <span className="px-3 py-1.5 text-sm font-medium text-[#64748b] bg-white border-y border-r border-gray-200">...</span>
                    <button 
                      onClick={() => setCurrentPage(totalPages)}
                      className={`px-3 py-1.5 text-sm font-medium border-y border-r border-gray-200 rounded-r-md ${
                        currentPage === totalPages ? 'bg-[#6366f1] text-white border-[#6366f1]' : 'bg-white text-[#0f172a] hover:bg-gray-50'
                      }`}
                    >
                      {totalPages}
                    </button>
                  </>
                )}
              </div>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-sm font-medium text-[#0f172a] bg-white border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 ml-1"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* VIEW PROFILE DRAWER */}
      {viewDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity" onClick={() => setViewDrawerOpen(false)} />
          <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right-full duration-300">
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-white shrink-0">
              <h2 className="text-lg font-semibold text-[#0f172a]">User Profile</h2>
              <button onClick={() => setViewDrawerOpen(false)} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-gray-50/50">
              {viewingUser && (
                <>
                  <div className="flex flex-col items-center text-center">
                    <Avatar className="h-20 w-20 ring-4 ring-white shadow-sm mb-3">
                      <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${viewingUser.avatarInitial}&backgroundColor=e2e8f0`} />
                      <AvatarFallback className="text-xl">{viewingUser.avatarInitial}</AvatarFallback>
                    </Avatar>
                    <h3 className="font-bold text-xl text-[#0f172a]">{viewingUser.name}</h3>
                    <p className="text-[#6366f1] text-sm font-medium mt-1">{viewingUser.role}</p>
                  </div>
                  
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-4">
                    <div>
                      <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Email</h4>
                      <div className="flex items-center text-[#0f172a]"><Mail className="w-4 h-4 mr-2 text-gray-400" /> {viewingUser.email}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-50">
                      <div>
                        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Status</h4>
                        <span className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold ${viewingUser.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {viewingUser.status}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Plan</h4>
                        <span className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold ${
                          viewingUser.plan === 'Enterprise' ? 'bg-[#faf5ff] text-[#a855f7]' : 
                          viewingUser.plan === 'Pro' ? 'bg-[#e0e7ff] text-[#6366f1]' : 
                          'bg-[#f1f5f9] text-[#64748b]'
                        }`}>
                          {viewingUser.plan}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Joined Date</h4>
                      <p className="text-sm text-[#0f172a] font-medium">{viewingUser.joinedDate}</p>
                    </div>
                    <div>
                      <h4 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Last Active</h4>
                      <p className="text-sm text-[#0f172a] font-medium">{viewingUser.lastActive}</p>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="border-t border-gray-100 px-5 py-4 bg-white flex justify-end gap-3 shrink-0 mt-auto">
              <button onClick={() => setViewDrawerOpen(false)} className="px-4 py-2 text-sm font-medium text-[#0f172a] bg-white border border-gray-300 rounded-md hover:bg-gray-50">Close</button>
              <button onClick={() => { setViewDrawerOpen(false); openEditDrawer(viewingUser); }} className="px-4 py-2 text-sm font-medium text-white bg-[#6366f1] border border-transparent rounded-md hover:bg-[#4f46e5]">Edit User</button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT USER DRAWER */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity" onClick={() => setDrawerOpen(false)} />
          <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right-full duration-300">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-[#f8fafc] shrink-0">
                <h2 className="text-lg font-bold text-[#0f172a]">Edit User</h2>
                <button onClick={() => setDrawerOpen(false)} className="text-gray-400 hover:text-gray-500 bg-white rounded-full p-1 shadow-sm">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleSave} className="flex flex-col h-full overflow-hidden">
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {editingUser && (
                    <>
                      <div className="flex items-center gap-4 mb-2">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${editingUser.avatarInitial}&backgroundColor=e2e8f0`} />
                          <AvatarFallback>{editingUser.avatarInitial}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-bold text-lg text-[#0f172a]">{editingUser.name}</h3>
                          <p className="text-[#64748b] text-sm">ID: {editingUser.id}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-[#0f172a] mb-1">Full Name</label>
                          <input type="text" name="name" defaultValue={editingUser.name} className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1] outline-none" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#0f172a] mb-1">Email Address</label>
                          <input type="email" name="email" defaultValue={editingUser.email} className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1] outline-none" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#0f172a] mb-1">Phone Number</label>
                          <input type="tel" placeholder="+91 98765 43210" className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1] outline-none" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-[#0f172a] mb-1">Role</label>
                            <select name="role" defaultValue={editingUser.role} className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1] outline-none">
                              <option>User</option>
                              <option>Admin</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-[#0f172a] mb-1">Plan</label>
                            <select name="plan" defaultValue={editingUser.plan} className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1] outline-none">
                              <option>Free</option>
                              <option>Pro</option>
                              <option>Enterprise</option>
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#0f172a] mb-1">Assign to Organization</label>
                          <select name="organizationId" defaultValue={editingUser.organizationId || "none"} className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1] outline-none">
                            <option value="none">No Organization</option>
                            {orgData?.organizations?.map((org: any) => (
                              <option key={org.id} value={org.id}>{org.name}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#0f172a] mb-2 flex items-center justify-between">
                            <span>Status</span>
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${editingUser.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                              {editingUser.status}
                            </span>
                          </label>
                          <div className="flex items-center gap-3">
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" name="isActive" className="sr-only peer" defaultChecked={editingUser.status === 'Active'} />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#e0e7ff] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#22c55e]"></div>
                              <span className="ml-3 text-sm font-medium text-gray-900">Account is Active</span>
                            </label>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#0f172a] mb-1">Bio / Notes</label>
                          <textarea rows={4} placeholder="Internal admin notes..." className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1] outline-none resize-none" />
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <div className="border-t border-gray-100 p-6 bg-[#f8fafc] flex justify-end gap-3 mt-auto">
                  <button type="button" onClick={() => setDrawerOpen(false)} className="px-4 py-2 text-sm font-medium text-[#0f172a] bg-white border border-gray-300 rounded-md hover:bg-gray-50">Cancel</button>
                  <button type="submit" disabled={isSaving} className="px-4 py-2 text-sm font-medium text-white bg-[#6366f1] border border-transparent rounded-md hover:bg-[#4f46e5] disabled:opacity-70">
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
      )}

      {/* ADD USER MODAL */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity" onClick={() => setAddModalOpen(false)} />
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg z-10 overflow-hidden animate-in zoom-in-95">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-[#f8fafc]">
              <h2 className="text-xl font-bold text-[#0f172a]">Add New User</h2>
              <button onClick={() => setAddModalOpen(false)} className="text-gray-400 hover:text-gray-500">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAddUser} autoComplete="off">
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#0f172a] mb-1">Full Name</label>
                  <input type="text" name="name" required autoComplete="new-password" placeholder="e.g. John Doe" className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0f172a] mb-1">Email Address</label>
                  <input type="email" name="email" required autoComplete="new-password" placeholder="john@example.com" className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1] outline-none" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-[#0f172a]">Password</label>
                  </div>
                  <input type="password" name="password" required autoComplete="new-password" placeholder="••••••••" className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1] outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#0f172a] mb-1">Role</label>
                    <select name="role" className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#6366f1] outline-none">
                      <option>User</option>
                      <option>Admin</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#0f172a] mb-1">Plan</label>
                    <select name="plan" className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#6366f1] outline-none">
                      <option>Free</option>
                      <option>Pro</option>
                      <option>Enterprise</option>
                    </select>
                  </div>
                </div>
                <div className="pt-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded border-gray-300 text-[#6366f1] focus:ring-[#6366f1]" />
                    <span className="text-sm text-[#0f172a]">Send welcome email with login instructions</span>
                  </label>
                </div>
              </div>
              <div className="px-6 py-4 bg-[#f8fafc] border-t border-gray-100 flex justify-end gap-3">
                <button type="button" onClick={() => setAddModalOpen(false)} className="px-4 py-2 text-sm font-medium text-[#0f172a] bg-white border border-gray-300 rounded-md hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={isAdding} className="px-4 py-2 text-sm font-medium text-white bg-[#6366f1] rounded-md hover:bg-[#4f46e5] disabled:opacity-70">
                  {isAdding ? "Creating..." : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteModalOpen && userToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity" onClick={() => setDeleteModalOpen(false)} />
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md z-10 overflow-hidden animate-in zoom-in-95">
            <div className="p-6 flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <h2 className="text-lg font-bold text-[#0f172a]">Are you sure?</h2>
              <p className="text-sm text-[#64748b] mt-2 mb-6">
                You are about to delete the user <strong className="text-[#0f172a]">{userToDelete.name}</strong>. 
                <span className="block mt-1 text-red-600 font-medium">This action cannot be undone.</span>
              </p>
              <div className="flex w-full gap-3">
                <button onClick={() => setDeleteModalOpen(false)} disabled={isDeleting} className="flex-1 px-4 py-2.5 text-sm font-medium text-[#0f172a] bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-70">Cancel</button>
                <button onClick={handleDelete} disabled={isDeleting} className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-70">
                  {isDeleting ? "Deleting..." : "Delete User"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
