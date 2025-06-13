import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const processId = formData.get('processId') as string;
    const label = formData.get('label') as string;

    if (!file || !processId || !label) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create directory if it doesn't exist
    const dirPath = join(process.cwd(), 'public', processId, label);
    await mkdir(dirPath, { recursive: true });

    // Save file with original name
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = join(dirPath, file.name);
    await writeFile(filePath, buffer);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
} 