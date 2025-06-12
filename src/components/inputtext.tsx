import React from 'react';

export interface InputTextProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'number';
}

const InputText: React.FC<InputTextProps> = ({ value, onChange, placeholder, type = 'text' }) => {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="border rounded p-2 w-full text-black placeholder:text-black"
    />
  );
};

export default InputText;
