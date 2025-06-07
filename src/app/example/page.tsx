"use client";
import React, { useState } from "react";
import KeywordExtractor3, { extractKeywords as extract3 } from "@/processes/3KeyWordExtractor";
import KeywordExtractor4, { extractKeywords as extract4 } from "@/processes/4KeyWordsExtractor";
import MetaTagSearch, { metaTagSearch } from "@/processes/MetaTagSearch";

const modelOptions = [
  { label: "gpt-4.1-nano", value: "gpt-4.1-nano" },
  { label: "gpt-4.1", value: "gpt-4.1" },
];

const processOptions = [
  { label: "3 Keyword Extractor", value: "3" },
  { label: "4 Keyword Extractor", value: "4" },
  { label: "Meta Tag Search", value: "meta" },
];

export default function ExamplePage() {
  const [input, setInput] = useState("");
  const [model, setModel] = useState("gpt-4.1");
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
        result = await extract3(input, model as any);
        setOutput((result as string[]).join("\n"));
      } else if (process === "4") {
        result = await extract4(input, model as any);
        setOutput((result as string[]).join("\n"));
      } else if (process === "meta") {
        // Split input into non-empty lines for MetaTagSearch
        const inputLines = input.split("\n").map(line => line.trim()).filter(line => line.length > 0);
        result = await metaTagSearch(inputLines, model as any);
        setOutput(result as string);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: 32 }}>
      <h1 className="text-xl font-bold mb-4">Keyword Extractor Example</h1>
      <div className="mb-4 w-full">
        <label className="block mb-1 font-medium">Input Text</label>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          style={{ width: "100%", maxWidth: 900, minHeight: 300 }}
          className="border rounded p-2 "
          placeholder="Enter your text here..."
        />
      </div>
      <div className="mb-4 flex gap-4">
        <div>
          <label className="block mb-1 font-medium">Model</label>
          <select
            value={model}
            onChange={e => setModel(e.target.value)}
            className="border rounded p-2"
          >
            {modelOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1 font-medium">Process</label>
          <select
            value={process}
            onChange={e => setProcess(e.target.value)}
            className="border rounded p-2"
          >
            {processOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>
      <button
        onClick={handleProcess}
        className="bg-blue-600 text-black px-4 py-2 rounded disabled:opacity-50"
        disabled={loading || !input.trim()}
      >
        {loading ? "Processing..." : "Submit"}
      </button>
      {error && <div className="text-red-600 mt-2">{error}</div>}
      <div className="mt-6">
        <label className="block mb-1 font-medium">Output</label>
        <textarea
          value={output}
          readOnly
          style={{ width: "100%", maxWidth: 900, minHeight: 300 }}
          className="border rounded p-2 bg-black text-balck"
        />
      </div>
    </div>
  );
}
