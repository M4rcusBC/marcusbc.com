"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
// import { useFormStatus } from "react-dom" // removed because we'll handle pending manually

export default function ContactForm() {
  const [message, setMessage] = useState("")
  const [success, setSuccess] = useState(false)
  const [pending, setPending] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    setMessage("")
    
    try {
      const formData = new FormData(e.currentTarget)
      const name = formData.get("name") as string
      const email = formData.get("email") as string
      const formMessage = formData.get("message") as string

      const response = await fetch("https://formspree.io/f/mbgdggjg", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, message: formMessage }),
      })

      if (!response.ok) {
        throw new Error("Failed to send message")
      }

      setMessage("Thanks for your message! I'll get back to you within 24 hours.")
      setSuccess(true)

      // Reset form if successful
      const form = document.getElementById("contact-form") as HTMLFormElement
      form?.reset()
    } catch (error) {
      setMessage("Something went wrong. Please try again.")
      setSuccess(false)
    } finally {
      setPending(false)
    }
  }

  return (
    <Card className="p-6">
      <form id="contact-form" onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2">
            Name
          </label>
          <Input id="name" name="name" required disabled={pending} />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Email
          </label>
          <Input id="email" name="email" type="email" required disabled={pending} />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium mb-2">
            Message
          </label>
          <Textarea id="message" name="message" required disabled={pending} />
        </div>
        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "Sending..." : "Send Message"}
        </Button>
        {message && (
          <p
            className={`text-sm text-center mt-4 ${success ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}
          >
            {message}
          </p>
        )}
      </form>
    </Card>
  )
}
