"use client"

import { useState, useRef, useEffect } from "react"
import { Bell, Check, CheckCircle2, AlertCircle, Info, CheckCheck } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { getDashboardNotifications, markNotificationAsRead, markAllNotificationsAsRead } from "@/actions/notifications"
import { Badge } from "@/components/ui/badge"

export default function DashboardNotificationBell() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  
  const [notifications, setNotifications] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  const fetchNotifications = async () => {
    const data = await getDashboardNotifications()
    setNotifications(data.notifications)
    setUnreadCount(data.unreadCount)
  }

  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 15000)
    return () => clearInterval(interval)
  }, [])

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

  const handleMarkAsRead = async (id: string) => {
    // Optimistic update
    setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n))
    setUnreadCount(prev => Math.max(0, prev - 1))
    
    await markNotificationAsRead(id)
    fetchNotifications()
  }

  const handleMarkAllAsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
    setUnreadCount(0)
    
    await markAllNotificationsAsRead()
    fetchNotifications()
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
        className="relative flex items-center justify-center h-10 w-10 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted transition-colors focus:outline-none"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 rounded-full bg-destructive border-2 border-background">
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40 sm:hidden" onClick={() => setIsOpen(false)} />
          
          <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-[380px] bg-card sm:rounded-xl shadow-lg border border-border overflow-hidden z-50 transform origin-top-right transition-all fixed sm:absolute top-14 sm:top-auto right-4 sm:-right-2">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground text-sm">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="bg-destructive/10 text-destructive text-[10px] font-semibold px-1.5 py-0.5 rounded-md">
                    {unreadCount} new
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button 
                  onClick={handleMarkAllAsRead}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 px-2 py-1 hover:bg-muted rounded-md"
                >
                  <CheckCheck className="h-3.5 w-3.5" /> Mark all read
                </button>
              )}
            </div>
            
            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
              {notifications.length === 0 ? (
                <div className="py-12 px-6 flex flex-col items-center justify-center text-center">
                  <div className="bg-muted h-12 w-12 rounded-full flex items-center justify-center mb-3">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium text-foreground">You're all caught up!</p>
                  <p className="text-xs text-muted-foreground mt-1">No new notifications right now.</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {notifications.map((notif: any) => (
                    <div 
                      key={notif._id} 
                      className={`p-4 hover:bg-muted/50 transition-colors group relative flex gap-3 border-b border-border ${!notif.isRead ? 'bg-primary/5' : 'bg-card'}`}
                    >
                      <div className={`shrink-0 mt-0.5 h-8 w-8 flex items-center justify-center`}>
                        {getIcon(notif.type)}
                      </div>
                      <div className="flex-1 min-w-0 pr-6">
                        <h4 className="text-sm font-semibold text-foreground mb-0.5 truncate">{notif.title}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-2 leading-snug mb-1">{notif.message}</p>
                        <span className="text-xs text-muted-foreground/70">
                          {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      {!notif.isRead && (
                        <button 
                          onClick={() => handleMarkAsRead(notif._id)}
                          className="absolute top-4 right-4 h-6 w-6 rounded-md bg-background border border-border shadow-sm flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-border/80 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
                          title="Mark as read"
                        >
                          <Check className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="border-t border-border">
              <Link 
                href="/dashboard/notifications"
                onClick={() => setIsOpen(false)}
                className="block w-full py-3 px-4 text-center text-sm text-muted-foreground hover:text-foreground font-medium hover:bg-muted/50 transition-colors"
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
