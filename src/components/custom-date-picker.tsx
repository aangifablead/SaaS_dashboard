"use client"

import { useRouter } from "next/navigation"
import { Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CustomDatePicker() {
  const router = useRouter()
  return (
    <div className="relative hidden sm:flex ml-2">
      <input
        type="date"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        onChange={(e) => {
          if (e.target.value) {
            router.push(`?range=custom&from=${e.target.value}`)
          }
        }}
      />
      <Button variant="outline" size="sm" className="h-8 pointer-events-none">
        <Calendar className="mr-2 h-4 w-4" />
        Custom
      </Button>
    </div>
  )
}
