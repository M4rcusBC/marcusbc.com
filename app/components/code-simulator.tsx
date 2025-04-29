"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface CodeSimulatorProps {
  code: string
  language: string
  title: string
  initialVariables?: Array<{
    name: string;
    type: "string" | "number" | "boolean";
    defaultValue: string | number | boolean;
  }>;
}

export default function CodeSimulator({ code, language, title, initialVariables = [] }: CodeSimulatorProps) {
  const [output, setOutput] = useState<string>("")
  const [isRunning, setIsRunning] = useState(false)
  const [activeTab, setActiveTab] = useState<string>("code")
  
  // Add state for variables
  const [variables, setVariables] = useState<Array<{
    name: string;
    type: "string" | "number" | "boolean";
    value: string | number | boolean;
  }>>(
    initialVariables.map(v => ({ 
      name: v.name, 
      type: v.type, 
      value: v.defaultValue 
    }))
  )

  // Handle variable value changes
  const handleVariableChange = (index: number, newValue: string | number | boolean) => {
    const newVariables = [...variables];
    newVariables[index].value = newValue;
    setVariables(newVariables);
  }

  const runCode = async () => {
    setIsRunning(true)
    setOutput("")

    try {
      if (language === "javascript" || language === "typescript") {
        await runJavaScript();
      } else if (language === "python") {
        await runPython();
      } else if (language === "java") {
        await runJava();
      } else if (language === "c" || language === "cpp") {
        await runCpp();
      } else {
        setOutput(`Simulation for ${language} is not supported.`)
      }
    } catch (error) {
      setOutput(`Error: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setIsRunning(false)
      setActiveTab("output")
    }
  }

  // JavaScript/TypeScript execution
  const runJavaScript = async () => {
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

    // Inject variables into the code
    const variableDefinitions = variables.map(v => {
      if (v.type === "string") {
        return `const ${v.name} = "${v.value}";`;
      } else {
        return `const ${v.name} = ${v.value};`;
      }
    }).join("\n");

    // Wrap the code in a try-catch block with injected variables
    const wrappedCode = `
      try {
        // Injected variables
        ${variableDefinitions}
        // User code
        ${code.replace(/console\.log/g, "simulatedConsole.log")}
      } catch (error) {
        simulatedConsole.error(error.message);
      }
    `

    // Execute the code in a safe context
    const executeFunction = new Function("simulatedConsole", wrappedCode)
    executeFunction(simulatedConsole)

    setOutput(simulationOutput || "Code executed successfully with no output.")
  }

  // Python execution with Pyodide
  const runPython = async () => {
    try {
      // Check if Pyodide is already loaded
      if (!(window as any).loadPyodide) {
        setOutput("Loading Python environment (Pyodide)...");
        // Load Pyodide script if not already loaded
        const script = document.createElement('script');
        script.src = "https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js";
        document.head.appendChild(script);
        
        // Wait for the script to load
        await new Promise((resolve) => {
          script.onload = resolve;
        });
      }
      
      // Load Pyodide
      const pyodide = await (window as any).loadPyodide();
      
      // Prepare variable injection for Python
      const pythonVars = variables.map(v => {
        if (v.type === "string") {
          return `${v.name} = "${v.value}"`;
        } else if (v.type === "boolean") {
          return `${v.name} = ${v.value ? "True" : "False"}`;
        } else {
          return `${v.name} = ${v.value}`;
        }
      }).join("\n");
      
      // Redirect stdout to capture console output
      pyodide.runPython(`
        import sys, io
        sys.stdout = io.StringIO()
      `);
      
      // Run the user code with variables
      pyodide.runPython(`
${pythonVars}
${code}
      `);
      
      // Get the captured output
      const output = pyodide.runPython("sys.stdout.getvalue()");
      setOutput(output || "Code executed successfully with no output.");
      
    } catch (error) {
      setOutput(`Python Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // Placeholder for Java execution (would require backend)
  const runJava = async () => {
    // For now, just display a message about needing a backend
    setOutput("Java execution requires a backend server. This is a placeholder implementation.\n\nTo fully implement Java execution, you would need to:\n1. Set up a backend API endpoint\n2. Send the code and variables to the server\n3. Compile and run the Java code on the server\n4. Return the results to the browser");
  }

  // Placeholder for C/C++ execution (would require backend)
  const runCpp = async () => {
    // For now, just display a message about needing a backend
    setOutput("C/C++ execution requires a backend server. This is a placeholder implementation.\n\nTo fully implement C/C++ execution, you would need to:\n1. Set up a backend API endpoint\n2. Send the code and variables to the server\n3. Compile and run the C/C++ code on the server\n4. Return the results to the browser");
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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="code">Code</TabsTrigger>
            <TabsTrigger value="variables">Variables</TabsTrigger>
            <TabsTrigger value="output">Output</TabsTrigger>
          </TabsList>
        </div>
  
        <TabsContent value="code" className="p-0 m-0">
          <pre className="p-4 overflow-auto bg-muted/50 max-h-80">
            <code>{code}</code>
          </pre>
        </TabsContent>
  
        <TabsContent value="variables" className="p-0 m-0">
          <div className="p-4 overflow-auto bg-muted/50 max-h-80">
            {variables.length === 0 ? (
              <p className="text-sm text-gray-500">No editable variables defined.</p>
            ) : (
              <div className="space-y-4">
                {variables.map((variable, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <label className="text-sm font-medium w-1/3">{variable.name}:</label>
                    {variable.type === "boolean" ? (
                      <select 
                        value={variable.value.toString()}
                        onChange={(e) => handleVariableChange(index, e.target.value === "true")}
                        className="flex h-9 w-2/3 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                      >
                        <option value="true">true</option>
                        <option value="false">false</option>
                      </select>
                    ) : (
                      <input
                        type={variable.type === "number" ? "number" : "text"}
                        value={variable.value.toString()}
                        onChange={(e) => {
                          const newValue = variable.type === "number" 
                            ? parseFloat(e.target.value) 
                            : e.target.value;
                          handleVariableChange(index, newValue);
                        }}
                        className="flex h-9 w-2/3 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                      />
                    )}
                  </div>
                ))}
                <div className="pt-2">
                  <Button 
                    onClick={runCode} 
                    disabled={isRunning} 
                    size="sm" 
                    className="w-full"
                  >
                    {isRunning ? "Running..." : "Run with Current Values"}
                  </Button>
                </div>
              </div>
            )}
          </div>
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
