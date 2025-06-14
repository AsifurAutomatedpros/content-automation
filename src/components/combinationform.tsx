import React, { useState, useEffect } from 'react';
import InputText from './inputtext';
import Button from './button';
import Dropdown from './dropdown';
import ToggleButton from './togglebutton';
import { createCombinationPage } from '@/operations/createcombinationlogic';

interface ProcessField {
  id: number;
  value: string;
  path: string;
  responsePath?: string;
}

interface ProcessOption {
  label: string;
  value: string;
  path: string;
}

const outputOptions = [
  { label: 'Text', value: 'text' },
  { label: 'Video', value: 'video' },
  { label: 'Image', value: 'image' },
];

const CombinationForm: React.FC = () => {
  const [combinationName, setCombinationName] = useState('');
  const [combinationId, setCombinationId] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [processFields, setProcessFields] = useState<ProcessField[]>([{ id: 1, value: '', path: '', responsePath: undefined }]);
  const [outputType, setOutputType] = useState('text');
  const [processOptions, setProcessOptions] = useState<ProcessOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const loadProcessOptions = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/processes');
        if (!response.ok) throw new Error('Failed to fetch processes');
        const options = await response.json();
        setProcessOptions(options);
      } catch (error) {
        setError('Error loading process options');
      } finally {
        setIsLoading(false);
      }
    };
    loadProcessOptions();
  }, []);

  useEffect(() => {
    const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
    setCombinationId(randomCode);
  }, []);

  const addProcessField = () => {
    const newId = processFields.length + 1;
    setProcessFields([...processFields, { id: newId, value: '', path: '', responsePath: undefined }]);
  };

  const removeProcessField = (id: number) => {
    setProcessFields(processFields.filter(field => field.id !== id));
    setProcessFields(prev => prev.map((field, index) => ({ ...field, id: index + 1 })));
  };

  const handleProcessChange = (id: number, value: string) => {
    const selectedProcess = processOptions.find((opt) => opt.value === value);
    if (selectedProcess) {
      const pathParts = selectedProcess.path.split('/');
      const fileName = pathParts[pathParts.length - 1];
      const responsePath = fileName.replace('.tsx', '') === '300f' ? 'data.choices[0].message.content' : undefined;
      setProcessFields(processFields.map(field =>
        field.id === id ? { ...field, value: fileName.replace('.tsx', ''), path: fileName, responsePath } : field
      ));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    try {
      if (!combinationName.trim()) throw new Error('Combination name is required');
      if (!outputType) throw new Error('Output type is required');
      if (processFields.some(field => !field.value)) throw new Error('All process fields must be selected');

      const result = await createCombinationPage({
        combinationName,
        combinationId,
        isActive,
        processes: processFields.map(field => ({
          id: field.id,
          path: field.path,
          name: field.value,
          responsePath: field.responsePath
        })),
        outputType,
        responsePath: outputType === 'image' || outputType === 'video' ? 'data.data.url' : undefined
      });

      if (!result.success) throw new Error(result.error || 'Failed to create combination');
      setSuccess('Combination created successfully!');
      setCombinationName('');
      setProcessFields([{ id: 1, value: '', path: '', responsePath: undefined }]);
      setOutputType('text');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="max-w-4xl mx-auto p-8 text-center text-black">Loading process options...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-6 bg-white rounded-lg shadow text-black">
      <h2 className="text-xl font-bold mb-4 text-black">Create New Combination</h2>
      {error && <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}
      {success && <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">{success}</div>}
      <div>
        <label className="block text-sm font-medium mb-1 text-black">Combination Name</label>
        <InputText value={combinationName} onChange={setCombinationName} placeholder="Enter combination name" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1 text-black">Combination ID</label>
        <input type="text" value={combinationId} readOnly className="w-full border rounded p-2 bg-gray-100 text-gray-500 cursor-not-allowed" />
      </div>
      <div className="flex items-center space-x-2">
        <ToggleButton checked={isActive} onChange={setIsActive} label="Status:" />
      </div>
      <div className="space-y-4">
        <label className="block text-sm font-medium text-black">Processes</label>
        {processFields.map((field) => (
          <div key={field.id} className="flex items-center space-x-2">
            <span className="text-sm font-medium w-8 text-black">{field.id}.</span>
            <Dropdown
              options={processOptions}
              value={field.value}
              onChange={(val) => handleProcessChange(field.id, val)}
              placeholder="Select Process"
            />
            {field.id > 1 && (
              <Button type="button" variant="secondary" onClick={() => removeProcessField(field.id)}>
                Delete
              </Button>
            )}
          </div>
        ))}
        <Button type="button" variant="primary" onClick={addProcessField}>
          + Add Process
        </Button>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1 text-black">Output Type</label>
        <Dropdown
          options={outputOptions}
          value={outputType}
          onChange={setOutputType}
          placeholder="Select Output Type"
        />
      </div>
      <Button type="submit" variant="primary" disabled={isLoading}>
        {isLoading ? 'Submitting...' : 'Create Combination'}
      </Button>
    </form>
  );
};

export default CombinationForm;
