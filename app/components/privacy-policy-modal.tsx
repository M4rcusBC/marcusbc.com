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
import { X } from "lucide-react";

export const PRIVACY_POLICY_VERSION = "1.0.1";

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
            Last updated: April 26, 2025<br />
            Version {PRIVACY_POLICY_VERSION}
          </DialogDescription>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground" />
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-4 text-sm">
            <p>
              This Privacy Policy describes how marcusbc.com ("we", "us", or "our") collects, uses, and shares your personal information when you visit or interact with our website.
            </p>

            <h3 className="text-lg font-medium mt-6">Information We Collect</h3>
            <p>
              <strong>Personal Information:</strong> When you interact with our site, we may collect certain information from you, including:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Email address (if you sign up or contact us)</li>
              <li>Name (if provided)</li>
              <li>Authentication information when you sign in</li>
            </ul>

            <h3 className="text-lg font-medium mt-6">Usage Data</h3>
            <p>
              We may also collect information about how you access and use the website:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Browser type and version</li>
              <li>Pages visited</li>
              <li>Traffic source</li>
              <li>Device information</li>
            </ul>

            <h3 className="text-lg font-medium mt-6">Cookies and Similar Technologies</h3>
            <p>
              We use cookies and similar tracking technologies to track activity on our website and store certain information. Cookies are files with a small amount of data which include an anonymous unique identifier.
            </p>
            <p>
              You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our site, including authentication.
            </p>

            <h3 className="text-lg font-medium mt-6">How We Use Your Information</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>To provide and maintain our service</li>
              <li>To notify you about changes to our service</li>
              <li>To allow you to participate in interactive features when you choose to do so</li>
              <li>To provide customer support</li>
              <li>To gather analysis or valuable information so that we can improve our service</li>
              <li>To monitor the usage of our service</li>
              <li>To detect, prevent and address technical issues or malicious behavior on our site</li>
            </ul>

            <h3 className="text-lg font-medium mt-6">Third-Party Services</h3>
            <p>
              Our website uses Cloudflare for security and performance optimization. To accomplish this, traffic to and from the site is first proxied through Cloudflare.
              As such, your usage of this site is governed by Cloudflare's privacy policy in addition to our own. By using our site, you agree to the collection and use of information in accordance with these policies.
              <br />Cloudflare's privacy policy can be viewed <a href="https://www.cloudflare.com/privacypolicy/" className="text-blue-600 dark:text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">here <img src="/assets/external-link.svg" className="inline h-4 w-4 ml-1" alt="external link icon" /></a>.
            </p>

            <h3 className="text-lg font-medium mt-6">Data Security</h3>
            <p>
              The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.
            </p>

            <h3 className="text-lg font-medium mt-6">Changes to This Privacy Policy</h3>
            <p>
              We may update our Privacy Policy at any point. Any changes will be reflected here with an updated effective date. We encourage you to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
            </p>

            <h3 className="text-lg font-medium mt-6">Contact Us</h3>
            <p>
              If you have any questions about this Privacy Policy, please contact us at admin@marcusbc.com.
            </p>
            
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}