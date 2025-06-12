export interface InputField {
  id: string;
  label: string;
  type: 'text' | 'file' | 'number';
  required: boolean;
  placeholder?: string;
  accept?: string;
  multiple?: boolean;
} 