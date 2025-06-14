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

    // Sanitize process name for filename
    const sanitizedProcessName = processName.replace(/[^a-zA-Z0-9_]/g, '_');
    const processFileName = sanitizedProcessName; // Remove .tsx extension

    // Create process file
    const processFilePath = path.join(process.cwd(), 'src/processes', `${processFileName}.tsx`);
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

    // Update example page
    try {
      const examplePagePath = path.join(process.cwd(), 'src/app/example/page.tsx');
      let examplePageContent = fs.readFileSync(examplePagePath, 'utf8');

      // Generate function and alias names
      const functionName = `process${sanitizedProcessName}Data`;
      const aliasName = `process${sanitizedProcessName}Data`;

      // Add import statement at the top with other imports
      const importStatement = `import { processData as ${aliasName} } from '@/processes/${processFileName}';\n`;
      const importSection = examplePageContent.split('import React')[0];
      const restOfImports = examplePageContent.split('import React')[1];
      examplePageContent = importSection + importStatement + 'import React' + restOfImports;

      // Add process option to the array
      const processOption = `  { label: "${processName}", value: "${processId}", processId: "${processId}", processName: "${processName}" },\n`;
      const processOptionsStart = examplePageContent.indexOf('const processOptions = [');
      const processOptionsEnd = examplePageContent.indexOf('];', processOptionsStart);
      const beforeOptions = examplePageContent.slice(0, processOptionsEnd);
      const afterOptions = examplePageContent.slice(processOptionsEnd);
      examplePageContent = beforeOptions + processOption + afterOptions;

      // Add process handler to the handlers map
      const handlerEntry = `  "${processId}": ${aliasName},\n`;
      const handlersStart = examplePageContent.indexOf('const processHandlers = {');
      const handlersEnd = examplePageContent.indexOf('};', handlersStart);
      const beforeHandlers = examplePageContent.slice(0, handlersEnd);
      const afterHandlers = examplePageContent.slice(handlersEnd);
      examplePageContent = beforeHandlers + handlerEntry + afterHandlers;

      // Write the updated content back to the file
      fs.writeFileSync(examplePagePath, examplePageContent);
    } catch (error) {
      console.error('Error updating example page:', error);
      // Don't throw error here, as the process was created successfully
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Process created successfully',
      processName,
      processId,
      processFileName
    });
  } catch (error) {
    console.error('Error creating process:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create process' },
      { status: 500 }
    );
  }
} 