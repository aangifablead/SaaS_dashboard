import NextAuth from "next-auth"
import authConfig from "@/auth.config"

const { auth } = NextAuth(authConfig)

const publicRoutes = [
  '/',
  '/login',
  '/admin/login',
  '/register',
  '/forgot-password',
  '/billing/success',
  '/join',
  '/docs',
  '/api/webhooks/stripe',
  '/new-password'
]

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth
  let userRole = (req.auth?.user as any)?.role || "USER"
  
  // Failsafe for admin
  if (req.auth?.user?.email === "admin@gmail.com") {
    userRole = "ADMIN"
  }

  const isPublicRoute = publicRoutes.includes(nextUrl.pathname)
  const isAuthRoute = nextUrl.pathname === '/login' || nextUrl.pathname === '/register' || nextUrl.pathname === '/forgot-password'
  const isDashboardRoute = nextUrl.pathname.startsWith('/dashboard') || nextUrl.pathname.startsWith('/org') || nextUrl.pathname.startsWith('/settings') || nextUrl.pathname.startsWith('/billing') || nextUrl.pathname.startsWith('/analytics')
  const isAdminRoute = nextUrl.pathname.startsWith('/admin')

  // 1. If accessing auth routes (login/register) while logged in -> redirect to /dashboard
  if (isAuthRoute && isLoggedIn) {
    return Response.redirect(new URL('/dashboard', nextUrl))
  }

  // 2. If accessing admin routes without ADMIN role -> redirect to /admin/login
  if (isAdminRoute) {
    if (nextUrl.pathname === '/admin/login') {
      if (isLoggedIn && userRole === "ADMIN") {
        return Response.redirect(new URL('/admin', nextUrl))
      }
      return // allow viewing admin login page
    }

    if (!isLoggedIn) {
      return Response.redirect(new URL('/admin/login', nextUrl))
    }
    if (userRole !== "ADMIN") {
      return Response.redirect(new URL('/dashboard', nextUrl))
    }
    return // allow
  }

  // 3. If accessing protected routes without login -> redirect to /login
  if (isDashboardRoute && !isLoggedIn) {
    return Response.redirect(new URL('/login', nextUrl))
  }

  return // allow
})

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
