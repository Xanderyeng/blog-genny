"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Bell, 
  Mail, 
  Smartphone, 
  Globe,
  FileText,
  Users,
  TrendingUp,
  Calendar,
  Heart,
  MessageSquare,
  Settings,
  Volume2,
  VolumeX
} from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

type UserType = {
  id: string
  name: string | null
  email: string
  tier: "free" | "premium"
}

interface NotificationSettingsProps {
  user: UserType
}

export function NotificationSettings({ user }: NotificationSettingsProps) {
  const [emailNotifications, setEmailNotifications] = useState({
    newArticles: true,
    weeklyDigest: true,
    accountUpdates: true,
    marketingEmails: false,
    securityAlerts: true,
    comments: true,
    likes: false,
    follows: true,
    mentions: true,
  })

  const [pushNotifications, setPushNotifications] = useState({
    browserNotifications: false,
    mobileNotifications: false,
  })

  const [topicSubscriptions, setTopicSubscriptions] = useState({
    technology: true,
    webDevelopment: true,
    ai: false,
    design: false,
    business: false,
    productivity: true,
    tutorials: true,
    news: false,
  })

  const [soundEnabled, setSoundEnabled] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const isPremium = user.tier === "premium"

  const topics = [
    { key: "technology", label: "Technology", icon: Globe },
    { key: "webDevelopment", label: "Web Development", icon: FileText },
    { key: "ai", label: "Artificial Intelligence", icon: TrendingUp },
    { key: "design", label: "Design", icon: Smartphone },
    { key: "business", label: "Business", icon: Users },
    { key: "productivity", label: "Productivity", icon: Calendar },
    { key: "tutorials", label: "Tutorials", icon: FileText },
    { key: "news", label: "Tech News", icon: Bell },
  ]

  const handleEmailToggle = (key: string, value: boolean) => {
    setEmailNotifications(prev => ({ ...prev, [key]: value }))
  }

  const handleTopicToggle = (key: string, value: boolean) => {
    setTopicSubscriptions(prev => ({ ...prev, [key]: value }))
  }

  const saveNotificationSettings = async () => {
    setIsSaving(true)
    try {
      const response = await fetch("/api/user/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emailNotifications,
          pushNotifications,
          topicSubscriptions,
          soundEnabled,
        }),
      })

      if (response.ok) {
        toast.success("Notification settings saved!")
      } else {
        toast.error("Failed to save settings")
      }
    } catch (error) {
      toast.error("An error occurred")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Email Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mail className="h-5 w-5" />
            <span>Email Notifications</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm font-medium">New Articles</Label>
                <p className="text-xs text-muted-foreground">
                  Get notified when new articles are published in your subscribed topics
                </p>
              </div>
              <Switch
                checked={emailNotifications.newArticles}
                onCheckedChange={(value) => handleEmailToggle("newArticles", value)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm font-medium">Weekly Digest</Label>
                <p className="text-xs text-muted-foreground">
                  Weekly summary of trending articles and updates
                </p>
              </div>
              <Switch
                checked={emailNotifications.weeklyDigest}
                onCheckedChange={(value) => handleEmailToggle("weeklyDigest", value)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <Label className="text-sm font-medium">Comments & Interactions</Label>
                  <Badge variant="secondary" className="text-xs">Premium</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Notifications for comments, likes, and mentions on your articles
                </p>
              </div>
              <Switch
                checked={emailNotifications.comments}
                onCheckedChange={(value) => handleEmailToggle("comments", value)}
                disabled={!isPremium}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm font-medium">Account Updates</Label>
                <p className="text-xs text-muted-foreground">
                  Important updates about your account and billing
                </p>
              </div>
              <Switch
                checked={emailNotifications.accountUpdates}
                onCheckedChange={(value) => handleEmailToggle("accountUpdates", value)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm font-medium">Security Alerts</Label>
                <p className="text-xs text-muted-foreground">
                  Security-related notifications and login alerts
                </p>
              </div>
              <Switch
                checked={emailNotifications.securityAlerts}
                onCheckedChange={(value) => handleEmailToggle("securityAlerts", value)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm font-medium">Marketing Emails</Label>
                <p className="text-xs text-muted-foreground">
                  Product updates, features, and promotional content
                </p>
              </div>
              <Switch
                checked={emailNotifications.marketingEmails}
                onCheckedChange={(value) => handleEmailToggle("marketingEmails", value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Topic Subscriptions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Topic Subscriptions</span>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Choose topics you want to receive notifications about when new articles are published.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {topics.map((topic) => {
              const Icon = topic.icon
              return (
                <div key={topic.key} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                    <Label className="text-sm font-medium cursor-pointer">
                      {topic.label}
                    </Label>
                  </div>
                  <Switch
                    checked={topicSubscriptions[topic.key as keyof typeof topicSubscriptions]}
                    onCheckedChange={(value) => handleTopicToggle(topic.key, value)}
                  />
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Push Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <span>Push Notifications</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Label className="text-sm font-medium">Browser Notifications</Label>
                <Badge variant="secondary" className="text-xs">Premium</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Receive notifications in your browser when new content is available
              </p>
            </div>
            <Switch
              checked={pushNotifications.browserNotifications}
              onCheckedChange={(value) => 
                setPushNotifications(prev => ({ ...prev, browserNotifications: value }))
              }
              disabled={!isPremium}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Label className="text-sm font-medium">Mobile Notifications</Label>
                <Badge variant="secondary" className="text-xs">Coming Soon</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Get notifications on your mobile device
              </p>
            </div>
            <Switch
              checked={pushNotifications.mobileNotifications}
              onCheckedChange={(value) => 
                setPushNotifications(prev => ({ ...prev, mobileNotifications: value }))
              }
              disabled={true}
            />
          </div>
        </CardContent>
      </Card>

      {/* Sound Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            {soundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
            <span>Sound Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Notification Sounds</Label>
              <p className="text-xs text-muted-foreground">
                Play sounds when receiving notifications
              </p>
            </div>
            <Switch
              checked={soundEnabled}
              onCheckedChange={setSoundEnabled}
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={saveNotificationSettings} disabled={isSaving} size="lg">
          {isSaving ? "Saving..." : "Save Notification Settings"}
        </Button>
      </div>

      {/* Premium Upgrade */}
      {!isPremium && (
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 border-purple-200 dark:border-purple-800">
          <CardContent className="p-6 text-center">
            <Bell className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Unlock Premium Notifications</h3>
            <p className="text-muted-foreground mb-4">
              Get real-time browser notifications, comment alerts, and advanced notification customization.
            </p>
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
              Upgrade to Premium
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
