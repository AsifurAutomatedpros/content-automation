"use client";
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
const PROCESS_ID = "948232";
const PROCESS_NAME = "surfaced";
const PROCESS_TYPE = "newest";
const TYPE_ID = "2145";
const FILE_FIELDS = [
  {
    "type": "array",
    "sourceType": "input",
    "name": "attachments",
    "source": "1"
  }
];
const FILE_FIELD_CONFIGS = [
  {
    "field": {
      "type": "array",
      "sourceType": "input",
      "name": "attachments",
      "source": "1"
    },
    "config": {
      "id": "1",
      "label": "attachmentss",
      "type": "file",
      "required": true,
      "multiple": true
    }
  }
];

// File paths for attachmentss
const ATTACHMENTS_PATHS: string[] = [
  "/public/948232/attachmentss/Profile.tsx"
];
const ATTACHMENTS_NAMES: string[] = [
  "Profile.tsx"
];
const ATTACHMENTS_DIRECTORY = "public/948232/attachmentss";

interface ProcessPayload {
    " model": string;
    "max_tokens": string;
    "temperature": string;
    "attachments": string[]
    "prompt": string;
  }

  // Type for API payload that can be either ProcessPayload or FormData
  type ApiPayload = ProcessPayload | FormData;

export const processData = async (
  inputLines: string[]
): Promise<any> => {
  try {
    const inputText = inputLines.join("\n");
    // Prepare the prompt
    const generatedPrompt = "\n\nFollow these instructions strictly:in tailwind create html not js no compoennt just same \nValidation: error free\n\nMain Input:\n" + inputText;

    let apiPayload: ApiPayload;

    // Construct the base payload object first, to easily access values for FormData or JSON
    const basePayload: ProcessPayload = { " model": "gemini-1.5-pro", "max_tokens": "200", "temperature": "0.7", "attachments": ATTACHMENTS_PATHS, "prompt": generatedPrompt };

    if ('multipart' === 'multipart') {
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
      
      if (ATTACHMENTS_PATHS.length > 0) {
        await Promise.all(
          ATTACHMENTS_PATHS.map(async (filePath: string, index: number) => {
            const response = await fetch('/api/process-file/content?processId=' + PROCESS_ID + '&label=' + (FILE_FIELD_CONFIGS.find(ffc => ffc.field.name === 'attachments')?.config?.label || '') + '&filename=' + ATTACHMENTS_NAMES[index]);
            if (!response.ok) throw new Error("Failed to fetch file content for " + ATTACHMENTS_NAMES[index]);
            const content = await response.text();
            const blob = new Blob([content], { type: 'text/plain' });
            formData.append('attachments[]', blob, ATTACHMENTS_NAMES[index]);
          })
        );
      } else {
        // If no attachments, append an empty blob to ensure the field is present as an array
        formData.append('attachments[]', new Blob([]), '');
      }
      apiPayload = formData;
    } else {
      // For JSON payloads, the basePayload is the apiPayload
      apiPayload = basePayload;
    }

    // Make API call
    const response = await axios.post(
      'https://dev.felidae.network/api/gemini/code_generation',
      apiPayload,
      { 
        headers: { 
          'Content-Type': 'multipart/form-data'
        }, 
        timeout: 60000 
      }
    );
    // Extract output using responsePath
    const output = response.data.data.code;
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
        const result = await processData(inputText.split("\n"));
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

  return <Output type="text" content={output} />;
};

export default Process;