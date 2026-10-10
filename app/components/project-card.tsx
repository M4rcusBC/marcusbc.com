import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Github, ExternalLink } from "lucide-react"
import Link from "next/link"

interface ProjectCardProps {
  title: string
  description: string
  link: string
  liveUrl?: string
  tags: string[]
}

export default function ProjectCard({ title, description, link, liveUrl, tags }: ProjectCardProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden border-border/80 transition-all duration-300 hover:border-primary/40 hover:shadow-md hover:shadow-primary/5">
      <CardContent className="p-4 flex-1">
        <h3 className="font-semibold text-xl mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-full bg-secondary/80 text-secondary-foreground px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ring-border/50"
            >
              {tag}
            </span>
          ))}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-4 mt-auto">
        {liveUrl && (
          <Link href={liveUrl} target="_blank" className="inline-flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors hover:underline">
            <ExternalLink className="h-4 w-4" />
            Live Site
          </Link>
        )}
        <Link href={link} target="_blank" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors hover:underline">
          <Github className="h-4 w-4" />
          View Source
        </Link>
      </CardFooter>
    </Card>
  )
}

