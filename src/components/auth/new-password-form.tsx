"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Hexagon, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { resetPassword } from "@/actions/reset-password"
import { useSearchParams } from "next/navigation"

export function NewPasswordForm() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (!token) {
      setError("Missing reset token. Please check your email link.")
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.")
      setLoading(false)
      return
    }

    try {
      const formData = new FormData()
      formData.append("token", token)
      formData.append("password", password)

      const res = await resetPassword(formData)
      if (res.success) {
        setSuccess(true)
      } else {
        setError(res.error || "Failed to reset password.")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="w-full max-w-md mx-auto bg-white dark:bg-card rounded-2xl shadow-xl border border-border overflow-hidden">
        <div className="p-8 sm:p-10 flex flex-col items-center text-center">
          <div className="h-16 w-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 mb-6">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground mb-2">Password reset!</h2>
          <p className="text-muted-foreground mb-8">
            Your password has been successfully reset. You can now log in with your new password.
          </p>
          <Link href="/login" className="w-full">
            <Button className="w-full h-11 rounded-xl text-base font-medium shadow-sm">
              Log in to your account
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-card rounded-2xl shadow-xl border border-border overflow-hidden">
      <div className="p-8 sm:p-10">
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="h-12 w-12 bg-primary rounded-xl flex items-center justify-center text-primary-foreground mb-4 shadow-sm">
            <Hexagon className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Set new password</h1>
          <p className="text-sm text-muted-foreground mt-2 text-center">
            Enter your new password below.
          </p>
        </div>

        {!token ? (
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium text-center mb-4">
            Invalid or missing reset token. Please use the exact link from your email.
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium text-center">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="password" className="font-semibold text-foreground">New Password</Label>
            <Input 
              id="password" 
              type="password" 
              placeholder="••••••••" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              disabled={!token}
              className="h-11 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="font-semibold text-foreground">Confirm New Password</Label>
            <Input 
              id="confirmPassword" 
              type="password" 
              placeholder="••••••••" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              required 
              disabled={!token}
              className="h-11 rounded-xl"
            />
          </div>

          <Button type="submit" disabled={loading || !token} className="w-full h-11 rounded-xl text-base font-medium shadow-sm">
            {loading ? "Resetting..." : "Reset password"}
          </Button>
        </form>

        <div className="mt-8 text-center text-sm">
          <Link href="/login" className="font-semibold text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Back to login
          </Link>
        </div>
      </div>
    </div>
  )
}
