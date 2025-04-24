import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import type React from "react"
import SiteHeader from "./components/site-header"
import SiteFooter from "./components/site-footer"
import CookieNotice from "./components/cookie-notice"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Marcus Clements - Full Stack Developer",
  description: "Full stack developer portfolio showcasing projects, tools, and interactive code demos",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.className)}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="relative flex min-h-screen flex-col">
            <SiteHeader />
            <div className="flex-1">{children}</div>
            <SiteFooter />
          </div>
          <CookieNotice />
        </ThemeProvider>
      </body>
    </html>
  )
}
