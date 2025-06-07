'use client';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

interface MetaTagSearchResponse {
  message: string;
  data: {
    choices: Array<{
      message: {
        content: string;
      };
    }>;
  };
}

interface MetaTagSearchProps {
  inputLines: string[]; // Each line is a 4-word input phrase
  model?: 'gpt-4.1' | 'gpt-4.1-nano';
}

export const metaTagSearch = async (
  inputLines: string[],
  model: 'gpt-4.1' | 'gpt-4.1-nano' = 'gpt-4.1',
  retryCount = 0
): Promise<string> => {
  try {
    // Read the instruction file as text from public
    const instructionContent = await fetch('/instructions/Metatagsearch.txt').then(res => res.text());

    // Prepare the prompt for messages (plain text only)
    const prompt = `***IMPORTANT: For each input line, you MUST output the result strictly in the following format, and nothing else. Do not add or remove any sections. Do not perform keyword extraction.***\n\nFORMAT:\n\n🎬 Line:\n"Exact script line here."\n\n💡 Keywords:\n3-Keyword: ["...", "...", "..."]  \n4-Keyword: ["...", "...", "...", "..."]  \nMeta Tags: ["...", "..."]  \nTitle Tags: ["..."] or []\n\n📌 B-roll: Show / Suppress / Replace with Title\n\n🧠 Reason:\nShort, precise explanation based on emotional tone, visual clarity, speaker delivery, or story moment.\n\n🚫 Flags Triggered (if any):\n- useless_visual\n- speaker_focus\n- literal_demo\n- sensitive\n- precaution_required\n- title_overlay\n\n🎨 Creative Exception:\n(Optional) If an AI-generated, stylized, or animated visual would elevate the emotional clarity or storytelling, describe it briefly.\n\n🎯 Override Strength: [low / medium / high]\n\nINSTRUCTION:\n${instructionContent}\n\nINPUT LINES:\n${inputLines.map(line => `"${line}"`).join('\n')}`;

    // Prepare FormData
    const formData = new FormData();
    formData.append('model', model);
    formData.append('messages', prompt);
    formData.append('temperature', '0.7');
    formData.append('max_tokens', '4000');
    formData.append('schema_tool', new Blob([instructionContent], { type: 'text/plain' }), 'schema_tool.txt');

    // Make the API call with a 60-second timeout
    const response = await axios.post<MetaTagSearchResponse>(
      'https://dev.felidae.network/api/chatgpt/chat_completion',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' }, timeout: 60000 }
    );

    // Extract the content
    const content = response.data.data.choices[0].message.content;

    // Validation: check if all input lines are present in the output
    const valid = inputLines.every(line => content.includes(line));
    if (!valid && retryCount < 3) {
      return await metaTagSearch(inputLines, model, retryCount + 1);
    }

    return content;
  } catch (error) {
    console.error('Error in meta tag search:', error);
    throw error;
  }
};

export const MetaTagSearch: React.FC<MetaTagSearchProps> = ({ inputLines, model = 'gpt-4.1' }) => {
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const process = async () => {
      if (!inputLines.length) return;
      setLoading(true);
      setError(null);
      try {
        const result = await metaTagSearch(inputLines, model);
        setOutput(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    process();
  }, [inputLines, model]);

  if (loading) return <div>Processing...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!output) return null;

  return (
    <div>
      <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{output}</pre>
    </div>
  );
};

export default MetaTagSearch;
