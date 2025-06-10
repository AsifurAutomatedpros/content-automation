"use client";
import React, { useState } from "react";
import { extractKeywords as extract3 } from "@/processes/3KeyWordExtractor";
import { extractKeywords as extract4 } from "@/processes/4KeyWordsExtractor";

const modelOptions = [
  { label: "gpt-4.1-nano", value: "gpt-4.1-nano" },
  { label: "gpt-4.1", value: "gpt-4.1" },
];

type ModelType = 'gpt-4.1' | 'gpt-4.1-nano';
type ProcessStatus = 'pending' | 'processing' | 'completed' | 'error';

interface ProcessStep {
  name: string;
  status: ProcessStatus;
  output: string;
}

export default function combinew() {
  const [input, setInput] = useState("");
  const [model, setModel] = useState<ModelType>("gpt-4.1");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processSteps, setProcessSteps] = useState<ProcessStep[]>([
    { name: "extract3", status: 'pending', output: "" },
    { name: "extract4", status: 'pending', output: "" }
  ]);

  const handleProcess = async () => {
    setLoading(true);
    setError(null);
    setProcessSteps(steps => steps.map(step => ({ ...step, status: 'pending', output: "" })));

    try {
      
      // Step 1: extract3
      setProcessSteps(steps => {
        const newSteps = [...steps];
        newSteps[0].status = 'processing';
        return newSteps;
      });
      const inputLines1 = input.split("\n").map(line => line.trim()).filter(line => line.length > 0);
      const result1 = await extract3(inputLines1, model);
      const output1 = Array.isArray(result1) ? result1.join("\n") : result1;
      setProcessSteps(steps => {
        const newSteps = [...steps];
        newSteps[0].status = 'completed';
        newSteps[0].output = output1;
        return newSteps;
      });

      // Step 2: extract4
      setProcessSteps(steps => {
        const newSteps = [...steps];
        newSteps[1].status = 'processing';
        return newSteps;
      });
      const inputLines2 = output1.split("\n").map(line => line.trim()).filter(line => line.length > 0);
      const result2 = await extract4(inputLines2, model);
      const output2 = Array.isArray(result2) ? result2.join("\n") : result2;
      setProcessSteps(steps => {
        const newSteps = [...steps];
        newSteps[1].status = 'completed';
        newSteps[1].output = output2;
        return newSteps;
      });

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
      <h1 className="text-xl font-bold mb-4">combinew</h1>
      
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

          <div className="mb-4">
            <label className="block mb-1 font-medium">Model</label>
            <select
              value={model}
              onChange={e => setModel(e.target.value as ModelType)}
              className="border rounded p-2 text-black bg-white"
            >
              {modelOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleProcess}
            className="bg-blue-600 text-black px-4 py-2 rounded disabled:opacity-50"
            disabled={loading || !input.trim()}
          >
            {loading ? "Processing..." : "Start Process"}
          </button>
          {error && <div className="text-red-600 mt-2">{error}</div>}

          {/* Final Output */}
          <div className="mt-6 w-full">
            <label className="block mb-1 font-medium">Final Output</label>
            <textarea
        value={processSteps[1].output}
        readOnly
        style={{ width: "100%", maxWidth: 900, minHeight: 300 }}
        className="border rounded p-2 bg-black text-white"
        placeholder="Final processed output will appear here..."
      />
          </div>
        </div>

        {/* Right side - Process Status */}
        <div className="w-80">
          <h2 className="text-lg font-semibold mb-4">Process Status</h2>
          <div className="space-y-4">
            {processSteps.map((step, index) => (
              <div key={index} className="border rounded p-4">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(step.status)}`} />
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
