"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileSettings } from "@/components/settings/profile-settings"
import { AppearanceSettings } from "@/components/settings/appearance-settings"
import { NotificationSettings } from "@/components/settings/notification-settings"
import { BillingSettings } from "@/components/settings/billing-settings"
import { SecuritySettings } from "@/components/settings/security-settings"
import { 
  User, 
  Palette, 
  Bell, 
  CreditCard, 
  Shield,
  Settings as SettingsIcon
} from "lucide-react"

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

interface PremiumSettingsProps {
  user: UserType
}

export function PremiumSettings({ user }: PremiumSettingsProps) {
  const isPremium = user.tier === "premium"
  const isAdmin = user.role === "admin"

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account preferences and subscription settings.
        </p>
      </div>
      
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
          <TabsTrigger value="profile" className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center space-x-2">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Appearance</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center space-x-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          {(isPremium || isAdmin) && (
            <TabsTrigger value="billing" className="flex items-center space-x-2">
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">Billing</span>
            </TabsTrigger>
          )}
          <TabsTrigger value="security" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileSettings user={user} />
        </TabsContent>

        <TabsContent value="appearance">
          <AppearanceSettings user={user} />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationSettings user={user} />
        </TabsContent>

        {(isPremium || isAdmin) && (
          <TabsContent value="billing">
            <BillingSettings user={user} />
          </TabsContent>
        )}

        <TabsContent value="security">
          <SecuritySettings user={user} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
