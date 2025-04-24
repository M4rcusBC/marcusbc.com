"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X } from "lucide-react"

export default function CookieNotice() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if the user has already accepted cookies
    const cookiesAccepted = localStorage.getItem("cookiesAccepted")
    if (!cookiesAccepted) {
      setIsVisible(true)
    }
  }, [])

  const acceptCookies = () => {
    localStorage.setItem("cookiesAccepted", "true")
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-4 left-0 right-0 z-50 mx-auto w-full max-w-md px-4">
      <Card className="p-4 shadow-lg">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <h3 className="font-medium">Cookie Notice</h3>
            <p className="text-sm text-muted-foreground">
              Traffic on this site is proxied through the Cloudflare network for performance and security. By continuing to use this site, you
              agree to our use of cookies and Cloudflare's <a href="https://www.cloudflare.com/privacypolicy/">privacy policy</a>.
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setIsVisible(false)}>
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
        <div className="mt-4 flex justify-end space-x-2">
          <Button variant="outline" size="sm" onClick={() => setIsVisible(false)}>
            Decline
          </Button>
          <Button size="sm" onClick={acceptCookies}>
            Accept
          </Button>
        </div>
      </Card>
    </div>
  )
}
