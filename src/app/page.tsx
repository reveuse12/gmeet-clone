import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Camera, Video, Users, Shield, Zap, Globe } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function Page() {
  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 hidden md:flex">
            <Link className="mr-6 flex items-center space-x-2" href="/">
              <Camera className="h-6 w-6" />
              <span className="hidden font-bold sm:inline-block">MeetClone</span>
            </Link>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <Link href="#features" className="transition-colors hover:text-foreground/80 text-foreground/60">
                Features
              </Link>
              <Link href="#pricing" className="transition-colors hover:text-foreground/80 text-foreground/60">
                Pricing
              </Link>
              <Link href="#about" className="transition-colors hover:text-foreground/80 text-foreground/60">
                About
              </Link>
            </nav>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <div className="w-full flex-1 md:w-auto md:flex-none">
              <ThemeToggle />
            </div>
            <Button>Sign In</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container px-4 md:px-6 py-12 md:py-24 lg:py-32">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Meet, chat, and collaborate from anywhere
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Premium video meetings. Now free for everyone. We re-engineered the service for secure business
                meetings.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button size="lg">
                <Video className="mr-2 h-4 w-4" />
                New Meeting
              </Button>
              <Button size="lg" variant="outline">
                Join Meeting
              </Button>
            </div>
          </div>
          <div className="mx-auto aspect-video overflow-hidden rounded-xl border bg-muted lg:order-last">
            <Image alt="Hero" className="object-cover w-full" height="310" src="/placeholder.svg" width="550" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container px-4 md:px-6 py-12 md:py-24 lg:py-32 bg-muted">
        <div className="mx-auto grid max-w-5xl items-center gap-6 lg:grid-cols-2 lg:gap-12">
          <div className="space-y-4">
            <div className="inline-block rounded-lg bg-background px-3 py-1 text-sm">Features</div>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              Everything you need for better meetings
            </h2>
            <p className="max-w-[600px] text-muted-foreground md:text-xl">
              Get the best video meeting experience with our premium features designed for teams of all sizes.
            </p>
          </div>
          <div className="grid gap-6 lg:gap-8">
            <div className="flex gap-4">
              <Users className="h-6 w-6 shrink-0" />
              <div className="space-y-2">
                <h3 className="font-bold">Up to 250 participants</h3>
                <p className="text-sm text-muted-foreground">
                  Host large meetings with up to 250 participants at once.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <Shield className="h-6 w-6 shrink-0" />
              <div className="space-y-2">
                <h3 className="font-bold">Enterprise-grade security</h3>
                <p className="text-sm text-muted-foreground">
                  All meetings are encrypted in transit and our security measures are always active.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <Zap className="h-6 w-6 shrink-0" />
              <div className="space-y-2">
                <h3 className="font-bold">Low-latency streaming</h3>
                <p className="text-sm text-muted-foreground">
                  Experience crystal clear video and audio with our optimized streaming technology.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <Globe className="h-6 w-6 shrink-0" />
              <div className="space-y-2">
                <h3 className="font-bold">Available worldwide</h3>
                <p className="text-sm text-muted-foreground">
                  Connect from anywhere with our globally distributed infrastructure.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container px-4 md:px-6 py-12 md:py-24 lg:py-32">
        <div className="mx-auto max-w-3xl space-y-4 text-center">
          <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Ready to start your first meeting?</h2>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
            Try MeetClone today and experience the future of video conferencing. No credit card required.
          </p>
          <div className="space-x-4">
            <Button size="lg">Get Started for Free</Button>
            <Button size="lg" variant="outline">
              View Plans
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <Camera className="h-6 w-6" />
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              Built by{" "}
              <a href="#" className="font-medium underline underline-offset-4">
                MeetClone
              </a>
              . The source code is available on{" "}
              <a href="#" className="font-medium underline underline-offset-4">
                GitHub
              </a>
              .
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

