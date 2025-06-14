import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface ProcessField {
  id: number;
  path: string;
  name: string;
}

interface FormData {
  combinationName: string;
  combinationId: string;
  isActive: boolean;
  processes: ProcessField[];
  outputType: string;
  responsePath?: string;
}

function getImportLineFromExample(processPath: string): string {
  const examplePagePath = path.join(process.cwd(), 'src', 'app', 'example', 'page.tsx');
  const pageContent = fs.readFileSync(examplePagePath, 'utf-8');
  const processFileName = processPath.replace(/\.tsx$/, '');
  const regex = new RegExp(`import\\s+\\{[^}}]+\\}\\s+from\\s+['\"]@/processes/${processFileName}['\"];?`);
  const match = pageContent.match(regex);
  if (match) {
    return match[0];
  } else {
    throw new Error(`Import line for ${processFileName} not found in example/page.tsx`);
  }
}

function getAliasOrFunctionName(importLine: string): string {
  const aliasMatch = importLine.match(/\{\s*\w+\s+as\s+(\w+)\s*\}/);
  if (aliasMatch) return aliasMatch[1];
  const funcMatch = importLine.match(/\{\s*(\w+)\s*\}/);
  if (funcMatch) return funcMatch[1];
  throw new Error('Could not extract function or alias name from import line: ' + importLine);
}

function generatePageContent(formData: FormData): string {
  const { processes, outputType, responsePath } = formData;

  const defaultImports = `"use client";\nimport React, { useState } from \"react\";\nimport Output from '@/components/output';`;

  const processImports = processes
    .sort((a, b) => a.id - b.id)
    .map(p => getImportLineFromExample(p.path))
    .join('\n');

  const processSteps = processes
    .sort((a, b) => a.id - b.id)
    .map(p => `{ name: "${p.name}", status: 'pending', output: "" }`)
    .join(',\n    ');

  const processExecution = processes
    .sort((a, b) => a.id - b.id)
    .map((p, index) => (
      `
      // Step ${index + 1}: ${p.name}
      setProcessSteps(steps => {
        const newSteps = [...steps];
        newSteps[${index}].status = 'processing';
        return newSteps;
      });
      const inputLines${index + 1} = ${index === 0 ? 'input.split("\\n").map(line => line.trim()).filter(line => line.length > 0)' : `output${index}.split("\\n").map(line => line.trim()).filter(line => line.length > 0)`};
      const result${index + 1} = await ${p.name}(inputLines${index + 1});
      const output${index + 1} = Array.isArray(result${index + 1}) ? result${index + 1}.join("\\n") : result${index + 1};
      setProcessSteps(steps => {
        const newSteps = [...steps];
        newSteps[${index}].status = 'completed';
        newSteps[${index}].output = output${index + 1};
        return newSteps;
      });`
    ))
    .join('\n');

  const renderOutput = () => {
    if (outputType === 'image' || outputType === 'video') {
      return `
        <div className="mt-6 w-full">
          <label className="block mb-1 font-medium">Final Output</label>
          <Output 
            type="${outputType}" 
            content={[{ url: processSteps[${processes.length - 1}].output }]} 
            className="w-full"
          />
        </div>`;
    }
    return `
      <div className="mt-6 w-full">
        <label className="block mb-1 font-medium">Final Output</label>
        <div className="border rounded p-4 bg-black text-white">
          {processSteps[${processes.length - 1}].output}
        </div>
      </div>`;
  };

  return `${defaultImports}
${processImports}

type ProcessStatus = 'pending' | 'processing' | 'completed' | 'error';

interface ProcessStep {
  name: string;
  status: ProcessStatus;
  output: string;
}

interface MediaData {
  url: string;
  resolution?: string;
  duration?: string;
  tags?: string[];
}

export default function ${formData.combinationName.replace(/\s+/g, '')}() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processSteps, setProcessSteps] = useState<ProcessStep[]>([
    ${processSteps}
  ]);

  const handleProcess = async () => {
    setLoading(true);
    setError(null);
    setProcessSteps(steps => steps.map(step => ({ ...step, status: 'pending', output: "" })));

    try {
      ${processExecution}

    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setProcessSteps(steps => {
        const newSteps = [...steps];
        const currentStep = newSteps.find(step => step.status === 'processing');
        if (currentStep) {
          currentStep.status = 'error';
        }
        return newSteps;
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: ProcessStatus) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'processing':
        return 'bg-blue-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-300';
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: 32 }}>
      <h1 className="text-xl font-bold mb-4">${formData.combinationName}</h1>
      
      <div className="flex gap-8">
        {/* Left side - Input and Controls */}
        <div className="flex-1">
          <div className="mb-4 w-full">
            <label className="block mb-1 font-medium">Input Text</label>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              style={{ width: "100%", maxWidth: 900, minHeight: 300 }}
              className="border rounded p-2"
              placeholder="Enter your text here..."
            />
          </div>

          <button
            onClick={handleProcess}
            className="bg-blue-600 text-black px-4 py-2 rounded disabled:opacity-50"
            disabled={loading || !input.trim()}
          >
            {loading ? "Processing..." : "Start Process"}
          </button>
          {error && <div className="text-red-600 mt-2">{error}</div>}
          ${renderOutput()}
        </div>

        {/* Right side - Process Status */}
        <div className="w-80">
          <h2 className="text-lg font-semibold mb-4">Process Status</h2>
          <div className="space-y-4">
            {processSteps.map((step, index) => (
              <div key={index} className="border rounded p-4">
                <div className={\`w-3 h-3 rounded-full \${getStatusColor(step.status)}\`} />
                <span className="font-medium">{step.name}</span>
                {step.output && (
                  <div className="mt-2 text-sm">
                    <div className="font-medium mb-1">Output:</div>
                    <div className="bg-black-100 p-2 rounded max-h-40 overflow-y-auto">
                      {step.output}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
`;
}

export async function POST(request: Request) {
  try {
    const formData: FormData = await request.json();
    
    // Create folder name from combination name (lowercase, no spaces)
    const folderName = formData.combinationName.toLowerCase().replace(/\s+/g, '');
    const folderPath = path.join(process.cwd(), 'src', 'app', folderName);

    // Create the folder if it doesn't exist
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    // For each process, get the correct import line and extract the alias/function name
    const processesWithImports = formData.processes.map(p => {
      const importLine = getImportLineFromExample(p.path);
      const name = getAliasOrFunctionName(importLine);
      return { ...p, importLine, name };
    });

    // Create page.tsx content
    const pageContent = generatePageContent({ ...formData, processes: processesWithImports });

    // Write the page.tsx file
    fs.writeFileSync(path.join(folderPath, 'page.tsx'), pageContent);

    return NextResponse.json({
      success: true,
      folderPath,
      message: 'Combination page created successfully'
    });
  } catch (error) {
    console.error('Error creating combination page:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 });
  }
} 