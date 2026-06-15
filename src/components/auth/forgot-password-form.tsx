"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Hexagon, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { sendPasswordResetEmail } from "@/actions/reset-password"

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await sendPasswordResetEmail(email)
      if (res.success) {
        setSuccess(true)
      } else {
        setError(res.error || "Failed to send reset email.")
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
          <h2 className="text-2xl font-bold tracking-tight text-foreground mb-2">Check your email</h2>
          <p className="text-muted-foreground mb-8">
            We sent a password reset link to <br />
            <span className="font-semibold text-foreground">{email}</span>
          </p>
          <Link href="/login" className="w-full">
            <Button className="w-full h-11 rounded-xl text-base font-medium shadow-sm">
              Return to login
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
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Forgot password?</h1>
          <p className="text-sm text-muted-foreground mt-2 text-center">
            No worries, we'll send you reset instructions.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium text-center">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email" className="font-semibold text-foreground">Email address</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="name@example.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              className="h-11 rounded-xl"
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full h-11 rounded-xl text-base font-medium shadow-sm">
            {loading ? "Sending link..." : "Send reset link"}
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
