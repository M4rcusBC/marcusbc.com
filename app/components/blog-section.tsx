import { getBlogPosts } from "../actions"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { ArrowRight, Calendar } from "lucide-react"
import Link from "next/link"

export default async function BlogSection() {
  const posts = await getBlogPosts()

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post: any) => (
          <Card key={post.id} className="overflow-hidden border-border/80 transition-all duration-300 hover:border-primary/40 hover:shadow-md hover:shadow-primary/5 flex flex-col justify-between">
            <CardContent className="p-4 pt-6">
              <div className="flex items-center text-xs text-muted-foreground mb-3">
                <Calendar className="mr-1.5 h-3.5 w-3.5" />
                <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                <span className="mx-2">•</span>
                <span>{post.readTime}</span>
              </div>
              <h4 className="font-semibold text-lg mb-2">{post.title}</h4>
              <p className="text-sm text-muted-foreground">{post.excerpt}</p>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Link href={`/blog/${post.id}`} className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline group">
                Read Article
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
