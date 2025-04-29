"use client"

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import Link from "next/link";
import { useUser } from "@stackframe/stack";
import { useState } from "react";

export default function DownloadButton({ filename }: { filename: string }) {
  const user = useUser();
  const [isDownloading, setIsDownloading] = useState(false);
  
  const handleDownload = async () => {
    if (!user) return;
    
    setIsDownloading(true);
    try {
      // Create a temporary anchor element
      const a = document.createElement('a');
      a.href = `/api/protected-assets?file=${filename}`;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setIsDownloading(false);
    }
  };
  
  return !user ? (
    <Link href={`/signin?after_auth_return_to=${window.location.pathname}`}>
      <Button variant="outline" size="sm">
        Sign In to Download
      </Button>
    </Link>
  ) : (
    <Button onClick={handleDownload} disabled={isDownloading}>
      <Download className="mr-2 h-4 w-4" />
      {isDownloading ? "Downloading..." : "Download PDF"}
    </Button>
  );
}