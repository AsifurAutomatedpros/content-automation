import React, { useState, useEffect } from 'react';
import InputText from './inputtext';
import Output from './output';
import Button from './button';
import Dropdown from './dropdown';
import ToggleButton from './togglebutton';
import { createProcess } from '@/operations/createprocess';
import { generateProcessFile } from '@/operations/generateProcessFile';
import { TypeConfig } from '@/types/inputfields/typesanditsinputfields';
import { ProcessData } from '@/types/process';
import AddTypeForm from './addType';
import { typeConfigs } from '@/types/inputfields/typesanditsinputfields';

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
  const [gptValidation, setGptValidation] = useState('');
  const [outputStyle, setOutputStyle] = useState('text');
  const [selectedType, setSelectedType] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [dynamicFields, setDynamicFields] = useState<Record<string, any>>({});
  const [showAddType, setShowAddType] = useState(false);
  const [types, setTypes] = useState<TypeConfig[]>([]);
  const [loadingTypes, setLoadingTypes] = useState(true);

  useEffect(() => {
    fetchTypes();
  }, []);

  const fetchTypes = async () => {
    try {
      setLoadingTypes(true);
      const response = await fetch('/api/types');
      if (!response.ok) {
        throw new Error('Failed to fetch types');
      }
      const data = await response.json();
      setTypes(data.types);
      if (data.types.length > 0) {
        setSelectedType(data.types[0].value);
      }
    } catch (error) {
      console.error('Error fetching types:', error);
      setError('Failed to load types');
    } finally {
      setLoadingTypes(false);
    }
  };

  const handleFileChange = (fieldId: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      // Save files to public directory
      files.forEach(async (file) => {
        const field = types.find(t => t.value === selectedType)?.fields.find(f => f.id === fieldId);
        if (field) {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('processId', processId);
          formData.append('label', field.label);
          
          try {
            const response = await fetch('/api/process-file/upload', {
              method: 'POST',
              body: formData
            });
            
            if (!response.ok) {
              throw new Error('Failed to upload file');
            }
          } catch (error) {
            console.error('Error uploading file:', error);
          }
        }
      });
      setDynamicFields(prev => ({ ...prev, [fieldId]: files }));
    }
  };

  const handleTextChange = (fieldId: string) => (value: string) => {
    setDynamicFields(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleAddType = async (newType: any) => {
    try {
      await fetchTypes(); // Refresh types after adding new one
    } catch (error) {
      console.error('Error refreshing types:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      if (!processName.trim()) throw new Error('Process name is required');

      const selectedTypeConfig = types.find(t => t.value === selectedType);
      if (!selectedTypeConfig) throw new Error('Invalid type selected');

      // Validate required fields
      for (const field of selectedTypeConfig.fields) {
        if (field.required && !dynamicFields[field.id]) {
          throw new Error(`${field.label} is required`);
        }
      }

      // Build the payload using the type config
      const { payloadFields, mainPayloadField, mainPayloadFieldType, payloadType, endpoint } = selectedTypeConfig.api;
      let payload: Record<string, any> = {};
      
      // Handle file attachments
      const attachments = [];
      for (const field of selectedTypeConfig.fields) {
        if (field.type === 'file') {
          const files = dynamicFields[field.id];
          if (files) {
            for (const file of Array.isArray(files) ? files : [files]) {
              // Get file content from public directory
              const response = await fetch(`/api/process-file/content?processId=${processId}&label=${field.label}&filename=${file.name}`);
              if (!response.ok) throw new Error(`Failed to fetch file content for ${field.label}`);
              const content = await response.text();
              attachments.push({
                name: file.name,
                content: content,
                path: `/public/${processId}/${field.label}/${file.name}`
              });
            }
          }
        }
      }
      
      // Add attachments to payload if any
      if (attachments.length > 0) {
        payload.attachments = attachments;
      }

      // Add main payload field as empty or default value of its type
      switch (mainPayloadFieldType) {
        case 'int':
          payload[mainPayloadField] = 0;
          break;
        case 'boolean':
          payload[mainPayloadField] = false;
          break;
        case 'array':
          payload[mainPayloadField] = [];
          break;
        case 'file':
          payload[mainPayloadField] = null;
          break;
        default:
          payload[mainPayloadField] = '';
      }

      // Add other payload fields
      payloadFields.forEach(field => {
        let value;
        if (field.sourceType === 'input') {
          value = dynamicFields[field.source];
        } else {
          value = field.source;
        }
        switch (field.type) {
          case 'int':
            value = parseInt(value, 10);
            break;
          case 'boolean':
            value = value === 'true' || value === true;
            break;
          case 'array':
            if (typeof value === 'string') {
              value = value.split(',').map((v: string) => v.trim());
            }
            break;
          case 'file':
            // For file fields, use the field label as the key and the file paths as the value
            const fileField = selectedTypeConfig.fields.find(f => f.id === field.source);
            if (fileField) {
              const files = dynamicFields[field.source];
              if (files) {
                value = Array.isArray(files) 
                  ? files.map(file => `/public/${processId}/${fileField.label}/${file.name}`)
                  : [`/public/${processId}/${fileField.label}/${files.name}`];
              } else {
                value = [];
              }
            }
            break;
          default:
            value = String(value);
        }
        payload[field.name] = value;
      });

      // Build the prompt for the process file
      let prompt = '';
      if (gptValidation.trim()) {
        prompt += `\n\nFollow these instructions strictly:${gptValidation}`;
      }
      if (validation.trim()) {
        prompt += `\nValidation: ${validation}`;
      }
      if (prompt) {
        prompt += '\n\nMain Input:\n';
      }

      // Generate the process file content
      const processFileContent = generateProcessFile(selectedTypeConfig, {
        ...payload,
        processName,
        processId,
        type: selectedType,
        status,
        instruction,
        validation,
        gptValidation,
        outputStyle,
        // Add file paths for each file field
        ...Object.fromEntries(
          selectedTypeConfig.fields
            .filter(field => field.type === 'file')
            .map(field => {
              const files = dynamicFields[field.id];
              if (!files) return [field.id, []];
              const filePaths = Array.isArray(files) 
                ? files.map(file => `/public/${processId}/${field.label}/${file.name}`)
                : [`/public/${processId}/${field.label}/${files.name}`];
              return [field.id, filePaths];
            })
        )
      }, prompt);

      // Create FormData for process creation
      const formData = new FormData();
      formData.append('processName', processName);
      formData.append('processId', processId);
      formData.append('status', String(status));
      formData.append('instruction', instruction);
      formData.append('validation', validation);
      formData.append('gptValidation', gptValidation);
      formData.append('outputStyle', outputStyle);
      formData.append('processFileContent', processFileContent);
      formData.append('type', selectedType);
      formData.append('payloadType', payloadType || 'json');

      // Add knowledge base and schema tool files if they exist
      if (dynamicFields.knowledgeBase) {
        const knowledgeBaseFiles = Array.isArray(dynamicFields.knowledgeBase) 
          ? dynamicFields.knowledgeBase 
          : [dynamicFields.knowledgeBase];
        knowledgeBaseFiles.forEach(file => formData.append('knowledgeBase', file));
      }

      if (dynamicFields.schemaTool) {
        const schemaToolFiles = Array.isArray(dynamicFields.schemaTool) 
          ? dynamicFields.schemaTool 
          : [dynamicFields.schemaTool];
        schemaToolFiles.forEach(file => formData.append('schemaTool', file));
      }

      // Save the process file using the API
      const response = await fetch('/api/process/create', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to create process file.');
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Failed to create process');
      }

      setSuccess('Process created and integrated successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create process file.');
    } finally {
      setLoading(false);
    }
  };

  const renderDynamicFields = () => {
    const selectedTypeConfig = types.find(t => t.value === selectedType);
    if (!selectedTypeConfig) return null;

    return selectedTypeConfig.fields.map(field => (
      <div key={field.id}>
        <label className="block mb-1 font-medium text-black">{field.label}</label>
        {field.type === 'file' ? (
          <>
            <input
              type="file"
              multiple={field.multiple}
              accept={field.accept}
              onChange={handleFileChange(field.id)}
              className="border rounded p-2 w-full"
            />
            {dynamicFields[field.id] && (
              <div className="mt-2 text-sm text-gray-600">
                {Array.isArray(dynamicFields[field.id])
                  ? dynamicFields[field.id].map((file: File) => file.name).join(', ')
                  : dynamicFields[field.id].name}
              </div>
            )}
          </>
        ) : (
          <InputText
            value={dynamicFields[field.id] || ''}
            onChange={handleTextChange(field.id)}
            placeholder={field.placeholder}
            type={field.type}
          />
        )}
      </div>
    ));
  };

  return (
    <div className="relative">
      <div className="absolute top-0 right-0 p-4">
        <Button
          type="button"
          variant="secondary"
          onClick={() => setShowAddType(true)}
        >
          Add Type
        </Button>
      </div>

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
        <div>
          <label className="block mb-1 font-medium text-black">Type</label>
          {loadingTypes ? (
            <div className="text-gray-500">Loading types...</div>
          ) : (
            <Dropdown
              options={types.map(t => ({ label: t.label, value: t.value }))}
              value={selectedType}
              onChange={setSelectedType}
              placeholder="Select type"
            />
          )}
        </div>
        <div className="flex items-center gap-4">
          <ToggleButton checked={status} onChange={setStatus} label="Status" />
        </div>
        <div>
          <label className="block mb-1 font-medium text-black">LLM Validation</label>
          <InputText value={validation} onChange={setValidation} placeholder="Enter validation logic or notes" />
        </div>
        <div>
          <label className="block mb-1 font-medium text-black">LLM Instruction</label>
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
        {renderDynamicFields()}
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit'}
        </Button>
        {error && <div className="text-red-600 mt-2">{error}</div>}
        {success && <div className="text-green-600 mt-2">{success}</div>}
      </form>

      {showAddType && (
        <AddTypeForm
          onClose={() => setShowAddType(false)}
          onAddType={handleAddType}
          setSelectedType={setSelectedType}
          setShowAddType={setShowAddType}
        />
      )}
    </div>
  );
};

export default ProcessForm;
