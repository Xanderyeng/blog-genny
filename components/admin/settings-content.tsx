"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Settings, 
  Globe, 
  Mail, 
  Shield, 
  Database, 
  Palette, 
  Bell,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Info
} from "lucide-react"
import { toast } from "sonner"

interface BlogSettings {
  // General Settings
  siteName: string
  siteDescription: string
  siteUrl: string
  adminEmail: string
  
  // Content Settings
  articlesPerPage: number
  enableComments: boolean
  enableNewsletter: boolean
  requireModeration: boolean
  
  // SEO Settings
  defaultMetaTitle: string
  defaultMetaDescription: string
  enableSitemap: boolean
  enableRobots: boolean
  
  // Security Settings
  enableTwoFactor: boolean
  maxLoginAttempts: number
  sessionTimeout: number
  
  // AI Settings
  aiProvider: string
  maxTokensPerGeneration: number
  enableAutoPublish: boolean
  autoPublishDelay: number
  
  // Notification Settings
  emailNotifications: boolean
  slackNotifications: boolean
  webhookUrl: string
}

export function SettingsContent() {
  const [settings, setSettings] = useState<BlogSettings>({
    // General Settings
    siteName: "Blog Genny",
    siteDescription: "AI-Powered Blog Generation Platform",
    siteUrl: "https://your-blog.com",
    adminEmail: "admin@blog.com",
    
    // Content Settings
    articlesPerPage: 10,
    enableComments: true,
    enableNewsletter: false,
    requireModeration: true,
    
    // SEO Settings
    defaultMetaTitle: "Blog Genny - AI Blog Generator",
    defaultMetaDescription: "Generate high-quality blog content with AI",
    enableSitemap: true,
    enableRobots: true,
    
    // Security Settings
    enableTwoFactor: false,
    maxLoginAttempts: 5,
    sessionTimeout: 24,
    
    // AI Settings
    aiProvider: "gemini",
    maxTokensPerGeneration: 2000,
    enableAutoPublish: false,
    autoPublishDelay: 2,
    
    // Notification Settings
    emailNotifications: true,
    slackNotifications: false,
    webhookUrl: ""
  })

  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  // Load settings on component mount
  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/settings")
      if (response.ok) {
        const data = await response.json()
        setSettings(data)
      } else {
        throw new Error("Failed to fetch settings")
      }
    } catch (error) {
      console.error("Failed to load settings:", error)
      toast.error("Failed to load settings")
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    setSaving(true)
    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      })

      if (response.ok) {
        const updatedSettings = await response.json()
        setSettings(updatedSettings)
        toast.success("Settings saved successfully")
      } else {
        throw new Error("Failed to save settings")
      }
    } catch (error) {
      console.error("Failed to save settings:", error)
      toast.error("Failed to save settings")
    } finally {
      setSaving(false)
    }
  }

  const resetToDefaults = async () => {
    if (confirm("Are you sure you want to reset all settings to defaults? This action cannot be undone.")) {
      setSaving(true)
      try {
        const response = await fetch("/api/admin/settings", {
          method: "POST",
        })

        if (response.ok) {
          const defaultSettings = await response.json()
          setSettings(defaultSettings)
          toast.success("Settings reset to defaults")
        } else {
          throw new Error("Failed to reset settings")
        }
      } catch (error) {
        console.error("Failed to reset settings:", error)
        toast.error("Failed to reset settings")
      } finally {
        setSaving(false)
      }
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-96 bg-muted animate-pulse rounded-lg" />
        <div className="h-64 bg-muted animate-pulse rounded-lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">General</span>
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Content</span>
          </TabsTrigger>
          <TabsTrigger value="seo" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">SEO</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="ai" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            <span className="hidden sm:inline">AI</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                General Settings
              </CardTitle>
              <CardDescription>
                Basic configuration for your blog
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={settings.siteName}
                    onChange={(e) => setSettings(prev => ({ ...prev, siteName: e.target.value }))}
                    placeholder="Your Blog Name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siteUrl">Site URL</Label>
                  <Input
                    id="siteUrl"
                    value={settings.siteUrl}
                    onChange={(e) => setSettings(prev => ({ ...prev, siteUrl: e.target.value }))}
                    placeholder="https://your-blog.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteDescription">Site Description</Label>
                <Textarea
                  id="siteDescription"
                  value={settings.siteDescription}
                  onChange={(e) => setSettings(prev => ({ ...prev, siteDescription: e.target.value }))}
                  placeholder="A brief description of your blog"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="adminEmail">Admin Email</Label>
                <Input
                  id="adminEmail"
                  type="email"
                  value={settings.adminEmail}
                  onChange={(e) => setSettings(prev => ({ ...prev, adminEmail: e.target.value }))}
                  placeholder="admin@yourblog.com"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content Settings */}
        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Content Settings
              </CardTitle>
              <CardDescription>
                Configure how content is displayed and managed
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="articlesPerPage">Articles Per Page</Label>
                <Select 
                  value={settings.articlesPerPage.toString()} 
                  onValueChange={(value) => setSettings(prev => ({ ...prev, articlesPerPage: parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 articles</SelectItem>
                    <SelectItem value="10">10 articles</SelectItem>
                    <SelectItem value="15">15 articles</SelectItem>
                    <SelectItem value="20">20 articles</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Comments</Label>
                    <p className="text-sm text-muted-foreground">Allow readers to comment on articles</p>
                  </div>
                  <Switch
                    checked={settings.enableComments}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableComments: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Newsletter</Label>
                    <p className="text-sm text-muted-foreground">Allow users to subscribe to newsletter</p>
                  </div>
                  <Switch
                    checked={settings.enableNewsletter}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableNewsletter: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Moderation</Label>
                    <p className="text-sm text-muted-foreground">Comments require approval before publishing</p>
                  </div>
                  <Switch
                    checked={settings.requireModeration}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, requireModeration: checked }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO Settings */}
        <TabsContent value="seo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                SEO Settings
              </CardTitle>
              <CardDescription>
                Search engine optimization configuration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="defaultMetaTitle">Default Meta Title</Label>
                <Input
                  id="defaultMetaTitle"
                  value={settings.defaultMetaTitle}
                  onChange={(e) => setSettings(prev => ({ ...prev, defaultMetaTitle: e.target.value }))}
                  placeholder="Default title for pages"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="defaultMetaDescription">Default Meta Description</Label>
                <Textarea
                  id="defaultMetaDescription"
                  value={settings.defaultMetaDescription}
                  onChange={(e) => setSettings(prev => ({ ...prev, defaultMetaDescription: e.target.value }))}
                  placeholder="Default description for pages"
                  rows={3}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Sitemap</Label>
                    <p className="text-sm text-muted-foreground">Generate sitemap.xml for search engines</p>
                  </div>
                  <Switch
                    checked={settings.enableSitemap}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableSitemap: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Robots.txt</Label>
                    <p className="text-sm text-muted-foreground">Generate robots.txt for search crawlers</p>
                  </div>
                  <Switch
                    checked={settings.enableRobots}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableRobots: checked }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
              <CardDescription>
                Configure security and authentication settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Require 2FA for admin accounts</p>
                </div>
                <Switch
                  checked={settings.enableTwoFactor}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableTwoFactor: checked }))}
                />
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                  <Select 
                    value={settings.maxLoginAttempts.toString()} 
                    onValueChange={(value) => setSettings(prev => ({ ...prev, maxLoginAttempts: parseInt(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 attempts</SelectItem>
                      <SelectItem value="5">5 attempts</SelectItem>
                      <SelectItem value="10">10 attempts</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Session Timeout (hours)</Label>
                  <Select 
                    value={settings.sessionTimeout.toString()} 
                    onValueChange={(value) => setSettings(prev => ({ ...prev, sessionTimeout: parseInt(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 hour</SelectItem>
                      <SelectItem value="8">8 hours</SelectItem>
                      <SelectItem value="24">24 hours</SelectItem>
                      <SelectItem value="168">1 week</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800 dark:text-yellow-200">Security Notice</h4>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                      Enabling two-factor authentication and limiting login attempts will enhance your blog&apos;s security.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Settings */}
        <TabsContent value="ai" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                AI Configuration
              </CardTitle>
              <CardDescription>
                Configure AI content generation settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="aiProvider">AI Provider</Label>
                <Select 
                  value={settings.aiProvider} 
                  onValueChange={(value) => setSettings(prev => ({ ...prev, aiProvider: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gemini">Google Gemini</SelectItem>
                    <SelectItem value="openai">OpenAI GPT</SelectItem>
                    <SelectItem value="claude">Anthropic Claude</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxTokens">Max Tokens Per Generation</Label>
                <Select 
                  value={settings.maxTokensPerGeneration.toString()} 
                  onValueChange={(value) => setSettings(prev => ({ ...prev, maxTokensPerGeneration: parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1000">1,000 tokens</SelectItem>
                    <SelectItem value="2000">2,000 tokens</SelectItem>
                    <SelectItem value="4000">4,000 tokens</SelectItem>
                    <SelectItem value="8000">8,000 tokens</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Auto-Publish</Label>
                    <p className="text-sm text-muted-foreground">Automatically publish generated articles</p>
                  </div>
                  <Switch
                    checked={settings.enableAutoPublish}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableAutoPublish: checked }))}
                  />
                </div>

                {settings.enableAutoPublish && (
                  <div className="space-y-2">
                    <Label htmlFor="autoPublishDelay">Auto-Publish Delay (minutes)</Label>
                    <Select 
                      value={settings.autoPublishDelay.toString()} 
                      onValueChange={(value) => setSettings(prev => ({ ...prev, autoPublishDelay: parseInt(value) }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 minute</SelectItem>
                        <SelectItem value="2">2 minutes</SelectItem>
                        <SelectItem value="5">5 minutes</SelectItem>
                        <SelectItem value="10">10 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-800 dark:text-blue-200">AI Usage</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                      Higher token limits allow for longer, more detailed articles but may increase costs.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Settings
              </CardTitle>
              <CardDescription>
                Configure how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, emailNotifications: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Slack Notifications</Label>
                    <p className="text-sm text-muted-foreground">Send notifications to Slack channel</p>
                  </div>
                  <Switch
                    checked={settings.slackNotifications}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, slackNotifications: checked }))}
                  />
                </div>
              </div>

              {settings.slackNotifications && (
                <div className="space-y-2">
                  <Label htmlFor="webhookUrl">Slack Webhook URL</Label>
                  <Input
                    id="webhookUrl"
                    value={settings.webhookUrl}
                    onChange={(e) => setSettings(prev => ({ ...prev, webhookUrl: e.target.value }))}
                    placeholder="https://hooks.slack.com/services/..."
                  />
                </div>
              )}

              <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-green-800 dark:text-green-200">Stay Informed</h4>
                    <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                      Notifications help you stay updated on article generation, user activity, and system events.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6 border-t">
        <Button
          variant="outline"
          onClick={resetToDefaults}
          disabled={saving}
          className="w-full sm:w-auto"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          {saving ? "Resetting..." : "Reset to Defaults"}
        </Button>

        <Button
          onClick={saveSettings}
          disabled={saving}
          className="w-full sm:w-auto"
        >
          <Save className="mr-2 h-4 w-4" />
          {saving ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  )
}
