import { Suspense } from "react"
import { NewPasswordForm } from "@/components/auth/new-password-form"

export const metadata = {
  title: "New Password - SaaS Dashboard",
  description: "Set your new password",
}

export default function NewPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-background p-4 sm:p-8">
      <Suspense fallback={<div className="animate-pulse flex flex-col items-center justify-center h-64 w-full max-w-md mx-auto bg-white dark:bg-card rounded-2xl shadow-xl border border-border"></div>}>
        <NewPasswordForm />
      </Suspense>
    </div>
  )
}
