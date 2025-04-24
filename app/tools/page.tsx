import ToolsSection from "../components/tools-section"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function ToolsPage() {
  return (
    <div className="container py-12">
      <div className="flex items-center mb-8">
        <Link href="/">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>

      <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-12 text-center">
        Self-Hosted Tools
      </h1>

      <ToolsSection />
    </div>
  )
}
