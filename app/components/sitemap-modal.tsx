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
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { X } from "lucide-react";

export function SitemapModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[85vh]">
        <DialogHeader>
          <DialogTitle>Site Map</DialogTitle>
          <DialogDescription>
            All pages and sections available on marcusbc.com
          </DialogDescription>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">Main Pages</h3>
              <ul className="mt-2 space-y-2">
                <li>
                  <Link 
                    href="/" 
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                    onClick={() => onOpenChange(false)}
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/#about" 
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                    onClick={() => onOpenChange(false)}
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/#projects" 
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                    onClick={() => onOpenChange(false)}
                  >
                    Projects
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/tools" 
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                    onClick={() => onOpenChange(false)}
                  >
                    Tools
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/demos" 
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                    onClick={() => onOpenChange(false)}
                  >
                    Demos
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/contact" 
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                    onClick={() => onOpenChange(false)}
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/resume" 
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                    onClick={() => onOpenChange(false)}
                  >
                    Resume
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium">Authentication</h3>
              <ul className="mt-2 space-y-2">
                <li>
                  <Link 
                    href="/auth/signin" 
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                    onClick={() => onOpenChange(false)}
                  >
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/auth/register" 
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                    onClick={() => onOpenChange(false)}
                  >
                    Register
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}