import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowLeft,
  Download,
  Mail,
  Phone,
  MapPin,
  Linkedin,
} from "lucide-react";
import Link from "next/link";
import DownloadButton from "@/components/download-button";

export default function ResumePage() {

  return (
    <div className="container py-12 container-center">
      <div className="flex justify-between items-center mb-8">
        <Link href="/">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Portfolio
          </Button>
        </Link>
        <DownloadButton filename="resume.pdf" />
      </div>

      <Card className="p-8 resume-content">
        <div className="space-y-8">
          {/* Header and Contact Info */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Marcus B Clements</h1>
            <p className="text-xl text-muted-foreground">
              Software Engineering Student
            </p>
            <div className="flex flex-wrap gap-4 mt-3 text-sm">
              <div className="flex items-center">
                <Mail className="mr-1 h-4 w-4" />
                <a href="admin@marcusbc.com" className="hover:underline">
                  marcus.bc@icloud.com
                </a>
              </div>
              <div className="flex items-center">
                <Phone className="mr-1 h-4 w-4" />
                <span>(763)-357-8293</span>
              </div>
              <div className="flex items-center">
                <MapPin className="mr-1 h-4 w-4" />
                <span>Saint Paul, MN</span>
              </div>
              <div className="flex items-center">
                <Linkedin className="mr-1 h-4 w-4" />
                <a
                  href="https://linkedin.com/in/marcusbclements"
                  className="hover:underline"
                >
                  LinkedIn
                </a>
              </div>
            </div>
          </div>

          {/* Professional Summary */}
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Professional Summary</h2>
            <p>
              Skilled multitasker with superior work ethic and great teamwork,
              problem-solving and organizational skills. Willing to take on any
              task to help the team and foster an accepting and diverse work
              environment. Reliable and dedicated team player with a hardworking
              and resourceful approach to problem-solving.
            </p>
          </div>

          {/* Work Experience */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Work Experience</h2>

            <div className="space-y-2">
              <div className="flex justify-between">
                <h3 className="font-medium">
                  Student Audiovisual Technician & IT Support Technician
                </h3>
                <p className="text-sm text-muted-foreground">
                  10/2023 - Present
                </p>
              </div>
              <p className="font-medium">University Of Wisconsin-La Crosse</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  Hosted and mixed live events in a professional team
                  environment with well-controlled lights, sound, and video
                  streaming
                </li>
                <li>
                  Streamlined event production by coordinating closely with
                  event organizers and presenters
                </li>
                <li>
                  Provided in-person, phone, and ticketing system customer
                  support
                </li>
                <li>
                  Handled daily hardware, software, and IAM system support
                  responsibilities
                </li>
                <li>
                  Delivered one-on-one customer support for students and staff
                  across campus software suite
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <h3 className="font-medium">Barista Trainer & Coffee Master</h3>
                <p className="text-sm text-muted-foreground">
                  01/2021 - Present (Part-Time & Seasonal)
                </p>
              </div>
              <p className="font-medium">Starbucks</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  Developed strong leadership, customer service, and
                  communication skills
                </li>
                <li>
                  Received Coffee Master and Barista Trainer certifications
                  after thorough training programs
                </li>
                <li>
                  Became proficient with delegating shift tasks, assisting with
                  schedule creation, and training
                </li>
                <li>
                  Boosted company reputation by maintaining a clean, efficient,
                  and inviting café environment
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <h3 className="font-medium">Repair Technician</h3>
                <p className="text-sm text-muted-foreground">
                  11/2021 - Present
                </p>
              </div>
              <p className="font-medium">Independent Phone Repair Business</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  Repaired and replaced iPhone components of various
                  difficulties as a service for around 12 friends and family
                  members
                </li>
              </ul>
            </div>
          </div>

          {/* Education */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Education</h2>

            <div className="space-y-1">
              <div className="flex justify-between">
                <p className="font-medium">
                  Master of Science and Engineering in Software Engineering –
                  Cybersecurity Emphasis
                </p>
                <p className="text-sm text-muted-foreground">
                  Expected 05/2027
                </p>
              </div>
              <p>University of Wisconsin-La Crosse</p>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <p className="font-medium">
                  Bachelor of Science in Computer Science – General Writing
                  Emphasis
                </p>
                <p className="text-sm text-muted-foreground">
                  Expected 05/2026
                </p>
              </div>
              <p>University of Wisconsin-La Crosse</p>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <p className="font-medium">
                  Google Cybersecurity Professional Certificate
                </p>
                <p className="text-sm text-muted-foreground">
                  Expected 04/2025
                </p>
              </div>
              <p>Coursera - Google Career Certificates</p>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <p className="font-medium">High School Diploma</p>
                <p className="text-sm text-muted-foreground">
                  Received 06/2022
                </p>
              </div>
              <p>Saint Paul Central Senior High School</p>
            </div>
          </div>

          {/* Skills */}
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {[
                "Java",
                "C/C++",
                "SQL",
                "HTML",
                "CSS",
                "JavaScript",
                "Node.js",
                "Git",
                "GitHub",
                "GitLab",
                "Microsoft AD",
                "Oral Communications",
                "Written Communications",
                "Equipment Troubleshooting",
                "Customer Service",
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
  );
}
