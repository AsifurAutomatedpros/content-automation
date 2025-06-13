import React, { useState } from 'react';
import InputText from './inputtext';
import Button from './button';
import Dropdown from './dropdown';
import { typeConfigs } from '@/types/inputfields/typesanditsinputfields';

type FieldType = 'text' | 'file' | 'number' | 'dropdown' | 'file-multiple';

interface Field {
  id: string;
  label: string;
  type: FieldType;
  required: boolean;
  placeholder?: string;
  accept?: string;
  multiple?: boolean;
  options?: { label: string; value: string }[];
}

interface PayloadField {
  name: string;
  type: 'string' | 'array' | 'int' | 'boolean' | 'file';
  sourceType: 'input' | 'static';
  source: string; // input field id or static value
}

interface AddTypeFormProps {
  onClose: () => void;
  onAddType: (newType: any) => void;
  setSelectedType: (type: string) => void;
  setShowAddType: (show: boolean) => void;
}

const AddTypeForm: React.FC<AddTypeFormProps> = ({ onClose, onAddType, setSelectedType, setShowAddType }) => {
  const [typeName, setTypeName] = useState('');
  const [typeValue, setTypeValue] = useState('');
  const [apiEndpoint, setApiEndpoint] = useState('');
  const [payloadType, setPayloadType] = useState('json');
  const [responsePath, setResponsePath] = useState('');
  const [responseExample, setResponseExample] = useState('');
  const [mainPayloadField, setMainPayloadField] = useState('');
  const [mainPayloadFieldType, setMainPayloadFieldType] = useState<'string' | 'array' | 'int' | 'boolean' | 'file'>('string');
  const generateTypeId = () => Math.floor(1000 + Math.random() * 9000).toString();
  const [typeId] = useState(generateTypeId());
  const [fields, setFields] = useState<Field[]>([]);
  const [currentField, setCurrentField] = useState<Partial<Field>>({ type: 'text', required: true });
  const [payloadFields, setPayloadFields] = useState<PayloadField[]>([]);
  const [currentPayloadField, setCurrentPayloadField] = useState<Partial<PayloadField>>({ type: 'string', sourceType: 'input' });
  const [error, setError] = useState<string | null>(null);

  const fieldTypeOptions = [
    { label: 'Text Input', value: 'text', className: 'text-black' },
    { label: 'Number Input', value: 'number', className: 'text-black' },
    { label: 'File Upload (Single)', value: 'file', className: 'text-black' },
    { label: 'File Upload (Multiple)', value: 'file-multiple', className: 'text-black' },
    { label: 'Dropdown', value: 'dropdown', className: 'text-black' }
  ];

  const payloadTypeOptions = [
    { label: 'JSON', value: 'json', className: 'text-black' },
    { label: 'Multipart Form Data', value: 'multipart', className: 'text-black' }
  ];

  const payloadFieldTypeOptions = [
    { label: 'String', value: 'string', className: 'text-black' },
    { label: 'Array', value: 'array', className: 'text-black' },
    { label: 'Integer', value: 'int', className: 'text-black' },
    { label: 'Boolean', value: 'boolean', className: 'text-black' },
    { label: 'File', value: 'file', className: 'text-black' },
  ];

  const payloadFieldSourceTypeOptions = [
    { label: 'Input Field', value: 'input', className: 'text-black' },
    { label: 'Static Value', value: 'static', className: 'text-black' },
  ];

  const addField = () => {
    if (!currentField.id || !currentField.label || !currentField.type) return;

    const newField: Field = {
      id: currentField.id,
      label: currentField.label,
      type: currentField.type === 'file-multiple' ? 'file' : currentField.type,
      required: currentField.required!,
      placeholder: currentField.placeholder,
      accept: currentField.accept,
      multiple: currentField.type === 'file-multiple',
      options: currentField.options
    };

    setFields([...fields, newField]);
    setCurrentField({ type: 'text', required: true });
  };

  const removeField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const addPayloadField = () => {
    if (!currentPayloadField.name || !currentPayloadField.type || !currentPayloadField.sourceType || !currentPayloadField.source) return;
    setPayloadFields([...payloadFields, currentPayloadField as PayloadField]);
    setCurrentPayloadField({ type: 'string', sourceType: 'input' });
  };

  const removePayloadField = (index: number) => {
    setPayloadFields(payloadFields.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!typeName.trim()) {
      setError('Type Name is required.');
      return;
    }
    if (!typeValue.trim()) {
      setError('Type Value is required.');
      return;
    }
    if (!apiEndpoint.trim()) {
      setError('API Endpoint is required.');
      return;
    }
    if (!payloadType) {
      setError('Payload Type is required.');
      return;
    }
    if (!mainPayloadField.trim()) {
      setError('Main Payload Field Name is required.');
      return;
    }
    if (!mainPayloadFieldType) {
      setError('Main Payload Field Type is required.');
      return;
    }
    if (payloadFields.length === 0) {
      setError('Please add at least one other payload field.');
      return;
    }
    if (!responsePath.trim()) {
      setError('Response Path is required.');
      return;
    }

    try {
      const newType = {
        id: typeId,
        label: typeName,
        value: typeValue,
        fields,
        api: {
          endpoint: apiEndpoint,
          payloadType,
          responsePath,
          responseExample,
          mainPayloadField,
          mainPayloadFieldType,
          payloadFields,
          payload: (formData: Record<string, any>) => {
            const payload: Record<string, any> = {};
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
            payloadFields.forEach(field => {
              let value;
              if (field.sourceType === 'input') {
                value = formData[field.source];
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
                    value = value.split(',').map(v => v.trim());
                  }
                  break;
                case 'file':
                  // leave as is (should be File or File[])
                  break;
                default:
                  value = String(value);
              }
              payload[field.name] = value;
            });
            if (payloadType === 'multipart') {
              const formDataObj = new FormData();
              Object.entries(payload).forEach(([key, value]) => {
                if (value instanceof File || Array.isArray(value)) {
                  if (Array.isArray(value)) {
                    value.forEach(file => formDataObj.append(key, file));
                  } else {
                    formDataObj.append(key, value);
                  }
                } else {
                  formDataObj.append(key, String(value));
                }
              });
              return formDataObj;
            }
            return payload;
          }
        }
      };

      const response = await fetch('/api/types', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newType),
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 400 && result.existingType) {
          setError(`Type already exists with ${result.existingType.label} (${result.existingType.value})`);
        } else {
          throw new Error(result.error || 'Failed to add type');
        }
        return;
      }

      if (result.success) {
        onAddType(newType);
        setSelectedType(newType.value);
        setShowAddType(false);
        onClose();
      } else {
        throw new Error(result.error || 'Failed to add type');
      }
    } catch (error) {
      console.error('Error adding type:', error);
      setError(error instanceof Error ? error.message : 'Failed to add type');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-black">Add New Type</h2>
        {error && <div className="mb-4 text-red-600 font-semibold">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Type Info Section */}
          <div className="border-b pb-4 mb-4">
            <h3 className="font-semibold text-lg text-black mb-2">Type Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-medium text-black">Type ID</label>
                <input
                  type="text"
                  value={typeId}
                  readOnly
                  className="border rounded p-2 w-full bg-gray-100 text-gray-500 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-black">Type Name</label>
                <InputText
                  value={typeName}
                  onChange={setTypeName}
                  placeholder="Enter type name (e.g., Document Processing)"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-black">Type Value</label>
                <InputText
                  value={typeValue}
                  onChange={setTypeValue}
                  placeholder="Enter type value (e.g., document)"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-black">API Endpoint</label>
                <InputText
                  value={apiEndpoint}
                  onChange={setApiEndpoint}
                  placeholder="Enter API endpoint (e.g., /api/process/document)"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-black">Payload Type</label>
                <Dropdown
                  options={payloadTypeOptions}
                  value={payloadType}
                  onChange={setPayloadType}
                  placeholder="Select payload type"
                />
              </div>
            </div>
          </div>
          {/* Input Fields Section */}
          <div className="border-b pb-4 mb-4">
            <h3 className="font-semibold text-lg text-black mb-2">Input Fields</h3>
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  <span className="flex-grow text-black">{field.label} ({field.type})</span>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => removeField(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-4">
              <h4 className="font-medium text-black">Add New Field</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-black">Field ID</label>
                  <InputText
                    value={currentField.id || ''}
                    onChange={(value) => setCurrentField({ ...currentField, id: value })}
                    placeholder="Enter field ID"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-black">Field Label</label>
                  <InputText
                    value={currentField.label || ''}
                    onChange={(value) => setCurrentField({ ...currentField, label: value })}
                    placeholder="Enter field label"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-black">Field Type</label>
                  <Dropdown
                    options={fieldTypeOptions}
                    value={currentField.type || 'text'}
                    onChange={(value) => setCurrentField({ ...currentField, type: value as FieldType })}
                    placeholder="Select field type"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-black">Required</label>
                  <input
                    type="checkbox"
                    checked={currentField.required}
                    onChange={(e) => setCurrentField({ ...currentField, required: e.target.checked })}
                    className="ml-2"
                  />
                </div>
                {currentField.type === 'file' && (
                  <div>
                    <label className="block mb-1 text-black">Accepted File Types</label>
                    <InputText
                      value={currentField.accept || ''}
                      onChange={(value) => setCurrentField({ ...currentField, accept: value })}
                      placeholder="e.g., .txt,.pdf"
                    />
                  </div>
                )}
              </div>
              <Button type="button" variant="secondary" onClick={addField}>
                Add Field
              </Button>
            </div>
          </div>
          {/* Payload Fields Section */}
          <div className="border-b pb-4 mb-4">
            <h3 className="font-semibold text-lg text-black mb-2">Payload Fields</h3>
            {/* Main Payload Field Name */}
            <div className="mb-4 p-4 bg-gray-100 rounded">
              <label className="block mb-1 font-medium text-black">Main Payload Field Name</label>
              <InputText
                value={mainPayloadField}
                onChange={setMainPayloadField}
                placeholder="Enter main payload field name"
              />
              <label className="block mb-1 font-medium text-black mt-2">Type</label>
              <Dropdown
                options={payloadFieldTypeOptions}
                value={mainPayloadFieldType}
                onChange={value => setMainPayloadFieldType(value as typeof mainPayloadFieldType)}
                placeholder="Select type"
              />
            </div>
            {/* Other Payload Fields */}
            <div className="space-y-4">
              {payloadFields.map((field, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  <span className="flex-grow text-black">{field.name} ({field.type}, {field.sourceType === 'input' ? `from input: ${field.source}` : `static: ${field.source}`})</span>
                  <Button type="button" variant="secondary" onClick={() => removePayloadField(index)}>
                    Remove
                  </Button>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-4">
              <h4 className="font-medium text-black">Other Payload Fields</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-black">Payload Field Name</label>
                  <InputText
                    value={currentPayloadField.name || ''}
                    onChange={value => setCurrentPayloadField({ ...currentPayloadField, name: value })}
                    placeholder="Enter payload field name"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-black">Type</label>
                  <Dropdown
                    options={payloadFieldTypeOptions}
                    value={currentPayloadField.type || 'string'}
                    onChange={value => setCurrentPayloadField({ ...currentPayloadField, type: value as PayloadField['type'] })}
                    placeholder="Select type"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-black">Source Type</label>
                  <Dropdown
                    options={payloadFieldSourceTypeOptions}
                    value={currentPayloadField.sourceType || 'input'}
                    onChange={value => setCurrentPayloadField({ ...currentPayloadField, sourceType: value as PayloadField['sourceType'] })}
                    placeholder="Select source type"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-black">{currentPayloadField.sourceType === 'input' ? 'Input Field ID' : 'Static Value'}</label>
                  <InputText
                    value={currentPayloadField.source || ''}
                    onChange={value => setCurrentPayloadField({ ...currentPayloadField, source: value })}
                    placeholder={currentPayloadField.sourceType === 'input' ? 'Enter input field ID' : 'Enter static value'}
                  />
                </div>
              </div>
              <Button type="button" variant="secondary" onClick={addPayloadField}>
                Add Payload Field
              </Button>
            </div>
          </div>
          {/* Response Info Section */}
          <div>
            <h3 className="font-semibold text-lg text-black mb-2">Response Info</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-medium text-black">Response Path</label>
                <InputText
                  value={responsePath}
                  onChange={setResponsePath}
                  placeholder="Enter response path (e.g., data.choices[0].message.content)"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-black">Response Example</label>
                <textarea
                  value={responseExample}
                  onChange={(e) => setResponseExample(e.target.value)}
                  placeholder="Enter example API response (e.g., { data: { choices: [{ message: { content: 'Example output' } }] } })"
                  className="w-full border rounded p-2 text-black placeholder:text-black"
                  rows={4}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Add Type
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTypeForm;
