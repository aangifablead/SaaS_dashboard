import { getPaginatedNotifications } from "@/actions/notifications"
import { CheckCircle2, AlertCircle, Info, Bell, Check } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export const dynamic = "force-dynamic"

export default async function NotificationsPage({
  searchParams,
}: {
  searchParams: { page?: string }
}) {
  const currentPage = Number(searchParams.page) || 1
  const limit = 10
  
  const { notifications, totalPages } = await getPaginatedNotifications(currentPage, limit)

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case 'warning': return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case 'error': return <AlertCircle className="h-5 w-5 text-red-500" />
      default: return <Info className="h-5 w-5 text-blue-500" />
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground mt-1">
            Stay up to date with your account activity and project alerts.
          </p>
        </div>
        <Link href="/dashboard" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground bg-muted/50 hover:bg-muted px-3 py-2 rounded-md transition-colors mt-1">
          <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </Link>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <CardTitle>All Notifications</CardTitle>
            <CardDescription>
              Showing page {currentPage} of {Math.max(1, totalPages)}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {notifications.length === 0 ? (
            <div className="py-12 px-6 flex flex-col items-center justify-center text-center">
              <div className="bg-muted h-12 w-12 rounded-full flex items-center justify-center mb-3">
                <Bell className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground">You're all caught up!</p>
              <p className="text-xs text-muted-foreground mt-1">No notifications found.</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {notifications.map((notif: any) => (
                <div 
                  key={notif._id} 
                  className={`p-6 flex gap-4 ${!notif.isRead ? 'bg-primary/5' : 'bg-card'}`}
                >
                  <div className={`shrink-0 mt-0.5 h-10 w-10 bg-background rounded-full border shadow-sm flex items-center justify-center`}>
                    {getIcon(notif.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base font-semibold text-foreground mb-1">{notif.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-2">{notif.message}</p>
                    <span className="text-xs font-medium text-muted-foreground/70">
                      {new Date(notif.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          {currentPage > 1 ? (
            <Button
              variant="outline"
              render={<Link href={`/dashboard/notifications?page=${currentPage - 1}`} />}
            >
              Previous
            </Button>
          ) : (
            <Button variant="outline" disabled>Previous</Button>
          )}

          <div className="flex items-center gap-1 mx-2">
            {Array.from({ length: totalPages }).map((_, i) => {
              const page = i + 1;
              return page !== currentPage ? (
                <Button
                  key={page}
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  render={<Link href={`/dashboard/notifications?page=${page}`} />}
                >
                  {page}
                </Button>
              ) : (
                <Button
                  key={page}
                  variant="default"
                  size="icon"
                  className="h-8 w-8"
                >
                  {page}
                </Button>
              )
            })}
          </div>

          {currentPage < totalPages ? (
            <Button
              variant="outline"
              render={<Link href={`/dashboard/notifications?page=${currentPage + 1}`} />}
            >
              Next
            </Button>
          ) : (
            <Button variant="outline" disabled>Next</Button>
          )}
        </div>
      )}
    </div>
  )
}
