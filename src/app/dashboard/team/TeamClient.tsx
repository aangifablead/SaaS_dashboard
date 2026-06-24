"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Search, Plus, Download, MoreHorizontal, Filter, ChevronLeft, ChevronRight, Mail, UserPlus, XCircle, Loader2, Users, UserCheck, UserMinus } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import toast from "react-hot-toast"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"

export interface TeamClientProps {
  usersData: any[];
  stats: {
    totalUsers: number;
    activeUsers: number;
    inactiveUsers: number;
    newUsers: number;
  };
  invitesData: any[];
}

export default function TeamClient({ usersData, stats, invitesData }: TeamClientProps) {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [isInviteOpen, setIsInviteOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState("member")
  const [isInviting, setIsInviting] = useState(false)
  const [isRevoking, setIsRevoking] = useState<string | null>(null)
  const [confirmDialog, setConfirmDialog] = useState<{ type: "revoke" | "delete", id: string } | null>(null)
  const [editUserDialog, setEditUserDialog] = useState<any | null>(null)
  const [editData, setEditData] = useState({ name: "", email: "", role: "", plan: "" })
  const [isSavingUser, setIsSavingUser] = useState(false)
  const router = useRouter()
  
  const toggleAll = () => {
    if (selectedUsers.length === usersData.length) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(usersData.map(u => u.id))
    }
  }

  const toggleUser = (id: string) => {
    if (selectedUsers.includes(id)) {
      setSelectedUsers(selectedUsers.filter(u => u !== id))
    } else {
      setSelectedUsers([...selectedUsers, id])
    }
  }

  const handleInvite = async () => {
    if (!inviteEmail) {
      toast.error("Please enter an email address")
      return
    }

    setIsInviting(true)
    try {
      const res = await fetch("/api/invites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
      })

      if (!res.ok) {
        const errorText = await res.text()
        toast.error(errorText || "Failed to send invite")
        return
      }

      toast.success("Invitation sent successfully!")
      setIsInviteOpen(false)
      setInviteEmail("")
      setInviteRole("member")
      router.refresh()
    } catch (error: any) {
      toast.error("Failed to send invite")
    } finally {
      setIsInviting(false)
    }
  }

  const handleRevoke = async (inviteId: string) => {
    setIsRevoking(inviteId)
    try {
      const res = await fetch(`/api/invites?id=${inviteId}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        const errorText = await res.text()
        toast.error(errorText || "Failed to revoke invite")
        return
      }

      toast.success("Invite revoked successfully")
      router.refresh()
    } catch (error: any) {
      toast.error("Failed to revoke invite")
    } finally {
      setIsRevoking(null)
    }
  }

  const handleConfirmAction = async () => {
    if (!confirmDialog) return;
    
    if (confirmDialog.type === "revoke") {
      setConfirmDialog(null);
      await handleRevoke(confirmDialog.id);
    } else if (confirmDialog.type === "delete") {
      const userId = confirmDialog.id;
      setConfirmDialog(null);
      if (userId === "bulk") {
        toast.error("Bulk deletion not implemented yet.");
        return;
      }
      try {
        const res = await fetch(`/api/users?id=${userId}`, { method: "DELETE" });
        if (!res.ok) {
          const errText = await res.text();
          toast.error(errText || "Failed to remove user");
          return;
        }
        toast.success("User successfully removed");
        router.refresh();
      } catch (error: any) {
        toast.error("Failed to remove user");
      }
    }
  }

  const handleToggleActive = async (userId: string, currentActive: boolean) => {
    try {
      const res = await fetch(`/api/users?id=${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentActive })
      });
      if (!res.ok) throw new Error("Failed");
      toast.success(currentActive ? "User suspended" : "User activated");
      router.refresh();
    } catch {
      toast.error("Failed to update user status");
    }
  }

  const openEditDialog = (user: any, mode: "edit" | "plan" | "view") => {
    setEditData({ name: user.name || "", email: user.email || "", role: user.role || "MEMBER", plan: user.plan || "FREE" });
    setEditUserDialog({ user, mode });
  }

  const saveEditUser = async () => {
    if (!editUserDialog) return;
    setIsSavingUser(true);
    try {
      const res = await fetch(`/api/users?id=${editUserDialog.user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData)
      });
      if (!res.ok) throw new Error("Failed");
      toast.success("User updated successfully");
      setEditUserDialog(null);
      router.refresh();
    } catch {
      toast.error("Failed to update user");
    } finally {
      setIsSavingUser(false);
    }
  }

  return (
    <div className="flex flex-col gap-8 pb-8">
      {/* HEADER */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Team Members</h1>
          <Badge variant="secondary" className="bg-primary/10 text-primary border-none rounded-full px-3 py-1 font-semibold text-sm">
            {stats.totalUsers.toLocaleString()} total
          </Badge>
        </div>
        <div className="flex items-center gap-3">
          <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
            <DialogTrigger render={<Button className="gap-2 shadow-sm" />}>
              <UserPlus className="h-4 w-4" />
              Invite Member
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Invite Team Member</DialogTitle>
                <DialogDescription>
                  Send an email invitation to join your workspace.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email address</Label>
                  <Input 
                    id="email" 
                    type="email"
                    placeholder="name@example.com" 
                    className="col-span-3 shadow-sm bg-background" 
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="role">Role</Label>
                  <Select value={inviteRole} onValueChange={(val) => setInviteRole(val || "member")}>
                    <SelectTrigger className="shadow-sm bg-background">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="member">Member</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button 
                  onClick={handleInvite} 
                  disabled={isInviting || !inviteEmail} 
                  className="w-full gap-2 shadow-sm"
                >
                  {isInviting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
                  {isInviting ? "Sending..." : "Send Invite"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* STATS MINI ROW */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Users", value: stats.totalUsers.toLocaleString() },
          { label: "Active Users", value: stats.activeUsers.toLocaleString(), color: "text-success" },
          { label: "Inactive Users", value: stats.inactiveUsers.toLocaleString(), color: "text-muted-foreground" },
          { label: "New This Month", value: stats.newUsers.toLocaleString(), color: "text-primary" },
        ].map((stat, i) => (
          <Card key={i} className="shadow-sm">
            <CardContent className="p-4 md:p-5 flex flex-row items-center justify-between gap-3 overflow-hidden">
              <span className="text-[13px] md:text-sm font-medium text-muted-foreground whitespace-nowrap">{stat.label}</span>
              <span className={`text-xl md:text-2xl font-bold ${stat.color || "text-foreground"}`}>{stat.value}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* MAIN CONTENT CARD */}
      <Card className="shadow-sm border-border flex flex-col overflow-hidden">
        {/* Filter Bar */}
        <div className="p-4 border-b border-border flex flex-col md:flex-row gap-4 justify-between items-center bg-card">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                className="w-full bg-background shadow-sm pl-9 rounded-lg"
              />
            </div>
            <Select>
              <SelectTrigger className="w-[130px] shadow-sm">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Plan" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Plans</SelectItem>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="pro">Pro</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[130px] shadow-sm">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button variant="outline" className="gap-2 w-full md:w-auto shadow-sm">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>

        {/* Bulk Actions Bar */}
        {selectedUsers.length > 0 && (
          <div className="bg-primary/5 border-b border-primary/20 p-3 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-2 pl-2 text-sm font-medium text-primary">
              <span className="h-5 w-5 bg-primary text-white rounded-full flex items-center justify-center text-xs">
                {selectedUsers.length}
              </span>
              users selected
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-8 shadow-sm">Change Plan</Button>
              <Button variant="outline" size="sm" className="h-8 shadow-sm text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20" onClick={() => setConfirmDialog({ type: 'delete', id: 'bulk' })}>Delete</Button>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border bg-accent/30 hover:bg-accent/30">
                <TableHead className="w-[50px] text-center pl-4">
                  <Checkbox 
                    checked={selectedUsers.length === usersData.length && usersData.length > 0}
                    onCheckedChange={toggleAll}
                  />
                </TableHead>
                <TableHead className="text-xs font-semibold text-muted-foreground h-11">User</TableHead>
                <TableHead className="text-xs font-semibold text-muted-foreground h-11">Role</TableHead>
                <TableHead className="text-xs font-semibold text-muted-foreground h-11">Plan</TableHead>
                <TableHead className="text-xs font-semibold text-muted-foreground h-11 text-center">Active</TableHead>
                <TableHead className="text-xs font-semibold text-muted-foreground h-11">Joined</TableHead>
                <TableHead className="text-xs font-semibold text-muted-foreground h-11">Last Active</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usersData.map((user) => (
                <TableRow 
                  key={user.id} 
                  className={`border-border transition-colors ${selectedUsers.includes(user.id) ? 'bg-primary/5 hover:bg-primary/5' : 'hover:bg-[#f8fafc]'}`}
                >
                  <TableCell className="pl-4">
                    <Checkbox 
                      checked={selectedUsers.includes(user.id)}
                      onCheckedChange={() => toggleUser(user.id)}
                    />
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center font-bold text-muted-foreground text-sm shrink-0 uppercase">
                        {(user.name || "U").slice(0, 2)}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm text-foreground">{user.name || "Unknown User"}</span>
                        <span className="text-xs text-muted-foreground">{user.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-medium text-foreground capitalize">{user.role?.toLowerCase() || 'user'}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={`${user.plan === 'ENTERPRISE' ? 'bg-[#faf5ff] text-[#a855f7] hover:bg-[#faf5ff]' : 'bg-primary/10 text-primary hover:bg-primary/10'} font-semibold border-none rounded-md px-2 py-0.5`}>
                      {user.plan || "Free"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch 
                      checked={user.isActive} 
                      onCheckedChange={() => handleToggleActive(user.id, user.isActive)} 
                    />
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{user.joined}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{user.lastActive}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger render={<Button variant="ghost" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground" />}>
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[160px] rounded-xl shadow-lg border-border">
                        <DropdownMenuItem className="cursor-pointer font-medium" onClick={() => openEditDialog(user, 'view')}>View Profile</DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer font-medium" onClick={() => openEditDialog(user, 'edit')}>Edit User</DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer font-medium" onClick={() => openEditDialog(user, 'plan')}>Change Plan</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer font-medium text-warning focus:text-warning" onClick={() => handleToggleActive(user.id, user.isActive)}>
                          {user.isActive ? "Suspend User" : "Activate User"}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer font-medium text-destructive focus:text-destructive" onClick={() => setConfirmDialog({ type: 'delete', id: user.id })}>Delete User</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-border flex items-center justify-between bg-card text-sm text-muted-foreground">
          <div>
            Showing <span className="font-medium text-foreground">1-{usersData.length}</span> of <span className="font-medium text-foreground">{stats.totalUsers.toLocaleString()}</span> users
          </div>
          {stats.totalUsers > usersData.length && (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="h-8 w-8 shadow-sm" disabled>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-1">
                <Button variant="outline" size="sm" className="h-8 w-8 p-0 bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground border-primary shadow-sm">1</Button>
                {stats.totalUsers > 10 && <Button variant="ghost" size="sm" className="h-8 w-8 p-0">2</Button>}
                {stats.totalUsers > 20 && <Button variant="ghost" size="sm" className="h-8 w-8 p-0">3</Button>}
                {stats.totalUsers > 30 && (
                  <>
                    <span className="px-2">...</span>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">{Math.ceil(stats.totalUsers / 10)}</Button>
                  </>
                )}
              </div>
              <Button variant="outline" size="icon" className="h-8 w-8 shadow-sm">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* PENDING INVITES SECTION */}
      <h3 className="text-lg font-semibold text-foreground mt-4 -mb-2">Pending Invites</h3>
      <Card className="shadow-sm border-border">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border bg-accent/30">
                <TableHead className="text-xs font-semibold text-muted-foreground h-11 pl-6">Email Address</TableHead>
                <TableHead className="text-xs font-semibold text-muted-foreground h-11">Role</TableHead>
                <TableHead className="text-xs font-semibold text-muted-foreground h-11">Status</TableHead>
                <TableHead className="text-xs font-semibold text-muted-foreground h-11">Sent On</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invitesData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-6">
                    No pending invites
                  </TableCell>
                </TableRow>
              ) : invitesData.map((invite, i) => (
                <TableRow key={invite.id || i} className="border-b border-border hover:bg-accent/50">
                  <TableCell className="pl-6 py-3 font-medium text-sm">{invite.email}</TableCell>
                  <TableCell className="text-sm capitalize">{invite.role?.toLowerCase() || "member"}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-warning/15 text-warning border-none font-semibold px-2 py-0.5">
                      Pending
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{invite.sentOn}</TableCell>
                  <TableCell className="pr-6 text-right">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 text-destructive border-destructive/20 hover:bg-destructive/10 hover:text-destructive gap-1 shadow-sm"
                      onClick={() => setConfirmDialog({ type: 'revoke', id: invite.id })}
                      disabled={isRevoking === invite.id}
                    >
                      {isRevoking === invite.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <XCircle className="h-3.5 w-3.5" />}
                      Revoke
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={!!confirmDialog} onOpenChange={(open) => !open && setConfirmDialog(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              {confirmDialog?.type === "revoke" 
                ? "This will permanently revoke the invitation. The user will no longer be able to use the invite link."
                : "This will permanently remove the user from your organization and revoke their access."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setConfirmDialog(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleConfirmAction}>
              {confirmDialog?.type === "revoke" ? "Yes, Revoke" : "Yes, Remove"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={!!editUserDialog} onOpenChange={(open) => !open && setEditUserDialog(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editUserDialog?.mode === "plan" ? "Change Plan" : 
               editUserDialog?.mode === "view" ? "User Profile" : 
               "Edit User Profile"}
            </DialogTitle>
            <DialogDescription>
              {editUserDialog?.mode === "view" ? "Viewing details for this user." : "Update the details and permissions for this user."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {editUserDialog?.mode === "view" ? (
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xl shrink-0 uppercase">
                    {(editUserDialog.user.name || "U").slice(0, 2)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{editUserDialog.user.name || "Unknown User"}</h3>
                    <p className="text-sm text-muted-foreground">{editUserDialog.user.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Role</p>
                    <p className="font-semibold capitalize">{editUserDialog.user.role?.toLowerCase() || 'User'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Plan</p>
                    <Badge variant="secondary" className={`${editUserDialog.user.plan === 'ENTERPRISE' ? 'bg-[#faf5ff] text-[#a855f7]' : 'bg-primary/10 text-primary'} font-semibold border-none rounded-md px-2 py-0.5 w-fit`}>
                      {editUserDialog.user.plan || "Free"}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                    {editUserDialog.user.isActive ? (
                      <Badge variant="secondary" className="bg-success/15 text-success border-none font-semibold px-2 py-0.5 w-fit">Active</Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-destructive/10 text-destructive border-none font-semibold px-2 py-0.5 w-fit">Suspended</Badge>
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Joined</p>
                    <p className="text-sm">{editUserDialog.user.joined}</p>
                  </div>
                  <div className="space-y-1 col-span-2">
                    <p className="text-sm font-medium text-muted-foreground">Last Active</p>
                    <p className="text-sm">{editUserDialog.user.lastActive}</p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {editUserDialog?.mode !== "plan" && (
                  <>
                    <div className="grid gap-2">
                      <Label htmlFor="edit-name">Name</Label>
                      <Input 
                        id="edit-name" 
                        value={editData.name}
                        onChange={(e) => setEditData({...editData, name: e.target.value})}
                        placeholder="User's full name"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="edit-email">Email</Label>
                      <Input 
                        id="edit-email" 
                        type="email"
                        value={editData.email}
                        onChange={(e) => setEditData({...editData, email: e.target.value})}
                        placeholder="name@example.com"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="edit-role">Role</Label>
                      <Select value={editData.role} onValueChange={(val) => setEditData({...editData, role: val || "MEMBER"})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ADMIN">Admin</SelectItem>
                          <SelectItem value="MEMBER">Member</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
                
                <div className="grid gap-2">
                  <Label htmlFor="edit-plan">Plan</Label>
                  <Select value={editData.plan} onValueChange={(val) => setEditData({...editData, plan: val || "FREE"})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select plan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FREE">Free</SelectItem>
                      <SelectItem value="PRO">Pro</SelectItem>
                      <SelectItem value="ENTERPRISE">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            {editUserDialog?.mode === "view" ? (
              <Button onClick={() => setEditUserDialog(null)}>Close</Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => setEditUserDialog(null)}>Cancel</Button>
                <Button onClick={saveEditUser} disabled={isSavingUser}>
                  {isSavingUser ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Save Changes
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
