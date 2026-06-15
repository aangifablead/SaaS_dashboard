import { LoginForm } from "@/components/auth/login-form"

export const metadata = {
  title: "Login - SaaS Dashboard",
  description: "Login to your account",
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-background p-4 sm:p-8">
      <LoginForm />
    </div>
  )
}
