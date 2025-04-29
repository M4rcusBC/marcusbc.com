import { getDemos } from "../actions"
import CodeSimulator from "./code-simulator"

export default async function DemosSection() {
  const demos = await getDemos()

  return (
    <div className="space-y-8">
      {demos.length === 0 ? (
        <p className="text-center text-muted-foreground">No demos available yet.</p>
      ) : (
        demos.map((demo: any) => (
          <div key={demo.id} className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold">{demo.title}</h3>
              <p className="text-muted-foreground">{demo.description}</p>
            </div>
            <CodeSimulator 
              code={demo.code} 
              language={demo.language} 
              title={demo.title} 
              initialVariables={demo.initial_variables || []}
            />
          </div>
        ))
      )}
    </div>
  )
}