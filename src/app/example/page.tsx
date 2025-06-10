"use client";
import React, { useState } from "react";
import { extractKeywords as extract3 } from "@/processes/3KeyWordExtractor";
import { extractKeywords as extract4 } from "@/processes/4KeyWordsExtractor";
import { metaTagSearch } from "@/processes/MetaTagSearch";
import { processData as keywordFinal } from "@/processes/keyword Final";


const modelOptions = [
  { label: "gpt-4.1-nano", value: "gpt-4.1-nano" },
  { label: "gpt-4.1", value: "gpt-4.1" },
];

const processOptions = [
  { label: "3 Keyword Extractor", value: "3" },
  { label: "4 Keyword Extractor", value: "4" },
  { label: "Meta Tag Search", value: "meta" },
  { label: "Keyword Final", value: "keyword-final" },
  { label: "44 Process", value: "44" },
  { label: "sometimes", value: "819931" },
];

type ModelType = 'gpt-4.1' | 'gpt-4.1-nano';

export default function ExamplePage() {
  const [input, setInput] = useState("");
  const [model, setModel] = useState<ModelType>("gpt-4.1");
  const [process, setProcess] = useState("3");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleProcess = async () => {
    setLoading(true);
    setError(null);
    setOutput("");
    try {
      let result: string[] | string = [];
      if (process === "3") {
        result = await extract3(input.split('\n'), model);
        setOutput((result as string[]).join("\n"));
      } else if (process === "4") {
        result = await extract4(input.split('\n'), model);
        setOutput((result as string[]).join("\n"));
      } else if (process === "meta") {
        const inputLines = input.split("\n").map(line => line.trim()).filter(line => line.length > 0);
        result = await metaTagSearch(inputLines, model);
        setOutput(result as string);
      } else if (process === "keyword-final") {
        result = await keywordFinal(input.split('\n'), model);
        setOutput((result as string[]).join("\n"));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Keyword Extractor Example</h1>
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Input Text</label>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          className="w-full h-64 p-3 border rounded-lg"
          placeholder="Enter your text here..."
        />
      </div>
      <div className="flex gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2">Model</label>
          <select
            value={model}
            onChange={e => setModel(e.target.value as ModelType)}
            className="p-2 border rounded-lg bg-white text-black"
          >
            {modelOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Process</label>
          <select
            value={process}
            onChange={e => setProcess(e.target.value)}
            className="p-2 border rounded-lg bg-white text-black"
          >
            {processOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>
      <button
        onClick={handleProcess}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
        disabled={loading || !input.trim()}
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
