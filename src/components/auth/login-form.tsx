"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { loginUser } from "@/actions/auth"
import { useRouter } from "next/navigation"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const formData = new FormData()
    formData.append("email", email)
    formData.append("password", password)

    try {
      const res = await loginUser(formData)
      if (res.success) {
        // Force hard navigation to refresh the session
        window.location.href = "/dashboard"
      }
    } catch (err: any) {
      setError(err.message || "An error occurred")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, nextFieldId: string) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      document.getElementById(nextFieldId)?.focus()
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto mt-10">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold tracking-tight">Login to your account</CardTitle>
        <CardDescription>Enter your email below to login to your account</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="m@example.com" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => handleKeyDown(e, 'password')} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => handleKeyDown(e, 'submit-btn')} required />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button id="submit-btn" type="submit" className="w-full">Login</Button>
          <div className="text-sm text-center text-muted-foreground">
            Don't have an account? <Link href="/register" className="text-primary hover:underline">Sign up</Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}
