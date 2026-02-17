"use client"

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function DownloadButton({ filename }: { filename: string }) {
  
  return (
    <Button variant="outline" size="sm" disabled>
      <Download className="mr-2 h-4 w-4" />
      Download PDF (Coming Soon)
    </Button>
  );
}