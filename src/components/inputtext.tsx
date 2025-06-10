import React, { useState, useRef, useEffect } from 'react';
import { typography } from '@/app/styles/typography';
import Icon from './icon/Icon';

interface InputTextProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const InputText: React.FC<InputTextProps> = ({
  value,
  onChange,
  placeholder = 'Type something...',
  disabled = false,
  className = '',
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const divRef = useRef<HTMLDivElement>(null);

  // Only update the contentEditable div when value changes from outside
  useEffect(() => {
    if (divRef.current && divRef.current.textContent !== value) {
      divRef.current.textContent = value;
    }
  }, [value]);

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const content = e.currentTarget.textContent || '';
    onChange(content);
  };

  return (
    <div className={`relative ${className}`}>
      <div
        ref={divRef}
        className={`
          ${typography.BodyNormal}
          min-h-[100px]
          w-full
          px-4
          py-2
          rounded-md
          border
          border-[var(--color-border-black-20)]
          bg-[var(--color-white)]
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${isFocused ? 'border-[var(--color-brand-orange)] ring-2 ring-[var(--color-brand-orange)]' : ''}
          focus:outline-none
        `}
        contentEditable={!disabled}
        onInput={handleInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        suppressContentEditableWarning
        data-placeholder={placeholder}
        aria-disabled={disabled}
      />
      {disabled && (
        <div className="absolute inset-0 bg-[var(--color-white-10)] rounded-md" />
      )}
    </div>
  );
};

export default InputText;
