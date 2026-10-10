import { Button } from "@/components/ui/button"
import { ArrowLeft, Bug, Lightbulb, Handshake } from "lucide-react"
import Link from "next/link"
import ContactForm from "../components/contact-form"

export default function ContactPage() {
  return (
    <div className="container py-12 max-w-5xl">
      <div className="flex items-center mb-8">
        <Link href="/">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>

      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">Let's Connect!</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Whether you want to report a bug, suggest a feature, have feedback for the site, or just want to connect, I'd love to hear from you.
        </p>
        <div className="mt-6 inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-sm font-medium text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50 shadow-sm">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          Form submissions are checked regularly! I'll get back to you within 24 hours.
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-start">
        <div className="space-y-8 mt-4">
          <div className="flex gap-4">
            <div className="bg-primary/10 p-3 rounded-2xl h-fit text-primary">
              <Bug className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Report a Problem</h3>
              <p className="text-muted-foreground">Found a glitch on the site? Please let me know! I'd rather not host buggy or subpar software.</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-primary/10 p-3 rounded-2xl h-fit text-primary">
              <Lightbulb className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Request Features</h3>
              <p className="text-muted-foreground">Have a cool idea for the site or a project to work on? I'd love to work together!</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="bg-primary/10 p-3 rounded-2xl h-fit text-primary">
              <Handshake className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Collaborate & Network</h3>
              <p className="text-muted-foreground">Looking to team up or just want to network? I'm always looking to learn from others.</p>
            </div>
          </div>
        </div>

        <div>
          <ContactForm />
        </div>
      </div>
    </div>
  )
}
