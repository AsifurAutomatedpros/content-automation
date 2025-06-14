"use client";
import { processData as processsetuData } from '@/processes/setu';
import { processData as processasdasdData } from '@/processes/asdasd';
import { processData as processexactlyData } from '@/processes/exactly';
import { processData as processnextjsonData } from '@/processes/nextjson';
import { processData as processasifiiiiiiiiissssData } from '@/processes/asifiiiiiiiiissss';

import { processData as processsurfacedData } from '@/processes/surfaced';
import React, { useState } from "react";
import { extractKeywords as extract3 } from "@/processes/3KeyWordExtractor";
import { extractKeywords as extract4 } from "@/processes/4KeyWordsExtractor";
import { metaTagSearch } from "@/processes/MetaTagSearch";
import { processData as keywordFinal } from "@/processes/keyword Final";

// Define the type for process handlers
type ProcessHandler = (inputLines: string[]) => Promise<string[] | string>;

// Process handlers map for easy integration
const processHandlers: Record<string, ProcessHandler> = {
  "3": extract3,
  "4": extract4,
  "meta": metaTagSearch,
  "keyword-final": keywordFinal,
  "166887": processsetuData,
  "300712": processasdasdData,
  "410476": processexactlyData,
  "700367": processnextjsonData,
  "180833": processasifiiiiiiiiissssData,
  
  "948232": processsurfacedData,
};

// Process options with their IDs and names
const processOptions = [
  { label: "3 Keyword Extractor", value: "3", processId: "3", processName: "3KeyWordExtractor" },
  { label: "4 Keyword Extractor", value: "4", processId: "4", processName: "4KeyWordsExtractor" },
  { label: "Meta Tag Search", value: "meta", processId: "meta", processName: "MetaTagSearch" },
  { label: "Keyword Final", value: "keyword-final", processId: "keyword-final", processName: "keyword Final" },
  { label: "44 Process", value: "44", processId: "44", processName: "44" },
  { label: "sometimes", value: "819931", processId: "819931", processName: "sometimes" },
  { label: "GptCode5", value: "gptcode5", processId: "gptcode5", processName: "GptCode5" },
  { label: "New Pro Ultra", value: "new_pro_ultratsx", processId: "new_pro_ultratsx", processName: "new_pro_ultratsx" },
  { label: "Gemini Story Generation", value: "gemini-story", processId: "gemini-story", processName: "gemini_story_generation" },
  { label: "Gemini Story Generation 2", value: "gemini-story-2", processId: "gemini-story-2", processName: "gemini_story_generation2" },
  { label: "Gemini Code 5", value: "gemini-code-5", processId: "gemini-code-5", processName: "gemini_code_5" },
  { label: "Code 67", value: "code67", processId: "code67", processName: "code67" },
  { label: "Newsetssstsx", value: "newsetssstsx", processId: "newsetssstsx", processName: "newsetssstsx" },
  { label: "2324 Process", value: "2324", processId: "2324", processName: "2324" },
  { label: "10001 Process", value: "10001", processId: "10001", processName: "10001" },
  { label: "2222 Process", value: "2222", processId: "2222", processName: "2222" },
  { label: "setu", value: "166887", processId: "166887", processName: "setu" },
  { label: "asdasd", value: "300712", processId: "300712", processName: "asdasd" },
  { label: "exactly", value: "410476", processId: "410476", processName: "exactly" },
  { label: "nextjson", value: "700367", processId: "700367", processName: "nextjson" },
  { label: "asifiiiiiiiiissss", value: "180833", processId: "180833", processName: "asifiiiiiiiiissss" },
  { label: "surfaced", value: "948232", processId: "948232", processName: "surfaced" },
  
];

export default function ExamplePage() {
  const [input, setInput] = useState("");
  const [process, setProcess] = useState("3");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      setOutput(typeof result === 'string' ? result : JSON.stringify(result));
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
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
      <div className="mt-6">
        <label className="block text-sm font-medium mb-2">Output</label>
        <textarea
          value={output}
          readOnly
          className="w-full h-64 p-3 border rounded-lg bg-black text-white"
        />
      </div>
    </div>
  );
}
