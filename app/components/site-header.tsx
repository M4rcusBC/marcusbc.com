import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"
import MobileNav from "./mobile-nav"
import { SignInButton } from "@/components/auth/signin-button"

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex items-center">
          <MobileNav />
          <Link className="mr-6 flex items-center space-x-2" href="/">
            <span className="font-bold sm:inline-block">marcusbc.com</span>
          </Link>
        </div>
        <div className="hidden md:flex ml-4">
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="/#about" className="transition-colors hover:text-foreground/80">
              About
            </Link>
            <Link href="/#projects" className="transition-colors hover:text-foreground/80">
              Projects
            </Link>
            <Link href="/tools" className="transition-colors hover:text-foreground/80">
              Tools
            </Link>
            <Link href="/demos" className="transition-colors hover:text-foreground/80">
              Demos
            </Link>
            <Link href="/contact" className="transition-colors hover:text-foreground/80">
              Contact
            </Link>
          </nav>
        </div>
        <div className="ml-auto flex items-center space-x-2">
          <ThemeToggle />
          <SignInButton />
          <Button variant="outline" asChild className="hidden sm:flex">
            <Link href="/resume">Resume</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
