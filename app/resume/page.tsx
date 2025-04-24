import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Download } from "lucide-react"
import Link from "next/link"

export default function ResumePage() {
  return (
    <div className="container py-12 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <Link href="/">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Portfolio
          </Button>
        </Link>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Download PDF
        </Button>
      </div>

      <Card className="p-8">
        <div className="space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Marcus Clements</h1>
            <p className="text-xl text-muted-foreground">Full Stack Developer</p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Summary</h2>
            <p>
              Experienced full stack developer with expertise in modern web technologies. Passionate about creating
              efficient, scalable, and user-friendly applications.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Experience</h2>

            <div className="space-y-2">
              <div className="flex justify-between">
                <h3 className="font-medium">Senior Developer</h3>
                <p className="text-sm text-muted-foreground">2020 - Present</p>
              </div>
              <p className="font-medium">Tech Company Inc.</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Led development of multiple web applications using React and Next.js</li>
                <li>Implemented CI/CD pipelines and improved deployment processes</li>
                <li>Mentored junior developers and conducted code reviews</li>
              </ul>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <h3 className="font-medium">Web Developer</h3>
                <p className="text-sm text-muted-foreground">2017 - 2020</p>
              </div>
              <p className="font-medium">Digital Agency Ltd.</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Developed responsive websites and web applications for various clients</li>
                <li>Worked with REST APIs and database integrations</li>
                <li>Collaborated with designers to implement UI/UX improvements</li>
              </ul>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Education</h2>
            <div className="flex justify-between">
              <p className="font-medium">Bachelor of Science in Computer Science</p>
              <p className="text-sm text-muted-foreground">2013 - 2017</p>
            </div>
            <p>University of Technology</p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {[
                "JavaScript",
                "TypeScript",
                "React",
                "Next.js",
                "Node.js",
                "PostgreSQL",
                "MongoDB",
                "AWS",
                "Docker",
                "Git",
                "CI/CD",
                "REST APIs",
                "GraphQL",
              ].map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-sm font-medium text-primary ring-1 ring-inset ring-primary/20"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
