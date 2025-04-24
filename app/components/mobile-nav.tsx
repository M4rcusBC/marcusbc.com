"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Marcus Clements</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-4 mt-8">
          <Link href="/#about" className="text-lg font-medium hover:underline" onClick={() => setOpen(false)}>
            About
          </Link>
          <Link href="/#projects" className="text-lg font-medium hover:underline" onClick={() => setOpen(false)}>
            Projects
          </Link>
          <Link href="/tools" className="text-lg font-medium hover:underline" onClick={() => setOpen(false)}>
            Tools
          </Link>
          <Link href="/demos" className="text-lg font-medium hover:underline" onClick={() => setOpen(false)}>
            Demos
          </Link>
          <Link href="/contact" className="text-lg font-medium hover:underline" onClick={() => setOpen(false)}>
            Contact
          </Link>
          <Link href="/resume" className="text-lg font-medium hover:underline" onClick={() => setOpen(false)}>
            Resume
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
