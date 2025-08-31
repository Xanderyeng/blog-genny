"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Search, 
  MoreHorizontal, 
  UserCheck, 
  UserX, 
  Crown,
  Mail,
  Calendar,
  Filter,
  Edit,
  Eye,
  Key,
  Trash2Icon
} from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import { ResetPasswordDialog } from "./reset-password-dialog"

interface User {
  id: string
  name: string | null
  email: string
  role: "user" | "admin"
  tier: "free" | "premium"
  image: string | null
  createdAt: string
  stripeSubscriptionId: string | null
  _count?: {
    articles: number
  }
}

export function UsersTable() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [tierFilter, setTierFilter] = useState<string>("all")
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  async function fetchUsers() {
    try {
      const response = await fetch("/api/admin/users")
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users)
      }
    } catch (error) {
      console.error("Failed to fetch users:", error)
      toast.error("Failed to load users")
    } finally {
      setLoading(false)
    }
  }

  async function updateUserRole(userId: string, newRole: "user" | "admin") {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }),
      })

      if (response.ok) {
        setUsers(users.map(user => 
          user.id === userId ? { ...user, role: newRole } : user
        ))
        toast.success(`User role updated to ${newRole}`)
      } else {
        toast.error("Failed to update user role")
      }
    } catch (error) {
      console.error("Error updating user role:", error)
      toast.error("Failed to update user role")
    }
  }

  async function updateUserTier(userId: string, newTier: "free" | "premium") {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tier: newTier }),
      })

      if (response.ok) {
        setUsers(users.map(user => 
          user.id === userId ? { ...user, tier: newTier } : user
        ))
        toast.success(`User tier updated to ${newTier}`)
      } else {
        toast.error("Failed to update user tier")
      }
    } catch (error) {
      console.error("Error updating user tier:", error)
      toast.error("Failed to update user tier")
    }
  }

  const handleResetPasswordClick = (user: User) => {
    setSelectedUser(user)
    setIsResetDialogOpen(true)
  }

  // delete user

  async function deleteUser(userId: string) {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setUsers(users.filter(user => user.id !== userId))
        toast.success("User deleted successfully")
      } else {
        toast.error("Failed to delete user")
      }
    } catch (error) {
      console.error("Error deleting user:", error)
      toast.error("Failed to delete user")
    }
  }

  // Filter users based on search term and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    const matchesTier = tierFilter === "all" || user.tier === tierFilter
    
    return matchesSearch && matchesRole && matchesTier
  })

  function getRoleBadgeVariant(role: string) {
    return role === "admin" ? "default" : "secondary"
  }

  function getTierBadgeVariant(tier: string) {
    return tier === "premium" ? "default" : "outline"
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-muted rounded w-64 h-10 animate-pulse" />
              <div className="bg-muted rounded w-32 h-10 animate-pulse" />
              <div className="bg-muted rounded w-32 h-10 animate-pulse" />
            </div>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-muted rounded h-16 animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Filters - Mobile Responsive */}
            <div className="flex sm:flex-row flex-col sm:items-center gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="top-1/2 left-3 absolute w-4 h-4 text-muted-foreground -translate-y-1/2" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              <div className="flex gap-2">
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-28 sm:w-32">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>

              <Select value={tierFilter} onValueChange={setTierFilter}>
                <SelectTrigger className="w-28 sm:w-32">
                  <SelectValue placeholder="Tier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tiers</SelectItem>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                </SelectContent>
              </Select>
              </div>
            </div>

            {/* Users Table - Mobile Responsive */}
            <div className="border rounded-md overflow-hidden">
              {/* Mobile Card View - Only visible on very small screens */}
              <div className="sm:hidden block">
                <div className="space-y-3 p-4">
                  {filteredUsers.length === 0 ? (
                    <div className="py-8 text-muted-foreground text-center">
                      No users found matching your criteria.
                    </div>
                  ) : (
                    filteredUsers.map((user) => (
                      <Card key={user.id} className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex flex-1 items-center space-x-3 min-w-0">
                            <Avatar className="flex-shrink-0 w-10 h-10">
                              <AvatarImage src={user.image || undefined} />
                              <AvatarFallback>
                                {user.name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium truncate">
                                {user.name || "Unnamed User"}
                              </div>
                              <div className="text-muted-foreground text-sm truncate">
                                {user.email}
                              </div>
                              <div className="flex gap-1 mt-2">
                                <Badge variant={getRoleBadgeVariant(user.role)} className="text-xs">
                                  {user.role}
                                </Badge>
                                <Badge variant={getTierBadgeVariant(user.tier)} className="text-xs">
                                  {user.tier}
                                  {user.tier === "premium" && (
                                    <Crown className="ml-1 w-2 h-2 text-yellow-500" />
                                  )}
                                </Badge>
                              </div>
                              <div className="mt-1 text-muted-foreground text-xs">
                                {user._count?.articles || 0} articles • Joined {new Date(user.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="flex-shrink-0 p-0 w-8 h-8">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem asChild>
                                <Link href={`/admin/users/${user.id}`}>
                                  <Eye className="mr-2 w-4 h-4" />
                                  View Details
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/admin/users/${user.id}`}>
                                  <Edit className="mr-2 w-4 h-4" />
                                  Edit User
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleResetPasswordClick(user)}>
                                <Key className="mr-2 w-4 h-4" />
                                Reset Password
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem asChild>
                                <a href={`mailto:${user.email}`}>
                                  <Mail className="mr-2 w-4 h-4" />
                                  Send Email
                                </a>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </div>

              {/* Desktop Table View - Hidden on mobile */}
              <div className="hidden sm:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[200px]">User</TableHead>
                      <TableHead className="hidden sm:table-cell">Role</TableHead>
                      <TableHead className="hidden sm:table-cell">Tier</TableHead>
                      <TableHead className="hidden md:table-cell">Articles</TableHead>
                      <TableHead className="hidden lg:table-cell">Joined</TableHead>
                      <TableHead className="w-[50px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-muted-foreground text-center">
                        No users found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id} className="hover:bg-muted/50">
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="flex-shrink-0 w-8 h-8">
                              <AvatarImage src={user.image || undefined} />
                              <AvatarFallback>
                                {user.name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium truncate">
                                {user.name || "Unnamed User"}
                              </div>
                              <div className="text-muted-foreground text-sm truncate">
                                {user.email}
                              </div>
                              {/* Mobile-only badges */}
                              <div className="sm:hidden flex gap-1 mt-1">
                                <Badge variant={getRoleBadgeVariant(user.role)} className="text-xs">
                                  {user.role}
                                </Badge>
                                <Badge variant={getTierBadgeVariant(user.tier)} className="text-xs">
                                  {user.tier}
                                  {user.tier === "premium" && (
                                    <Crown className="ml-1 w-2 h-2 text-yellow-500" />
                                  )}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge variant={getRoleBadgeVariant(user.role)}>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <div className="flex items-center space-x-1">
                            <Badge variant={getTierBadgeVariant(user.tier)}>
                              {user.tier}
                            </Badge>
                            {user.tier === "premium" && (
                              <Crown className="w-3 h-3 text-yellow-500" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <span className="text-muted-foreground">
                            {user._count?.articles || 0}
                          </span>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <div className="flex items-center space-x-1 text-muted-foreground text-sm">
                            <Calendar className="w-3 h-3" />
                            <span>
                              {new Date(user.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="p-0 w-8 h-8">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem asChild>
                                <Link href={`/admin/users/${user.id}`}>
                                  <Eye className="mr-2 w-4 h-4" />
                                  View Details
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/admin/users/${user.id}`}>
                                  <Edit className="mr-2 w-4 h-4" />
                                  Edit User
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleResetPasswordClick(user)}>
                                <Key className="mr-2 w-4 h-4" />
                                Reset Password
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem asChild>
                                <a href={`mailto:${user.email}`}>
                                  <Mail className="mr-2 w-4 h-4" />
                                  Send Email
                                </a>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              
                              {/* Role Management */}
                              {user.role === "user" ? (
                                <DropdownMenuItem
                                  onClick={() => updateUserRole(user.id, "admin")}
                                >
                                  <UserCheck className="mr-2 w-4 h-4" />
                                  Make Admin
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem
                                  onClick={() => updateUserRole(user.id, "user")}
                                >
                                  <UserX className="mr-2 w-4 h-4" />
                                  Remove Admin
                                </DropdownMenuItem>
                              )}

                              {/* Tier Management */}
                              {user.tier === "free" ? (
                                <DropdownMenuItem
                                  onClick={() => updateUserTier(user.id, "premium")}
                                >
                                  <Crown className="mr-2 w-4 h-4 text-yellow-600" />
                                  Upgrade to Premium
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem
                                  onClick={() => updateUserTier(user.id, "free")}
                                >
                                  <UserX className="mr-2 w-4 h-4" />
                                  Downgrade to Free
                                </DropdownMenuItem>
                              )}
                              {/* Delete User */}
                              <DropdownMenuItem onClick={() => deleteUser(user.id)} className='bg-red-600/30 hover:bg-red-900/40'>
                                <Trash2Icon className="mr-2 w-4 h-4" />
                                Delete User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      {selectedUser && (
        <ResetPasswordDialog
          open={isResetDialogOpen}
          onOpenChange={setIsResetDialogOpen}
          user={selectedUser}
        />
      )}
    </>
  )
}
