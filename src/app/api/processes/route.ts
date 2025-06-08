import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// Function to format process name for display
const formatProcessName = (fileName: string): string => {
  // Remove .tsx extension
  const nameWithoutExt = fileName.replace('.tsx', '');
  // Split by capital letters and join with spaces
  return nameWithoutExt
    .split(/(?=[A-Z])/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export async function GET() {
  try {
    const processesDir = path.join(process.cwd(), 'src', 'processes');
    const files = await fs.readdir(processesDir);
    
    const processOptions = files
      .filter(file => file.endsWith('.tsx'))
      .map(file => ({
        label: formatProcessName(file),
        value: file.replace('.tsx', ''),
        path: `@/processes/${file.replace('.tsx', '')}`
      }));

    return NextResponse.json(processOptions);
  } catch (error) {
    console.error('Error reading processes directory:', error);
    return NextResponse.json({ error: 'Failed to read processes' }, { status: 500 });
  }
} 