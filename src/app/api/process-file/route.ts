import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
  try {
    // Get the URL object from the request
    const url = new URL(request.url);
    const processPath = url.searchParams.get('path');

    if (!processPath) {
      return NextResponse.json(
        { error: 'Process path is required' },
        { status: 400 }
      );
    }

    // Decode the path and ensure it's safe
    const decodedPath = decodeURIComponent(processPath);
    const sanitizedPath = path.normalize(decodedPath).replace(/^(\.\.(\/|\\|$))+/, '');
    
    // Construct the full path to the process file
    const fullPath = path.join(process.cwd(), 'src', 'processes', sanitizedPath);

    // Verify the file exists and is within the processes directory
    if (!fs.existsSync(fullPath)) {
      return NextResponse.json(
        { error: `Process file not found: ${sanitizedPath}` },
        { status: 404 }
      );
    }

    // Verify the file is within the processes directory
    const processesDir = path.join(process.cwd(), 'src', 'processes');
    if (!fullPath.startsWith(processesDir)) {
      return NextResponse.json(
        { error: 'Invalid process path' },
        { status: 403 }
      );
    }

    // Read the file content
    const fileContent = fs.readFileSync(fullPath, 'utf-8');

    // Extract the export function name
    const exportMatch = fileContent.match(/export\s+const\s+(\w+)\s*=/);
    const exportName = exportMatch ? exportMatch[1] : null;

    if (!exportName) {
      return NextResponse.json(
        { error: 'No export function found in process file' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      content: fileContent,
      exportName,
      path: sanitizedPath
    });
  } catch (error) {
    console.error('Error reading process file:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to read process file' },
      { status: 500 }
    );
  }
} 