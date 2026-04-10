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

const SIZE_MAP: Record<
  LogoSize,
  {
    iconWidth: number;
    iconHeight: number;
    iconRadius: number;
    iconFont: number;
    gap: number;
    wordmark: number;
    subline: number;
    tracking: string;
  }
> = {
  small: {
    iconWidth: 42,
    iconHeight: 76,
    iconRadius: 22,
    iconFont: 18,
    gap: 12,
    wordmark: 18,
    subline: 0,
    tracking: '0.16em',
  },
  medium: {
    iconWidth: 48,
    iconHeight: 86,
    iconRadius: 24,
    iconFont: 20,
    gap: 14,
    wordmark: 22,
    subline: 10,
    tracking: '0.18em',
  },
  large: {
    iconWidth: 58,
    iconHeight: 98,
    iconRadius: 28,
    iconFont: 24,
    gap: 16,
    wordmark: 30,
    subline: 12,
    tracking: '0.2em',
  },
  xl: {
    iconWidth: 66,
    iconHeight: 112,
    iconRadius: 32,
    iconFont: 28,
    gap: 18,
    wordmark: 36,
    subline: 13,
    tracking: '0.22em',
  },
};

const ACCENT = '#b8743c';
const TEXT = '#171717';
const MUTED = '#777777';

export const Logo: React.FC<LogoProps> = ({
  variant = 'horizontal',
  size = 'medium',
  className,
  style,
}) => {
  const config = SIZE_MAP[size];
  const showSubtitle = variant !== 'icon' && config.subline > 0;

  if (variant === 'icon') {
    return (
      <span
        aria-label="The Craft Studios"
        className={className}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: config.iconWidth,
          height: config.iconHeight,
          borderRadius: config.iconRadius,
          background: 'linear-gradient(180deg, #ffffff 0%, #fbfbfb 100%)',
          border: '1px solid rgba(23,23,23,0.08)',
          boxShadow: '0 4px 14px rgba(23,23,23,0.10), inset 0 -2px 0 rgba(23,23,23,0.04)',
          color: ACCENT,
          fontSize: config.iconFont,
          fontWeight: 700,
          lineHeight: 1,
          fontFamily: '"Space Grotesk", "Inter", sans-serif',
          flexShrink: 0,
          ...style,
        }}
      >
        T
      </span>
    );
  }

  return (
    <span
      aria-label="The Craft Studios"
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: config.gap,
        maxWidth: '100%',
        flexShrink: 1,
        ...style,
      }}
    >
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: config.iconWidth,
          height: config.iconHeight,
          borderRadius: config.iconRadius,
          background: 'linear-gradient(180deg, #ffffff 0%, #fbfbfb 100%)',
          border: '1px solid rgba(23,23,23,0.08)',
          boxShadow: '0 4px 14px rgba(23,23,23,0.10), inset 0 -2px 0 rgba(23,23,23,0.04)',
          color: ACCENT,
          fontSize: config.iconFont,
          fontWeight: 700,
          lineHeight: 1,
          fontFamily: '"Space Grotesk", "Inter", sans-serif',
          flexShrink: 0,
        }}
      >
        T
      </span>

      <span
        style={{
          display: 'inline-flex',
          flexDirection: 'column',
          justifyContent: 'center',
          minWidth: 0,
          gap: showSubtitle ? 8 : 0,
        }}
      >
        <span
          style={{
            display: 'block',
            whiteSpace: 'nowrap',
            color: TEXT,
            fontSize: config.wordmark,
            fontWeight: 700,
            lineHeight: 1,
            letterSpacing: '-0.04em',
            fontFamily: '"Space Grotesk", "Inter", sans-serif',
          }}
        >
          thecraftstudios<span style={{ color: ACCENT }}>.in</span>
        </span>

        {showSubtitle && (
          <span
            style={{
              display: 'block',
              whiteSpace: 'nowrap',
              color: MUTED,
              fontSize: config.subline,
              fontWeight: 600,
              lineHeight: 1.1,
              letterSpacing: config.tracking,
              textTransform: 'uppercase',
              fontFamily: '"Inter", sans-serif',
            }}
          >
            Innovation • Tech • Branding
          </span>
        )}
      </span>
    </span>
  );
};

export default Logo;
