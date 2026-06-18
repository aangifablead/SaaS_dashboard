"use client"

import { ReactNode, useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { signOut } from "next-auth/react"
import {
  LayoutDashboard,
  Users,
  Building2,
  TrendingUp,
  Mail,
  Settings,
  ExternalLink,
  LogOut,
  Bell,
  Menu,
  X,
  User
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu"
import NotificationBell from "./NotificationBell"

export default function AdminLayoutClient({ children, user, platformName = "Admin", logo }: { children: ReactNode, user: { name: string, email: string, image: string }, platformName?: string, logo?: string }) {
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  const getAvatarSrc = (image?: string) => {
    if (!image) return "";
    return image.startsWith("http") ? image : "";
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0][0].toUpperCase();
  };
  const initial = getInitials(user.name || "");

  const pathParts = pathname.split('/').filter(Boolean)
  const pageName = pathParts.length > 1 ? pathParts[1].charAt(0).toUpperCase() + pathParts[1].slice(1) : "Dashboard"
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  const isActive = (path: string) => {
    if (path === '/admin' && pathname !== '/admin') return false
    if (pathname.startsWith(path)) return true
    return false
  }

  const sidebarContent = (
    <>
      <div className="p-6 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-2 text-white font-bold text-xl truncate">
          {logo ? (
            <img src={logo} alt={platformName} className="h-8 w-8 object-contain rounded" />
          ) : (
            <span className="truncate">⚡ {platformName}</span>
          )}
        </Link>
        <button 
          className="md:hidden text-gray-400 hover:text-white" 
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 px-4 py-2 flex flex-col overflow-y-auto">
        <div className="space-y-1">
          <Link
            href="/admin"
            className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
              isActive('/admin') ? 'bg-[#6366f1] text-white' : 'hover:bg-[#1e293b] hover:text-white'
            }`}
          >
            <LayoutDashboard className="size-5 shrink-0" />
            Dashboard
          </Link>
          <Link
            href="/admin/users"
            className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
              isActive('/admin/users') ? 'bg-[#6366f1] text-white' : 'hover:bg-[#1e293b] hover:text-white'
            }`}
          >
            <Users className="size-5 shrink-0" />
            Users
          </Link>
          <Link
            href="/admin/organizations"
            className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
              isActive('/admin/organizations') ? 'bg-[#6366f1] text-white' : 'hover:bg-[#1e293b] hover:text-white'
            }`}
          >
            <Building2 className="size-5 shrink-0" />
            Organizations
          </Link>
          <Link
            href="/admin/revenue"
            className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
              isActive('/admin/revenue') ? 'bg-[#6366f1] text-white' : 'hover:bg-[#1e293b] hover:text-white'
            }`}
          >
            <TrendingUp className="size-5 shrink-0" />
            Revenue
          </Link>
          <Link
            href="/admin/emails"
            className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
              isActive('/admin/emails') ? 'bg-[#6366f1] text-white' : 'hover:bg-[#1e293b] hover:text-white'
            }`}
          >
            <Mail className="size-5 shrink-0" />
            Emails
          </Link>
          <Link
            href="/admin/settings"
            className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
              isActive('/admin/settings') ? 'bg-[#6366f1] text-white' : 'hover:bg-[#1e293b] hover:text-white'
            }`}
          >
            <Settings className="size-5 shrink-0" />
            Settings
          </Link>
        </div>

        <div className="mt-auto pt-4 space-y-1">
          <div className="mb-4 border-t border-[#1e293b]" />
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[#1e293b] hover:text-white transition-colors"
          >
            <ExternalLink className="size-5 shrink-0" />
            View Site
          </Link>
          <button onClick={() => signOut({ callbackUrl: '/login' })} className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-red-500/10 hover:text-red-500 transition-colors text-left">
            <LogOut className="size-5 shrink-0" />
            Log Out
          </button>
        </div>
      </nav>

      <div className="p-4 border-t border-[#1e293b]">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border border-gray-700 bg-gray-800 shrink-0">
            <AvatarImage src={getAvatarSrc(user.image)} />
            <AvatarFallback className="bg-gray-800 text-gray-200 font-semibold">
              {initial}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-white truncate">{user.name}</p>
            <p className="text-xs text-gray-400 truncate">{user.email}</p>
          </div>
        </div>
      </div>
    </>
  )

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={() => setIsMobileMenuOpen(false)} 
        />
      )}

      {/* Sidebar - Desktop & Mobile */}
      <aside 
        className={`w-64 bg-[#0f172a] text-gray-300 flex flex-col shrink-0 fixed inset-y-0 left-0 z-50 md:static transition-transform duration-300 ease-in-out shadow-xl md:shadow-none ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b bg-white flex items-center justify-between px-4 sm:px-6 shrink-0">
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <button 
              className="md:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-md"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2 truncate">
              <span className="hidden sm:inline truncate max-w-[120px]">{platformName}</span> 
              <span className="hidden sm:inline text-gray-300">/</span> 
              <span className="font-medium text-gray-900 sm:font-normal sm:text-gray-500 truncate">{pageName}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <NotificationBell />
            
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 hover:bg-gray-100 p-1 rounded-full sm:rounded-md sm:px-2 transition-colors focus:outline-none">
                <span className="text-sm font-medium hidden sm:inline">{user.name}</span>
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarImage src={getAvatarSrc(user.image)} />
                  <AvatarFallback className="bg-indigo-100 text-indigo-700 font-semibold text-xs">
                    {initial}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/admin/profile')} className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/admin/settings/smtp')} className="cursor-pointer">
                  <Mail className="mr-2 h-4 w-4" />
                  <span>SMTP Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/login' })} className="text-rose-600 cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <div className="flex-1 p-4 sm:p-6 overflow-y-auto overflow-x-hidden relative">
          {children}
        </div>
      </main>
    </div>
  )
}
