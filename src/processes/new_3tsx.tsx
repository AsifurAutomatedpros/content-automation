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

export const processData = async (
  inputLines: string[]
): Promise<any> => {
  try {
    const inputText = inputLines.join("\n");
    // Prepare the prompt
    const generatedPrompt = "create it as like profile.tsx dont use any compoent just tailwind \n\nFollow these instructions strictly:\nValidation: validate it well\n\nattachments:\nProfile.tsx\n\nInput:\n";
    // Prepare payload
    const payload = { "attachments": [{}], "description": generatedPrompt };
    // Make API call
    const response = await axios.post(
      'https://dev.felidae.network/api/chatgpt/code_generation',
      payload,
      { headers: { 'Content-Type': 'multipart/form-data' }, timeout: 60000 }
    );
    // Extract output using responsePath
    const output = response.data.data.data.code;
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

  return <Output type={"array"} content={output} />;
};

export default Process;
