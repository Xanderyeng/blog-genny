"use client"

import { signOut, useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { 
  User, 
  Settings, 
  LogOut, 
  Shield, 
  FileText, 
  BarChart3,
  Crown 
} from "lucide-react"
import Link from "next/link"

export function UserNav() {
  const { data: session } = useSession()

  if (!session) {
    return (
      <div className="flex items-center space-x-2">
        <Button variant="ghost" asChild>
          <Link href="/auth/signin">Sign In</Link>
        </Button>
        <Button asChild>
          <Link href="/auth/signup">Sign Up</Link>
        </Button>
      </div>
    )
  }

  const initials =
    session.user.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() ||
    session.user.email?.[0]?.toUpperCase() ||
    "U"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative rounded-full w-8 h-8">
          <Avatar className="w-8 h-8">
            <AvatarImage src={session.user.image || ""} alt={session.user.name || ""} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="font-medium text-sm leading-none">{session.user.name}</p>
            <p className="text-muted-foreground text-xs leading-none">{session.user.email}</p>
            <div className="flex items-center space-x-2 pt-1">
              <Badge variant={session.user.role === "admin" ? "default" : "secondary"}>{session.user.role}</Badge>
              <Badge variant="outline">{session.user.tier}</Badge>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard/settings">
            <User className="mr-2 w-4 h-4" />
            Profile & Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard/articles">
            <FileText className="mr-2 w-4 h-4" />
            My Articles
          </Link>
        </DropdownMenuItem>
        {(session.user.tier === "premium" || session.user.role === "admin") && (
          <DropdownMenuItem asChild>
            <Link href="/dashboard/analytics">
              <BarChart3 className="mr-2 w-4 h-4" />
              Analytics
            </Link>
          </DropdownMenuItem>
        )}
        {session.user.tier === "premium" && (
          <DropdownMenuItem asChild>
            <Link href="/dashboard/settings?tab=billing">
              <Crown className="mr-2 w-4 h-4" />
              Billing & Subscription
            </Link>
          </DropdownMenuItem>
        )}
        {session.user.role === "admin" && (
          <DropdownMenuItem asChild>
            <Link href="/admin">
              <Shield className="mr-2 w-4 h-4" />
              Admin Dashboard
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>
          <LogOut className="mr-2 w-4 h-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
