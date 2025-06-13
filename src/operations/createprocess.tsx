import { typeConfigs } from '@/types/inputfields/typesanditsinputfields';

interface ProcessData {
  processName: string;
  processId: string;
  status: boolean;
  instruction: string;
  validation: string;
  knowledgeBase: File[];
  schemaTool: File[];
  gptValidation: string;
  outputStyle: string;
}

// Function to generate the process file content dynamically
export const generateProcessFile = (typeConfig: any, formData: Record<string, any>, prompt: string): string => {
  const responsePath = typeConfig.api.responsePath.startsWith('.') ? typeConfig.api.responsePath : '.' + typeConfig.api.responsePath;
  const mainField = typeConfig.api.mainPayloadField;
  const payloadFieldsConfig = typeConfig.api.payloadFields || [];
  // Build the payload assignment as a string: only main payload field and payloadFields
  const payloadFieldAssignments = payloadFieldsConfig
    .filter((field: any) => field.name !== mainField)
    .map((field: any) => `${JSON.stringify(field.name)}: ${JSON.stringify(formData[field.name])}`)
    .join(', ');
  // Escape newlines in the prompt for a valid JS string
  const escapedPrompt = prompt.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/\r/g, '');
  // Set outputType from config, mapping 'string' to 'text'
  const outputType = typeConfig.api.mainPayloadFieldType === 'string' ? 'text' : (typeConfig.api.mainPayloadFieldType || 'text');
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

export const processData = async (
  inputLines: string[]
): Promise<any> => {
  try {
    const inputText = inputLines.join("\\n");
    // Prepare the prompt
    const generatedPrompt = "${escapedPrompt}" + inputText;
    // Prepare payload
    const payload = { ${payloadFieldAssignments}${payloadFieldAssignments ? ', ' : ''}${JSON.stringify(mainField)}: generatedPrompt };
    // Make API call
    const response = await axios.post(
      '${typeConfig.api.endpoint}',
      payload,
      { headers: { 'Content-Type': '${typeConfig.api.payloadType === 'multipart' ? 'multipart/form-data' : 'application/json'}' }, timeout: 60000 }
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

  return <Output type={"${outputType}"} content={output} />;
};

export default Process;
`;
};

// Utility to read file content as text
async function readFileContent(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

// Main process execution function
export const createProcess = async ({ endpoint, payload, headers, payloadType, typeConfig, dynamicFields, gptValidation, validation, userInput, processId, processName }: {
  endpoint: string;
  payload: any;
  headers: any;
  payloadType: string;
  typeConfig: any;
  dynamicFields: Record<string, any>;
  gptValidation: string;
  validation: string;
  userInput: string;
  processId: string;
  processName: string;
}) => {
  try {
    // Build the prompt
    let prompt = `${gptValidation}\n\nFollow these instructions strictly:`;
    prompt += `\nValidation: ${validation}`;
    // Add file field contents to the prompt
    for (const field of typeConfig.fields) {
      if (field.type === 'file') {
        const label = field.label;
        const files = dynamicFields[field.id];
        if (files) {
          for (const file of Array.isArray(files) ? files : [files]) {
            const content = await readFileContent(file);
            prompt += `\n\n${label}:\n${content}`;
          }
        }
      }
    }
    prompt += `\n\nInput:{{$inputText}}\n`;

    // Set main payload field to prompt
    payload[typeConfig.api.mainPayloadField] = prompt;

    // Prepare FormData if needed
    let apiPayload = payload;
    if (payloadType === 'multipart') {
      const formDataObj = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        if (value instanceof File) {
          formDataObj.append(key, value);
        } else if (Array.isArray(value)) {
          value.forEach(file => {
            if (file) formDataObj.append(key, file);
          });
        } else if (value !== undefined && value !== null) {
          formDataObj.append(key, String(value));
        }
      });
      apiPayload = formDataObj;
    }

    // Make the API call
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: payloadType === 'multipart' ? undefined : headers,
      body: apiPayload,
    });
    const result = await response.json();
    if (!result.success && result.error) {
      throw new Error(result.error);
    }

    // Write the process file to /processes via API
    const processFileContent = generateProcessFile(typeConfig, payload, prompt);
    await fetch('/api/process-file', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename: processName, content: processFileContent }),
    });

    return result;
  } catch (error) {
    console.error('Error in createProcess:', error);
    throw error;
  }
};
