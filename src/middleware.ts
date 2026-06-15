import NextAuth from "next-auth"
import authConfig from "@/auth.config"

const { auth } = NextAuth({
  ...authConfig,
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard') || nextUrl.pathname.startsWith('/org')
      
      if (isOnDashboard) {
        if (isLoggedIn) return true
        return false // Redirect unauthenticated users to login page
      } else if (isLoggedIn && (nextUrl.pathname === '/login' || nextUrl.pathname === '/register')) {
        return Response.redirect(new URL('/dashboard', nextUrl))
      }
      
      return true
    },
  },
})

export default auth

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
