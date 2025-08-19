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
                        {/* Page title skeleton */}
                        <Skeleton className="h-10 w-64 mb-4" />
                        {/* Description skeleton */}
                        <div className="space-y-2 max-w-2xl">
                            <Skeleton className="h-5 w-full" />
                            <Skeleton className="h-5 w-2/3" />
                        </div>
                    </section>

                    <section>
                        {/* Filter/search section skeleton */}
                        <div className="mb-8 space-y-4">
                            <div className="flex flex-wrap gap-4">
                                <Skeleton className="h-10 w-48" />
                                <Skeleton className="h-10 w-32" />
                                <Skeleton className="h-10 w-32" />
                            </div>
                        </div>

                        {/* Blog cards grid skeleton */}
                        <BlogCardGridSkeleton count={9} />
                    </section>
                </div>
            </main>
            <Footer />
        </>
    )
}
