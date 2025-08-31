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
        <div className="flex sm:flex-row flex-col sm:justify-between sm:items-center gap-4">
          <div className="space-y-1">
            {/* <h1 className="font-bold text-2xl sm:text-3xl tracking-tight">Users</h1> */}
            <p className="text-muted-foreground text-sm sm:text-base">
              Manage user accounts, roles, and subscriptions
            </p>
          </div>
          <Button asChild className="self-start sm:self-auto">
            <Link href="/admin/users/new">
              <Plus className="mr-2 w-4 h-4" />
              <span className="hidden sm:inline">Add User</span>
              <span className="sm:hidden">Add</span>
            </Link>
          </Button>
        </div>

      {/* Statistics Section */}
      <Suspense fallback={
        <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-muted rounded-lg h-24 animate-pulse" />
          ))}
        </div>
      }>
        <UsersStats />
      </Suspense>

      {/* Users Table Section */}
      <Suspense fallback={
        <div className="bg-muted rounded-lg h-96 animate-pulse" />
      }>
        <UsersTable />
      </Suspense>
      </div>
    </AdminDashboardLayout>
  )
}
