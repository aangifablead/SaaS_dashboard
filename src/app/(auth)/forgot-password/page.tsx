import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"

export const metadata = {
  title: "Forgot Password - SaaS Dashboard",
  description: "Reset your password",
}

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-background p-4 sm:p-8">
      <ForgotPasswordForm />
    </div>
  )
}
