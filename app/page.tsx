import { Button } from "@/components/ui/button"
import { Github, Linkedin, Mail } from "lucide-react"
import Link from "next/link"
import ProjectCard from "./components/project-card"
import { getProjects } from "./actions"

export default async function Page() {
  const projects = await getProjects()

  return (
    <div className="min-h-screen bg-background">
      <main className="container px-4 md:px-6">
        <section id="about" className="relative py-12 md:py-24 lg:py-32 overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(52,211,153,0.15),rgba(34,211,238,0.15),transparent)] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.15),rgba(6,182,212,0.1),transparent)]" />
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-500 animate-in fade-in zoom-in duration-1000">
                  Welcome!
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  I'm Marcus Clements, a software engineering student with a passion for building challenging and useful software.
                  I enjoy working with modern technologies and am always eager to learn new skills.
                  This website showcases my projects, skills, and interests in the tech world, as well as a blog about my experiences and insights.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="https://github.com/m4rcusbc" target="_blank">
                  <Button variant="outline" size="icon">
                    <Github className="h-4 w-4" />
                    <span className="sr-only">GitHub</span>
                  </Button>
                </Link>
                <Link href="https://linkedin.com/in/marcusbclements" target="_blank">
                  <Button variant="outline" size="icon">
                    <Linkedin className="h-4 w-4" />
                    <span className="sr-only">LinkedIn</span>
                  </Button>
                </Link>
                <Link href="mailto:admin@marcusbc.com">
                  <Button variant="outline" size="icon">
                    <Mail className="h-4 w-4" />
                    <span className="sr-only">Email</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section id="projects" className="py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-12 text-center">Projects</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.length > 0 ? (
                projects.map((project: any) => (
                  <ProjectCard
                    key={project.id}
                    title={project.title}
                    description={project.description}
                    link={project.github_url}
                    tags={project.tags || []}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-12 text-muted-foreground">
                  No projects could be loaded at this time. Check back later!
                </div>
              )}
            </div>

            <div className="mt-12 text-center">
              <Button asChild>
                <Link href="https://github.com/m4rcusbc" target="_blank">
                  <Github className="mr-2 h-4 w-4" />
                  View All Projects on GitHub
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="flex flex-col items-center text-center p-6 border rounded-xl bg-card transition-all duration-300 hover:border-primary/40 hover:shadow-md hover:shadow-primary/5">
                <h3 className="text-xl font-semibold mb-4">Read My Blog</h3>
                <p className="text-muted-foreground mb-6">Thoughts on software engineering, cloud architecture, and building side projects.</p>
                <Button asChild>
                  <Link href="/blog">View Blog</Link>
                </Button>
              </div>

              <div className="flex flex-col items-center text-center p-6 border rounded-xl bg-card transition-all duration-300 hover:border-primary/40 hover:shadow-md hover:shadow-primary/5">
                <h3 className="text-xl font-semibold mb-4">Code Demos</h3>
                <p className="text-muted-foreground mb-6">Interactive code examples you can run in your browser.</p>
                <Button asChild>
                  <Link href="/demos">View Demos</Link>
                </Button>
              </div>

              <div className="flex flex-col items-center text-center p-6 border rounded-xl bg-card transition-all duration-300 hover:border-primary/40 hover:shadow-md hover:shadow-primary/5">
                <h3 className="text-xl font-semibold mb-4">Get in Touch</h3>
                <p className="text-muted-foreground mb-6">Have a question or want to work together?</p>
                <Button asChild>
                  <Link href="/contact">Contact Me</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
