'use client';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

interface ProcessResponse {
  message: string;
  data: {
    choices: Array<{
      message: {
        content: string;
      };
    }>;
  };
}

interface ProcessProps {
  inputText: string;
  model?: 'gpt-4.1' | 'gpt-4.1-nano';
}

// Process configuration
const PROCESS_CONFIG = {
  name: "544459",
  validation: "",
  gptValidation: ""
};

export const processData = async (
  inputLines: string[],
  model: 'gpt-4.1' | 'gpt-4.1-nano' = 'gpt-4.1'
): Promise<string[]> => {
  try {
    const inputText = inputLines.join('\n');
    
    // Read required files
    const knowledgeBaseContent = await fetch(`/knowledgebase/${PROCESS_CONFIG.name}/${PROCESS_CONFIG.name}KnowledgeBase.txt?t=${Date.now()}`).then(res => res.text());
    const schemaToolContent = await fetch(`/instructions/${PROCESS_CONFIG.name}/${PROCESS_CONFIG.name}.txt?t=${Date.now()}`).then(res => res.text());

    // Prepare the prompt
    const prompt = `${PROCESS_CONFIG.gptValidation}\n\nFollow these instructions strictly:\n1. Read the knowledge base.\n2. Read the schema-tool.\n3. Check the input prompt.\n4. Prepare the output.\n5. Validate the output.\n6. If any issue is found, send for recheck with output format.\n\nValidation: ${PROCESS_CONFIG.validation}\n\nKnowledge Base:\n${knowledgeBaseContent}\n\nSchema Tool:\n${schemaToolContent}\n\nInput:\n${inputText}`;

    // Prepare FormData
    const formData = new FormData();
    formData.append('model', model);
    formData.append('messages', prompt);
    formData.append('temperature', '0.7');
    formData.append('max_tokens', '4000');
    formData.append('knowledge_base', new Blob([knowledgeBaseContent], { type: 'text/plain' }), 'knowledge_base.txt');
    formData.append('schema_tool', new Blob([schemaToolContent], { type: 'text/plain' }), 'schema_tool.txt');

    // Make API call
    const response = await axios.post<ProcessResponse>(
      'https://dev.felidae.network/api/chatgpt/chat_completion',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' }, timeout: 60000 }
    );

    const content = response.data.data.choices[0].message.content;
    const results = content
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    return results;
  } catch (error) {
    console.error('Error processing data:', error);
    throw error;
  }
};

// Component for using the process
export const Process: React.FC<ProcessProps> = ({ 
  inputText,
  model = 'gpt-4.1'
}) => {
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processText = async () => {
      if (!inputText) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const result = await processData(inputText.split('\n'), model);
        setResults(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    processText();
  }, [inputText, model]);

  if (loading) return <div>Processing...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!results.length) return null;

  return (
    <div>
      {results.map((result, index) => (
        <div key={index}>{result}</div>
      ))}
    </div>
  );
};

export default Process;