'use client';

import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'spinner' | 'dots' | 'pulse' | 'bars';
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  variant = 'spinner',
  text,
  fullScreen = false,
  className = '',
}) => {
  const { currentTheme, ageTier } = useTheme();

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'w-4 h-4';
      case 'md':
        return 'w-6 h-6';
      case 'lg':
        return 'w-8 h-8';
      case 'xl':
        return 'w-12 h-12';
      default:
        return 'w-6 h-6';
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'sm':
        return 'text-sm';
      case 'md':
        return 'text-base';
      case 'lg':
        return 'text-lg';
      case 'xl':
        return 'text-xl';
      default:
        return 'text-base';
    }
  };

  const getAgeThemeAnimation = () => {
    switch (ageTier) {
      case 'kids':
        return 'animate-bounce';
      case 'teens_u16':
        return 'animate-pulse';
      default:
        return 'animate-spin';
    }
  };

  const renderSpinner = () => (
    <div
      className={`${getSizeStyles()} ${getAgeThemeAnimation()} border-2 border-gray-300 border-t-purple-600 rounded-full`}
      style={{ borderTopColor: currentTheme.colors.primary }}
      data-oid="68eb.1g"
    />
  );

  const renderDots = () => (
    <div className="flex space-x-1" data-oid="p7ftomr">
      {[0, 1, 2].map(i => (
        <div
          key={i}
          className={`w-2 h-2 rounded-full animate-pulse`}
          style={{
            backgroundColor: currentTheme.colors.primary,
            animationDelay: `${i * 0.2}s`,
            animationDuration: '1s',
          }}
          data-oid="_1_biqv"
        />
      ))}
    </div>
  );

  const renderPulse = () => (
    <div
      className={`${getSizeStyles()} animate-pulse rounded-full`}
      style={{ backgroundColor: currentTheme.colors.primary }}
      data-oid="vsedglq"
    />
  );

  const renderBars = () => (
    <div className="flex space-x-1 items-end" data-oid="31frt:q">
      {[0, 1, 2, 3].map(i => (
        <div
          key={i}
          className="w-1 bg-purple-600 animate-pulse"
          style={{
            height: `${12 + (i % 2) * 8}px`,
            backgroundColor: currentTheme.colors.primary,
            animationDelay: `${i * 0.15}s`,
            animationDuration: '1.2s',
          }}
          data-oid="1jpjg9d"
        />
      ))}
    </div>
  );

  const renderLoader = () => {
    switch (variant) {
      case 'dots':
        return renderDots();
      case 'pulse':
        return renderPulse();
      case 'bars':
        return renderBars();
      default:
        return renderSpinner();
    }
  };

  const content = (
    <div
      className={`flex flex-col items-center justify-center gap-3 ${className}`}
      data-oid="qetmekk"
    >
      {renderLoader()}
      {text && (
        <p
          className={`${getTextSize()} font-medium ${ageTier === 'kids' ? 'font-bold' : ''}`}
          style={{ color: currentTheme.colors.text.secondary }}
          data-oid="7q-28s2"
        >
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
        style={{ backgroundColor: `${currentTheme.colors.background}CC` }}
        data-oid="c8svgov"
      >
        {content}
      </div>
    );
  }

  return content;
};

export default Loading;
