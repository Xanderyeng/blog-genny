import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PenTool, Home, Search } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserNav } from "@/components/user-nav"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <PenTool className="h-6 w-6" />
          <span className="font-bold text-xl">Blog Genny</span>
        </Link>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">
              <Home className="h-4 w-4 mr-2" />
              Home
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/search">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/generate">
              <PenTool className="h-4 w-4 mr-2" />
              Generate Post
            </Link>
          </Button>
          <ThemeToggle />
          <UserNav />
        </div>
      </nav>
    </header>
  )
}
