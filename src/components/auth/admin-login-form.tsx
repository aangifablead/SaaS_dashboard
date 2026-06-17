"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield } from "lucide-react"
import { loginUser } from "@/actions/auth"

export function AdminLoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const formData = new FormData()
    formData.append("email", email)
    formData.append("password", password)
    formData.append("redirectTo", "/admin")

    try {
      const res = await loginUser(formData)
      if (res.success) {
        window.location.href = "/admin"
      } else if (res.error) {
        setError(res.error)
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during login")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-card rounded-2xl shadow-xl border border-border overflow-hidden">
      <div className="p-8 sm:p-10">
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="h-12 w-12 bg-red-600 rounded-xl flex items-center justify-center text-white mb-4 shadow-sm">
            <Shield className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Admin Portal</h1>
          <p className="text-sm text-muted-foreground mt-2">Enter your admin credentials</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium text-center">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="font-semibold text-foreground">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="admin@example.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              className="h-11 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="font-semibold text-foreground">Password</Label>
            </div>
            <Input 
              id="password" 
              type="password" 
              placeholder="••••••••" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              className="h-11 rounded-xl"
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full h-11 rounded-xl text-base font-medium shadow-sm bg-red-600 hover:bg-red-700 text-white">
            {loading ? "Authenticating..." : "Login to Admin"}
          </Button>
        </form>
      </div>
    </div>
  )
}
