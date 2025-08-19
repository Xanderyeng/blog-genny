import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import type { NextRequest } from "next/server"

export default auth((req: NextRequest & { auth: any }) => {
  if (req.nextUrl.pathname.startsWith("/admin")) {
    if (!req.auth || req.auth.user?.role !== "admin") {
      return NextResponse.redirect(new URL("/auth/signin", req.url))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
}
