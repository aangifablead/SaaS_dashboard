"use client"

import { useState, useRef, useEffect } from "react"
import { Bell, Check, ExternalLink, CheckCircle2, AlertCircle, Info, CheckCheck } from "lucide-react"
import Link from "next/link"
import useSWR from "swr"
import { formatDistanceToNow } from "date-fns"

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const { data, mutate } = useSWR('/api/admin/notifications?unreadOnly=true', fetcher, {
    refreshInterval: 10000, // Poll every 10 seconds
  })

  const notifications = data?.notifications || []
  const unreadCount = notifications.length

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const markAsRead = async (id: string) => {
    // Optimistic update
    mutate({ ...data, notifications: notifications.filter((n: any) => n.id !== id) }, false)
    
    await fetch(`/api/admin/notifications/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
    })
    
    mutate()
  }

  const markAllAsRead = async () => {
    mutate({ ...data, notifications: [] }, false)
    
    await fetch('/api/admin/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'markAllRead' })
    })
    
    mutate()
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case 'error': return <AlertCircle className="h-4 w-4 text-red-500" />
      default: return <Info className="h-4 w-4 text-blue-500" />
    }
  }



  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative text-gray-500 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200"
      >
        <Bell className="size-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500 border border-white"></span>
          </span>
        )}
      </button>

      {isOpen && (
        <>
          {/* Mobile Overlay */}
          <div className="fixed inset-0 z-40 sm:hidden" onClick={() => setIsOpen(false)} />
          
          <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-[380px] bg-white sm:rounded-xl shadow-lg border border-gray-200/70 overflow-hidden z-50 transform origin-top-right transition-all fixed sm:absolute top-14 sm:top-auto right-4 sm:-right-2">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900 text-sm">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="bg-rose-100 text-rose-700 text-[10px] font-semibold px-1.5 py-0.5 rounded-md">
                    {unreadCount} new
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button 
                  onClick={markAllAsRead}
                  className="text-xs text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-1 px-2 py-1 hover:bg-gray-100 rounded-md"
                >
                  <CheckCheck className="h-3.5 w-3.5" /> Mark all read
                </button>
              )}
            </div>
            
            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
              {notifications.length === 0 ? (
                <div className="py-12 px-6 flex flex-col items-center justify-center text-center">
                  <div className="bg-gray-50 h-12 w-12 rounded-full flex items-center justify-center mb-3">
                    <Bell className="h-5 w-5 text-gray-400" />
                  </div>
                  <p className="text-sm font-medium text-gray-900">You're all caught up!</p>
                  <p className="text-xs text-gray-500 mt-1">No new notifications right now.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notifications.map((notif: any) => (
                    <div 
                      key={notif.id} 
                      className={`p-4 hover:bg-gray-50 transition-colors group relative flex gap-3 border-b border-gray-100 ${!notif.isRead ? 'bg-blue-50/20' : 'bg-white'}`}
                    >
                      <div className={`shrink-0 mt-0.5 h-8 w-8 flex items-center justify-center`}>
                        {getIcon(notif.type)}
                      </div>
                      <div className="flex-1 min-w-0 pr-6">
                        <h4 className="text-sm font-semibold text-gray-900 mb-0.5 truncate">{notif.title}</h4>
                        <p className="text-sm text-gray-500 line-clamp-2 leading-snug mb-1">{notif.message}</p>
                        <span className="text-xs text-gray-400">
                          {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      <button 
                        onClick={() => markAsRead(notif.id)}
                        className="absolute top-4 right-4 h-6 w-6 rounded-md bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-400 hover:text-gray-900 hover:border-gray-300 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
                        title="Mark as read"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="border-t border-gray-100">
              <Link 
                href="/admin/notifications"
                onClick={() => setIsOpen(false)}
                className="block w-full py-3 px-4 text-center text-sm text-gray-600 hover:text-gray-900 font-medium hover:bg-gray-50 transition-colors"
              >
                View all notifications
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
