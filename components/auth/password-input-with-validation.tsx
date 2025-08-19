"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff, Check, X } from "lucide-react"

interface PasswordRequirement {
    regex: RegExp
    text: string
}

interface PasswordInputWithValidationProps {
    id: string
    value: string
    onChange: (value: string) => void
    placeholder?: string
    required?: boolean
    disabled?: boolean
    minLength?: number
    className?: string
    showRequirements?: boolean
    requirements?: PasswordRequirement[]
}

const defaultRequirements: PasswordRequirement[] = [
    { regex: /.{6,}/, text: "At least 6 characters" },
    { regex: /[A-Z]/, text: "One uppercase letter" },
    { regex: /[a-z]/, text: "One lowercase letter" },
    { regex: /\d/, text: "One number" },
]

export function PasswordInputWithValidation({
    id,
    value,
    onChange,
    placeholder,
    required = false,
    disabled = false,
    minLength,
    className = "",
    showRequirements = false,
    requirements = defaultRequirements
}: PasswordInputWithValidationProps) {
    const [showPassword, setShowPassword] = useState(false)
    const [isFocused, setIsFocused] = useState(false)

    const checkRequirement = (requirement: PasswordRequirement) => {
        return requirement.regex.test(value)
    }

    return (
        <div className="space-y-2">
            <div className="relative">
                <Input
                    id={id}
                    type={showPassword ? "text" : "password"}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
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

            {showRequirements && (isFocused || value) && (
                <div className="text-sm space-y-1">
                    {requirements.map((requirement, index) => {
                        const isValid = checkRequirement(requirement)
                        return (
                            <div
                                key={index}
                                className={`flex items-center space-x-2 ${isValid ? "text-green-600" : "text-muted-foreground"
                                    }`}
                            >
                                {isValid ? (
                                    <Check className="h-3 w-3" />
                                ) : (
                                    <X className="h-3 w-3" />
                                )}
                                <span>{requirement.text}</span>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
