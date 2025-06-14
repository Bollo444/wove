'use client';

import React, { useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import Button from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  footer?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  footer,
}) => {
  const { currentTheme, ageTier } = useTheme();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'max-w-md';
      case 'md':
        return 'max-w-lg';
      case 'lg':
        return 'max-w-2xl';
      case 'xl':
        return 'max-w-4xl';
      case 'full':
        return 'max-w-full mx-4';
      default:
        return 'max-w-lg';
    }
  };

  const getAgeThemeStyles = () => {
    switch (ageTier) {
      case 'kids':
        return 'rounded-3xl border-4 shadow-2xl';
      case 'teens_u16':
        return 'rounded-2xl border-2 shadow-xl';
      case 'teens_16_plus':
        return 'rounded-xl shadow-lg';
      case 'adults':
        return 'rounded-lg shadow-lg';
      default:
        return 'rounded-lg shadow-lg';
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && closeOnOverlayClick) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" data-oid="jg1.4j6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={handleOverlayClick}
        data-oid=":rb9a03"
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4" data-oid="j-1yg1p">
        <div
          className={`
            relative w-full ${getSizeStyles()} ${getAgeThemeStyles()}
            transform transition-all duration-300 scale-100 opacity-100
          `}
          style={{
            backgroundColor: currentTheme.colors.surface,
            borderColor: currentTheme.colors.border,
          }}
          data-oid="asyefan"
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div
              className="flex items-center justify-between p-6 border-b"
              style={{ borderColor: currentTheme.colors.border }}
              data-oid="b:u9dxf"
            >
              {title && (
                <h2
                  className={`text-xl font-semibold ${
                    ageTier === 'kids' ? 'text-2xl font-bold' : ''
                  }`}
                  style={{ color: currentTheme.colors.text.primary }}
                  data-oid="ykkw762"
                >
                  {title}
                </h2>
              )}

              {showCloseButton && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="ml-auto"
                  data-oid="ccejq37"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    data-oid="qdc9fw3"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                      data-oid="u_2_zmx"
                    />
                  </svg>
                </Button>
              )}
            </div>
          )}

          {/* Content */}
          <div className="p-6" data-oid="y1hdwqy">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div
              className="flex items-center justify-end gap-3 p-6 border-t"
              style={{ borderColor: currentTheme.colors.border }}
              data-oid=":9ou8e_"
            >
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
