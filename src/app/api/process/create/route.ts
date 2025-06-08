import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const processName = formData.get('processName') as string;
    const processId = formData.get('processId') as string;
    const status = formData.get('status') as string;
    const instruction = formData.get('instruction') as string;
    const validation = formData.get('validation') as string;
    const gptValidation = formData.get('gptValidation') as string;
    const outputStyle = formData.get('outputStyle') as string;
    const processFileContent = formData.get('processFileContent') as string;
    const knowledgeBase = formData.getAll('knowledgeBase') as File[];
    const schemaTool = formData.getAll('schemaTool') as File[];

    // Create process file
    const processFilePath = path.join(process.cwd(), 'src/processes', `${processName}.tsx`);
    fs.writeFileSync(processFilePath, processFileContent);

    // Create directories if they don't exist
    const knowledgeBaseDir = path.join(process.cwd(), 'public/knowledgebase', processId);
    const schemaToolDir = path.join(process.cwd(), 'public/instructions', processId);
    fs.mkdirSync(knowledgeBaseDir, { recursive: true });
    fs.mkdirSync(schemaToolDir, { recursive: true });

    // Save knowledge base files
    for (const file of knowledgeBase) {
      const filePath = path.join(knowledgeBaseDir, `${processId}KnowledgeBase.txt`);
      const arrayBuffer = await file.arrayBuffer();
      fs.writeFileSync(filePath, Buffer.from(arrayBuffer));
    }

    // Save schema tool files
    for (const file of schemaTool) {
      const filePath = path.join(schemaToolDir, `${processId}.txt`);
      const arrayBuffer = await file.arrayBuffer();
      fs.writeFileSync(filePath, Buffer.from(arrayBuffer));
    }

    // Log the process creation details
    console.log('Process created:', {
      processName,
      processId,
      status,
      instruction,
      validation,
      gptValidation,
      outputStyle
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error creating process:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create process' },
      { status: 500 }
    );
  }
} 