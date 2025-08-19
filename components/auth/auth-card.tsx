import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface AuthCardProps {
    title: string
    description: string
    error?: string
    children: React.ReactNode
}

export function AuthCard({ title, description, error, children }: AuthCardProps) {
    return (
        <Card className="w-full max-w-md glass-light">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {error && (
                    <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                {children}
            </CardContent>
        </Card>
    )
}
