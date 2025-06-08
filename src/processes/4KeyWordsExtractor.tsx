'use client';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

interface KeywordExtractorResponse {
  message: string;
  data: {
    choices: Array<{
      message: {
        content: string;
      };
    }>;
  };
}

interface KeywordExtractorProps {
  inputText: string;
  model?: 'gpt-4.1' | 'gpt-4.1-nano';
}

export const extractKeywords = async (
  inputLines: string[],
  model: 'gpt-4.1' | 'gpt-4.1-nano' = 'gpt-4.1',
  retryCount = 0
): Promise<string[]> => {
  try {
    const inputText = inputLines.join('\n');
    // Read all required files as text from public
    const knowledgeBaseContent = await fetch(`/knowledgebase/4KeyWordExtractor/4KeyWordKnowledgeBase.txt?t=${Date.now()}`).then(res => res.text());
    const schemaToolContent = await fetch(`/instructions/4keywordextractor.txt?t=${Date.now()}`).then(res => res.text());

    // Prepare the prompt for messages (plain text only)
    const prompt = `***IMPORTANT: For each phrase in the input, you MUST output exactly 4 keywords (no more, no less) for each phrase add serial number like 1,2,3 for each set of 4 keywords, and nothing else. Each line must be in the format: [Subject] [Action] [Camera] [Modifier].***\n\nFollow these instructions strictly:\n1. Read the knowledge base.\n2. Read the schema-tool.\n3. Check the input prompt.\n4. Prepare the output.\n5. Validate the output.\n6. If any issue is found, send for recheck with output format.\n\nValidation: For each phrase, output exactly 4 keywords in the format [Subject] [Action] [Camera] [Modifier], no other content, just  list of four keywords per phrase as per the knowledge base and schema tool so there will be many four keywords as there are many phrases in the input.\n\nKnowledge Base:\n${knowledgeBaseContent}\n\nSchema Tool:\n${schemaToolContent}\n\nInput:\n${inputText}`;

    // Prepare FormData
    const formData = new FormData();
    formData.append('model', model);
    formData.append('messages', prompt);
    formData.append('temperature', '0.7');
    formData.append('max_tokens', '4000');
    formData.append('knowledge_base', new Blob([knowledgeBaseContent], { type: 'text/plain' }), 'knowledge_base.txt');
    formData.append('schema_tool', new Blob([schemaToolContent], { type: 'text/plain' }), 'schema_tool.txt');

    // Make the API call with a 60-second timeout
    const response = await axios.post<KeywordExtractorResponse>(
      'https://dev.felidae.network/api/chatgpt/chat_completion',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' }, timeout: 60000 }
    );

    // Only lines with exactly 4 words
    const content = response.data.data.choices[0].message.content;
    const keywords = content
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    // Validation: number of output lines must match number of input lines
    const filteredInputLines = inputLines.filter((line: string) => line.trim().length > 0);
    if ((keywords.length < filteredInputLines.length) && retryCount < 3) {
      return await extractKeywords(filteredInputLines, model, retryCount + 1);
    }

    return keywords;
  } catch (error) {
    console.error('Error extracting keywords:', error);
    throw error;
  }
};

// Component for using the keyword extractor
export const KeywordExtractor: React.FC<KeywordExtractorProps> = ({ 
  inputText,
  model = 'gpt-4.1' // Default to gpt-4.1 if not specified
}) => {
  const [keywords, setKeywords] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processText = async () => {
      if (!inputText) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const result = await extractKeywords(inputText.split('\n'), model);
        setKeywords(result);
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
  if (!keywords.length) return null;

  return (
    <div>
      {keywords.map((keyword, index) => (
        <div key={index}>{keyword}</div>
      ))}
    </div>
  );
};

export default KeywordExtractor;
