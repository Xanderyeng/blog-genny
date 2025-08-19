import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function BlogCardSkeleton() {
    return (
        <Card className="h-full overflow-hidden">
            <CardHeader className="p-0">
                {/* Hero image skeleton */}
                <Skeleton className="w-full h-48" />
            </CardHeader>
            <CardContent className="p-6">
                <div className="space-y-3">
                    {/* Title skeleton */}
                    <Skeleton className="h-6 w-3/4" />
                    {/* Description skeleton - 2 lines */}
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                    </div>
                    {/* Metadata skeleton */}
                    <div className="flex items-center justify-between pt-4">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-16" />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export function BlogCardGridSkeleton({ count = 6 }: { count?: number }) {
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: count }).map((_, i) => (
                <BlogCardSkeleton key={i} />
            ))}
        </div>
    )
}