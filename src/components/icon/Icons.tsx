import React from "react";

type SvgProps = React.SVGProps<SVGSVGElement> & {
  size?: number;
  name: string;
  color?: string;
};

// Simple fallback SVG renderer when actual SVGs can't be loaded
const FallbackIcon: React.FC<SvgProps> = ({ 
  name,
  size = 24,
  color = "currentColor",
  ...props
}) => {
  return (
    <svg
      width={size}
      height={size}
      fill="none"
      viewBox="0 0 24 24" 
      stroke={color}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect width="24" height="24" fill="none" stroke="none" />
      <path
        d="M12 8v8m-4-4h8"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

// CheckIcon component based on the check.svg asset
const CheckIcon: React.FC<Omit<SvgProps, 'name'> & { className?: string }> = ({ 
  size = 24,
  color = "currentColor",
  className,
  ...props
}) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none"
      className={className}
      {...props}
    >
      <path 
        d="M9.54998 18L3.84998 12.3L5.27498 10.875L9.54998 15.15L18.725 5.97498L20.15 7.39998L9.54998 18Z" 
        fill={color} 
      />
    </svg>
  );
};

export { FallbackIcon, CheckIcon };
