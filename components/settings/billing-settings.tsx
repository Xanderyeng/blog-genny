"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  CreditCard, 
  Calendar, 
  Receipt, 
  Download,
  AlertTriangle,
  Crown,
  CheckCircle,
  XCircle,
  RefreshCw,
  Settings,
  ExternalLink,
  DollarSign,
  Clock
} from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

type UserType = {
  id: string
  name: string | null
  email: string
  tier: "free" | "premium"
  stripeCustomerId: string | null
  stripeSubscriptionId: string | null
  stripePriceId: string | null
  stripeCurrentPeriodEnd: Date | null
}

interface BillingSettingsProps {
  user: UserType
}

export function BillingSettings({ user }: BillingSettingsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showCancelDialog, setShowCancelDialog] = useState(false)

  const isPremium = user.tier === "premium"
  const hasActiveSubscription = isPremium && user.stripeSubscriptionId

  // Mock data for demonstration
  const mockSubscription = {
    status: "active",
    currentPeriodEnd: user.stripeCurrentPeriodEnd || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    amount: 9.99,
    currency: "USD",
    interval: "month",
    nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  }

  const mockPaymentMethods = [
    {
      id: "pm_1",
      type: "card",
      brand: "visa",
      last4: "4242",
      expiryMonth: 12,
      expiryYear: 2025,
      isDefault: true,
    },
    {
      id: "pm_2",
      type: "paypal",
      email: "user@example.com",
      isDefault: false,
    },
  ]

  const mockInvoices = [
    {
      id: "inv_001",
      date: new Date("2024-07-01"),
      amount: 9.99,
      status: "paid",
      downloadUrl: "#",
    },
    {
      id: "inv_002",
      date: new Date("2024-06-01"),
      amount: 9.99,
      status: "paid",
      downloadUrl: "#",
    },
    {
      id: "inv_003",
      date: new Date("2024-05-01"),
      amount: 9.99,
      status: "paid",
      downloadUrl: "#",
    },
  ]

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(date))
  }

  const formatCurrency = (amount: number, currency: string = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount)
  }

  const handleManageBilling = async () => {
    setIsLoading(true)
    try {
      // This would redirect to Stripe customer portal
      const response = await fetch("/api/billing/portal", {
        method: "POST",
      })
      
      if (response.ok) {
        const { url } = await response.json()
        window.open(url, "_blank")
      } else {
        toast.error("Failed to open billing portal")
      }
    } catch (error) {
      toast.error("An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelSubscription = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/billing/cancel", {
        method: "POST",
      })
      
      if (response.ok) {
        toast.success("Subscription cancelled. You'll have access until the end of your billing period.")
        setShowCancelDialog(false)
      } else {
        toast.error("Failed to cancel subscription")
      }
    } catch (error) {
      toast.error("An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "past_due":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      default:
        return <RefreshCw className="h-4 w-4 text-blue-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "default"
      case "pending":
        return "secondary"
      case "failed":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-6">
      {/* Current Subscription */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Crown className="h-5 w-5" />
            <span>Current Subscription</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isPremium ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-lg border">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold">Premium Plan</h3>
                    {getStatusIcon(mockSubscription.status)}
                    <Badge variant="default">Active</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {formatCurrency(mockSubscription.amount)} / {mockSubscription.interval}
                  </p>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-sm font-medium">Next billing date</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(mockSubscription.nextBillingDate)}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button 
                  onClick={handleManageBilling} 
                  disabled={isLoading}
                  className="flex items-center space-x-2"
                >
                  <Settings className="h-4 w-4" />
                  <span>Manage Billing</span>
                  <ExternalLink className="h-3 w-3" />
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => setShowCancelDialog(true)}
                >
                  Cancel Subscription
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center p-6">
              <Crown className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Free Plan</h3>
              <p className="text-muted-foreground mb-4">
                You're currently on the free plan. Upgrade to Premium for unlimited features.
              </p>
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                <Crown className="h-4 w-4 mr-2" />
                Upgrade to Premium
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Methods */}
      {isPremium && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5" />
              <span>Payment Methods</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {mockPaymentMethods.map((method) => (
                <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {method.type === "card" ? (
                      <div className="flex items-center space-x-2">
                        <CreditCard className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">
                            {method.brand.toUpperCase()} •••• {method.last4}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Expires {method.expiryMonth}/{method.expiryYear}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">PayPal</p>
                          <p className="text-sm text-muted-foreground">{method.email}</p>
                        </div>
                      </div>
                    )}
                    {method.isDefault && (
                      <Badge variant="secondary" className="ml-2">Default</Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {!method.isDefault && (
                      <Button variant="ghost" size="sm">
                        Set as Default
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <Button variant="outline" className="w-full">
              <CreditCard className="h-4 w-4 mr-2" />
              Add Payment Method
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Billing History */}
      {isPremium && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Receipt className="h-5 w-5" />
              <span>Billing History</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockInvoices.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{formatDate(invoice.date)}</span>
                    </div>
                    <Badge variant={getStatusColor(invoice.status)}>
                      {invoice.status}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <span className="font-medium">
                      {formatCurrency(invoice.amount)}
                    </span>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t">
              <Button variant="outline" className="w-full">
                <Clock className="h-4 w-4 mr-2" />
                View All Invoices
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Usage & Limits */}
      <Card>
        <CardHeader>
          <CardTitle>Usage & Limits</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Articles this month</span>
              <span className="text-sm font-medium">
                {isPremium ? "Unlimited" : "3 / 5"}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">AI generations</span>
              <span className="text-sm font-medium">
                {isPremium ? "Unlimited" : "8 / 10"}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Storage used</span>
              <span className="text-sm font-medium">2.1 GB / ∞</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cancel Subscription Dialog */}
      {showCancelDialog && (
        <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-red-600 dark:text-red-400">
              <AlertTriangle className="h-5 w-5" />
              <span>Cancel Subscription</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm">
              Are you sure you want to cancel your Premium subscription? You will:
            </p>
            <ul className="text-sm space-y-1 ml-4">
              <li>• Lose access to premium features at the end of your billing period</li>
              <li>• Keep all your existing articles and data</li>
              <li>• Be limited to 5 articles per month on the free plan</li>
              <li>• Can resubscribe anytime</li>
            </ul>
            <div className="flex items-center space-x-2 pt-4">
              <Button 
                variant="destructive" 
                onClick={handleCancelSubscription}
                disabled={isLoading}
              >
                {isLoading ? "Cancelling..." : "Yes, Cancel Subscription"}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowCancelDialog(false)}
              >
                Keep Subscription
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
