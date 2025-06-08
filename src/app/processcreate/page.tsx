"use client";
import React, { useState } from "react";
import { createProcess } from "@/operations/createprocess";

const outputStyleOptions = [
  { label: "Text", value: "text" },
  { label: "Image", value: "image" },
  { label: "Video", value: "video" },
];

function generateProcessId() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export default function ProcessCreatePage() {
  const [processName, setProcessName] = useState("");
  const [processId] = useState(generateProcessId());
  const [status, setStatus] = useState(true);
  const [instruction, setInstruction] = useState("");
  const [validation, setValidation] = useState("");
  const [knowledgeBase, setKnowledgeBase] = useState<File[]>([]);
  const [schemaTool, setSchemaTool] = useState<File[]>([]);
  const [gptValidation, setGptValidation] = useState("");
  const [outputStyle, setOutputStyle] = useState("text");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleFileChange = (setter: React.Dispatch<React.SetStateAction<File[]>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      console.log('Selected files:', files.map(f => f.name));
      setter(files);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Validate required fields
      if (!processName.trim()) {
        throw new Error('Process name is required');
      }
      if (knowledgeBase.length === 0) {
        throw new Error('At least one knowledge base file is required');
      }
      if (schemaTool.length === 0) {
        throw new Error('At least one schema tool file is required');
      }
      if (!gptValidation.trim()) {
        throw new Error('GPT validation instruction is required');
      }
      if (!validation.trim()) {
        throw new Error('Validation logic is required');
      }

      console.log('Submitting process creation with data:', {
        processName,
        processId,
        status,
        instruction,
        validation,
        knowledgeBase: knowledgeBase.map(f => f.name),
        schemaTool: schemaTool.map(f => f.name),
        gptValidation,
        outputStyle
      });

      const processData = {
        processName,
        processId,
        status,
        instruction,
        validation,
        knowledgeBase,
        schemaTool,
        gptValidation,
        outputStyle
      };

      await createProcess(processData);
      setSuccess("Process created successfully!");
    } catch (err) {
      console.error('Error creating process:', err);
      setError(err instanceof Error ? err.message : "Failed to create process.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 32 }}>
      <h1 className="text-xl font-bold mb-4">Create New Process</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-1 font-medium">Process Name</label>
          <input
            type="text"
            value={processName}
            onChange={e => setProcessName(e.target.value)}
            className="border rounded p-2 w-full"
            placeholder="Enter process name"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Process ID</label>
          <input
            type="text"
            value={processId}
            readOnly
            className="border rounded p-2 w-full bg-gray-100 text-gray-500 cursor-not-allowed"
          />
        </div>
        <div className="flex items-center gap-4">
          <label className="block font-medium">Status</label>
          <button
            type="button"
            onClick={() => setStatus(s => !s)}
            className={`w-12 h-6 flex items-center rounded-full p-1 duration-300 ease-in-out ${status ? 'bg-green-500' : 'bg-gray-300'}`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${status ? 'translate-x-6' : ''}`}
            />
          </button>
          <span className={status ? "text-green-600" : "text-gray-500"}>{status ? "Active" : "Inactive"}</span>
        </div>
        <div>
          <label className="block mb-1 font-medium">Instruction</label>
          <textarea
            value={instruction}
            onChange={e => setInstruction(e.target.value)}
            className="border rounded p-2 w-full min-h-[80px]"
            placeholder="Enter process instruction"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Validation</label>
          <textarea
            value={validation}
            onChange={e => setValidation(e.target.value)}
            className="border rounded p-2 w-full min-h-[80px]"
            placeholder="Enter validation logic or notes"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Knowledge Base Files</label>
          <input
            type="file"
            multiple
            accept=".txt"
            onChange={handleFileChange(setKnowledgeBase)}
            className="border rounded p-2 w-full"
            required
          />
          {knowledgeBase.length > 0 && (
            <div className="mt-2 text-sm text-gray-600">
              {knowledgeBase.map(file => file.name).join(", ")}
            </div>
          )}
        </div>
        <div>
          <label className="block mb-1 font-medium">Schema Tool Files</label>
          <input
            type="file"
            multiple
            accept=".txt"
            onChange={handleFileChange(setSchemaTool)}
            className="border rounded p-2 w-full"
            required
          />
          {schemaTool.length > 0 && (
            <div className="mt-2 text-sm text-gray-600">
              {schemaTool.map(file => file.name).join(", ")}
            </div>
          )}
        </div>
        <div>
          <label className="block mb-1 font-medium">GPT Validation Instruction</label>
          <textarea
            value={gptValidation}
            onChange={e => setGptValidation(e.target.value)}
            className="border rounded p-2 w-full min-h-[80px]"
            placeholder="Enter GPT validation instruction"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Output Style</label>
          <select
            value={outputStyle}
            onChange={e => setOutputStyle(e.target.value)}
            className="border rounded p-2 w-full text-black bg-white"
          >
            {outputStyleOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-black px-4 py-2 rounded disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
        {error && <div className="text-red-600 mt-2">{error}</div>}
        {success && <div className="text-green-600 mt-2">{success}</div>}
      </form>
    </div>
  );
}
