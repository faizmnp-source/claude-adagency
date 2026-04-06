/**
 * Logo.tsx — The Craft Studio brand mark
 * Uses the official logo image: /download.png (transparent bg PNG)
 *
 * Props:
 *   variant: 'icon' | 'horizontal' | 'vertical' | 'wordmark'
 *   size:    'small'(36h) | 'medium'(48h) | 'large'(64h) | 'xl'(96h)
 *   color:   kept for API compat (PNG is always full-color)
 *
 * Usage:
 *   <Logo />                          → 48px height full logo
 *   <Logo size="small" />             → 36px height (nav use)
 *   <Logo variant="icon" size="xl" /> → large logo
 */

import React from 'react';

export type LogoVariant = 'icon' | 'horizontal' | 'vertical' | 'wordmark';
export type LogoSize    = 'small' | 'medium' | 'large' | 'xl';
export type LogoColor   = 'color' | 'black' | 'white' | 'red';

interface LogoProps {
  variant?:   LogoVariant;
  size?:      LogoSize;
  color?:     LogoColor;   // kept for API compat, PNG is full-color always
  className?: string;
  style?:     React.CSSProperties;
}

const HEIGHT: Record<LogoSize, number> = {
  small:  36,
  medium: 48,
  large:  64,
  xl:     96,
};

export const Logo: React.FC<LogoProps> = ({
  variant = 'horizontal',
  size    = 'medium',
  color,  // eslint-disable-line @typescript-eslint/no-unused-vars
  className,
  style,
}) => {
  const h = HEIGHT[size];

  return (
    <span
      role="img"
      aria-label="The Craft Studio"
      className={className}
      style={{ display: 'inline-flex', alignItems: 'center', flexShrink: 0, ...style }}
    >
      <img
        src="/download.png"
        alt="The Craft Studios"
        height={h}
        style={{ height: h, width: 'auto', display: 'block', objectFit: 'contain' }}
        draggable={false}
      />
    </span>
  );
};

export default Logo;
