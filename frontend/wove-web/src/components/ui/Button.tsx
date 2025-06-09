'use client';

import React from 'react';
// Removed: import { useTheme } from '../../contexts/ThemeContext';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  children,
  className = '',
  disabled,
  // Removed ageTier from destructuring as useTheme is removed
  ...props
}) => {
  // Removed: const { currentTheme, ageTier } = useTheme();

  const getVariantStyles = () => {
    const baseStyles =
      'font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800';

    switch (variant) {
      case 'primary':
        return `${baseStyles} bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 focus:ring-purple-500 dark:from-purple-500 dark:to-blue-500 dark:hover:from-purple-600 dark:hover:to-blue-600 dark:focus:ring-purple-400 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5`;
      case 'secondary':
        return `${baseStyles} bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600 dark:focus:ring-gray-400`;
      case 'outline':
        return `${baseStyles} border-2 border-purple-600 text-purple-600 hover:bg-purple-50 focus:ring-purple-500 dark:border-purple-400 dark:text-purple-400 dark:hover:bg-purple-900 dark:focus:ring-purple-300`;
      case 'ghost':
        return `${baseStyles} text-gray-600 hover:bg-gray-100 focus:ring-gray-500 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-400`;
      case 'danger':
        return `${baseStyles} bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-400`;
      default:
        return baseStyles;
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-sm rounded-md';
      case 'md':
        return 'px-4 py-2 text-base rounded-lg';
      case 'lg':
        return 'px-6 py-3 text-lg rounded-lg';
      case 'xl':
        return 'px-8 py-4 text-xl rounded-xl';
      default:
        return 'px-4 py-2 text-base rounded-lg';
    }
  };

  // Removed getAgeThemeStyles function as ageTier is no longer available
  // and its styling logic might conflict or be redundant with Tailwind's responsive/variant system.
  // If age-specific styling is still required, it should be re-implemented using a different approach,
  // possibly by passing ageTier as a prop or using a separate context if necessary.

  const isDisabled = disabled || isLoading;

  return (
    <button
      className={`
        ${getVariantStyles()}
        ${getSizeStyles()}
        ${fullWidth ? 'w-full' : ''}
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
        flex items-center justify-center gap-2
      `}
      disabled={isDisabled}
      {...props}
      data-oid="7i8958n"
    >
      {isLoading ? (
        <>
          <div
            className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"
            data-oid="9k:wpk."
          ></div>
          Loading...
        </>
      ) : (
        <>
          {leftIcon && (
            <span className="flex-shrink-0" data-oid="30bgx8g">
              {leftIcon}
            </span>
          )}
          <span data-oid="d5z-ckl">{children}</span>
          {rightIcon && (
            <span className="flex-shrink-0" data-oid="qn7-b6p">
              {rightIcon}
            </span>
          )}
        </>
      )}
    </button>
  );
};

export default Button;
