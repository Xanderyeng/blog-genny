"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import { LayoutDashboard, FileText, Users, Settings, Menu, PlusCircle, BarChart3, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Articles",
    href: "/admin/articles",
    icon: FileText,
  },
  {
    name: "Generate",
    href: "/admin/generate",
    icon: PlusCircle,
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    name: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
]

interface AdminDashboardLayoutProps {
  children: React.ReactNode
}

export function AdminDashboardLayout({ children }: AdminDashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  const Sidebar = ({ className }: { className?: string }) => (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="flex items-center px-6 border-b h-16">
        <Link href="/admin" className="flex items-center space-x-2">
          <div className="flex justify-center items-center bg-primary rounded-lg w-8 h-8">
            <span className="font-bold text-primary-foreground text-sm">BG</span>
          </div>
          <span className="font-semibold">Blog Genny Admin</span>
        </Link>
      </div>

      {/* Sign Out Button - Right after title */}
      <div className="px-4 py-3 border-b">
        <Button
          variant="ghost"
          size="sm"
          className="justify-start hover:bg-accent w-full text-muted-foreground hover:text-foreground"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut className="mr-3 w-4 h-4" />
          Sign Out
        </Button>
      </div>

      <nav className="flex-1 space-y-1 px-4 py-6">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg font-medium text-sm transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t">
        <div className="flex items-center space-x-3">
          <div className="flex justify-center items-center bg-muted rounded-full w-8 h-8">
            <span className="font-medium text-xs">A</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm">Admin User</p>
            <p className="text-muted-foreground text-xs">admin@blog-genny.com</p>
          </div>
          <Badge variant="secondary" className="text-xs">
            Admin
          </Badge>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex bg-background h-screen">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:border-r lg:w-64">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden top-4 left-4 z-40 fixed bg-background/20 rounded-xl glass">
            <Menu className="w-5 h-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <Sidebar />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="relative flex flex-col flex-1 overflow-hidden">
        {/* Floating Theme Toggle */}
        <div className="top-6 right-6 z-50 fixed">
          <div className="bg-background/20 shadow-lg hover:shadow-xl p-3 rounded-xl transition-all duration-200 glass">
            <ThemeToggle />
          </div>
        </div>

        <main className="flex-1 overflow-y-auto">
          <div className="border-0 glass-light">
            <div className="px-6 py-3.25">
              <h1 className="font-semibold text-2xl">
                {navigation.find((item) => item.href === pathname)?.name || "Dashboard"}
              </h1>
            </div>
          </div>
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  )
}
