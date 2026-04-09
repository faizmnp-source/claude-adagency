import React from 'react';

export type LogoVariant = 'icon' | 'horizontal' | 'vertical' | 'wordmark';
export type LogoSize = 'small' | 'medium' | 'large' | 'xl';
export type LogoColor = 'color' | 'black' | 'white' | 'red';

interface LogoProps {
  variant?: LogoVariant;
  size?: LogoSize;
  color?: LogoColor;
  className?: string;
  style?: React.CSSProperties;
}

const HEIGHT: Record<LogoSize, number> = {
  small: 68,
  medium: 82,
  large: 96,
  xl: 132,
};

export const Logo: React.FC<LogoProps> = ({
  size = 'medium',
  color, // kept for API compatibility
  className,
  style,
}) => {
  const height = HEIGHT[size];

  return (
    <span
      role="img"
      aria-label="The Craft Studios"
      className={className}
      style={{ display: 'inline-flex', alignItems: 'center', flexShrink: 0, ...style }}
    >
      <img
        src="/logofinal.png"
        alt="The Craft Studios"
        height={height}
        style={{
          height,
          width: 'auto',
          display: 'block',
          objectFit: 'contain',
          filter: color === 'white' ? 'brightness(0) invert(1)' : undefined,
        }}
        draggable={false}
      />
    </span>
  );
};

export default Logo;
