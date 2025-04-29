import { Button } from "@/components/ui/button"
import { CodeXmlIcon, Github, Linkedin, Mail, Twitter } from "lucide-react"
import Link from "next/link"
import ProjectCard from "./components/project-card"
import TechStack from "./components/tech-stack"
import { getProjects } from "./actions"

export default async function Page() {
  const projects = await getProjects()

  return (
    <div className="min-h-screen bg-background">
      <main className="container px-4 md:px-6">
        <section id="about" className="py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Welcome!
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  I'm a software engineering student with a passion for building challenging and useful software.
                  I enjoy working with modern technologies and am always eager to learn new skills.
                  This portfolio showcases my projects, skills, and interests in the tech world.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="https://github.com/m4rcusbc/marcusbc.com" target="_blank">
                  <Button variant="outline">
                    View Site Source
                    <CodeXmlIcon className="h-4 w-4" />
                  </Button>
                </Link>
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
                    image={project.image_url || "/placeholder.svg?height=400&width=600"}
                    link={project.github_url}
                    tags={project.tags || []}
                  />
                ))
              ) : ( // Sample projects - not meant to be displayed in production
                <>
                  <ProjectCard
                    title="E-commerce Platform"
                    description="A full-stack e-commerce platform built with Next.js, Prisma, and Stripe integration."
                    image="/placeholder.svg?height=400&width=600"
                    link="https://github.com"
                    tags={["Next.js", "Prisma", "Stripe"]}
                  />
                  <ProjectCard
                    title="Task Management App"
                    description="A real-time task management application with team collaboration features."
                    image="/placeholder.svg?height=400&width=600"
                    link="https://github.com"
                    tags={["React", "Node.js", "Socket.io"]}
                  />
                  <ProjectCard
                    title="AI Chat Interface"
                    description="An AI-powered chat interface with natural language processing capabilities."
                    image="/placeholder.svg?height=400&width=600"
                    link="https://github.com"
                    tags={["OpenAI", "Next.js", "TailwindCSS"]}
                  />
                </>
              )}
            </div>

            <div className="mt-12 text-center">
              <Button asChild>
                <Link href="https://github.com" target="_blank">
                  <Github className="mr-2 h-4 w-4" />
                  View All Projects on GitHub
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-12 text-center">
              Tech Stack
            </h2>
            <TechStack />
          </div>
        </section>

        <section className="py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="flex flex-col items-center text-center p-6 border rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Self-Hosted Tools</h3>
                <p className="text-muted-foreground mb-6">Explore my collection of self-hosted tools and services.</p>
                <Button asChild>
                  <Link href="/tools">View Tools</Link>
                </Button>
              </div>

              <div className="flex flex-col items-center text-center p-6 border rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Code Demos</h3>
                <p className="text-muted-foreground mb-6">Interactive code examples you can run in your browser.</p>
                <Button asChild>
                  <Link href="/demos">View Demos</Link>
                </Button>
              </div>

              <div className="flex flex-col items-center text-center p-6 border rounded-lg">
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
