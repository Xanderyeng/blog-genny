import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Protect admin routes
        if (req.nextUrl.pathname.startsWith("/admin")) {
          return token?.role === "admin"
        }
        return true
      },
    },
  }
)

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
}
