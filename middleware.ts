import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Check auth condition
  const authRoutes = ["/login", "/register", "/forgot-password", "/reset-password"]
  const isAuthRoute = authRoutes.some((route) => req.nextUrl.pathname.startsWith(route))

  // Protected routes
  const protectedRoutes = ["/profile", "/submit", "/idea/*/edit"]
  const isProtectedRoute = protectedRoutes.some((route) => {
    if (route.includes("*")) {
      const routeParts = route.split("*")
      return (
        req.nextUrl.pathname.startsWith(routeParts[0]) &&
        (routeParts.length === 1 || req.nextUrl.pathname.endsWith(routeParts[1]))
      )
    }
    return req.nextUrl.pathname.startsWith(route)
  })

  // Admin routes
  const adminRoutes = ["/admin"]
  const isAdminRoute = adminRoutes.some((route) => req.nextUrl.pathname.startsWith(route))

  // Redirect if needed
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL("/", req.url))
  }

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  // For admin routes, we would typically check a role or permission
  // This is a simplified check - in a real app, you'd check a role in the database
  if (isAdminRoute && (!session || !session.user.email?.includes("admin"))) {
    return NextResponse.redirect(new URL("/", req.url))
  }

  return res
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
