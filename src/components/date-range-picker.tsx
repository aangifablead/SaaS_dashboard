"use client"

import * as React from "react"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"
import { format } from "date-fns"
import { useRouter, useSearchParams } from "next/navigation"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function DatePickerWithRange({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const fromParam = searchParams.get("from")
  const toParam = searchParams.get("to")
  
  const [date, setDate] = React.useState<DateRange | undefined>(() => {
    if (fromParam && toParam) {
      return {
        from: new Date(fromParam),
        to: new Date(toParam),
      }
    }
    return undefined
  })

  // When date changes, update URL
  React.useEffect(() => {
    if (date?.from && date?.to) {
      const params = new URLSearchParams(searchParams.toString())
      params.set("range", "custom")
      params.set("from", format(date.from, "yyyy-MM-dd"))
      params.set("to", format(date.to, "yyyy-MM-dd"))
      router.push(`?${params.toString()}`)
    }
  }, [date, router, searchParams])

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger
          id="date"
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "hidden sm:flex h-8 ml-2 justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date?.from ? (
            date.to ? (
              <>
                {format(date.from, "LLL dd, y")} -{" "}
                {format(date.to, "LLL dd, y")}
              </>
            ) : (
              format(date.from, "LLL dd, y")
            )
          ) : (
            <span>Custom</span>
          )}
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
