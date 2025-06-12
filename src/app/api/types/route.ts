import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { typeConfigs } from '@/types/inputfields/typesanditsinputfields';

const TYPES_FILE_PATH = path.join(process.cwd(), 'src/types/inputfields/typesanditsinputfields.tsx');

export async function GET() {
  try {
    return NextResponse.json({ types: typeConfigs });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch types' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newType = await request.json();
    
    // Check if type already exists
    const existingType = typeConfigs.find(t => 
      t.id === newType.id || 
      t.value === newType.value || 
      t.label === newType.label
    );

    if (existingType) {
      return NextResponse.json({ 
        error: 'Type already exists with same ID, value, or label',
        existingType 
      }, { status: 400 });
    }

    // Read the current file content
    const fileContent = fs.readFileSync(TYPES_FILE_PATH, 'utf8');
    
    // Find the position to insert the new type (before the closing bracket)
    const insertPosition = fileContent.lastIndexOf('];');
    
    // Create the new type string with proper formatting
    const mainPayloadField = newType.api.mainPayloadField;
    const payloadFields = newType.api.payloadFields;
    const payloadAssignments = payloadFields
      .filter((field: any) => field.name !== mainPayloadField)
      .map((field: any) => {
        if (field.sourceType === 'input') {
          return `payload['${field.name}'] = formData['${field.source}'];`;
        } else {
          return `payload['${field.name}'] = '${field.source}';`;
        }
      })
      .join('\n        ');
    // Properly escape responseExample
    const responseExampleEscaped = (newType.api.responseExample || '').replace(/'/g, "\\'").replace(/\n/g, '\\n');
    // Ensure fields and payloadFields are valid JSON
    const fieldsString = JSON.stringify(newType.fields, null, 2);
    const payloadFieldsString = JSON.stringify(payloadFields, null, 2);
    // Ensure a comma before the new type if needed
    const fileContentTrimmed = fileContent.trim();
    const needsComma = fileContentTrimmed.endsWith('},') ? '' : ',';
    const newTypeString = `${needsComma}
  {
    id: '${newType.id}',
    label: '${newType.label}',
    value: '${newType.value}',
    fields: ${fieldsString},
    api: {
      endpoint: '${newType.api.endpoint}',
      payloadType: '${newType.api.payloadType}',
      responsePath: '${newType.api.responsePath}',
      responseExample: '${responseExampleEscaped}',
      mainPayloadField: '${mainPayloadField}',
      mainPayloadFieldType: '${newType.api.mainPayloadFieldType}',
      payloadFields: ${payloadFieldsString},
      payload: (formData: Record<string, any>) => {
        const payload: Record<string, any> = {};
        payload['${mainPayloadField}'] = '';
        ${payloadAssignments}
        return payload;
      }
    }
  }
`;
    // Insert the new type
    const newContent = fileContent.slice(0, insertPosition) + newTypeString + fileContent.slice(insertPosition);
    
    // Write back to file
    fs.writeFileSync(TYPES_FILE_PATH, newContent);
    
    // Add to typeConfigs array
    typeConfigs.push(newType);
    
    return NextResponse.json({ 
      success: true, 
      type: newType,
      message: 'Type added successfully'
    });
  } catch (error) {
    console.error('Error adding type:', error);
    return NextResponse.json({ 
      error: 'Failed to add type',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 