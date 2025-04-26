"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X } from "lucide-react"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog"
import { PrivacyPolicyModal } from "./privacy-policy-modal";
import { PRIVACY_POLICY_VERSION } from "./privacy-policy-modal"


export default function CookieNotice() {
  const [isVisible, setIsVisible] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)
    const [isPrivacyPolicyOpen, setPrivacyPolicyOpen] = useState(false);
  
  useEffect(() => {
    // Check if the user has already accepted cookies
    const cookiesAccepted = localStorage.getItem("cookiesAccepted")
    const acceptedVersion = localStorage.getItem("policyVersion")
    
    // Show notice if never accepted OR accepted an older version
    if (!cookiesAccepted || acceptedVersion !== PRIVACY_POLICY_VERSION) {
      setIsVisible(true)
    }
  }, [])

  const acceptCookies = () => {
    localStorage.setItem("cookiesAccepted", "true")
    localStorage.setItem("policyVersion", PRIVACY_POLICY_VERSION)
    setIsVisible(false)
  }


  if (!isVisible) return null

  return (
    <>
      <div className="fixed bottom-4 left-0 right-0 z-50 mx-auto w-full max-w-md px-4">
        <Card className="p-4 shadow-lg">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h3 className="font-medium">Privacy Notice</h3>
              <p className="text-sm text-muted-foreground">
                Traffic on this site is proxied through the Cloudflare network for performance and security. By continuing to use this site, you
                agree to both <button 
                  type="button"
                  className="text-primary underline" 
                  onClick={() => setPrivacyPolicyOpen(true)}
                >our</button> and <a 
                  href="https://cloudflare.com/privacypolicy/"
                  className="text-primary underline"
                  target="_blank"
                  rel="noreferrer"
                >Cloudflare</a>'s privacy policies. If you do not agree, please navigate away from this page.
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsVisible(false)}>
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <button 
              type="button"
              aria-label="Why am I seeing this?"
              onClick={() => setShowExplanation(true)}
              className="text-xs text-muted-foreground hover:underline"
            >
              Why am I seeing this?
            </button>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={() => {
                setIsVisible(false)
                history.back()
              }}>
                Decline
              </Button>
              <Button size="sm" onClick={acceptCookies}>
                Accept
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Explanation Dialog */}
      <Dialog open={showExplanation} onOpenChange={setShowExplanation}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Why am I seeing this notice?</DialogTitle>
            <DialogDescription>
              This explanation helps you understand cookie notices and potential privacy policy changes.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-sm">
            <p>
              You're seeing this cookie notice for one of the following reasons:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>First visit:</strong> This is your first time visiting our website
              </li>
              <li>
                <strong>Cleared browser data:</strong> You've cleared your cookies or browsing data since your last visit
              </li>
              <li>
                <strong>Privacy policy update:</strong> Our privacy policy has been updated since you last accepted<br />
                <strong>Current version:</strong> {PRIVACY_POLICY_VERSION}<br />
                <strong>Accepted version:</strong> {localStorage.getItem("policyVersion") || "Not accepted"}
              </li>
              <li>
                <strong>New device:</strong> You're visiting from a new device or browser
              </li>
            </ul>
            <p>
              We require your consent to use cookies and other technologies as outlined in our privacy policy. These help us provide a better experience and understand how users interact with our site.
            </p>
            <p>
              When our privacy policy is updated, we ask for your consent again to ensure you're aware of any changes to how we collect, process, or use any data you provide to the site.
            </p>
          </div>
        </DialogContent>
      </Dialog>
      <PrivacyPolicyModal open={isPrivacyPolicyOpen} onOpenChange={setPrivacyPolicyOpen} />
    </>
  )
}