import React from "react";

export type IconName = 
  | "keyboard-arrow-down"
  | "keyboard-arrow-up"
  | "check"
  | "close"
  | "search";

interface InlineSvgIconProps {
  name: IconName;
  size?: number;
  color?: string;
  className?: string;
}

export const InlineSvgIcon: React.FC<InlineSvgIconProps> = ({ 
  name, 
  size = 24, 
  color = "currentColor",
  className = "" 
}) => {
  const getSvgPath = (iconName: IconName) => {
    switch (iconName) {
      case "keyboard-arrow-down":
        return (
          <path 
            d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" 
            fill={color} 
          />
        );
      case "keyboard-arrow-up":
        return (
          <path 
            d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6 1.41 1.41z" 
            fill={color} 
          />
        );
      case "check":
        return (
          <path 
            d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" 
            fill={color} 
          />
        );
      case "close":
        return (
          <path 
            d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" 
            fill={color} 
          />
        );
      case "search":
        return (
          <path 
            d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" 
            fill={color} 
          />
        );
      default:
        return (
          <path 
            d="M12 8v8m-4-4h8" 
            stroke={color} 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            fill="none"
          />
        );
    }
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="none"
    >
      {getSvgPath(name)}
    </svg>
  );
}; 