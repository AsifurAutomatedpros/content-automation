interface TypeConfig {
  api: {
    responsePath: string;
    mainPayloadField: string;
    mainPayloadFieldType: string;
    payloadFields?: Array<{
      name: string;
      type: string;
      source: string;
      sourceType: string;
      label?: string;
    }>;
    endpoint: string;
    payloadType: string;
  };
  fields?: Array<{
    id: string;
    label: string;
    type: string;
  }>;
  id: string;
}

interface Attachment {
  name: string;
  content: string;
  path: string;
}

export const generateProcessFile = (
  typeConfig: TypeConfig,
  formData: Record<string, any>,
  prompt: string,
  attachments?: any[]
): string => {
  const responsePath = typeConfig.api.responsePath.startsWith('.') ? typeConfig.api.responsePath : '.' + typeConfig.api.responsePath;
  const mainField = typeConfig.api.mainPayloadField;
  const payloadFieldsConfig = typeConfig.api.payloadFields || [];
  const processId = formData.processId;
  const processName = formData.processName;
  const type = formData.type;
  const typeId = typeConfig.id;

  // Find all file fields in payloadFields and their corresponding fields from typeConfig.fields
  const fileFields = payloadFieldsConfig.filter(field => field.type === 'file' || field.type === 'array');
  const fileFieldConfigs = fileFields.map(field => ({
    field,
    config: typeConfig.fields?.find(f => f.id === field.source)
  }));

  // Get file paths from formData for each file field
  const filePathConstants = fileFieldConfigs.length > 0 ? fileFieldConfigs.map(({ field, config }) => {
    const filePaths = formData[field.source] || [];
    const fileNames = filePaths.map((path: string) => path.split('/').pop() || '');
    return `
// File paths for ${config?.label || field.name}
const ${field.name.toUpperCase()}_PATHS: string[] = ${JSON.stringify(filePaths, null, 2)};
const ${field.name.toUpperCase()}_NAMES: string[] = ${JSON.stringify(fileNames, null, 2)};
const ${field.name.toUpperCase()}_DIRECTORY = "public/${processId}/${config?.label || 'Attachment'}";`;
  }).join('\n') : `
// No file paths available
const FILE_PATHS: string[] = [];
const FILE_NAMES: string[] = [];
const FILE_DIRECTORY = "";`;

  // Build the payload assignment as a string: only main payload field and payloadFields
  const payloadFieldAssignments = payloadFieldsConfig
    .map((field) => {
      if (field.type === 'file' || field.type === 'array') {
        // For file fields, use the file paths from the constants
        return `${JSON.stringify(field.name)}: ${field.name.toUpperCase()}_PATHS`;
      }
      if (field.sourceType === 'input') {
        return `${JSON.stringify(field.name)}: ${JSON.stringify(formData[field.source])}`;
      } else {
        // Handle static values
        switch (field.type) {
          case 'float':
            return `${JSON.stringify(field.name)}: ${parseFloat(field.source)}`;
          case 'int':
            return `${JSON.stringify(field.name)}: ${parseInt(field.source, 10)}`;
          case 'boolean':
            return `${JSON.stringify(field.name)}: ${field.source === 'true'}`;
          case 'array':
            return `${JSON.stringify(field.name)}: ${JSON.stringify(field.source.split(',').map((v: string) => v.trim()))}`;
          default:
            return `${JSON.stringify(field.name)}: ${JSON.stringify(field.source)}`;
        }
      }
    })
    .join(', ');

  // Properly escape the prompt for a valid JS string
  const escapedPrompt = prompt
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '')
    .replace(/\t/g, '\\t')
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"')
    .replace(/\${/g, '\\${');

  // Set outputType from config, mapping 'string' to 'text'
  const outputType = typeConfig.api.mainPayloadFieldType === 'string' ? 'text' : (typeConfig.api.mainPayloadFieldType || 'text');

  // Define the payload type interface based on the type configuration
  const payloadTypeInterface = `interface ProcessPayload {
    ${payloadFieldsConfig.map(field => {
      // Check if the field is in fileFields and has array type
      const isFileArray = fileFields.some((f: { name: string; type: string }) => f.name === field.name && f.type === 'array');
      const type = isFileArray ? 'string[]' : 
                  field.type === 'array' ? 'string[]' : 
                  field.type === 'file' ? 'string[]' :
                  field.type === 'int' ? 'number' :
                  field.type === 'float' ? 'number' :
                  field.type === 'boolean' ? 'boolean' :
                  'string';
      return `${JSON.stringify(field.name)}: ${type}`;
    }).join(';\n    ')}
    ${JSON.stringify(mainField)}: string;
  }

  // Type for API payload that can be either ProcessPayload or FormData
  type ApiPayload = ProcessPayload | FormData;`;

  return `"use client";
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Output from '@/components/output';

interface ProcessResponse {
  message: string;
  data: any;
}

interface ProcessProps {
  inputText: string;
}

// Store processId and file information as constants
const PROCESS_ID = "${processId}";
const PROCESS_NAME = "${processName}";
const PROCESS_TYPE = "${type}";
const TYPE_ID = "${typeId}";
const FILE_FIELDS = ${JSON.stringify(fileFields, null, 2)};
const FILE_FIELD_CONFIGS = ${JSON.stringify(fileFieldConfigs, null, 2)};
${filePathConstants}

${payloadTypeInterface}

export const processData = async (
  inputLines: string[]
): Promise<any> => {
  try {
    const inputText = inputLines.join("\\n");
    // Prepare the prompt
    const generatedPrompt = "${escapedPrompt}" + inputText;

    let apiPayload: ApiPayload;

    // Construct the base payload object first, to easily access values for FormData or JSON
    const basePayload: ProcessPayload = { ${payloadFieldAssignments}${payloadFieldAssignments ? ', ' : ''}${JSON.stringify(mainField)}: generatedPrompt };

    if ('${typeConfig.api.payloadType}' === 'multipart') {
      const formData = new FormData();

      // Append all non-file fields from the basePayload to FormData
      Object.entries(basePayload).forEach(([key, value]) => {
        // Exclude file fields from this loop, as they are handled below
        if (!FILE_FIELDS.some(f => f.name === key)) {
          if (Array.isArray(value)) {
            value.forEach(item => formData.append(key, String(item)));
          } else {
            formData.append(key, String(value));
          }
        }
      });

      // Process each file field and append to FormData
      ${fileFields.map(field => `
      if (${field.name.toUpperCase()}_PATHS.length > 0) {
        await Promise.all(
          ${field.name.toUpperCase()}_PATHS.map(async (filePath: string, index: number) => {
            const response = await fetch('/api/process-file/content?processId=' + PROCESS_ID + '&label=' + (FILE_FIELD_CONFIGS.find(ffc => ffc.field.name === '${field.name}')?.config?.label || '') + '&filename=' + ${field.name.toUpperCase()}_NAMES[index]);
            if (!response.ok) throw new Error("Failed to fetch file content for " + ${field.name.toUpperCase()}_NAMES[index]);
            const content = await response.text();
            const blob = new Blob([content], { type: 'text/plain' });
            formData.append('${field.name}[]', blob, ${field.name.toUpperCase()}_NAMES[index]);
          })
        );
      } else {
        // If no attachments, append an empty blob to ensure the field is present as an array
        formData.append('${field.name}[]', new Blob([]), '');
      }`).join('\n')}
      apiPayload = formData;
    } else {
      // For JSON payloads, the basePayload is the apiPayload
      apiPayload = basePayload;
    }

    // Make API call
    const response = await axios.post(
      '${typeConfig.api.endpoint}',
      apiPayload,
      { 
        headers: { 
          'Content-Type': '${typeConfig.api.payloadType === 'multipart' ? 'multipart/form-data' : 'application/json'}'
        }, 
        timeout: 60000 
      }
    );
    // Extract output using responsePath
    const output = response.data${responsePath};
    return output;
  } catch (error) {
    console.error('Error processing data:', error);
    throw error;
  }
};

export const Process: React.FC<ProcessProps> = ({ 
  inputText
}) => {
  const [output, setOutput] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processText = async () => {
      if (!inputText) return;
      setLoading(true);
      setError(null);
      try {
        const result = await processData(inputText.split("\\n"));
        setOutput(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    processText();
  }, [inputText]);

  if (loading) return <div>Processing...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!output) return null;

  return <Output type="${outputType}" content={output} />;
};

export default Process;`;
};