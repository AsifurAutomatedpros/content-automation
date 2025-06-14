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

export async function createCombinationPage(formData: FormData) {
  try {
    // First, create the combination file with proper output handling
    const combinationContent = `
"use client";
import React, { useState } from "react";
import OutputImage from '@/components/outputimage';
import OutputVideo from '@/components/outputvideo';
${formData.processes.map(process => `import { processData as process${process.name}Data } from '@/processes/${process.name}';`).join('\n')}

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

export default function CombinationPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processSteps, setProcessSteps] = useState<ProcessStep[]>([
    ${formData.processes.map(process => `{ name: "${process.name}", status: 'pending', output: "" }`).join(',\n    ')}
  ]);

  const handleProcess = async () => {
    setLoading(true);
    setError(null);
    setProcessSteps(steps => steps.map(step => ({ ...step, status: 'pending', output: "" })));

    try {
      let result = input;
      
      // Execute each process in sequence
      ${formData.processes.map((process, index) => `
      // Step ${index + 1}: ${process.name}
      setProcessSteps(steps => {
        const newSteps = [...steps];
        newSteps[${index}].status = 'processing';
        return newSteps;
      });
      const inputLines${index + 1} = result.split("\\n").map(line => line.trim()).filter(line => line.length > 0);
      const result${index + 1} = await process${process.name}Data(inputLines${index + 1});
      result = Array.isArray(result${index + 1}) ? result${index + 1}.join("\\n") : result${index + 1};
      setProcessSteps(steps => {
        const newSteps = [...steps];
        newSteps[${index}].status = 'completed';
        newSteps[${index}].output = result;
        return newSteps;
      });`).join('\n\n      ')}

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

  const renderOutput = () => {
    const finalOutput = processSteps[processSteps.length - 1].output;
    if (!finalOutput) return null;

    switch (formData.outputType) {
      case 'image':
        return (
          <div className="mt-6 w-full">
            <label className="block mb-1 font-medium">Final Output</label>
            <div className="grid grid-cols-2 gap-4">
              <OutputImage 
                images={[{ url: finalOutput }]} 
                className="w-full"
              />
            </div>
          </div>
        );
      case 'video':
        return (
          <div className="mt-6 w-full">
            <label className="block mb-1 font-medium">Final Output</label>
            <div className="grid grid-cols-2 gap-4">
              <OutputVideo 
                videos={[{ url: finalOutput }]} 
                className="w-full"
              />
            </div>
          </div>
        );
      default:
        return (
          <div className="mt-6 w-full">
            <label className="block mb-1 font-medium">Final Output</label>
            <div className="border rounded p-4 bg-black text-white">
              {finalOutput}
            </div>
          </div>
        );
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
          {renderOutput()}
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
}`;

    // Now send the combination data to the API
    const response = await fetch('/api/combinations/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...formData,
        combinationContent
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to create combination');
    }

    return result;
  } catch (error) {
    console.error('Error creating combination page:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}
