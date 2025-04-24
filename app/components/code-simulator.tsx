"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface CodeSimulatorProps {
  code: string
  language: string
  title: string
}

export default function CodeSimulator({ code, language, title }: CodeSimulatorProps) {
  const [output, setOutput] = useState<string>("")
  const [isRunning, setIsRunning] = useState(false)
  const [activeTab, setActiveTab] = useState<string>("code")

  const runCode = async () => {
    setIsRunning(true)
    setOutput("")

    try {
      // For JavaScript/TypeScript code, we can use Function constructor to run it
      if (language === "javascript" || language === "typescript") {
        // Create a safe console.log replacement that captures output
        let simulationOutput = ""
        const simulatedConsole = {
          log: (...args: any[]) => {
            simulationOutput +=
              args.map((arg) => (typeof arg === "object" ? JSON.stringify(arg, null, 2) : String(arg))).join(" ") + "\n"
          },
          error: (...args: any[]) => {
            simulationOutput +=
              "Error: " +
              args.map((arg) => (typeof arg === "object" ? JSON.stringify(arg, null, 2) : String(arg))).join(" ") +
              "\n"
          },
        }

        // Wrap the code in a try-catch block
        const wrappedCode = `
          try {
            ${code.replace(/console\.log/g, "simulatedConsole.log")}
          } catch (error) {
            simulatedConsole.error(error.message);
          }
        `

        // Execute the code in a safe context
        const executeFunction = new Function("simulatedConsole", wrappedCode)
        executeFunction(simulatedConsole)

        setOutput(simulationOutput || "Code executed successfully with no output.")
      } else {
        setOutput(`Simulation for ${language} is not supported in the browser.`)
      }
    } catch (error) {
      setOutput(`Error: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setIsRunning(false)
      setActiveTab("output")
    }
  }

  return (
    <Card className="overflow-hidden">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          <h3 className="font-medium">{title}</h3>
          <Button onClick={runCode} disabled={isRunning} size="sm">
            {isRunning ? "Running..." : "Run Code"}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="px-4 pt-2">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="code">Code</TabsTrigger>
            <TabsTrigger value="output">Output</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="code" className="p-0 m-0">
          <pre className="p-4 overflow-auto bg-muted/50 max-h-80">
            <code>{code}</code>
          </pre>
        </TabsContent>

        <TabsContent value="output" className="p-0 m-0">
          <pre className="p-4 overflow-auto bg-muted/50 max-h-80">
            <code>{output || "Run the code to see output"}</code>
          </pre>
        </TabsContent>
      </Tabs>
    </Card>
  )
}
