"use client"

import React, { createContext, useContext } from 'react'

type SettingsContextType = {
  currency: string;
  timezone: string;
  dateFormat: string;
}

const SettingsContext = createContext<SettingsContextType>({
  currency: "USD ($)",
  timezone: "UTC",
  dateFormat: "MM/DD/YYYY",
})

export function SettingsProvider({ 
  children, 
  initialSettings 
}: { 
  children: React.ReactNode,
  initialSettings: SettingsContextType
}) {
  return (
    <SettingsContext.Provider value={initialSettings}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  return useContext(SettingsContext)
}
