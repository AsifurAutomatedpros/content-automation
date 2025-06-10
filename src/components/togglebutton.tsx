import React from 'react';

interface ToggleButtonProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  className?: string;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({ checked, onChange, label, className = '' }) => {
  return (
    <label className={`flex items-center cursor-pointer gap-2 ${className}`}>
      <span className="text-black font-medium select-none">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        tabIndex={0}
        className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors duration-200 focus:outline-none ${checked ? 'bg-green-500' : 'bg-gray-300'}`}
        onClick={() => onChange(!checked)}
        onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onChange(!checked)}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-200 ${checked ? 'translate-x-6' : 'translate-x-1'}`}
        />
      </button>
      <span className={`text-sm ml-2 ${checked ? 'text-green-600' : 'text-gray-500'}`}>{checked ? 'Active' : 'Inactive'}</span>
    </label>
  );
};

export default ToggleButton; 