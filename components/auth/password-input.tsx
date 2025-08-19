"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff } from "lucide-react"

interface PasswordInputProps {
    id: string
    value: string
    onChange: (value: string) => void
    placeholder?: string
    required?: boolean
    disabled?: boolean
    minLength?: number
    className?: string
}

export function PasswordInput({
    id,
    value,
    onChange,
    placeholder,
    required = false,
    disabled = false,
    minLength,
    className = ""
}: PasswordInputProps) {
    const [showPassword, setShowPassword] = useState(false)

    return (
        <div className="relative">
            <Input
                id={id}
                type={showPassword ? "text" : "password"}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                required={required}
                disabled={disabled}
                minLength={minLength}
                className={`pr-10 ${className}`}
            />
            <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={disabled}
            >
                {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                ) : (
                    <Eye className="h-4 w-4" />
                )}
                <span className="sr-only">
                    {showPassword ? "Hide password" : "Show password"}
                </span>
            </Button>
        </div>
    )
}
