import { Suspense } from "react"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { AdminDashboardLayout } from "@/components/admin-dashboard-layout"
import { UsersTable } from "@/components/admin/users-table"
import { UsersStats } from "@/components/admin/users-stats"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default async function UsersPage() {
  const session = await getServerSession(authOptions)
  
  // Check if user is authenticated and is admin
  if (!session?.user || session.user.role !== "admin") {
    redirect("/auth/signin")
  }

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Users</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Manage user accounts, roles, and subscriptions
            </p>
          </div>
          <Button asChild className="self-start sm:self-auto">
            <Link href="/admin/users/new">
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Add User</span>
              <span className="sm:hidden">Add</span>
            </Link>
          </Button>
        </div>

      {/* Statistics Section */}
      <Suspense fallback={
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      }>
        <UsersStats />
      </Suspense>

      {/* Users Table Section */}
      <Suspense fallback={
        <div className="bg-muted animate-pulse rounded-lg h-96" />
      }>
        <UsersTable />
      </Suspense>
      </div>
    </AdminDashboardLayout>
  )
}
