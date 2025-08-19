"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Shield, 
  Lock, 
  Key,
  Smartphone,
  AlertTriangle,
  CheckCircle,
  Eye,
  EyeOff,
  Clock,
  MapPin,
  Monitor,
  Trash2,
  LogOut
} from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

type UserType = {
  id: string
  name: string | null
  email: string
  tier: "free" | "premium"
}

interface SecuritySettingsProps {
  user: UserType
}

export function SecuritySettings({ user }: SecuritySettingsProps) {
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [isEnabling2FA, setIsEnabling2FA] = useState(false)

  const isPremium = user.tier === "premium"

  // Mock login sessions data
  const mockSessions = [
    {
      id: "1",
      device: "Chrome on Windows",
      location: "New York, US",
      lastActive: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      isCurrent: true,
    },
    {
      id: "2",
      device: "Safari on iPhone",
      location: "New York, US",
      lastActive: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      isCurrent: false,
    },
    {
      id: "3",
      device: "Chrome on MacOS",
      location: "Boston, US",
      lastActive: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      isCurrent: false,
    },
  ]

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords don't match")
      return
    }

    if (passwordData.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long")
      return
    }

    setIsChangingPassword(true)
    try {
      const response = await fetch("/api/user/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      })

      if (response.ok) {
        toast.success("Password changed successfully!")
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
      } else {
        toast.error("Failed to change password")
      }
    } catch (error) {
      toast.error("An error occurred")
    } finally {
      setIsChangingPassword(false)
    }
  }

  const handleEnable2FA = async () => {
    setIsEnabling2FA(true)
    try {
      const response = await fetch("/api/user/2fa/enable", {
        method: "POST",
      })

      if (response.ok) {
        const { qrCode, secret } = await response.json()
        // In a real app, you'd show a modal with QR code and secret
        toast.success("Two-factor authentication enabled!")
        setTwoFactorEnabled(true)
      } else {
        toast.error("Failed to enable 2FA")
      }
    } catch (error) {
      toast.error("An error occurred")
    } finally {
      setIsEnabling2FA(false)
    }
  }

  const handleDisable2FA = async () => {
    try {
      const response = await fetch("/api/user/2fa/disable", {
        method: "POST",
      })

      if (response.ok) {
        toast.success("Two-factor authentication disabled!")
        setTwoFactorEnabled(false)
      } else {
        toast.error("Failed to disable 2FA")
      }
    } catch (error) {
      toast.error("An error occurred")
    }
  }

  const handleTerminateSession = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/user/sessions/${sessionId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast.success("Session terminated successfully!")
      } else {
        toast.error("Failed to terminate session")
      }
    } catch (error) {
      toast.error("An error occurred")
    }
  }

  const formatLastActive = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMins < 60) {
      return `${diffMins} minutes ago`
    } else if (diffHours < 24) {
      return `${diffHours} hours ago`
    } else {
      return `${diffDays} days ago`
    }
  }

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }))
  }

  return (
    <div className="space-y-6">
      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lock className="h-5 w-5" />
            <span>Change Password</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showPasswords.current ? "text" : "password"}
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                placeholder="Enter your current password"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => togglePasswordVisibility("current")}
              >
                {showPasswords.current ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showPasswords.new ? "text" : "password"}
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                placeholder="Enter your new password"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => togglePasswordVisibility("new")}
              >
                {showPasswords.new ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showPasswords.confirm ? "text" : "password"}
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                placeholder="Confirm your new password"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => togglePasswordVisibility("confirm")}
              >
                {showPasswords.confirm ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="pt-2">
            <Button 
              onClick={handlePasswordChange} 
              disabled={isChangingPassword || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
            >
              {isChangingPassword ? "Changing..." : "Change Password"}
            </Button>
          </div>

          <div className="text-xs text-muted-foreground space-y-1">
            <p>Password requirements:</p>
            <ul className="ml-4 space-y-1">
              <li>• At least 8 characters long</li>
              <li>• Include uppercase and lowercase letters</li>
              <li>• Include at least one number</li>
              <li>• Include at least one special character</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Two-Factor Authentication */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Smartphone className="h-5 w-5" />
            <span>Two-Factor Authentication</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <p className="font-medium">Two-Factor Authentication</p>
                {twoFactorEnabled ? (
                  <Badge variant="default" className="bg-green-600">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Enabled
                  </Badge>
                ) : (
                  <Badge variant="secondary">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Disabled
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {twoFactorEnabled 
                  ? "Your account is protected with 2FA" 
                  : "Add an extra layer of security to your account"
                }
              </p>
            </div>
            
            <div>
              {twoFactorEnabled ? (
                <Button variant="outline" onClick={handleDisable2FA}>
                  Disable 2FA
                </Button>
              ) : (
                <Button onClick={handleEnable2FA} disabled={isEnabling2FA}>
                  {isEnabling2FA ? "Enabling..." : "Enable 2FA"}
                </Button>
              )}
            </div>
          </div>

          {!twoFactorEnabled && (
            <div className="text-sm text-muted-foreground">
              <p className="mb-2">Two-factor authentication adds an extra layer of security by requiring:</p>
              <ul className="ml-4 space-y-1">
                <li>• Your password</li>
                <li>• A verification code from your phone</li>
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Monitor className="h-5 w-5" />
            <span>Active Sessions</span>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            These are the devices and locations where you're currently signed in.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {mockSessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Monitor className="h-5 w-5 text-muted-foreground" />
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <p className="font-medium">{session.device}</p>
                      {session.isCurrent && (
                        <Badge variant="default" className="text-xs">Current</Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{session.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{formatLastActive(session.lastActive)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {!session.isCurrent && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleTerminateSession(session.id)}
                  >
                    <LogOut className="h-4 w-4 mr-1" />
                    Sign Out
                  </Button>
                )}
              </div>
            ))}
          </div>
          
          <Separator />
          
          <Button variant="outline" className="w-full text-red-600 hover:text-red-700">
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out All Other Sessions
          </Button>
        </CardContent>
      </Card>

      {/* Security Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Security Recommendations</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">Strong password in use</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <span className="text-sm">Enable two-factor authentication</span>
              </div>
              {!twoFactorEnabled && (
                <Button size="sm" variant="outline">
                  Enable
                </Button>
              )}
            </div>
            
            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center space-x-2">
                <Key className="h-4 w-4 text-blue-600" />
                <span className="text-sm">Review active sessions regularly</span>
              </div>
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
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
            <div className="space-y-1">
              <p className="font-medium text-red-800 dark:text-red-200">Delete Account</p>
              <p className="text-sm text-red-600 dark:text-red-400">
                Permanently delete your account and all associated data. This action cannot be undone.
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
