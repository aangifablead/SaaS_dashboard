import Link from "next/link"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { UserNav } from "@/components/user-nav"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LayoutDashboard, Settings, CreditCard, Menu, Hexagon, LogOut, Users, Zap, Bell, Search } from "lucide-react"
import { SidebarNav } from "@/components/sidebar-nav"
import { Badge } from "@/components/ui/badge"
import { LogoutButton } from "@/components/logout-button"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  
  if (!session) {
    redirect("/login")
  }

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-20 hidden md:flex w-[240px] flex-col bg-card border-r shadow-[2px_0_8px_rgba(0,0,0,0.04)]">
        <div className="flex h-16 items-center px-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg text-foreground">
            <div className="h-8 w-8 bg-black rounded-lg flex items-center justify-center text-white">
              <Hexagon className="h-5 w-5" />
            </div>
            SaaS Kit
          </Link>
        </div>
        <div className="flex-1 flex flex-col justify-between h-full overflow-y-auto">
          <nav className="grid items-start px-4 mt-6 space-y-1">
            <SidebarNav />
          </nav>
          
          <div className="p-4 mt-auto border-t border-border bg-muted/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary shrink-0 border border-primary/20">
                {session.user?.name?.slice(0, 2).toUpperCase() || "US"}
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-semibold truncate text-foreground">{session.user?.name}</span>
                <span className="text-xs text-muted-foreground truncate">{session.user?.email}</span>
              </div>
            </div>
            <LogoutButton />
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-col md:pl-[240px] w-full min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-card/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-card/60 sm:px-6">
          <Sheet>
            <SheetTrigger className="md:hidden flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] p-0">
              <div className="flex h-16 items-center px-6 border-b">
                <Link href="/" className="flex items-center gap-2 font-bold text-lg text-foreground">
                  <div className="h-8 w-8 bg-black rounded-lg flex items-center justify-center text-white">
                    <Hexagon className="h-5 w-5" />
                  </div>
                  SaaS Kit
                </Link>
              </div>
              <nav className="grid gap-2 p-4 text-lg font-medium">
                <SidebarNav />
              </nav>
            </SheetContent>
          </Sheet>
          
          <div className="flex-1 flex justify-center max-w-2xl mx-auto hidden sm:flex">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search anything..."
                className="w-full bg-muted/50 shadow-none appearance-none pl-9 rounded-xl border-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:bg-background"
              />
            </div>
          </div>
          
          <div className="flex items-center justify-end gap-4 ml-auto">
            <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-muted">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 rounded-full bg-destructive border-2 border-background">3</Badge>
            </Button>
            <div className="h-8 w-px bg-border mx-1"></div>
            <UserNav user={session.user!} />
          </div>
        </header>
        
        {/* Page Content */}
        <main className="flex-1 p-6 md:p-8 lg:p-10 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  )
}
