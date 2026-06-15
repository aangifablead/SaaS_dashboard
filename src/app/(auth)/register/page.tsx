import { RegisterForm } from "@/components/auth/register-form"

export const metadata = {
  title: "Create an account - SaaS Dashboard",
  description: "Create your SaaS Kit account today",
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-background p-4 sm:p-8">
      <RegisterForm />
    </div>
  )
}
