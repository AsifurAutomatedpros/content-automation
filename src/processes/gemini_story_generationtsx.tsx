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
    const generatedPrompt = "use simple words to understandable for kids\n\nFollow these instructions strictly:\nValidation: Create a lively story along with keeping a visualisation of the same as we can create clips from it\n\nInput:\n";
    // Prepare payload
    const payload = { "model": "gemini-1.5-pro", "max_tokens": "200", "temperature": "0.7", "prompt": generatedPrompt };
    // Make API call
    const response = await axios.post(
      'https://dev.felidae.network/api/gemini/text_generation',
      payload,
      { headers: { 'Content-Type': 'application/json' }, timeout: 60000 }
    );
    // Extract output using responsePath
    const output = response.data.generated_text;
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

  return <Output type={"text"} content={output} />;
};

export default Process;
