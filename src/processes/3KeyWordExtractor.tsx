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
  inputText: string,
  model: 'gpt-4.1' | 'gpt-4.1-nano' = 'gpt-4.1',
  retryCount = 0
): Promise<string[]> => {
  try {
    // Read all required files as text from public
    const bRollKeywordEngineContent = await fetch('/knowledgebase/3KeyWordExtractor/B-Roll Keyword Engine.txt').then(res => res.text());
    const languageSafetyContent = await fetch('/knowledgebase/3KeyWordExtractor/Language Safety & Cinematic Reasoning.txt').then(res => res.text());
    const subjectSelectionContent = await fetch('/knowledgebase/3KeyWordExtractor/Subject Selection by Age & Specificity.txt').then(res => res.text());
    const schemaToolContent = await fetch('/instructions/3keywordExtractor.txt').then(res => res.text());

    // Prepare the prompt for messages (plain text only)
    const prompt = `***IMPORTANT: For each phrase in the input, you MUST output exactly 3 keywords (no more, no less) for each phrase, and nothing else.***\n\nFollow these instructions strictly:\n1. Read the knowledge base.\n2. Read the schema-tool.\n3. Check the input prompt.\n4. Prepare the output.\n5. Validate the output.\n6. If any issue is found, send for recheck with output format.\n\nValidation: For each phrase, output exactly 3 keywords, no other content, just  list of three keywords per phrase as per the knowledge base and schema tool so there will be many three keywords as there are many phrases in the input.\n\nKnowledge Base:\n${bRollKeywordEngineContent}\n\nSchema Tool:\n${schemaToolContent}\n\n${languageSafetyContent}\n\n${subjectSelectionContent}\n\nInput:\n${inputText}`;

    // Prepare FormData
    const formData = new FormData();
    formData.append('model', model);
    formData.append('messages', prompt);
    formData.append('temperature', '0.7');
    formData.append('max_tokens', '4000');
    formData.append('knowledge_base', new Blob([bRollKeywordEngineContent], { type: 'text/plain' }), 'knowledge_base.txt');
    formData.append('schema_tool', new Blob([schemaToolContent], { type: 'text/plain' }), 'schema_tool.txt');

    // Make the API call with a 60-second timeout
    const response = await axios.post<KeywordExtractorResponse>(
      'https://dev.felidae.network/api/chatgpt/chat_completion',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' }, timeout: 60000 }
    );

    // Only lines with exactly 3 words
    const content = response.data.data.choices[0].message.content;
    const keywords = content
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.split(' ').length === 3);

    // Validation: number of output lines must match number of input lines
    const inputLines = inputText.split('\n').filter(line => line.trim().length > 0);
    if ((keywords.length < inputLines.length) && retryCount < 3) {
      return await extractKeywords(inputText, model, retryCount + 1);
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
  const [keywords, setKeywords] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const processText = async () => {
      if (!inputText) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const result = await extractKeywords(inputText, model);
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
