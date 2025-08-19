import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

// Mock settings storage - in a real app, this would be in a database
let mockSettings = {
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
}

// GET - Fetch current settings
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json(mockSettings)
  } catch (error) {
    console.error("Error fetching settings:", error)
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    )
  }
}

// PUT - Update settings
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    
    // Validate and sanitize the settings
    const updatedSettings = {
      // General Settings
      siteName: body.siteName || mockSettings.siteName,
      siteDescription: body.siteDescription || mockSettings.siteDescription,
      siteUrl: body.siteUrl || mockSettings.siteUrl,
      adminEmail: body.adminEmail || mockSettings.adminEmail,
      
      // Content Settings
      articlesPerPage: Number(body.articlesPerPage) || mockSettings.articlesPerPage,
      enableComments: Boolean(body.enableComments),
      enableNewsletter: Boolean(body.enableNewsletter),
      requireModeration: Boolean(body.requireModeration),
      
      // SEO Settings
      defaultMetaTitle: body.defaultMetaTitle || mockSettings.defaultMetaTitle,
      defaultMetaDescription: body.defaultMetaDescription || mockSettings.defaultMetaDescription,
      enableSitemap: Boolean(body.enableSitemap),
      enableRobots: Boolean(body.enableRobots),
      
      // Security Settings
      enableTwoFactor: Boolean(body.enableTwoFactor),
      maxLoginAttempts: Number(body.maxLoginAttempts) || mockSettings.maxLoginAttempts,
      sessionTimeout: Number(body.sessionTimeout) || mockSettings.sessionTimeout,
      
      // AI Settings
      aiProvider: body.aiProvider || mockSettings.aiProvider,
      maxTokensPerGeneration: Number(body.maxTokensPerGeneration) || mockSettings.maxTokensPerGeneration,
      enableAutoPublish: Boolean(body.enableAutoPublish),
      autoPublishDelay: Number(body.autoPublishDelay) || mockSettings.autoPublishDelay,
      
      // Notification Settings
      emailNotifications: Boolean(body.emailNotifications),
      slackNotifications: Boolean(body.slackNotifications),
      webhookUrl: body.webhookUrl || ""
    }

    // Update the mock settings (in a real app, save to database)
    mockSettings = updatedSettings

    return NextResponse.json(updatedSettings)
  } catch (error) {
    console.error("Error updating settings:", error)
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    )
  }
}

// POST - Reset to defaults
export async function POST() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Reset to default settings
    mockSettings = {
      siteName: "Blog Genny",
      siteDescription: "AI-Powered Blog Generation Platform",
      siteUrl: "https://your-blog.com",
      adminEmail: "admin@blog.com",
      articlesPerPage: 10,
      enableComments: true,
      enableNewsletter: false,
      requireModeration: true,
      defaultMetaTitle: "Blog Genny - AI Blog Generator",
      defaultMetaDescription: "Generate high-quality blog content with AI",
      enableSitemap: true,
      enableRobots: true,
      enableTwoFactor: false,
      maxLoginAttempts: 5,
      sessionTimeout: 24,
      aiProvider: "gemini",
      maxTokensPerGeneration: 2000,
      enableAutoPublish: false,
      autoPublishDelay: 2,
      emailNotifications: true,
      slackNotifications: false,
      webhookUrl: ""
    }

    return NextResponse.json(mockSettings)
  } catch (error) {
    console.error("Error resetting settings:", error)
    return NextResponse.json(
      { error: "Failed to reset settings" },
      { status: 500 }
    )
  }
}
