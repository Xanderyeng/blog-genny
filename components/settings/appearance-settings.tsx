"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"
import { 
  Palette, 
  Monitor, 
  Sun, 
  Moon, 
  Check,
  Zap,
  Type,
  Layout
} from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

type UserType = {
  id: string
  name: string | null
  email: string
  tier: "free" | "premium"
}

interface AppearanceSettingsProps {
  user: UserType
}

export function AppearanceSettings({ user }: AppearanceSettingsProps) {
  const { theme, setTheme } = useTheme()
  const [selectedFont, setSelectedFont] = useState("default")
  const [selectedLayout, setSelectedLayout] = useState("comfortable")
  
  const isPremium = user.tier === "premium"

  const themes = [
    { 
      value: "light", 
      label: "Light", 
      icon: Sun, 
      description: "Clean and bright interface" 
    },
    { 
      value: "dark", 
      label: "Dark", 
      icon: Moon, 
      description: "Easy on the eyes in low light" 
    },
    { 
      value: "system", 
      label: "System", 
      icon: Monitor, 
      description: "Follow your system preference" 
    },
  ]

  const fonts = [
    { value: "default", label: "Inter (Default)", preview: "The quick brown fox" },
    { value: "serif", label: "Georgia", preview: "The quick brown fox", premium: false },
    { value: "mono", label: "JetBrains Mono", preview: "The quick brown fox", premium: true },
    { value: "rounded", label: "Nunito", preview: "The quick brown fox", premium: true },
  ]

  const layouts = [
    { 
      value: "compact", 
      label: "Compact", 
      description: "More content in less space",
      premium: false 
    },
    { 
      value: "comfortable", 
      label: "Comfortable", 
      description: "Balanced spacing and readability",
      premium: false 
    },
    { 
      value: "spacious", 
      label: "Spacious", 
      description: "Extra breathing room",
      premium: true 
    },
  ]

  const handleFontChange = (fontValue: string) => {
    const font = fonts.find(f => f.value === fontValue)
    if (font?.premium && !isPremium) {
      toast.error("This font is available for premium users only")
      return
    }
    setSelectedFont(fontValue)
    toast.success("Font preference saved!")
  }

  const handleLayoutChange = (layoutValue: string) => {
    const layout = layouts.find(l => l.value === layoutValue)
    if (layout?.premium && !isPremium) {
      toast.error("This layout is available for premium users only")
      return
    }
    setSelectedLayout(layoutValue)
    toast.success("Layout preference saved!")
  }

  return (
    <div className="space-y-6">
      {/* Theme Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Palette className="w-5 h-5" />
            <span>Theme</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="gap-4 grid grid-cols-1 md:grid-cols-3">
            {themes.map((themeOption) => {
              const Icon = themeOption.icon
              const isSelected = theme === themeOption.value
              
              return (
                <div
                  key={themeOption.value}
                  className={`relative p-4 border rounded-lg cursor-pointer transition-all hover:border-primary ${
                    isSelected ? "border-primary bg-primary/5" : "border-border"
                  }`}
                  onClick={() => setTheme(themeOption.value as typeof theme)}
                >
                  {isSelected && (
                    <div className="top-2 right-2 absolute">
                      <div className="bg-primary p-1 rounded-full text-primary-foreground">
                        <Check className="w-3 h-3" />
                      </div>
                    </div>
                  )}
                  
                  <div className="flex flex-col items-center space-y-2">
                    <Icon className="w-8 h-8" />
                    <div className="text-center">
                      <p className="font-medium">{themeOption.label}</p>
                      <p className="text-muted-foreground text-xs">
                        {themeOption.description}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Font Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Type className="w-5 h-5" />
            <span>Typography</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
            {fonts.map((font) => {
              const isSelected = selectedFont === font.value
              const isLocked = font.premium && !isPremium
              
              return (
                <div
                  key={font.value}
                  className={`relative p-4 border rounded-lg transition-all ${
                    isLocked 
                      ? "opacity-50 cursor-not-allowed" 
                      : "cursor-pointer hover:border-primary"
                  } ${
                    isSelected ? "border-primary bg-primary/5" : "border-border"
                  }`}
                  onClick={() => !isLocked && handleFontChange(font.value)}
                >
                  {isSelected && !isLocked && (
                    <div className="top-2 right-2 absolute">
                      <div className="bg-primary p-1 rounded-full text-primary-foreground">
                        <Check className="w-3 h-3" />
                      </div>
                    </div>
                  )}
                  
                  {isLocked && (
                    <div className="top-2 right-2 absolute">
                      <Zap className="w-4 h-4 text-yellow-500" />
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <p className="font-medium">{font.label}</p>
                      {font.premium && (
                        <span className="bg-yellow-100 dark:bg-yellow-900 px-2 py-1 rounded text-yellow-800 dark:text-yellow-100 text-xs">
                          Premium
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground text-sm" style={{ fontFamily: font.value === 'serif' ? 'Georgia' : font.value === 'mono' ? 'monospace' : font.value === 'rounded' ? 'Nunito' : 'inherit' }}>
                      {font.preview}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Layout Density */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Layout className="w-5 h-5" />
            <span>Layout Density</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {layouts.map((layout) => {
              const isSelected = selectedLayout === layout.value
              const isLocked = layout.premium && !isPremium
              
              return (
                <div
                  key={layout.value}
                  className={`relative p-4 border rounded-lg transition-all ${
                    isLocked 
                      ? "opacity-50 cursor-not-allowed" 
                      : "cursor-pointer hover:border-primary"
                  } ${
                    isSelected ? "border-primary bg-primary/5" : "border-border"
                  }`}
                  onClick={() => !isLocked && handleLayoutChange(layout.value)}
                >
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <p className="font-medium">{layout.label}</p>
                        {layout.premium && (
                          <span className="bg-yellow-100 dark:bg-yellow-900 px-2 py-1 rounded text-yellow-800 dark:text-yellow-100 text-xs">
                            Premium
                          </span>
                        )}
                      </div>
                      <p className="text-muted-foreground text-sm">
                        {layout.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {isLocked && <Zap className="w-4 h-4 text-yellow-500" />}
                      {isSelected && !isLocked && (
                        <div className="bg-primary p-1 rounded-full text-primary-foreground">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Premium Upgrade */}
      {!isPremium && (
        <Card className="bg-gradient-to-r from-purple-50 dark:from-purple-950/20 to-blue-50 dark:to-blue-950/20 border-purple-200 dark:border-purple-800">
          <CardContent className="p-6 text-center">
            <Zap className="mx-auto mb-4 w-12 h-12 text-yellow-500" />
            <h3 className="mb-2 font-semibold text-lg">Unlock Premium Appearance Options</h3>
            <p className="mb-4 text-muted-foreground">
              Get access to premium fonts, layouts, and advanced customization options.
            </p>
            <Button className="bg-gradient-to-r from-purple-600 hover:from-purple-700 to-blue-600 hover:to-blue-700">
              Upgrade to Premium
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
