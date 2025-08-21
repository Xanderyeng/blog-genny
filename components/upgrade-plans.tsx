"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Crown, 
  Check, 
  Zap, 
  BarChart3, 
  FileText, 
  Settings, 
  Headphones,
  Palette,
  Shield,
  Star
} from "lucide-react"

export function UpgradePlans() {
  const features = {
    free: [
      "5 articles per month",
      "Basic AI generation",
      "Standard templates",
      "Email support",
    ],
    premium: [
      "Unlimited articles",
      "Advanced AI generation",
      "Priority processing",
      "Advanced analytics",
      "Custom branding",
      "Premium templates",
      "Export options",
      "Priority support",
      "Early access to features",
      "Custom domains (coming soon)",
    ]
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Free Plan */}
        <Card className="relative">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-2xl">Free Plan</CardTitle>
            <div className="text-3xl font-bold">$0</div>
            <p className="text-muted-foreground">Perfect for getting started</p>
          </CardHeader>
          <CardContent className="space-y-4 justify-between">
            <ul className="space-y-3">
              {features.free.map((feature, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
            <Button variant="outline" className="w-full" disabled>
              Current Plan
            </Button>
          </CardContent>
        </Card>

        {/* Premium Plan */}
        <Card className="relative border-purple-200 dark:border-purple-800 shadow-lg">
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1">
              <Star className="h-3 w-3 mr-1" />
              Most Popular
            </Badge>
          </div>
          
          <CardHeader className="text-center pb-8 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
            <CardTitle className="text-2xl flex items-center justify-center space-x-2">
              <Crown className="h-6 w-6 text-purple-600" />
              <span>Premium Plan</span>
            </CardTitle>
            <div className="text-4xl font-bold">$9.99</div>
            <p className="text-muted-foreground">per month</p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <ul className="space-y-3">
              {features.premium.map((feature, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
            
            <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
              <Crown className="h-4 w-4 mr-2" />
              Upgrade Now
            </Button>
            
            <p className="text-xs text-center text-muted-foreground">
              Cancel anytime. No hidden fees.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Feature Highlights */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-center mb-8">
          Why Upgrade to Premium?
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="text-center">
            <CardHeader>
              <Zap className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <CardTitle className="text-lg">Lightning Fast</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Priority AI processing means your articles generate 3x faster than free users.
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardHeader>
              <BarChart3 className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <CardTitle className="text-lg">Advanced Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Track your content performance with detailed insights and engagement metrics.
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardHeader>
              <Palette className="h-12 w-12 text-purple-500 mx-auto mb-4" />
              <CardTitle className="text-lg">Custom Branding</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Add your logo, customize colors, and make your content truly yours.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* FAQ */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-center mb-8">
          Frequently Asked Questions
        </h2>
        
        <div className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">Can I cancel anytime?</h3>
              <p className="text-sm text-muted-foreground">
                Yes, you can cancel your subscription at any time. You&apos;ll continue to have access to premium features until the end of your billing period.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">What happens to my articles if I downgrade?</h3>
              <p className="text-sm text-muted-foreground">
                All your existing articles remain accessible. However, you&apos;ll be limited to creating 5 new articles per month on the free plan.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">Do you offer refunds?</h3>
              <p className="text-sm text-muted-foreground">
                We offer a 7-day money-back guarantee. If you&apos;re not satisfied within the first week, we&apos;ll provide a full refund.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
