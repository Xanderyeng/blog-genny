"use client"

import type React from "react"

import { useState } from "react"
import { signIn, getSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { AuthCard } from "./auth-card"
import { FormField } from "./form-field"
import { PasswordInput } from "./password-input"
import { AuthDivider } from "./auth-divider"
import { OAuthProviders } from "./oauth-providers"

export function SignInForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Invalid email or password")
      } else {
        // Check user role and redirect accordingly
        const session = await getSession()
        if (session?.user?.role === "admin") {
          router.push("/admin")
        } else {
          router.push("/")
        }
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthCard
      title="Sign In"
      description="Enter your credentials to access your account"
      error={error}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField label="Email" htmlFor="email">
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </FormField>

        <FormField label="Password" htmlFor="password">
          <PasswordInput
            id="password"
            value={password}
            onChange={setPassword}
            required
            disabled={loading}
          />
        </FormField>

        <Button type="submit" className="w-full cursor-pointer" disabled={loading}>
          {loading && <Loader2 className="mr-2 w-4 h-4 animate-spin" />}
          Sign In
        </Button>
      </form>

      <AuthDivider />

      <OAuthProviders disabled={loading} />
    </AuthCard>
  )
}
