interface ProcessField {
  id: number;
  path: string;
  name: string;
}

interface FormData {
  combinationName: string;
  combinationId: string;
  isActive: boolean;
  processes: ProcessField[];
  outputType: string;
}

export async function createCombinationPage(formData: FormData) {
  try {
    const response = await fetch('/api/combinations/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to create combination');
    }

    return result;
  } catch (error) {
    console.error('Error creating combination page:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}
