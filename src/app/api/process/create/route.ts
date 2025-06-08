import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    console.log('Starting process creation...');
    const formData = await request.formData();
    const processName = formData.get('processName') as string;
    console.log('Process name:', processName);

    const processId = formData.get('processId') as string;
    const status = formData.get('status') === 'true';
    const instruction = formData.get('instruction') as string;
    const validation = formData.get('validation') as string;
    const gptValidation = formData.get('gptValidation') as string;
    const outputStyle = formData.get('outputStyle') as string;
    
    const knowledgeBaseFiles = formData.getAll('knowledgeBase') as File[];
    const schemaToolFiles = formData.getAll('schemaTool') as File[];

    console.log('Files received:', {
      knowledgeBase: knowledgeBaseFiles.map(f => f.name),
      schemaTool: schemaToolFiles.map(f => f.name)
    });

    // Create process file name
    const processFileName = processName
      .trim()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('')
      + '.tsx';

    console.log('Generated process file name:', processFileName);

    // Create directories
    const baseDir = process.cwd();
    console.log('Base directory:', baseDir);

    const knowledgeBasePath = path.join(baseDir, 'public', 'knowledgebase', processFileName.replace('.tsx', ''));
    const schemaToolPath = path.join(baseDir, 'public', 'instructions', processFileName.replace('.tsx', ''));
    const processFilePath = path.join(baseDir, 'src', 'processes', processFileName);

    console.log('Paths:', {
      knowledgeBasePath,
      schemaToolPath,
      processFilePath
    });

    // Create directories if they don't exist
    const dirs = [
      path.join(baseDir, 'public', 'knowledgebase'),
      path.join(baseDir, 'public', 'instructions'),
      knowledgeBasePath,
      schemaToolPath
    ];

    for (const dir of dirs) {
      if (!fs.existsSync(dir)) {
        console.log('Creating directory:', dir);
        fs.mkdirSync(dir, { recursive: true });
      }
    }

    // Save knowledge base files
    console.log('Saving knowledge base files...');
    for (const file of knowledgeBaseFiles) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const filePath = path.join(knowledgeBasePath, file.name);
      console.log('Saving knowledge base file to:', filePath);
      fs.writeFileSync(filePath, buffer);
    }

    // Save schema tool files
    console.log('Saving schema tool files...');
    for (const file of schemaToolFiles) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const filePath = path.join(schemaToolPath, file.name);
      console.log('Saving schema tool file to:', filePath);
      fs.writeFileSync(filePath, buffer);
    }

    // Generate process file content
    console.log('Generating process file content...');
    const processContent = `'use client';
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
  name: "${processName}",
  validation: ${JSON.stringify(validation)},
  gptValidation: ${JSON.stringify(gptValidation)}
};

export const processData = async (
  inputLines: string[],
  model: 'gpt-4.1' | 'gpt-4.1-nano' = 'gpt-4.1',
  retryCount = 0
): Promise<string[]> => {
  try {
    const inputText = inputLines.join('\\n');
    
    // Read required files
    const knowledgeBaseContent = await fetch(\`/knowledgebase/\${PROCESS_CONFIG.name}/\${PROCESS_CONFIG.name}KnowledgeBase.txt?t=\${Date.now()}\`).then(res => res.text());
    const schemaToolContent = await fetch(\`/instructions/\${PROCESS_CONFIG.name}/\${PROCESS_CONFIG.name}.txt?t=\${Date.now()}\`).then(res => res.text());

    // Prepare the prompt
    const prompt = \`\${PROCESS_CONFIG.gptValidation}\\n\\nFollow these instructions strictly:\\n1. Read the knowledge base.\\n2. Read the schema-tool.\\n3. Check the input prompt.\\n4. Prepare the output.\\n5. Validate the output.\\n6. If any issue is found, send for recheck with output format.\\n\\nValidation: \${PROCESS_CONFIG.validation}\\n\\nKnowledge Base:\\n\${knowledgeBaseContent}\\n\\nSchema Tool:\\n\${schemaToolContent}\\n\\nInput:\\n\${inputText}\`;

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
      .split('\\n')
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
        const result = await processData(inputText.split('\\n'), model);
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

export default Process;`;

    // Save process file
    console.log('Saving process file to:', processFilePath);
    fs.writeFileSync(processFilePath, processContent);
    console.log('Process file saved successfully');

    return NextResponse.json({ 
      success: true, 
      message: 'Process created successfully',
      processName: processFileName
    });
  } catch (error) {
    console.error('Error creating process:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 });
  }
} 