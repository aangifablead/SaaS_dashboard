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
import { Search, Plus, Download, MoreHorizontal, Filter, ChevronLeft, ChevronRight } from "lucide-react"

const usersData = [
  { id: "1", name: "Olivia Martin", email: "olivia.martin@email.com", role: "Admin", plan: "Enterprise", planColor: "bg-[#faf5ff] text-[#a855f7]", status: true, joined: "Oct 24, 2026", lastActive: "Just now" },
  { id: "2", name: "Jackson Lee", email: "jackson.lee@email.com", role: "User", plan: "Pro", planColor: "bg-primary/10 text-primary", status: true, joined: "Oct 23, 2026", lastActive: "2 hrs ago" },
  { id: "3", name: "Isabella Nguyen", email: "isabella.nguyen@email.com", role: "Manager", plan: "Pro", planColor: "bg-primary/10 text-primary", status: false, joined: "Oct 20, 2026", lastActive: "5 days ago" },
  { id: "4", name: "William Kim", email: "will@email.com", role: "User", plan: "Free", planColor: "bg-accent text-muted-foreground", status: true, joined: "Oct 18, 2026", lastActive: "Yesterday" },
  { id: "5", name: "Sofia Davis", email: "sofia.davis@email.com", role: "User", plan: "Enterprise", planColor: "bg-[#faf5ff] text-[#a855f7]", status: true, joined: "Oct 15, 2026", lastActive: "3 hrs ago" },
  { id: "6", name: "James Wilson", email: "j.wilson@email.com", role: "User", plan: "Free", planColor: "bg-accent text-muted-foreground", status: false, joined: "Oct 10, 2026", lastActive: "2 weeks ago" },
  { id: "7", name: "Emma Thompson", email: "emma.t@email.com", role: "Manager", plan: "Pro", planColor: "bg-primary/10 text-primary", status: true, joined: "Oct 05, 2026", lastActive: "Today" },
  { id: "8", name: "Liam Garcia", email: "liam.g@email.com", role: "User", plan: "Free", planColor: "bg-accent text-muted-foreground", status: true, joined: "Sep 28, 2026", lastActive: "Yesterday" },
]

export default function UsersPage() {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  
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

  return (
    <div className="flex flex-col gap-8 pb-8">
      {/* HEADER */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Users</h1>
          <Badge variant="secondary" className="bg-primary/10 text-primary border-none rounded-full px-3 py-1 font-semibold text-sm">
            12,234 total
          </Badge>
        </div>
        <div className="flex items-center gap-3">
          <Button className="gap-2 shadow-sm">
            <Plus className="h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      {/* STATS MINI ROW */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Users", value: "12,234" },
          { label: "Active Users", value: "11,892", color: "text-success" },
          { label: "Inactive Users", value: "342", color: "text-muted-foreground" },
          { label: "New This Month", value: "845", color: "text-primary" },
        ].map((stat, i) => (
          <Card key={i} className="shadow-sm">
            <CardContent className="p-4 flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">{stat.label}</span>
              <span className={`text-lg font-bold ${stat.color || "text-foreground"}`}>{stat.value}</span>
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
              <Button variant="outline" size="sm" className="h-8 shadow-sm text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20">Delete</Button>
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
                        {user.name.slice(0, 2)}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm text-foreground">{user.name}</span>
                        <span className="text-xs text-muted-foreground">{user.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-medium text-foreground">{user.role}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={`${user.planColor} hover:${user.planColor} font-semibold border-none rounded-md px-2 py-0.5`}>
                      {user.plan}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch checked={user.status} />
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{user.joined}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{user.lastActive}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[160px] rounded-xl shadow-lg border-border">
                        <DropdownMenuItem className="cursor-pointer font-medium">View Profile</DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer font-medium">Edit User</DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer font-medium">Change Plan</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer font-medium text-warning focus:text-warning">Suspend User</DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer font-medium text-destructive focus:text-destructive">Delete User</DropdownMenuItem>
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
            Showing <span className="font-medium text-foreground">1-8</span> of <span className="font-medium text-foreground">12,234</span> users
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="h-8 w-8 shadow-sm" disabled>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" className="h-8 w-8 p-0 bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground border-primary shadow-sm">1</Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">2</Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">3</Button>
              <span className="px-2">...</span>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">1,529</Button>
            </div>
            <Button variant="outline" size="icon" className="h-8 w-8 shadow-sm">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
