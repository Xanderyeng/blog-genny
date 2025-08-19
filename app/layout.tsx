import type React from "react"
import type { Metadata } from "next"
import { Inter, Roboto_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { QueryProviders } from "@/components/providers/query-providers"
import { AuthProvider } from "@/components/providers/auth-provider"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

const roboto_mono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "Blog Genny - AI-Powered Blog Generation",
  description: "Create beautiful blog posts with AI assistance using MDX and Next.js",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${roboto_mono.variable}`}>
      <body>
        <AuthProvider>
          <ThemeProvider defaultTheme="system" storageKey="blog-genny-theme">
            <QueryProviders>
              {children}
            </QueryProviders>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
