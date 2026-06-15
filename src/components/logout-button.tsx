"use client"

import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"

export function LogoutButton() {
  return (
    <Button 
      variant="outline" 
      onClick={() => signOut({ callbackUrl: "/login", redirect: true })}
      className="w-full justify-center gap-2 text-muted-foreground hover:text-destructive hover:border-destructive/30 hover:bg-destructive/10 transition-colors"
    >
      <LogOut className="h-4 w-4" />
      Logout
    </Button>
  )
}
