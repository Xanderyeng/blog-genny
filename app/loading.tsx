import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BlogCardGridSkeleton } from "@/components/blog-card-skeleton"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
    return (
        <>
            <Header />
            <main className="min-h-screen bg-background">
                <div className="container mx-auto px-4 py-8">
                    <section className="mb-12">
                        {/* Title skeleton */}
                        <Skeleton className="h-10 w-80 mb-4" />
                        {/* Description skeleton */}
                        <div className="space-y-2 max-w-2xl">
                            <Skeleton className="h-6 w-full" />
                            <Skeleton className="h-6 w-3/4" />
                        </div>
                    </section>

                    <section>
                        {/* Section title skeleton */}
                        <Skeleton className="h-8 w-48 mb-6" />
                        {/* Blog cards grid skeleton */}
                        <BlogCardGridSkeleton count={6} />
                    </section>
                </div>
            </main>
            <Footer />
        </>
    )
}
