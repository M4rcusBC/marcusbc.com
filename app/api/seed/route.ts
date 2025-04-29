import { executeTransaction } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    await executeTransaction(async (client) => {
      // Seed projects
      await client.query(`
        INSERT INTO projects (title, description, image_url, github_url, live_url)
        VALUES 
          ('E-commerce Platform', 'A full-stack e-commerce platform built with Next.js, Prisma, and Stripe integration.', '/placeholder.svg?height=400&width=600', 'https://github.com', 'https://example.com'),
          ('Task Management App', 'A real-time task management application with team collaboration features.', '/placeholder.svg?height=400&width=600', 'https://github.com', 'https://example.com'),
          ('AI Chat Interface', 'An AI-powered chat interface with natural language processing capabilities.', '/placeholder.svg?height=400&width=600', 'https://github.com', 'https://example.com')
        ON CONFLICT DO NOTHING
      `)

      // Get the project IDs
      const projectsResult = await client.query(`SELECT id, title FROM projects LIMIT 3`)
      const projects = projectsResult.rows

      // Seed project tags
      if (projects.length > 0) {
        for (const project of projects) {
          if (project.id === projects[0].id) {
            await client.query(
              `
              INSERT INTO project_tags (project_id, tag)
              VALUES 
                ($1, 'Next.js'),
                ($1, 'Prisma'),
                ($1, 'Stripe')
              ON CONFLICT DO NOTHING
            `,
              [project.id],
            )
          } else if (project.id === projects[1].id) {
            await client.query(
              `
              INSERT INTO project_tags (project_id, tag)
              VALUES 
                ($1, 'React'),
                ($1, 'Node.js'),
                ($1, 'Socket.io')
              ON CONFLICT DO NOTHING
            `,
              [project.id],
            )
          } else if (project.id === projects[2].id) {
            await client.query(
              `
              INSERT INTO project_tags (project_id, tag)
              VALUES 
                ($1, 'OpenAI'),
                ($1, 'Next.js'),
                ($1, 'TailwindCSS')
              ON CONFLICT DO NOTHING
            `,
              [project.id],
            )
          }
        }
      }

      // Seed tools
      await client.query(`
        INSERT INTO tools (name, description, url, image_url, category)
        VALUES 
          ('Nextcloud', 'Self-hosted cloud storage and collaboration platform', 'https://nextcloud.com', '/placeholder.svg?height=160&width=320', 'Productivity'),
          ('Gitea', 'Self-hosted Git service', 'https://gitea.io', '/placeholder.svg?height=160&width=320', 'Development'),
          ('Home Assistant', 'Open source home automation platform', 'https://www.home-assistant.io', '/placeholder.svg?height=160&width=320', 'Smart Home'),
          ('Jellyfin', 'Free software media system', 'https://jellyfin.org', '/placeholder.svg?height=160&width=320', 'Media'),
          ('Bitwarden', 'Open source password management solution', 'https://bitwarden.com', '/placeholder.svg?height=160&width=320', 'Security'),
          ('Grafana', 'Open source analytics and monitoring solution', 'https://grafana.com', '/placeholder.svg?height=160&width=320', 'Monitoring')
        ON CONFLICT DO NOTHING
      `)

      // Seed demos with parameterized queries
      const demoData = [
        {
          title: "Fibonacci Sequence",
          description: "A simple function to generate the Fibonacci sequence",
          code: `function fibonacci(n) {
  const sequence = [0, 1];
  if (n <= 1) return sequence.slice(0, n + 1);
  for (let i = 2; i <= n; i++) {
    sequence.push(sequence[i - 1] + sequence[i - 2]);
  }
  return sequence;
}
// Generate first n Fibonacci numbers

const n = number;

const result = fibonacci(n);
console.log("Fibonacci Sequence:", result);
const sum = result.reduce((a, b) => a + b, 0);
console.log("Sum of sequence:", sum);`,
          language: "javascript",
        },
        {
          title: "Sorting Algorithms",
          description: "Implementation of common sorting algorithms",
          code: `function bubbleSort(arr) {
    const array = [...arr]; 
    const n = array.length; 
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            if (array[j] > array[j + 1]) {
                // Swap elements        
                [array[j], array[j + 1]] = [array[j + 1], array[j]];
            }
        }
    } r
    return array;
} 
    
function quickSort(arr) { 
    if (arr.length <= 1) { 
        return arr; } 
        const pivot = arr[Math.floor(arr.length / 2)]; 
        const left = arr.filter(x => x < pivot); const middle = arr.filter(x => x === pivot); 
        const right = arr.filter(x => x > pivot); 
        return [...quickSort(left), ...middle, ...quickSort(right)]; }



const testArray = inputArray.split(',').map(Number);
console.log("Original array:", testArray); 
console.log("Bubble sort:", bubbleSort(testArray)); 
console.log("Quick sort:", quickSort(testArray));`,
          language: "javascript",
        },
        {
          title: "Async/Await Example",
          description: "Demonstration of asynchronous JavaScript",
          code: `async function fetchData(delay) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        id: Math.floor(Math.random() * 100),
        timestamp: new Date().toISOString(),
        value: Math.random().toFixed(2)
      });
    }, delay);
  });
}

async function processData() {
  console.log("Starting data fetch...");
  
  try {
    // Parallel requests
    const startTime = Date.now();
    const results = await Promise.all([
      fetchData(1000),
      fetchData(1500),
      fetchData(500)
    ]);
    
    console.log("All data fetched in " + (Date.now() - startTime) + "ms");
    console.log("Results:", results);

    // Sequential processing
    console.log("Processing sequentially...");
    for (const item of results) {
      console.log("Processing item " + item.id);
      // Simulate processing
      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    console.log("All processing complete!");
  } catch (error) {
    console.error("Error:", error);
  }
}

processData();`,
          language: "javascript",
        },
      ]

      // Insert each demo with parameterized query
      for (const demo of demoData) {
        await client.query(
          `INSERT INTO demos (title, description, code, language) 
           VALUES ($1, $2, $3, $4) 
           ON CONFLICT DO NOTHING`,
          [demo.title, demo.description, demo.code, demo.language],
        )
      }
    })

    return NextResponse.json({ success: true, message: "Sample data seeded successfully" })
  } catch (error) {
    console.error("Error seeding data:", error)
    return NextResponse.json({ success: false, message: "Error seeding data" }, { status: 500 })
  }
}