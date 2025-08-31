"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PenTool, Home, Search, Menu, X, User, BookOpen, Settings, TrendingUp } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { useState, useEffect } from "react"
import { motion, AnimatePresence, easeInOut } from "framer-motion"
import { UserNav } from "./user-nav"

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isMobileMenuOpen])

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  }

  const sidebarVariants = {
    hidden: {
      x: "-100%",
      transition: {
        // type: "tween",
        duration: 0.5,
      },
    },
    visible: {
      x: 0,
      transition: {
        // type: "tween",
        duration: 0.4,
        ease: easeInOut,
      },
    },
  }

  const menuItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  }

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  }

  return (
    <>
      <header className="top-0 z-50 sticky bg-background/95 supports-[backdrop-filter]:bg-background/60 backdrop-blur border-b w-full">
        <nav className="flex justify-between items-center mx-auto px-4 h-16 container">
          <Link href="/" className="flex items-center space-x-2">
            <PenTool className="w-6 h-6" />
            <span className="font-bold text-xl">Blog Genny</span>
          </Link>

          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <Home className="mr-2 w-4 h-4" />
                Home
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/search">
                <Search className="mr-2 w-4 h-4" />
                Search
              </Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/generate">
                <PenTool className="mr-2 w-4 h-4" />
                Generate Post
              </Link>
            </Button>
            <ThemeToggle />
            <UserNav />
          </div>

          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <Button variant="ghost" size="sm" onClick={toggleMobileMenu} className="p-2">
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="md:hidden z-50 fixed inset-0">
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={toggleMobileMenu}
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            />

            <motion.div
              className="top-0 left-0 fixed bg-background shadow-2xl border-r w-80 max-w-[85vw] h-full"
              variants={sidebarVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <motion.div
                className="flex justify-between items-center p-6 border-b"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center space-x-2">
                  <PenTool className="w-6 h-6 text-primary" />
                  <span className="font-bold text-xl">Blog Genny</span>
                </div>
                <Button variant="ghost" size="sm" onClick={toggleMobileMenu} className="p-2">
                  <X className="w-5 h-5" />
                </Button>
              </motion.div>

              <div className="flex flex-col h-full">
                <motion.div
                  className="flex-1 space-y-2 px-6 py-4"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.div className="mb-4 font-medium text-muted-foreground text-sm" variants={menuItemVariants}>
                    Navigation
                  </motion.div>

                  <motion.div variants={menuItemVariants}>
                    <Button
                      variant="ghost"
                      size="lg"
                      asChild
                      className="justify-start w-full h-12 text-base"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Link href="/">
                        <Home className="mr-3 w-5 h-5" />
                        Home
                      </Link>
                    </Button>
                  </motion.div>

                  <motion.div variants={menuItemVariants}>
                    <Button
                      variant="ghost"
                      size="lg"
                      asChild
                      className="justify-start w-full h-12 text-base"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Link href="/search">
                        <Search className="mr-3 w-5 h-5" />
                        Search Articles
                      </Link>
                    </Button>
                  </motion.div>

                  <motion.div variants={menuItemVariants}>
                    <Button
                      size="lg"
                      asChild
                      className="justify-start w-full h-12 text-base"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Link href="/generate">
                        <PenTool className="mr-3 w-5 h-5" />
                        Generate Post
                      </Link>
                    </Button>
                  </motion.div>

                  <motion.div
                    className="mt-8 mb-4 font-medium text-muted-foreground text-sm"
                    variants={menuItemVariants}
                  >
                    Explore
                  </motion.div>

                  <motion.div variants={menuItemVariants}>
                    <Button
                      variant="ghost"
                      size="lg"
                      asChild
                      className="justify-start w-full h-12 text-base"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Link href="/blog">
                        <BookOpen className="mr-3 w-5 h-5" />
                        All Articles
                      </Link>
                    </Button>
                  </motion.div>

                  <motion.div variants={menuItemVariants}>
                    <Button
                      variant="ghost"
                      size="lg"
                      asChild
                      className="justify-start w-full h-12 text-base"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Link href="/trending">
                        <TrendingUp className="mr-3 w-5 h-5" />
                        Trending
                      </Link>
                    </Button>
                  </motion.div>

                  <motion.div variants={menuItemVariants}>
                    <Button
                      variant="ghost"
                      size="lg"
                      asChild
                      className="justify-start w-full h-12 text-base"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Link href="/dashboard">
                        <User className="mr-3 w-5 h-5" />
                        Dashboard
                      </Link>
                    </Button>
                  </motion.div>
                </motion.div>

                <motion.div
                  className="p-6 border-t"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="mb-4 font-medium text-muted-foreground text-sm">Settings</div>
                  <Button
                    variant="ghost"
                    size="lg"
                    asChild
                    className="justify-start w-full h-12 text-base"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Link href="/settings">
                      <Settings className="mr-3 w-5 h-5" />
                      Preferences
                    </Link>
                  </Button>

                  <div className="mt-6 pt-4 border-t">
                    <p className="text-muted-foreground text-xs">Blog Genny v1.0</p>
                    <p className="text-muted-foreground text-xs">AI-Powered Blog Generator</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
