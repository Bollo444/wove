'use client';

import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'outlined' | 'glass';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
  clickable?: boolean;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'default',
  padding = 'md',
  hover = false,
  clickable = false,
  onClick,
}) => {
  const { currentTheme, ageTier } = useTheme();

  const getVariantStyles = () => {
    switch (variant) {
      case 'elevated':
        return 'bg-white shadow-lg border border-gray-100';
      case 'outlined':
        return 'bg-white border-2 border-gray-200';
      case 'glass':
        return 'bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg';
      default:
        return 'bg-white shadow-md border border-gray-100';
    }
  };

  const getPaddingStyles = () => {
    switch (padding) {
      case 'none':
        return '';
      case 'sm':
        return 'p-3';
      case 'md':
        return 'p-4';
      case 'lg':
        return 'p-6';
      case 'xl':
        return 'p-8';
      default:
        return 'p-4';
    }
  };

  const getAgeThemeStyles = () => {
    switch (ageTier) {
      case 'kids':
        return 'rounded-2xl border-2';
      case 'teens_u16':
        return 'rounded-xl';
      case 'teens_16_plus':
        return 'rounded-lg';
      case 'adults':
        return 'rounded-lg';
      default:
        return 'rounded-lg';
    }
  };

  const getHoverStyles = () => {
    if (!hover && !clickable) return '';

    const baseHover = 'transition-all duration-200';

    switch (ageTier) {
      case 'kids':
        return `${baseHover} hover:shadow-xl hover:-translate-y-1 hover:scale-105`;
      case 'teens_u16':
        return `${baseHover} hover:shadow-lg hover:-translate-y-0.5`;
      default:
        return `${baseHover} hover:shadow-lg`;
    }
  };

  const handleClick = () => {
    if (clickable && onClick) {
      onClick();
    }
  };

  return (
    <div
      className={`
        ${getVariantStyles()}
        ${getPaddingStyles()}
        ${getAgeThemeStyles()}
        ${getHoverStyles()}
        ${clickable ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={handleClick}
      style={{
        backgroundColor: currentTheme.colors.surface,
        borderColor: currentTheme.colors.border,
      }}
      data-oid="q0lf:js"
    >
      {children}
    </div>
  );
};

export default Card;
