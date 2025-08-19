"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { BlogCard } from "@/components/blog-card";
import { Search } from "lucide-react";

interface BlogPost {
    slug: string;
    title: string;
    description: string;
    date: string;
    tags: string[];
    readingTime: string;
    content: string;
}

export default function SearchPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Fetch all posts on component mount
        fetch("/api/posts")
            .then((res) => res.json())
            .then((data) => {
                setPosts(data);
                setFilteredPosts(data);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching posts:", error);
                setIsLoading(false);
            });
    }, []);

    useEffect(() => {
        if (!searchTerm) {
            setFilteredPosts(posts);
            return;
        }

        const filtered = posts.filter((post) => {
            const searchLower = searchTerm.toLowerCase();
            return (
                post.title.toLowerCase().includes(searchLower) ||
                post.description.toLowerCase().includes(searchLower) ||
                post.tags.some((tag) => tag.toLowerCase().includes(searchLower)) ||
                post.content.toLowerCase().includes(searchLower)
            );
        });

        setFilteredPosts(filtered);
    }, [searchTerm, posts]);

    return (
        <>
            <Header />
            <main className="min-h-screen bg-background">
                <div className="container mx-auto px-4 py-8">
                    <div className="mb-8 text-center">
                        <div className="flex items-center justify-center mb-4">
                            <Search className="h-8 w-8 text-primary mr-3" />
                            <h1 className="text-4xl font-bold tracking-tight">Search Blog Posts</h1>
                        </div>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Find the perfect blog post by searching through titles, descriptions, tags, and content.
                        </p>
                    </div>

                    <div className="max-w-2xl mx-auto mb-8">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Search for blog posts..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    <div className="space-y-6">
                        {isLoading ? (
                            <div className="text-center py-12">
                                <p className="text-muted-foreground">Loading posts...</p>
                            </div>
                        ) : filteredPosts.length > 0 ? (
                            <>
                                <div className="text-sm text-muted-foreground mb-4">
                                    {searchTerm ? (
                                        <>
                                            Found {filteredPosts.length} post{filteredPosts.length !== 1 ? "s" : ""} for "{searchTerm}"
                                        </>
                                    ) : (
                                        <>Showing all {filteredPosts.length} post{filteredPosts.length !== 1 ? "s" : ""}</>
                                    )}
                                </div>
                                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                    {filteredPosts.map((post) => (
                                        <BlogCard key={post.slug} post={post} />
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-12">
                                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <p className="text-muted-foreground mb-2">
                                    {searchTerm ? `No posts found for "${searchTerm}"` : "No posts available"}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {searchTerm ? "Try searching with different keywords." : "Start by generating your first blog post!"}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
