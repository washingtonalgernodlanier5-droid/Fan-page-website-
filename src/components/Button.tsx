/**
 * Button Component
 * 
 * Built using TDD - implementation matches the test requirements
 */

import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  disabled = false,
  className = '',
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`bg-blue px-4 py-2 rounded font-semibold ${className}`.trim()}
    >
      {children}
    </button>
  );
};
