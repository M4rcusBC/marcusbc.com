"use client";

import { GithubIcon, HeartIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { SitemapModal } from "./sitemap-modal";
import { PrivacyPolicyModal } from "./privacy-policy-modal";

export default function SiteFooter() {
  const [isSitemapOpen, setSitemapOpen] = useState(false);
  const [isPrivacyPolicyOpen, setPrivacyPolicyOpen] = useState(false);

  return (
    <footer className="border-t">
      <div className="container flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2025 Marcus Clements. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <button 
            type="button"
            className="text-xs hover:underline underline-offset-4 text-gray-500 dark:text-gray-400"
            onClick={() => setSitemapOpen(true)}
          >
            Sitemap
          </button>
          <button 
            type="button"
            className="text-xs hover:underline underline-offset-4 text-gray-500 dark:text-gray-400"
            onClick={() => setPrivacyPolicyOpen(true)}
          >
            Privacy Policy
          </button>
          <Link 
            className="text-xs hover:underline underline-offset-4 text-gray-500 dark:text-gray-400 flex items-center" 
            href="https://github.com/m4rcusbc/marcusbc.com" 
            target="_blank"
          >
            View Source
            <GithubIcon className="h-4 w-4 inline ml-2" />
          </Link>
        </nav>
        <Button disabled variant="outline" className="text-xs text-gray-400 dark:text-gray-300">
          <p className="text-xs">v0.0.2 | Built with<HeartIcon className="h-4 w-4 inline mx-1 mb-1 text-red-500" /></p>
        </Button>
      </div>

      {/* Modals */}
      <SitemapModal open={isSitemapOpen} onOpenChange={setSitemapOpen} />
      <PrivacyPolicyModal open={isPrivacyPolicyOpen} onOpenChange={setPrivacyPolicyOpen} />
    </footer>
  );
}