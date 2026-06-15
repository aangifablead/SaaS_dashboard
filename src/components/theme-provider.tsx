"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  // Initialize accent color on load
  React.useEffect(() => {
    const savedColor = localStorage.getItem("accent-color")
    if (savedColor) {
      applyAccentColor(savedColor)
    }
  }, [])

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

export const applyAccentColor = (color: string) => {
  const root = document.documentElement
  root.style.setProperty("--primary", color)
  root.style.setProperty("--ring", color)
  root.style.setProperty("--sidebar-primary", color)
  root.style.setProperty("--sidebar-ring", color)
  // Ensure text is white on colored background in dark mode
  root.style.setProperty("--primary-foreground", "#ffffff")
  localStorage.setItem("accent-color", color)
}
