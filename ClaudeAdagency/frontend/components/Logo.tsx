import React, { useState } from 'react';

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

const SIZE_MAP: Record<LogoSize, { width: number; height: number; paddingX: number; paddingY: number; radius: number }> = {
  small: { width: 162, height: 46, paddingX: 12, paddingY: 8, radius: 18 },
  medium: { width: 196, height: 56, paddingX: 14, paddingY: 10, radius: 20 },
  large: { width: 244, height: 70, paddingX: 18, paddingY: 12, radius: 24 },
  xl: { width: 300, height: 84, paddingX: 20, paddingY: 14, radius: 28 },
};

const LOGO_SRC = '/logo.png';

export const Logo: React.FC<LogoProps> = ({
  size = 'medium',
  className,
  style,
}) => {
  const dimension = SIZE_MAP[size];
  const [failed, setFailed] = useState(false);

  return (
    <span
      aria-label="Brand logo"
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: dimension.width,
        minWidth: dimension.width,
        height: dimension.height,
        flexShrink: 0,
        padding: `${dimension.paddingY}px ${dimension.paddingX}px`,
        borderRadius: dimension.radius,
        background: 'rgba(255,255,255,0.92)',
        border: '1px solid rgba(17,17,17,0.08)',
        boxShadow: '0 10px 26px rgba(35,25,17,0.10)',
        ...style,
      }}
    >
      {!failed ? (
        <img
          src={LOGO_SRC}
          alt="Brand logo"
          width={dimension.width - dimension.paddingX * 2}
          height={dimension.height - dimension.paddingY * 2}
          onError={() => setFailed(true)}
          style={{
            width: '100%',
            maxWidth: '100%',
            height: '100%',
            maxHeight: '100%',
            display: 'block',
            objectFit: 'contain',
          }}
          draggable={false}
        />
      ) : (
        <span
          style={{
            width: '100%',
            height: '100%',
            borderRadius: Math.max(12, Math.round(dimension.radius * 0.7)),
            border: '1px dashed rgba(17,17,17,0.16)',
            background: 'rgba(255,255,255,0.72)',
            color: 'rgba(17,17,17,0.52)',
            fontSize: Math.max(10, Math.round(dimension.height * 0.24)),
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          Logo
        </span>
      )}
    </span>
  );
};

export default Logo;
