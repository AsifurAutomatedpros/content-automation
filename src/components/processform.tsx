import React, { useState } from 'react';
import InputText from './inputtext';
import Output from './output';
import Button from './button';
import Dropdown from './dropdown';
import ToggleButton from './togglebutton';
import { createProcess } from '@/operations/createprocess';

const outputStyleOptions = [
  { label: 'Text', value: 'text' },
  { label: 'Image', value: 'image' },
  { label: 'Video', value: 'video' },
];

function generateProcessId() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

const ProcessForm: React.FC = () => {
  const [processName, setProcessName] = useState('');
  const [processId] = useState(generateProcessId());
  const [status, setStatus] = useState(true);
  const [instruction, setInstruction] = useState('');
  const [validation, setValidation] = useState('');
  const [knowledgeBase, setKnowledgeBase] = useState<File[]>([]);
  const [schemaTool, setSchemaTool] = useState<File[]>([]);
  const [gptValidation, setGptValidation] = useState('');
  const [outputStyle, setOutputStyle] = useState('text');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleFileChange = (setter: React.Dispatch<React.SetStateAction<File[]>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setter(files);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      if (!processName.trim()) throw new Error('Process name is required');
      if (knowledgeBase.length === 0) throw new Error('At least one knowledge base file is required');
      if (schemaTool.length === 0) throw new Error('At least one schema tool file is required');
      if (!gptValidation.trim()) throw new Error('GPT validation instruction is required');
      if (!validation.trim()) throw new Error('Validation logic is required');
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
      setSuccess('Process created successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create process.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-6 bg-white rounded-lg shadow text-black">
      <h2 className="text-xl font-bold mb-4 text-black">Create New Process</h2>
      <div>
        <label className="block mb-1 font-medium text-black">Process Name</label>
        <InputText value={processName} onChange={setProcessName} placeholder="Enter process name" />
      </div>
      <div>
        <label className="block mb-1 font-medium text-black">Process ID</label>
        <input type="text" value={processId} readOnly className="border rounded p-2 w-full bg-gray-100 text-gray-500 cursor-not-allowed" />
      </div>
      <div className="flex items-center gap-4">
        <ToggleButton checked={status} onChange={setStatus} label="Status" />
      </div>
      <div>
        <label className="block mb-1 font-medium text-black">Instruction</label>
        <InputText value={instruction} onChange={setInstruction} placeholder="Enter process instruction" />
      </div>
      <div>
        <label className="block mb-1 font-medium text-black">Validation</label>
        <InputText value={validation} onChange={setValidation} placeholder="Enter validation logic or notes" />
      </div>
      <div>
        <label className="block mb-1 font-medium text-black">Knowledge Base Files</label>
        <input type="file" multiple accept=".txt" onChange={handleFileChange(setKnowledgeBase)} className="border rounded p-2 w-full" />
        {knowledgeBase.length > 0 && (
          <div className="mt-2 text-sm text-gray-600">{knowledgeBase.map(file => file.name).join(', ')}</div>
        )}
      </div>
      <div>
        <label className="block mb-1 font-medium text-black">Schema Tool Files</label>
        <input type="file" multiple accept=".txt" onChange={handleFileChange(setSchemaTool)} className="border rounded p-2 w-full" />
        {schemaTool.length > 0 && (
          <div className="mt-2 text-sm text-gray-600">{schemaTool.map(file => file.name).join(', ')}</div>
        )}
      </div>
      <div>
        <label className="block mb-1 font-medium text-black">GPT Validation Instruction</label>
        <InputText value={gptValidation} onChange={setGptValidation} placeholder="Enter GPT validation instruction" />
      </div>
      <div>
        <label className="block mb-1 font-medium text-black">Output Style</label>
        <Dropdown
          options={outputStyleOptions}
          value={outputStyle}
          onChange={setOutputStyle}
          placeholder="Select output style"
        />
      </div>
      <Button type="submit" variant="primary" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit'}
      </Button>
      {error && <div className="text-red-600 mt-2">{error}</div>}
      {success && <div className="text-green-600 mt-2">{success}</div>}
    </form>
  );
};

export default ProcessForm;
