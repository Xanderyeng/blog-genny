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
        className="w-8 aspect-square"
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
            className="w-8 aspect-square"
        />
    )
}

const MicrosoftIcon = () => (
    <Image
        src="/icons/microsoft-Light.svg"
        alt="Microsoft"
        width={32}
        height={32}
        className="w-8 aspect-square"
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
                    <div key={provider.id} className="group relative">
                        <Button
                            type="button"
                            variant="outline"
                            size="lg"
                            className="!bg-transparent hover:bg-gray-50 dark:hover:!bg-stone-600 hover:shadow-md p-1.5 rounded-2xl !dark:!hover:!outline-4 dark:hover:outline-primary w-10 aspect-square hover:scale-105 transition-all duration-200"
                            onClick={() => handleProviderSignIn(provider.id)}
                            disabled={disabled}
                        >
                            <Icon />
                            <span className="sr-only">Sign in with {provider.name}</span>
                        </Button>

                        {/* Tooltip */}
                        <div className="bottom-full left-1/2 z-10 absolute bg-gray-900 dark:bg-gray-800 opacity-0 group-hover:opacity-100 shadow-lg mb-3 px-3 py-2 rounded-lg text-white text-sm whitespace-nowrap transition-opacity -translate-x-1/2 duration-200 pointer-events-none transform">
                            Continue with {provider.name}
                            <div className="top-full left-1/2 absolute border-t-4 border-t-gray-900 border-transparent dark:border-t-gray-800 border-r-4 border-l-4 w-0 aspect-square -translate-x-1/2 transform"></div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
