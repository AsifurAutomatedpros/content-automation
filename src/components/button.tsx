import React from 'react';
import { typography } from '@/app/styles/typography';
import Icon, { iconPaths } from './icon/Icon';


interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  state?: 'enabled' | 'disabled' | 'touched';
  icon?: keyof typeof iconPaths;
  fullWidth?: boolean;
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  state = 'enabled',
  icon,
  fullWidth = false,
  children,
  className = '',
  type = 'button',
  ...props
}) => {
  const baseStyles = `
    ${typography.CaptionNormal}
    rounded-md
    transition-all
    duration-200
    flex
    items-center
    justify-center
    gap-2
    p-2
    cursor-pointer
    text-black
    border
    border-[var(--color-border-black-20)]
    hover:bg-[var(--color-brand-orange-16)]
    min-w-[120px]
    ${fullWidth ? 'w-full' : 'w-auto'}
  `;

  const variantStyles = {
    primary: `
      bg-[var(--color-brand-orange)]
      text-[var(--color-white)]
      hover:bg-[var(--color-brand-orange-16)]
      active:bg-[var(--color-brand-orange-16)]
    `,
    secondary: `
      bg-[var(--color-white)]
      text-[var(--color-brand-orange)]
      border
      border-[var(--color-brand-orange)]
      hover:bg-[var(--color-brand-orange-16)]
      active:bg-[var(--color-brand-orange-16)]
    `,
  };

  const stateStyles = {
    enabled: '',
    disabled: 'opacity-50 cursor-not-allowed',
    touched: 'ring-2 ring-[var(--color-brand-orange)]',
  };

  return (
    <button
      type={type}
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${stateStyles[state]}
        ${className}
      `}
      disabled={state === 'disabled'}
      {...props}
    >
      {icon && <Icon name={icon} size={24} />}
      {children}
    </button>
  );
};

export default Button;
