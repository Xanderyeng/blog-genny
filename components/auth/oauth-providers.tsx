"use client"

import { Button } from "@/components/ui/button"
import { signIn } from "next-auth/react"
import { useTheme } from "@/components/theme-provider"
import Image from "next/image"

// Custom SVG icon components using your local icons
const GoogleIcon = () => (
    <Image
        src="/icons/google-icon.svg"
        alt="Google"
        width={32}
        height={32}
        className="w-8 h-8"
    />
)

const GitHubIcon = () => {
    const { theme } = useTheme()
    const isDark = theme === "dark"

    return (
        <Image
            src={isDark ? "/icons/github-Dark.svg" : "/icons/github-Light.svg"}
            alt="GitHub"
            width={32}
            height={32}
            className="w-8 h-8"
        />
    )
}

const MicrosoftIcon = () => (
    <Image
        src="/icons/microsoft-Light.svg"
        alt="Microsoft"
        width={32}
        height={32}
        className="w-8 h-8"
    />
)

interface OAuthProvider {
    id: string
    name: string
    icon: React.ComponentType
    enabled: boolean
}

const providers: OAuthProvider[] = [
    { id: "google", name: "Google", icon: GoogleIcon, enabled: true },
    { id: "github", name: "GitHub", icon: GitHubIcon, enabled: true }, // Now enabled
    { id: "microsoft", name: "Microsoft", icon: MicrosoftIcon, enabled: true }, // Now enabled
]

interface OAuthProvidersProps {
    disabled?: boolean
    className?: string
}

export function OAuthProviders({ disabled = false, className = "" }: OAuthProvidersProps) {
    const handleProviderSignIn = (providerId: string) => {
        signIn(providerId, { callbackUrl: "/" })
    }

    const enabledProviders = providers.filter(provider => provider.enabled)

    if (enabledProviders.length === 0) {
        return null
    }

    return (
        <div className={`flex justify-center space-x-4 ${className}`}>
            {enabledProviders.map((provider) => {
                const Icon = provider.icon
                return (
                    <div key={provider.id} className="relative group">
                        <Button
                            type="button"
                            variant="outline"
                            size="lg"
                            className="w-10 h-10 p-1.5 rounded-2xl !bg-transparent hover:bg-gray-50 dark:hover:!bg-stone-600 hover:shadow-md hover:scale-105 transition-all duration-200 !dark:!hover:!outline-4 dark:hover:outline-primary"
                            onClick={() => handleProviderSignIn(provider.id)}
                            disabled={disabled}
                        >
                            <Icon />
                            <span className="sr-only">Sign in with {provider.name}</span>
                        </Button>

                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-3 py-2 text-sm text-white bg-gray-900 dark:bg-gray-800 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10 shadow-lg">
                            Continue with {provider.name}
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-800"></div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
