'use client';

import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  dot?: boolean;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  dot = false,
}) => {
  const { currentTheme, ageTier } = useTheme();

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'secondary':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'info':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-2 py-0.5 text-xs';
      case 'md':
        return 'px-2.5 py-1 text-sm';
      case 'lg':
        return 'px-3 py-1.5 text-base';
      default:
        return 'px-2.5 py-1 text-sm';
    }
  };

  const getAgeThemeStyles = () => {
    switch (ageTier) {
      case 'kids':
        return 'rounded-full font-bold border-2 shadow-sm';
      case 'teens_u16':
        return 'rounded-full font-semibold border';
      case 'teens_16_plus':
        return 'rounded-full font-medium border';
      case 'adults':
        return 'rounded-full font-medium';
      default:
        return 'rounded-full font-medium';
    }
  };

  if (dot) {
    return (
      <span className={`inline-flex items-center gap-1.5 ${className}`}>
        <span
          className={`w-2 h-2 rounded-full ${
            variant === 'primary'
              ? 'bg-purple-500'
              : variant === 'success'
                ? 'bg-green-500'
                : variant === 'warning'
                  ? 'bg-yellow-500'
                  : variant === 'error'
                    ? 'bg-red-500'
                    : variant === 'info'
                      ? 'bg-blue-500'
                      : 'bg-gray-500'
          }`}
        />

        <span style={{ color: currentTheme.colors.text.primary }}>{children}</span>
      </span>
    );
  }

  return (
    <span
      className={`
        inline-flex items-center justify-center
        ${getVariantStyles()}
        ${getSizeStyles()}
        ${getAgeThemeStyles()}
        ${className}
      `}
    >
      {children}
    </span>
  );
};

export default Badge;
