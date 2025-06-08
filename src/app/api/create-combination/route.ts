import { NextResponse } from 'next/server';
import { createCombinationPage } from '@/operations/createcombinationlogic';

export async function POST(request: Request) {
  try {
    const formData = await request.json();
    
    const result = await createCombinationPage(formData);
    
    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in create-combination API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 