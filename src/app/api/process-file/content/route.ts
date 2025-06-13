import { NextResponse } from 'next/server';
import { readFile, readdir } from 'fs/promises';
import { join } from 'path';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const processId = searchParams.get('processId');
  const label = searchParams.get('label');
  const filename = searchParams.get('filename');

  if (!processId || !label) {
    return NextResponse.json(
      { error: 'processId and label are required' },
      { status: 400 }
    );
  }

  const dirPath = join(process.cwd(), 'public', processId, label);

  try {
    if (filename) {
      // Serve specific file content
      const filePath = join(dirPath, filename);
      const content = await readFile(filePath, 'utf-8');
      return new NextResponse(content, { status: 200, headers: { 'Content-Type': 'text/plain' } });
    } else {
      // List files in the directory
      const files = await readdir(dirPath);
      return NextResponse.json(files, { status: 200 });
    }
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return NextResponse.json({ error: 'Directory or file not found' }, { status: 404 });
    } else {
      console.error('Error reading file or directory:', error);
      return NextResponse.json(
        { error: 'Failed to retrieve file content or list files' },
        { status: 500 }
      );
    }
  }
} 