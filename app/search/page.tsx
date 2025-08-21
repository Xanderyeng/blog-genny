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
            <main className="bg-background min-h-screen">
                <div className="mx-auto px-4 py-8 container">
                    <div className="mb-8 text-center">
                        <div className="flex justify-center items-center mb-4">
                            <Search className="mr-3 w-8 h-8 text-primary" />
                            <h1 className="font-bold text-4xl tracking-tight">Search Blog Posts</h1>
                        </div>
                        <p className="mx-auto max-w-2xl text-muted-foreground text-xl">
                            Find the perfect blog post by searching through titles, descriptions, tags, and content.
                        </p>
                    </div>

                    <div className="mx-auto mb-8 max-w-2xl">
                        <div className="relative">
                            <Search className="top-1/2 left-3 absolute w-4 h-4 text-muted-foreground -translate-y-1/2 transform" />
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
                            <div className="py-12 text-center">
                                <p className="text-muted-foreground">Loading posts...</p>
                            </div>
                        ) : filteredPosts.length > 0 ? (
                            <>
                                <div className="mb-4 text-muted-foreground text-sm">
                                    {searchTerm ? (
                                        <>
                                            Found {filteredPosts.length} post{filteredPosts.length !== 1 ? "s" : ""} for &quot;{searchTerm}&quot;
                                        </>
                                    ) : (
                                        <>Showing all {filteredPosts.length} post{filteredPosts.length !== 1 ? "s" : ""}</>
                                    )}
                                </div>
                                <div className="gap-6 grid md:grid-cols-2 lg:grid-cols-3">
                                    {filteredPosts.map((post) => (
                                        <BlogCard key={post.slug} post={post} />
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="py-12 text-center">
                                <Search className="mx-auto mb-4 w-12 h-12 text-muted-foreground" />
                                <p className="mb-2 text-muted-foreground">
                                    {searchTerm ? `No posts found for "${searchTerm}"` : "No posts available"}
                                </p>
                                <p className="text-muted-foreground text-sm">
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
