"use client"

import { useState, useTransition } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { resetPassword } from "@/app/actions/userActions"

interface ResetPasswordDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: { id: string; name: string | null }
}

export function ResetPasswordDialog({ open, onOpenChange, user }: ResetPasswordDialogProps) {
  const [newPassword, setNewPassword] = useState("")
  const [isPending, startTransition] = useTransition()

  const handleSubmit = () => {
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long.")
      return
    }

    startTransition(async () => {
      const result = await resetPassword({ userId: user.id, newPassword })
      if (result.success) {
        toast.success(`Password for ${user.name || 'user'} has been reset.`)
        onOpenChange(false)
        setNewPassword("")
      } else {
        toast.error(result.error || "Failed to reset password.")
      }
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Reset Password</AlertDialogTitle>
          <AlertDialogDescription>
            You are about to reset the password for <strong>{user.name || user.id}</strong>. They will not be notified of this change. Please provide a strong temporary password.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4">
          <Label htmlFor="new-password">New Password</Label>
          <Input
            id="new-password"
            type="text"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new temporary password"
            autoComplete="new-password"
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button onClick={handleSubmit} disabled={isPending || newPassword.length < 8}>
              {isPending ? "Resetting..." : "Reset Password"}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
