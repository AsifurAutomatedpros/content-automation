"use client";



import React, { useState } from "react";
import { extractKeywords as extract3 } from "@/processes/3KeyWordExtractor";
import { extractKeywords as extract4 } from "@/processes/4KeyWordsExtractor";
import { metaTagSearch } from "@/processes/MetaTagSearch";

import OutputImage from '@/components/outputimage';

// Define the type for process handlers
type ProcessHandler = (inputLines: string[]) => Promise<string[] | string>;

// Process handlers map for easy integration
const processHandlers: Record<string, ProcessHandler> = {
  "3": extract3,
  "4": extract4,
  "meta": metaTagSearch,
  

  
 
};

// Update the ProcessOption type
type ProcessOption = {
  label: string;
  value: string;
  processId: string;
  processName: string;
  outputType: 'text' | 'image' | 'video';
};

// Process options with their IDs and names
const processOptions = [
  { label: "3 Keyword Extractor", value: "3", processId: "3", processName: "3KeyWordExtractor", outputType: 'text' },
  { label: "4 Keyword Extractor", value: "4", processId: "4", processName: "4KeyWordsExtractor", outputType: 'text' },
  { label: "Meta Tag Search", value: "meta", processId: "meta", processName: "MetaTagSearch", outputType: 'text' },


];

export default function ExamplePage() {
  const [input, setInput] = useState("");
  const [process, setProcess] = useState("3");
  const [output, setOutput] = useState<string | string[]>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedProcess = processOptions.find(p => p.value === process);
  const outputType = selectedProcess?.outputType || 'text';

  const isInputValid = () => {
    if (process === "3333") return true;
    return input.trim().length > 0;
  };

  const handleProcess = async () => {
    setLoading(true);
    setError(null);
    setOutput("");
    try {
      const selectedProcess = processOptions.find(p => p.value === process);
      
      if (!selectedProcess) {
        throw new Error("Invalid process selected");
      }

      const handler = processHandlers[process];
      if (!handler) {
        throw new Error("Process handler not found");
      }

      const result = await handler(input.split('\n'));
      setOutput(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const renderOutput = () => {
    if (!output) return null;

    switch (outputType) {
      case 'image':
        return (
          <div className="mt-6">
            <label className="block text-sm font-medium mb-2">Output</label>
            <OutputImage 
              images={Array.isArray(output) ? output.map(url => ({ url })) : [{ url: output }]} 
              className="w-full"
            />
          </div>
        );
      case 'video':
        return (
          <div className="mt-6">
            <label className="block text-sm font-medium mb-2">Output</label>
            <video 
              src={Array.isArray(output) ? output[0] : output} 
              controls 
              className="w-full rounded-lg"
            />
          </div>
        );
      default:
        return (
          <div className="mt-6">
            <label className="block text-sm font-medium mb-2">Output</label>
            <textarea
              value={Array.isArray(output) ? output.join('\n') : output}
              readOnly
              className="w-full h-64 p-3 border rounded-lg bg-black text-white"
            />
          </div>
        );
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Process Example</h1>
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Input Text</label>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          className="w-full h-64 p-3 border rounded-lg"
          placeholder={process === "3333" ? "Enter your instructions here..." : "Enter your text here..."}
          required={process === "3333"}
        />
      </div>
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Process</label>
        <select
          value={process}
          onChange={e => setProcess(e.target.value)}
          className="p-2 border rounded-lg bg-white text-black w-full"
        >
          {processOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
      <button
        onClick={handleProcess}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
        disabled={loading || !isInputValid()}
      >
        {loading ? "Processing..." : "Submit"}
      </button>
      {error && <div className="mt-4 text-red-600">{error}</div>}
      {renderOutput()}
    </div>
  );
}
