"use client"

import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"
import MobileNav from "./mobile-nav"
import { motion } from "framer-motion"
import ProfileButton from "@/components/auth/profile-button"

export default function SiteHeader() {
  return (
    <motion.header 
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="container flex h-14 items-center">
        <div className="flex items-center">
          <MobileNav />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <Link className="mr-6 flex items-center space-x-2" href="/">
              <span className="font-bold sm:inline-block">marcusbc.com</span>
            </Link>
          </motion.div>
        </div>
        <div className="hidden md:flex ml-4">
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {[
              { href: "/#projects", label: "Projects" },
              { href: "/tools", label: "Tools" },
              { href: "/demos", label: "Demos" },
              { href: "/contact", label: "Contact" }
            ].map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ delay: 0.1 + index * 0.1, duration: 0.4 }}
              >
                <Link href={item.href} className="transition-colors hover:text-foreground/80 hover:underline focus-visible:text-foreground/80 focus-visible:underline">
                  {item.label}
                </Link>
              </motion.div>
            ))}
          </nav>
        </div>
        <motion.div 
          className="ml-auto flex items-center space-x-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="outline" asChild className="hidden sm:flex">
              <Link href="/resume">Resume</Link>
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.0 }} whileTap={{ scale: 0.95 }}>
            <ProfileButton />
          </motion.div>
        </motion.div>
      </div>
    </motion.header>
  )
}