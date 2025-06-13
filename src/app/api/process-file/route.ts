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

export async function POST(request: Request) {
  try {
    const { filename, content, processId, attachments } = await request.json();
    if (!filename || !content) {
      return NextResponse.json(
        { error: 'Filename and content are required' },
        { status: 400 }
      );
    }

    // Sanitize filename (no path traversal)
    const safeFilename = path.basename(filename).replace(/[^a-zA-Z0-9_-]/g, '') + '.tsx';
    const processesDir = path.join(process.cwd(), 'src', 'processes');
    const filePath = path.join(processesDir, safeFilename);

    // Ensure the processes directory exists
    if (!fs.existsSync(processesDir)) {
      fs.mkdirSync(processesDir, { recursive: true });
    }

    // Write the process file
    fs.writeFileSync(filePath, content, 'utf-8');

    // If attachments are provided, ensure they are saved in the public directory
    if (attachments && Array.isArray(attachments)) {
      for (const attachment of attachments) {
        if (attachment.path && attachment.content) {
          const attachmentPath = path.join(process.cwd(), attachment.path);
          const attachmentDir = path.dirname(attachmentPath);
          
          // Create directory if it doesn't exist
          if (!fs.existsSync(attachmentDir)) {
            fs.mkdirSync(attachmentDir, { recursive: true });
          }
          
          // Write the attachment file
          fs.writeFileSync(attachmentPath, attachment.content, 'utf-8');
        }
      }
    }

    return NextResponse.json({ success: true, path: filePath });
  } catch (error) {
    console.error('Error writing process file:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to write process file' },
      { status: 500 }
    );
  }
} 