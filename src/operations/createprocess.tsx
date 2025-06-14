import { typeConfigs, TypeConfig } from '../types/inputfields/typesanditsinputfields';
import { generateProcessFile } from './generateProcessFile';

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

interface Attachment {
  name: string;
  content: string;
  path: string;
}

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
  payloadType: 'json' | 'multipart';
  typeConfig: TypeConfig;
  dynamicFields: Record<string, any>;
  gptValidation: string;
  validation: string;
  userInput: string;
  processId: string;
  processName: string;
}) => {
  try {
    // Set main payload field to userInput
    payload[typeConfig.api.mainPayloadField] = userInput;

    // Handle attachments based on typeConfig payloadFields
    for (const field of typeConfig.api.payloadFields) {
      if (field.type === 'array' && field.sourceType === 'input') {
        // Get the files from dynamicFields using the source field ID
        const files = dynamicFields[field.source];
        if (files) {
          // Create an array of file objects with content from public directory
          const fileObjects = await Promise.all(
            (Array.isArray(files) ? files : [files]).map(async (file) => {
              const response = await fetch(`/api/process-file/content?processId=${processId}&label=${field.name}&filename=${file.name}`);
              if (!response.ok) throw new Error(`Failed to fetch file content for ${field.name}`);
              const content = await response.text();
              return {
                name: file.name,
                content: content,
                path: `/public/${processId}/${field.name}/${file.name}`
              };
            })
          );
          // Set the attachments in the payload using the field name
          payload[field.name] = fileObjects;
        }
      }
    }

    // Prepare FormData if needed
    let apiPayload = payload;
    if (payloadType === 'multipart') {
      const formDataObj = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        if (value instanceof File) {
          formDataObj.append(key, value);
        } else if (Array.isArray(value)) {
          value.forEach(file => {
            if (file) {
              // If it's a file object with content, create a Blob and append it
              if (file.content) {
                const blob = new Blob([file.content], { type: 'text/plain' });
                formDataObj.append(key, blob, file.name);
              } else {
                formDataObj.append(key, file);
              }
            }
          });
        } else if (value !== undefined && value !== null) {
          formDataObj.append(key, String(value));
        }
      });
      apiPayload = formDataObj;
    }

    // Make the API call
    const response = await fetch(endpoint, {
      method: typeConfig.api.method,
      headers: payloadType === 'multipart' ? undefined : headers,
      body: apiPayload,
    });
    const result = await response.json();
    if (!result.success && result.error) {
      throw new Error(result.error);
    }

    // Sanitize process name for filename
    const sanitizedProcessName = processName.replace(/[^a-zA-Z0-9_]/g, '_');
    // Remove .tsx extension from filename
    const processFileName = sanitizedProcessName;

    // Build the prompt for the process file
    const prompt = `\n\nFollow these instructions strictly:${gptValidation}\nValidation: ${validation}\n`;

    // Write the process file to /processes via API
    const processFileContent = generateProcessFile(typeConfig, {
      ...dynamicFields,
      processId,
      processName,
      type: typeConfig.id,
      status: true,
      instruction: '',
      validation,
      gptValidation,
      outputStyle: 'text'
    }, prompt);

    await fetch('/api/process-file', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        filename: processFileName,
        content: processFileContent,
        processId: processId,
        processName: processName,
        type: typeConfig.id,
        status: true,
        instruction: '',
        validation,
        gptValidation,
        outputStyle: 'text'
      }),
    });

    return result;
  } catch (error) {
    console.error('Error in createProcess:', error);
    throw error;
  }
};
