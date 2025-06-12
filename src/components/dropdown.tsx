'use client';
import React, { useState, useRef, useEffect } from 'react';
import { typography } from '@/app/styles/typography';
import Icon, { iconPaths } from './icon/Icon';

interface DropdownOption {
  label: string;
  value: string;
  className?: string;
}

interface DropdownProps {
  options: DropdownOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  icon?: keyof typeof iconPaths;
  className?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  disabled = false,
  icon = 'arrow-drop-down',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOption = options.find(option => option.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        className={`
          ${typography.BodyNormal}
          w-full
          px-4
          py-2
          rounded-md
          border
          border-[var(--color-border-black-20)]
          bg-[var(--color-white)]
          flex
          items-center
          justify-between
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          hover:border-[var(--color-brand-orange)]
          focus:outline-none
          focus:ring-2
          focus:ring-[var(--color-brand-orange)]
        `}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        <span className={selectedOption ? 'text-black' : 'text-black opacity-50'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <Icon
          name={icon}
          size={24}
          className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-[var(--color-white)] rounded-md shadow-lg border border-[var(--color-border-black-20)]">
          <div className="p-2 border-b border-[var(--color-border-black-20)]">
            <div className="relative">
              <input
                type="text"
                className={`
                  ${typography.BodyNormal}
                  w-full
                  px-4
                  py-2
                  pr-8
                  rounded-md
                  border
                  border-[var(--color-border-black-20)]
                  focus:outline-none
                  focus:ring-2
                  focus:ring-[var(--color-brand-orange)]
                  text-black
                  placeholder:text-black
                `}
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Icon
                name="search"
                size={20}
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
              />
            </div>
          </div>
          <div className="max-h-60 overflow-auto">
            {filteredOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${option.value === value ? 'bg-gray-100' : ''} ${option.className || 'text-black'}`}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                  setSearchTerm('');
                }}
              >
                {option.label}
              </button>
            ))}
            {filteredOptions.length === 0 && (
              <div className={`${typography.BodyNormal} px-4 py-2 text-[var(--color-text-black-40)]`}>
                No options found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
