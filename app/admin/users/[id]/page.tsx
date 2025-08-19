"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { AdminDashboardLayout } from "@/components/admin-dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, Save, Trash2, User } from "lucide-react"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface UserData {
  id: string
  name: string | null
  email: string
  role: "user" | "admin"
  tier: "free" | "premium"
  createdAt: string
  updatedAt: string
}

interface UserPageProps {
  params: Promise<{ id: string }>
}

export default function UserPage({ params }: UserPageProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "user" as "user" | "admin",
    tier: "free" as "free" | "premium"
  })
  const [userId, setUserId] = useState<string>("")

  // Get the user ID from params
  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params
      setUserId(resolvedParams.id)
    }
    getParams()
  }, [params])

  // Redirect if not admin
  useEffect(() => {
    if (status === "loading") return
    if (!session?.user || session.user.role !== "admin") {
      router.push("/admin")
      return
    }
  }, [session, status, router])

  // Fetch user data
  useEffect(() => {
    if (!userId) return
    
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/admin/users/${userId}`)
        if (!response.ok) {
          if (response.status === 404) {
            toast.error("User not found")
            router.push("/admin/users")
            return
          }
          throw new Error("Failed to fetch user")
        }
        
        const userData = await response.json()
        setUser(userData)
        setFormData({
          name: userData.name || "",
          email: userData.email,
          role: userData.role,
          tier: userData.tier
        })
      } catch (error) {
        console.error("Error fetching user:", error)
        toast.error("Failed to load user data")
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [userId, router])

  const handleSave = async () => {
    if (!user) return

    setSaving(true)
    try {
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to update user")
      }

      const updatedUser = await response.json()
      setUser(updatedUser)
      toast.success("User updated successfully")
    } catch (error) {
      console.error("Error updating user:", error)
      toast.error(error instanceof Error ? error.message : "Failed to update user")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!user) return

    setDeleting(true)
    try {
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to delete user")
      }

      toast.success("User deleted successfully")
      router.push("/admin/users")
    } catch (error) {
      console.error("Error deleting user:", error)
      toast.error(error instanceof Error ? error.message : "Failed to delete user")
    } finally {
      setDeleting(false)
    }
  }

  if (status === "loading" || loading) {
    return (
      <AdminDashboardLayout>
        <div className="space-y-6 max-w-4xl">
          <div className="mb-6">
            <Skeleton className="h-8 w-32 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Skeleton className="h-4 w-16 mb-2" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div>
                  <Skeleton className="h-4 w-16 mb-2" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Skeleton className="h-4 w-16 mb-2" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div>
                  <Skeleton className="h-4 w-16 mb-2" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </AdminDashboardLayout>
    )
  }

  if (!user) {
    return null
  }

  const isOwnAccount = session?.user?.id === user.id

  return (
    <AdminDashboardLayout>
      <div className="space-y-6 max-w-4xl">
        {/* Header Section */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push("/admin/users")}
            className="mb-4 -ml-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Back to Users</span>
            <span className="sm:hidden">Back</span>
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage user details and permissions
          </p>
        </div>

      {/* User Details Form */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <User className="h-5 w-5" />
              User Details
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Update user information and permissions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter user name"
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role" className="text-sm font-medium">Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value: "user" | "admin") => 
                    setFormData(prev => ({ ...prev, role: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem 
                      value="admin" 
                      disabled={isOwnAccount}
                    >
                      Admin
                    </SelectItem>
                  </SelectContent>
                </Select>
                {isOwnAccount && formData.role === "admin" && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Cannot modify your own admin role
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="tier" className="text-sm font-medium">Tier</Label>
                <Select
                  value={formData.tier}
                  onValueChange={(value: "free" | "premium") => 
                    setFormData(prev => ({ ...prev, tier: value }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Current Status Display */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Current Role</Label>
                <div>
                  <Badge variant={user.role === "admin" ? "default" : "secondary"} className="text-sm">
                    {user.role}
                  </Badge>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Current Tier</Label>
                <div>
                  <Badge variant={user.tier === "premium" ? "default" : "outline"} className="text-sm">
                    {user.tier}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t">
              <div className="space-y-1">
                <Label className="text-sm font-medium">Account Created</Label>
                <p className="text-sm text-muted-foreground">
                  {new Date(user.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div className="space-y-1">
                <Label className="text-sm font-medium">Last Updated</Label>
                <p className="text-sm text-muted-foreground">
                  {new Date(user.updatedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4">
          <div className="order-2 sm:order-1">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="destructive" 
                  disabled={isOwnAccount || deleting}
                  className="w-full sm:w-auto"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete User
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="mx-4">
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete User</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this user? This action cannot be undone.
                    All user data and associated content will be permanently removed.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                  <AlertDialogCancel className="w-full sm:w-auto">Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="w-full sm:w-auto bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete User
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {isOwnAccount && (
              <p className="text-xs text-muted-foreground mt-2 text-center sm:text-left">
                Cannot delete your own account
              </p>
            )}
          </div>

          <div className="order-1 sm:order-2">
            <Button 
              onClick={handleSave} 
              disabled={saving}
              className="w-full sm:w-auto"
            >
              <Save className="mr-2 h-4 w-4" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
        </div>
      </div>
    </AdminDashboardLayout>
  )
}
