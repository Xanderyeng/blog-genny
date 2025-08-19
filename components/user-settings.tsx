"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  User, 
  Mail, 
  Calendar, 
  Crown, 
  Settings, 
  Shield,
  CreditCard,
  Bell,
  Lock,
  Trash2,
  Upload
} from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

type UserType = {
  id: string
  name: string | null
  email: string
  image: string | null
  role: "user" | "admin"
  tier: "free" | "premium"
  createdAt: Date
  stripeCustomerId: string | null
  stripeSubscriptionId: string | null
  stripePriceId: string | null
  stripeCurrentPeriodEnd: Date | null
}

interface UserSettingsProps {
  user: UserType
}

export function UserSettings({ user }: UserSettingsProps) {
  const [name, setName] = useState(user.name || "")
  const [isUpdating, setIsUpdating] = useState(false)
  const router = useRouter()

  const isPremium = user.tier === "premium"
  const isAdmin = user.role === "admin"

  const handleUpdateProfile = async () => {
    setIsUpdating(true)
    try {
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      })

      if (response.ok) {
        toast.success("Profile updated successfully!")
        router.refresh()
      } else {
        toast.error("Failed to update profile")
      }
    } catch (error) {
      toast.error("An error occurred")
    } finally {
      setIsUpdating(false)
    }
  }

  const getInitials = (name: string | null, email: string) => {
    if (name) {
      return name.split(" ").map(n => n[0]).join("").toUpperCase()
    }
    return email[0].toUpperCase()
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(date))
  }

  return (
    <div className="space-y-6">
      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Profile Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.image || ""} alt={user.name || "User"} />
              <AvatarFallback className="text-lg">
                {getInitials(user.name, user.email)}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Change Avatar
              </Button>
              <p className="text-xs text-muted-foreground">
                JPG, PNG or GIF. Max size 2MB.
              </p>
            </div>
          </div>

          <Separator />

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Display Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                value={user.email}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                Email cannot be changed
              </p>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleUpdateProfile} disabled={isUpdating}>
              {isUpdating ? "Updating..." : "Save Changes"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Account Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Account Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Member Since</span>
              </div>
              <span className="text-sm">{formatDate(user.createdAt)}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center space-x-2">
                <Crown className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Account Type</span>
              </div>
              <Badge variant={isPremium ? "default" : "secondary"}>
                {isPremium ? "Premium" : "Free"}
              </Badge>
            </div>

            {isAdmin && (
              <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Settings className="h-4 w-4 text-red-600" />
                  <span className="text-sm font-medium">Role</span>
                </div>
                <Badge variant="destructive">Administrator</Badge>
              </div>
            )}

            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Email Status</span>
              </div>
              <Badge variant="default">Verified</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subscription Management - Premium Users */}
      {isPremium && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5" />
              <span>Subscription</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-lg border">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <Crown className="h-5 w-5 text-purple-600" />
                  <span className="font-semibold">Premium Subscription</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {user.stripeCurrentPeriodEnd 
                    ? `Next billing date: ${formatDate(user.stripeCurrentPeriodEnd)}`
                    : "Active subscription"
                  }
                </p>
              </div>
              <div className="space-x-2">
                <Button variant="outline" size="sm">
                  Manage Billing
                </Button>
                <Button variant="destructive" size="sm">
                  Cancel Subscription
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upgrade Section - Free Users */}
      {!isPremium && !isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Crown className="h-5 w-5" />
              <span>Upgrade to Premium</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 p-6 rounded-lg border">
              <h3 className="font-semibold mb-2">Unlock Premium Features</h3>
              <ul className="text-sm text-muted-foreground space-y-1 mb-4">
                <li>• Unlimited article generation</li>
                <li>• Advanced analytics and insights</li>
                <li>• Priority AI processing</li>
                <li>• Custom branding options</li>
                <li>• Priority support</li>
              </ul>
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                <Crown className="h-4 w-4 mr-2" />
                Upgrade for $9.99/month
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <span>Notification Preferences</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-muted-foreground">Receive updates about your articles</p>
              </div>
              <Button variant="outline" size="sm">
                Configure
              </Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Marketing Emails</p>
                <p className="text-sm text-muted-foreground">Updates about new features and tips</p>
              </div>
              <Button variant="outline" size="sm">
                Configure
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lock className="h-5 w-5" />
            <span>Security</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Change Password</p>
                <p className="text-sm text-muted-foreground">Update your account password</p>
              </div>
              <Button variant="outline" size="sm">
                Change
              </Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Two-Factor Authentication</p>
                <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
              </div>
              <Button variant="outline" size="sm">
                Enable
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200 dark:border-red-800">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-red-600 dark:text-red-400">
            <Trash2 className="h-5 w-5" />
            <span>Danger Zone</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
            <div>
              <p className="font-medium text-red-800 dark:text-red-200">Delete Account</p>
              <p className="text-sm text-red-600 dark:text-red-400">
                Permanently delete your account and all associated data
              </p>
            </div>
            <Button variant="destructive" size="sm">
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
