'use client';
import React, { useState, useEffect } from 'react';
import { createCombinationPage } from '@/operations/createcombinationlogic';

interface ProcessField {
  id: number;
  value: string;
  path: string;
}

interface ProcessOption {
  label: string;
  value: string;
  path: string;
}

const outputOptions = [
  { label: "Text", value: "text" },
  { label: "Video", value: "video" },
  { label: "Image", value: "image" },
];

export default function CreateCombination() {
  const [combinationName, setCombinationName] = useState('');
  const [combinationId, setCombinationId] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [processFields, setProcessFields] = useState<ProcessField[]>([{ id: 1, value: '', path: '' }]);
  const [outputType, setOutputType] = useState('');
  const [processOptions, setProcessOptions] = useState<ProcessOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load process options on component mount
  useEffect(() => {
    const loadProcessOptions = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/processes');
        if (!response.ok) throw new Error('Failed to fetch processes');
        const options = await response.json();
        setProcessOptions(options);
      } catch (error) {
        console.error('Error loading process options:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadProcessOptions();
  }, []);

  // Generate random 6-digit code on component mount
  useEffect(() => {
    const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
    setCombinationId(randomCode);
  }, []);

  const addProcessField = () => {
    const newId = processFields.length + 1;
    setProcessFields([...processFields, { id: newId, value: '', path: '' }]);
  };

  const removeProcessField = (id: number) => {
    setProcessFields(processFields.filter(field => field.id !== id));
    // Reorder remaining fields
    setProcessFields(prev => prev.map((field, index) => ({
      ...field,
      id: index + 1
    })));
  };

  const handleProcessChange = (id: number, value: string) => {
    const selectedProcess = processOptions.find(opt => opt.value === value);
    if (selectedProcess) {
      // Extract just the filename from the path
      const pathParts = selectedProcess.path.split('/');
      const fileName = pathParts[pathParts.length - 1];
      
      setProcessFields(processFields.map(field => 
        field.id === id ? { 
          ...field, 
          value: fileName.replace('.tsx', ''), 
          path: fileName 
        } : field
      ));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await createCombinationPage({
        combinationName,
        combinationId,
        isActive,
        processes: processFields.map(field => ({
          id: field.id,
          path: field.path,
          name: field.value
        })),
        outputType
      });

      if (!result.success) {
        throw new Error(result.error || 'Failed to create combination');
      }

      // Handle success - you might want to redirect or show a success message
      console.log('Combination created successfully:', result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="text-center">Loading process options...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Create New Combination</h1>
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Combination Name and ID */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Combination Name</label>
            <input
              type="text"
              value={combinationName}
              onChange={(e) => setCombinationName(e.target.value)}
              className="w-full border rounded p-2 text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Combination ID</label>
            <input
              type="text"
              value={combinationId}
              readOnly
              className="w-full border rounded p-2 bg-black text-white text-sm"
            />
          </div>
        </div>

        {/* Active Status Toggle */}
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium">Status:</label>
          <button
            type="button"
            onClick={() => setIsActive(!isActive)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full ${
              isActive ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                isActive ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <span className="text-sm">{isActive ? 'Active' : 'Inactive'}</span>
        </div>

        {/* Process Fields */}
        <div className="space-y-4">
          <label className="block text-sm font-medium">Processes</label>
          {processFields.map((field) => (
            <div key={field.id} className="flex items-center space-x-2">
              <span className="text-sm font-medium w-8">{field.id}.</span>
              <select
                value={field.value}
                onChange={(e) => handleProcessChange(field.id, e.target.value)}
                className="flex-1 border rounded p-2 text-sm bg-black text-white"
                required
              >
                <option value="" className="bg-black text-white">Select Process</option>
                {processOptions.map(opt => (
                  <option key={opt.value} value={opt.value} className="bg-black text-white">{opt.label}</option>
                ))}
              </select>
              {field.id > 1 && (
                <button
                  type="button"
                  onClick={() => removeProcessField(field.id)}
                  className="p-2 text-red-600 hover:text-red-800 text-sm"
                >
                  Delete
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addProcessField}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            + Add Process
          </button>
        </div>

        {/* Output Type */}
        <div>
          <label className="block text-sm font-medium mb-1">Output Type</label>
          <select
            value={outputType}
            onChange={(e) => setOutputType(e.target.value)}
            className="w-full border rounded p-2 text-sm bg-black text-white"
            required
          >
            <option value="" className="bg-black text-white">Select Output Type</option>
            {outputOptions.map(opt => (
              <option key={opt.value} value={opt.value} className="bg-black text-white">{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 text-sm"
          >
            Create Combination
          </button>
        </div>
      </form>
    </div>
  );
}
