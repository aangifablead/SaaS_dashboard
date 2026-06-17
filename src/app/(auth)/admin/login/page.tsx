import { AdminLoginForm } from "@/components/auth/admin-login-form"

export const metadata = {
  title: "Admin Login - SaaS Dashboard",
  description: "Login to the admin dashboard",
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-background p-4 sm:p-8">
      <AdminLoginForm />
    </div>
  )
}
