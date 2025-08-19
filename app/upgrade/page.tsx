import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { UpgradePlans } from "@/components/upgrade-plans"
import { redirect } from "next/navigation"

export default async function UpgradePage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect("/auth/signin")
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              Upgrade to Premium
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Unlock the full potential of Blog Genny with our premium features.
              Take your content creation to the next level.
            </p>
          </div>
          
          <UpgradePlans />
        </div>
      </main>
      <Footer />
    </>
  )
}
