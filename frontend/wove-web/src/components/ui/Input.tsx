'use client';

import React, { forwardRef } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'default' | 'filled' | 'outlined';
  inputSize?: 'sm' | 'md' | 'lg';
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      variant = 'default',
      inputSize = 'md',
      className = '',
      ...props
    },
    ref,
  ) => {
    const { currentTheme, ageTier } = useTheme();

    const getVariantStyles = () => {
      const baseStyles = 'w-full transition-all duration-200 focus:outline-none';

      switch (variant) {
        case 'filled':
          return `${baseStyles} bg-gray-100 border-0 focus:bg-white focus:ring-2 focus:ring-purple-500`;
        case 'outlined':
          return `${baseStyles} bg-transparent border-2 border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20`;
        default:
          return `${baseStyles} bg-white border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20`;
      }
    };

    const getSizeStyles = () => {
      switch (inputSize) {
        case 'sm':
          return 'px-3 py-2 text-sm';
        case 'md':
          return 'px-4 py-3 text-base';
        case 'lg':
          return 'px-5 py-4 text-lg';
        default:
          return 'px-4 py-3 text-base';
      }
    };

    const getAgeThemeStyles = () => {
      switch (ageTier) {
        case 'kids':
          return 'rounded-xl font-medium text-lg';
        case 'teens_u16':
          return 'rounded-lg font-medium';
        case 'teens_16_plus':
          return 'rounded-lg';
        case 'adults':
          return 'rounded-md';
        default:
          return 'rounded-md';
      }
    };

    const inputId = props.id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="w-full" data-oid="d::n5w8">
        {label && (
          <label
            htmlFor={inputId}
            className={`block text-sm font-medium mb-2 ${
              ageTier === 'kids' ? 'text-lg font-semibold' : ''
            }`}
            style={{ color: currentTheme.colors.text.primary }}
            data-oid="xnvpui9"
          >
            {label}
          </label>
        )}

        <div className="relative" data-oid="76dyv32">
          {leftIcon && (
            <div
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              data-oid="_fsfojy"
            >
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            className={`
            ${getVariantStyles()}
            ${getSizeStyles()}
            ${getAgeThemeStyles()}
            ${leftIcon ? 'pl-10' : ''}
            ${rightIcon ? 'pr-10' : ''}
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
            ${className}
          `}
            style={{
              backgroundColor: variant === 'filled' ? currentTheme.colors.surface : 'white',
              borderColor: error ? '#ef4444' : currentTheme.colors.border,
              color: currentTheme.colors.text.primary,
            }}
            {...props}
            data-oid="2opl--z"
          />

          {rightIcon && (
            <div
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              data-oid="xlyvn:0"
            >
              {rightIcon}
            </div>
          )}
        </div>

        {error && (
          <p
            className={`mt-1 text-sm text-red-600 ${ageTier === 'kids' ? 'font-medium' : ''}`}
            data-oid="akjwr2:"
          >
            {error}
          </p>
        )}

        {helperText && !error && (
          <p
            className={`mt-1 text-sm text-gray-500 ${ageTier === 'kids' ? 'font-medium' : ''}`}
            data-oid="68hhlgp"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';

export default Input;
