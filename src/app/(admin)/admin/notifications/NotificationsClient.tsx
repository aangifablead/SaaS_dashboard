"use client"

import { useState } from "react"
import useSWR from "swr"
import { Trash2, Check, CheckCircle2, AlertCircle, Info, Trash, Loader2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function NotificationsClient() {
  const [page, setPage] = useState(1)
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all')
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [deleteAllConfirm, setDeleteAllConfirm] = useState(false)
  const limit = 10
  
  const { data, error, isLoading, mutate } = useSWR(`/api/admin/notifications?page=${page}&limit=${limit}${activeTab === 'unread' ? '&unreadOnly=true' : ''}`, fetcher, {
    refreshInterval: 10000,
  })

  const notifications = data?.notifications || []
  const totalPages = data?.totalPages || 1
  const totalCount = data?.totalCount || 0

  const markAsRead = async (id: string) => {
    const updatedNotifs = notifications.map((n: any) => 
      n.id === id ? { ...n, isRead: true } : n
    )
    mutate({ ...data, notifications: updatedNotifs }, false)

    await fetch(`/api/admin/notifications/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
    })
    
    // Global mutate for the bell dropdown
    mutate()
  }

  const deleteNotification = async (id: string) => {
    setDeleteConfirmId(null)
    mutate({ ...data, notifications: notifications.filter((n: any) => n.id !== id) }, false)

    await fetch(`/api/admin/notifications/${id}`, {
      method: 'DELETE',
    })
    
    mutate()
  }

  const deleteAll = async () => {
    setDeleteAllConfirm(false)
    mutate({ ...data, notifications: [], totalCount: 0, totalPages: 0 }, false)

    await fetch('/api/admin/notifications', {
      method: 'DELETE',
    })
    
    mutate()
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case 'warning': return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case 'error': return <AlertCircle className="h-5 w-5 text-red-500" />
      default: return <Info className="h-5 w-5 text-blue-500" />
    }
  }



  return (
    <div className="w-full">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-[#eef2ff] to-white rounded-xl shadow-sm border border-[#c7d2fe] px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => window.history.back()}
            className="p-2 hover:bg-indigo-100 rounded-full transition-colors"
            title="Go Back"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-[#0f172a]">Notifications</h1>
            <span className="bg-white/60 text-[#0f172a] text-xs font-semibold px-2.5 py-0.5 rounded-full border border-indigo-100">
              {totalCount} Total
            </span>
          </div>
        </div>
        
        {totalCount > 0 && (
          <button 
            onClick={() => setDeleteAllConfirm(true)}
            className="inline-flex items-center px-3 py-1.5 text-rose-600 hover:bg-rose-50 rounded-lg text-sm transition-colors border border-transparent hover:border-rose-100 bg-white shadow-sm sm:shadow-none sm:bg-transparent"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear History
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <button 
          onClick={() => { setActiveTab('all'); setPage(1); }}
          className={`px-4 py-1.5 text-sm rounded-full transition-colors ${activeTab === 'all' ? 'bg-gray-900 text-white font-medium' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          All
        </button>
        <button 
          onClick={() => { setActiveTab('unread'); setPage(1); }}
          className={`px-4 py-1.5 text-sm rounded-full transition-colors ${activeTab === 'unread' ? 'bg-gray-900 text-white font-medium' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          Unread
        </button>
      </div>

      {/* List Container */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200/70 overflow-hidden">
        
        {/* Loading State */}
        {isLoading && (
          <div className="divide-y divide-gray-100">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-5 flex gap-4 animate-pulse">
                <div className="h-8 w-8 rounded-full bg-gray-200 shrink-0"></div>
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-rose-600 text-center p-8 bg-rose-50/50">
            Failed to load notifications. Please try again later.
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && notifications.length === 0 && (
          <div className="py-24 px-6 flex flex-col items-center justify-center text-center">
            <div className="bg-gray-50 h-16 w-16 rounded-full flex items-center justify-center mb-4 border border-gray-100">
              <Check className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-lg font-semibold text-gray-900">You're all caught up!</p>
            <p className="text-sm text-gray-500 mt-1 max-w-sm">When you receive new system alerts or user notifications, they will appear here.</p>
          </div>
        )}

        {/* Notifications List */}
        {!isLoading && !error && notifications.length > 0 && (
          <div className="divide-y divide-gray-100">
            {notifications.map((notif: any) => (
              <div 
                key={notif.id} 
                className={`p-5 flex gap-4 transition-colors ${!notif.isRead ? 'bg-white' : 'bg-gray-50/50 opacity-75'}`}
              >
                {/* Icon */}
                <div className={`shrink-0 mt-0.5 h-8 w-8 rounded-full flex items-center justify-center`}>
                  {getIcon(notif.type)}
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0 flex flex-col sm:flex-row gap-4 justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className={`text-sm ${!notif.isRead ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                        {notif.title}
                      </h4>
                      {!notif.isRead && (
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-500 leading-relaxed mb-2 max-w-3xl">
                      {notif.message}
                    </p>
                    
                    <span className="text-xs text-gray-400">
                      {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  
                  {/* Persistent Actions */}
                  <div className="flex items-start gap-2 shrink-0 pt-1">
                    {!notif.isRead && (
                      <button 
                        onClick={() => markAsRead(notif.id)}
                        className="inline-flex items-center px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                      >
                        <Check className="h-3.5 w-3.5 mr-1.5" /> Mark read
                      </button>
                    )}
                    <button 
                      onClick={() => setDeleteConfirmId(notif.id)}
                      className="inline-flex items-center px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-colors"
                    >
                      <Trash className="h-3.5 w-3.5 mr-1.5" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
            <p className="text-sm text-gray-500">
              Page <span className="font-medium text-gray-900">{page}</span> of <span className="font-medium text-gray-900">{totalPages}</span>
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {(deleteConfirmId || deleteAllConfirm) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex shrink-0 items-center justify-center h-10 w-10 rounded-full bg-rose-100">
                  <AlertCircle className="h-5 w-5 text-rose-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {deleteAllConfirm ? "Delete all notifications?" : "Delete notification?"}
                </h3>
              </div>
              <p className="text-sm text-gray-500 pl-13">
                {deleteAllConfirm 
                  ? "Are you sure you want to permanently delete all notifications? This action cannot be undone."
                  : "Are you sure you want to delete this notification? This action cannot be undone."}
              </p>
            </div>
            <div className="px-6 py-4 bg-gray-50 flex items-center justify-end gap-3 rounded-b-xl border-t border-gray-100">
              <button
                onClick={() => {
                  setDeleteConfirmId(null)
                  setDeleteAllConfirm(false)
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (deleteAllConfirm) deleteAll()
                  else if (deleteConfirmId) deleteNotification(deleteConfirmId)
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-rose-600 rounded-lg hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 shadow-sm"
              >
                {deleteAllConfirm ? "Delete All" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
