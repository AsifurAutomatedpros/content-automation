import { ProcessData } from '@/types/process';
import { typeConfigs } from '@/types/inputfields/typesanditsinputfields';

export const createProcess = async (processData: ProcessData): Promise<void> => {
  const selectedType = typeConfigs.find(t => t.value === processData.type);
  if (!selectedType) {
    throw new Error('Invalid process type');
  }

  const { endpoint, payload } = selectedType.api;
  const formattedPayload = payload(processData);

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formattedPayload),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const result = await response.json();
    console.log('Process created successfully:', result);
  } catch (error) {
    console.error('Error creating process:', error);
    throw error;
  }
}; 