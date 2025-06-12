export interface ProcessData {
  processName: string;
  processId: string;
  status: boolean;
  instruction: string;
  validation: string;
  gptValidation: string;
  outputStyle: string;
  type: string;
  knowledgeBase?: File[];
  schemaTool?: File[];
  [key: string]: any; // Allow dynamic fields
} 