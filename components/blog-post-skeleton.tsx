import { Skeleton } from "@/components/ui/skeleton"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export function BlogPostSkeleton() {
    return (
        <>
            <Header />
            <main className="min-h-screen bg-background">
                <div className="container mx-auto px-4 py-8 max-w-4xl">
                    <div className="mb-8">
                        {/* Back button skeleton */}
                        <Skeleton className="h-10 w-24 mb-6" />

                        {/* Hero image skeleton */}
                        <Skeleton className="w-full h-64 md:h-80 mb-8 rounded-lg" />

                        <div className="space-y-6">
                            {/* Title skeleton */}
                            <Skeleton className="h-12 w-3/4" />

                            {/* Metadata skeleton */}
                            <div className="flex flex-wrap items-center gap-4">
                                <Skeleton className="h-5 w-24" />
                                <Skeleton className="h-5 w-20" />
                                <Skeleton className="h-6 w-16" />
                            </div>

                            {/* Description skeleton */}
                            <div className="space-y-3">
                                <Skeleton className="h-5 w-full" />
                                <Skeleton className="h-5 w-5/6" />
                            </div>
                        </div>
                    </div>

                    {/* Article content skeleton */}
                    <article className="prose prose-lg max-w-none">
                        <div className="space-y-6">
                            {/* Paragraph skeletons */}
                            {Array.from({ length: 8 }).map((_, i) => (
                                <div key={i} className="space-y-3">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-3/4" />
                                </div>
                            ))}

                            {/* Section header skeleton */}
                            <Skeleton className="h-8 w-1/2 mt-8" />

                            {/* More paragraph skeletons */}
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={`section-${i}`} className="space-y-3">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-5/6" />
                                    <Skeleton className="h-4 w-4/5" />
                                </div>
                            ))}
                        </div>
                    </article>
                </div>
            </main>
            <Footer />
        </>
    )
}
