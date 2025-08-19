import { Suspense } from "react"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { AdminDashboardLayout } from "@/components/admin-dashboard-layout"
import { SettingsContent } from "@/components/admin/settings-content"

export default async function SettingsPage() {
  const session = await getServerSession(authOptions)
  
  // Check if user is authenticated and is admin
  if (!session?.user || session.user.role !== "admin") {
    redirect("/auth/signin")
  }

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage your blog configuration and preferences
          </p>
        </div>

        <Suspense fallback={
          <div className="space-y-6">
            <div className="h-96 bg-muted animate-pulse rounded-lg" />
            <div className="h-64 bg-muted animate-pulse rounded-lg" />
          </div>
        }>
          <SettingsContent />
        </Suspense>
      </div>
    </AdminDashboardLayout>
  )
}
