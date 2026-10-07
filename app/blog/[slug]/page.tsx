import { getPostData, getAllPosts } from '@/lib/blog'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Calendar, Clock } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  try {
    const posts = getAllPosts()
    return posts.map((post) => ({
      slug: post.id,
    }))
  } catch (e) {
    console.error("Error in generateStaticParams:", e)
    return []
  }
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  
  try {
    const postData = await getPostData(resolvedParams.slug)
    
    return (
      <div className="container py-12 max-w-4xl">
        <div className="flex items-center mb-8">
          <Link href="/blog">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>
          </Link>
        </div>

        <article className="prose prose-zinc dark:prose-invert lg:prose-lg max-w-none">
          <div className="mb-8">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
              {postData.title}
            </h1>
            <div className="flex items-center text-muted-foreground space-x-4">
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                <span>{new Date(postData.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                <span>{postData.readTime}</span>
              </div>
            </div>
          </div>
          
          <div dangerouslySetInnerHTML={{ __html: postData.content || '' }} />
        </article>
      </div>
    )
  } catch (e) {
    notFound()
  }
}
