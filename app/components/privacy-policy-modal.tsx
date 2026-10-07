"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

export const PRIVACY_POLICY_VERSION = "0.2";

export function PrivacyPolicyModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] max-h-[85vh]">
        <DialogHeader>
          <DialogTitle>Privacy Policy</DialogTitle>
          <DialogDescription>
            Last updated: October 6, 2026<br />
            Version {PRIVACY_POLICY_VERSION}
          </DialogDescription>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground" />
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-4 text-sm">
            <p>
              This Privacy Policy describes how I handle information when you visit or interact with my website, marcusbc.com.
            </p>

            <h3 className="text-lg font-medium mt-6">Information I Do Not Collect</h3>
            <p>
              As a private individual running this portfolio site, I respect your privacy. I do not actively collect, store, or process any personal data.
              There are no user accounts, authentication systems, or analytics trackers on this site.
            </p>

            <h3 className="text-lg font-medium mt-6">Information You Provide</h3>
            <p>
              If you choose to use the contact form or email me directly, I will only use your email address and any information you provide to respond to your inquiry. I do not sell, rent, or share this information with anyone.
            </p>

            <h3 className="text-lg font-medium mt-6">Cookies and Similar Technologies</h3>
            <p>
              This site does not use tracking cookies or advertising cookies. Any cookies used are strictly necessary for the basic functioning of the website (such as remembering your dark/light mode preference or that you have dismissed the cookie notice).
            </p>

            <h3 className="text-lg font-medium mt-6">Third-Party Services</h3>
            <p>
              My website is hosted on Cloudflare Pages and uses Cloudflare for security and performance optimization. To accomplish this, traffic to and from the site is routed through Cloudflare's network.
              As such, your usage of this site is governed by Cloudflare's privacy policy in addition to my own.
              <br /><br />Cloudflare's privacy policy can be viewed <a href="https://www.cloudflare.com/privacypolicy/" className="text-blue-600 dark:text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">here<img src="/assets/external-link.svg" className="inline h-4 w-4" alt="external link icon" /></a>.
            </p>

            <h3 className="text-lg font-medium mt-6">Changes to This Privacy Policy</h3>
            <p>
              I may update my Privacy Policy from time to time. Any changes will be reflected here with an updated effective date.
            </p>

            <h3 className="text-lg font-medium mt-6">Contact Me</h3>
            <p>
              If you have any questions about this Privacy Policy, please contact me at admin@marcusbc.com.
            </p>
            
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}