"use server"

import { executeQuery } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function submitContactForm(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const message = formData.get("message") as string

    // Insert the message into the database
    await executeQuery("INSERT INTO messages (name, email, message) VALUES ($1, $2, $3)", [name, email, message])

    revalidatePath("/")
    return {
      success: true,
      message: "Thanks for your message! I'll get back to you within 24 hours.",
    }
  } catch (error) {
    console.error("Error submitting contact form:", error)
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    }
  }
}

export async function getProjects() {
  try {
    // First get all projects
    const projects = await executeQuery(`
      SELECT * FROM projects
      ORDER BY created_at DESC
    `)

    // Then get tags for each project
    for (const project of projects) {
      const tags = await executeQuery(
        `
        SELECT tag FROM project_tags
        WHERE project_id = $1
      `,
        [project.id],
      )

      // Extract tags into an array
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
            project.tags = tags.map((t: any) => t.tag)
    }

    return projects
  } catch (error) {
    console.error("Error fetching projects:", error)
    return []
  }
}

export async function getTools() {
  try {
    const tools = await executeQuery(`
      SELECT * FROM tools
      ORDER BY category, name
    `)

    return tools
  } catch (error) {
    console.error("Error fetching tools:", error)
    return []
  }
}

export async function getDemos() {
  try {
    const demos = await executeQuery(`
      SELECT * FROM demos
      ORDER BY created_at DESC
    `)

    return demos
  } catch (error) {
    console.error("Error fetching demos:", error)
    return []
  }
}
