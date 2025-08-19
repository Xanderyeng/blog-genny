import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="font-semibold mb-3">Blog Genny</h3>
            <p className="text-sm text-muted-foreground">
              AI-powered blog generation platform built with Next.js and MDX.
            </p>
          </div>

          <div>
            <h4 className="font-medium mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/generate" className="text-muted-foreground hover:text-foreground transition-colors">
                  Generate Post
                </Link>
              </li>
              <li>
                <Link href="/search" className="text-muted-foreground hover:text-foreground transition-colors">
                  Search
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-3">Built With</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Next.js App Router</li>
              <li>MDX & Gray Matter</li>
              <li>Tailwind CSS v4</li>
              <li>Shadcn/ui Components</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; 2024 Blog Genny. Built with ❤️ and AI.</p>
        </div>
      </div>
    </footer>
  )
}
