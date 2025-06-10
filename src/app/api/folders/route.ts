import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const appDir = path.join(process.cwd(), 'src/app');
    const folders = fs.readdirSync(appDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    return NextResponse.json(folders);
  } catch (error) {
    console.error('Error reading folders:', error);
    return NextResponse.json({ error: 'Failed to read folders' }, { status: 500 });
  }
} 