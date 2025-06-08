import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { processId, processName } = await request.json();

    if (!processId || !processName) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const examplePagePath = path.join(process.cwd(), 'src/app/example/page.tsx');
    let pageContent = fs.readFileSync(examplePagePath, 'utf8');

    // Add the import statement if it doesn't exist - using processName for the import path
    const importStatement = `import { processData as process${processId} } from "@/processes/${processName}";\n`;
    if (!pageContent.includes(importStatement.trim())) {
      // Find the last import statement
      const lastImportIndex = pageContent.lastIndexOf('import');
      const nextLineIndex = pageContent.indexOf('\n', lastImportIndex) + 1;
      pageContent = pageContent.slice(0, nextLineIndex) + importStatement + pageContent.slice(nextLineIndex);
    }

    // Update processOptions array
    const processOptionsRegex = /const processOptions = \[([\s\S]*?)\];/;
    const processOptionsMatch = pageContent.match(processOptionsRegex);
    
    if (processOptionsMatch) {
      const currentOptions = processOptionsMatch[1];
      const newOption = `  { label: "${processName}", value: "${processId}" },\n`;
      const updatedOptions = currentOptions + newOption;
      
      pageContent = pageContent.replace(
        processOptionsRegex,
        `const processOptions = [${updatedOptions}];`
      );
    }

    // Update handleProcess function
    const handleProcessRegex = /const handleProcess = async \(\) => {([\s\S]*?)};/;
    const handleProcessMatch = pageContent.match(handleProcessRegex);
    
    if (handleProcessMatch) {
      const currentHandleProcess = handleProcessMatch[1];
      const newProcessCase = `      } else if (process === "${processId}") {
        result = await process${processId}(input.split('\\n'), model);
        setOutput((result as string[]).join("\\n"));\n`;
      
      // Find the last else-if statement
      const lastElseIfIndex = currentHandleProcess.lastIndexOf('} else if');
      if (lastElseIfIndex === -1) {
        // If no else-if statements exist, add after the first if
        const firstIfIndex = currentHandleProcess.indexOf('if (process ===');
        const nextBraceIndex = currentHandleProcess.indexOf('{', firstIfIndex);
        const updatedHandleProcess = 
          currentHandleProcess.slice(0, nextBraceIndex) + 
          newProcessCase + 
          currentHandleProcess.slice(nextBraceIndex);
        
        pageContent = pageContent.replace(
          handleProcessRegex,
          `const handleProcess = async () => {${updatedHandleProcess}};`
        );
      } else {
        // Add after the last else-if
        const nextBraceIndex = currentHandleProcess.indexOf('{', lastElseIfIndex);
        const updatedHandleProcess = 
          currentHandleProcess.slice(0, nextBraceIndex) + 
          newProcessCase + 
          currentHandleProcess.slice(nextBraceIndex);
        
        pageContent = pageContent.replace(
          handleProcessRegex,
          `const handleProcess = async () => {${updatedHandleProcess}};`
        );
      }
    }

    // Clean up any duplicate or malformed code
    pageContent = pageContent
      // Remove any duplicate else-if statements
      .replace(/(} else if \(process === "[^"]+"\)\s*{\s*result = await process[^;]+;\s*setOutput\(\(result as string\[\]\)\.join\("\\n"\)\);\s*})+/g, '$1')
      // Fix any malformed braces
      .replace(/}\s*{/g, '}')
      // Ensure proper spacing
      .replace(/\n\s*\n\s*\n/g, '\n\n')
      // Fix any malformed else-if chains
      .replace(/}\s*else\s*if/g, '} else if')
      // Fix any duplicate process cases
      .replace(new RegExp(`} else if \\(process === "${processId}"\\)[^}]+}`, 'g'), '')
      // Fix any broken else-if chains
      .replace(/}\s*else\s*if\s*\([^)]+\)\s*}\s*else\s*if/g, '} else if')
      // Fix any missing braces
      .replace(/}\s*else\s*if\s*\([^)]+\)\s*{/g, '} else if (process === "${processId}") {')
      // Fix any broken try-catch blocks
      .replace(/}\s*catch/g, '      }\n    } catch')
      // Fix any template literal issues
      .replace(/\${processId}/g, processId)
      // Fix any incomplete else-if statements
      .replace(/} else if \(process === "[^"]+"\)\s*$/gm, '} else if (process === "${processId}") {')
      // Fix any missing closing braces
      .replace(/}\s*else\s*if\s*\([^)]+\)\s*{([^}]*)$/gm, '} else if (process === "${processId}") {$1}')
      // Fix any extra closing braces
      .replace(/}\s*}/g, '}')
      // Fix any broken else-if chains
      .replace(/}\s*else\s*if\s*\([^)]+\)\s*{([^}]*)}/g, '} else if (process === "${processId}") {$1}');

    // Write the updated content back to the file
    fs.writeFileSync(examplePagePath, pageContent, 'utf8');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating example page:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update example page' },
      { status: 500 }
    );
  }
} 