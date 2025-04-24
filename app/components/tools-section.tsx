import { getTools } from "../actions"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { ExternalLink } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default async function ToolsSection() {
  const tools = await getTools()

  // Group tools by category
  const toolsByCategory: Record<string, any[]> = {}
  tools.forEach((tool: any) => {
    if (!toolsByCategory[tool.category]) {
      toolsByCategory[tool.category] = []
    }
    toolsByCategory[tool.category].push(tool)
  })

  return (
    <div className="space-y-8">
      {Object.entries(toolsByCategory).map(([category, categoryTools]) => (
        <div key={category}>
          <h3 className="text-xl font-semibold mb-4">{category}</h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {categoryTools.map((tool: any) => (
              <Card key={tool.id} className="overflow-hidden">
                <div className="relative h-40">
                  <Image
                    src={tool.image_url || "/placeholder.svg?height=160&width=320"}
                    alt={tool.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h4 className="font-semibold text-lg mb-2">{tool.name}</h4>
                  <p className="text-sm text-muted-foreground">{tool.description}</p>
                </CardContent>
                {tool.url && (
                  <CardFooter className="p-4 pt-0">
                    <Link
                      href={tool.url}
                      target="_blank"
                      className="inline-flex items-center gap-2 text-sm hover:underline"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Visit Tool
                    </Link>
                  </CardFooter>
                )}
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
