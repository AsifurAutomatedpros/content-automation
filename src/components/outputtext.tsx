import React from 'react';
import { typography } from '@/app/styles/typography';

interface OutputTextProps {
  content: string;
  className?: string;
}

const OutputText: React.FC<OutputTextProps> = ({
  content,
  className = '',
}) => {
  return (
    <div
      className={`
        ${typography.BodyNormal}
        w-full
        p-4
        rounded-md
        bg-[var(--color-white)]
        border
        border-[var(--color-border-black-20)]
        ${className}
      `}
    >
      {content}
    </div>
  );
};

export default OutputText;
