"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { AuthCard } from "./auth-card"
import { FormField } from "./form-field"
import { PasswordInput } from "./password-input"
import { AuthDivider } from "./auth-divider"
import { OAuthProviders } from "./oauth-providers"

export function SignUpForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      })

      if (response.ok) {
        router.push("/auth/signin?message=Account created successfully")
      } else {
        const data = await response.json()
        setError(data.error || "An error occurred")
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthCard
      title="Sign Up"
      description="Create a new account to get started"
      error={error}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField label="Name" htmlFor="name">
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading}
          />
        </FormField>

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
            minLength={6}
          />
        </FormField>

        <FormField label="Confirm Password" htmlFor="confirmPassword">
          <PasswordInput
            id="confirmPassword"
            value={confirmPassword}
            onChange={setConfirmPassword}
            required
            disabled={loading}
            minLength={6}
          />
        </FormField>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Sign Up
        </Button>
      </form>

      <AuthDivider />

      <OAuthProviders disabled={loading} />
    </AuthCard>
  )
}
