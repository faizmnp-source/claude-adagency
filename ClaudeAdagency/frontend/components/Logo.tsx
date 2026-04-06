/**
 * Logo.tsx — The Craft Studio brand mark + wordmark
 * Pages Router: import from '@/components/Logo' or '../components/Logo'
 *
 * Props:
 *   variant: 'icon' | 'horizontal' | 'vertical' | 'wordmark'
 *   size:    'small'(32) | 'medium'(48) | 'large'(64) | 'xl'(96)
 *   color:   'color' | 'black' | 'white' | 'red'
 *
 * Usage:
 *   <Logo />                                         → horizontal, medium, color
 *   <Logo variant="icon" size="xl" />                → big icon only
 *   <Logo variant="wordmark" color="white" />        → text only, white
 *   <Logo variant="vertical" size="large" />         → stacked lockup
 */

import React from 'react';

export type LogoVariant = 'icon' | 'horizontal' | 'vertical' | 'wordmark';
export type LogoSize    = 'small' | 'medium' | 'large' | 'xl';
export type LogoColor   = 'color' | 'black' | 'white' | 'red';

interface LogoProps {
  variant?: LogoVariant;
  size?:    LogoSize;
  color?:   LogoColor;
  className?: string;
  style?: React.CSSProperties;
}

/* ─── Size map (icon px height) ─────────────────────────────────────────── */
const SIZE_PX: Record<LogoSize, number> = {
  small:  32,
  medium: 48,
  large:  64,
  xl:     96,
};

/* ─── Color palette ──────────────────────────────────────────────────────── */
interface Palette {
  red:     string; // accent / C letter
  dark:    string; // hexagon stroke / S letter / wordmark text
  light:   string; // for inverted use
}

function getPalette(color: LogoColor): Palette {
  const RED   = '#E50914'; // Netflix red — matches site theme
  const DARK  = '#0A0A0A';
  const WHITE = '#FFFFFF';

  switch (color) {
    case 'black': return { red: DARK,  dark: DARK,  light: DARK  };
    case 'white': return { red: WHITE, dark: WHITE,  light: WHITE };
    case 'red':   return { red: RED,   dark: RED,    light: RED   };
    default:      return { red: RED,   dark: DARK,   light: WHITE }; // 'color'
  }
}

/* ─── Hexagon + CS mark (100×100 viewBox) ───────────────────────────────── */
/*
 * Hexagon: flat-top, outer radius 44, center (50,50)
 *   vertices: (94,50) (72,88) (28,88) (6,50) (28,12) (72,12)
 *
 * C letter (left half):
 *   Thick stroked arc, center (36,50) radius 12, opening on right ~100°
 *   Path: M 48 40 A 14 14 0 1 0 48 60
 *
 * S letter (right half):
 *   Cubic bezier — two opposing curves through (66,50)
 *   Path: M 72 38 C 55 38 55 49 64 50 C 74 51 73 62 56 62
 */

const MarkSVG: React.FC<{ p: Palette; iconPx: number }> = ({ p, iconPx }) => (
  <svg
    width={iconPx}
    height={iconPx}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    style={{ display: 'block', flexShrink: 0 }}
  >
    {/* ── Hexagon frame ── */}
    <polygon
      points="94,50 72,88 28,88 6,50 28,12 72,12"
      stroke={p.dark}
      strokeWidth="4"
      fill="none"
      strokeLinejoin="miter"
    />

    {/* ── C letter (left side, red, thick arc) ── */}
    {/* Arc from top-right of opening to bottom-right, going CCW (left side) */}
    <path
      d="M 48 38 A 14 14 0 1 0 48 62"
      stroke={p.red}
      strokeWidth="7.5"
      strokeLinecap="round"
      fill="none"
    />

    {/* ── S letter (right side, dark, bezier curves) ── */}
    <path
      d="M 71 37 C 54 37, 53 48, 63 50 C 74 52, 73 63, 55 63"
      stroke={p.dark}
      strokeWidth="5.5"
      strokeLinecap="round"
      fill="none"
    />
  </svg>
);

/* ─── Wordmark SVG (scalable via height) ────────────────────────────────── */
/*
 * "CRAFT STUDIO" in Bebas Neue, wide letter-spacing
 * Red accent underline (3px, 60% width, centered)
 */
const WordmarkSVG: React.FC<{ p: Palette; textHeight: number }> = ({ p, textHeight }) => {
  const fontSize    = textHeight;
  const letterSpacing = fontSize * 0.12;
  // Approximate width of "CRAFT STUDIO" at fontSize (Bebas Neue is ~0.6 wide)
  const approxWidth = fontSize * 7.2;
  const lineY       = fontSize + 6;
  const lineW       = approxWidth * 0.58;
  const lineX       = (approxWidth - lineW) / 2;

  return (
    <svg
      width={approxWidth}
      height={fontSize + 14}
      viewBox={`0 0 ${approxWidth} ${fontSize + 14}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ display: 'block', flexShrink: 0, overflow: 'visible' }}
    >
      {/* Wordmark text */}
      <text
        x="0"
        y={fontSize - 2}
        fontFamily="'Bebas Neue', 'Impact', sans-serif"
        fontSize={fontSize}
        letterSpacing={letterSpacing}
        fill={p.dark}
      >
        CRAFT STUDIO
      </text>
      {/* Red accent underline */}
      <rect
        x={lineX}
        y={lineY}
        width={lineW}
        height="3.5"
        fill={p.red}
        rx="1.5"
      />
    </svg>
  );
};

/* ─── Main Logo component ───────────────────────────────────────────────── */
export const Logo: React.FC<LogoProps> = ({
  variant = 'horizontal',
  size    = 'medium',
  color   = 'color',
  className,
  style,
}) => {
  const p       = getPalette(color);
  const iconPx  = SIZE_PX[size];
  const gap     = Math.round(iconPx * 0.33);  // spacing between mark and text

  // Text height relative to icon size
  const textH: Record<LogoSize, number> = {
    small:  14,
    medium: 20,
    large:  26,
    xl:     38,
  };
  const wH = textH[size];

  /* ── Aria label ── */
  const ariaLabel = 'The Craft Studio';

  /* ── Icon only ── */
  if (variant === 'icon') {
    return (
      <span
        role="img"
        aria-label={ariaLabel}
        className={className}
        style={{ display: 'inline-flex', alignItems: 'center', ...style }}
      >
        <MarkSVG p={p} iconPx={iconPx} />
      </span>
    );
  }

  /* ── Wordmark only ── */
  if (variant === 'wordmark') {
    return (
      <span
        role="img"
        aria-label={ariaLabel}
        className={className}
        style={{ display: 'inline-flex', alignItems: 'center', ...style }}
      >
        <WordmarkSVG p={p} textHeight={wH} />
      </span>
    );
  }

  /* ── Horizontal lockup: [icon] [text] ── */
  if (variant === 'horizontal') {
    return (
      <span
        role="img"
        aria-label={ariaLabel}
        className={className}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: `${gap}px`,
          ...style,
        }}
      >
        <MarkSVG p={p} iconPx={iconPx} />
        <WordmarkSVG p={p} textHeight={wH} />
      </span>
    );
  }

  /* ── Vertical lockup: [icon above] [text below] ── */
  if (variant === 'vertical') {
    return (
      <span
        role="img"
        aria-label={ariaLabel}
        className={className}
        style={{
          display: 'inline-flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: `${Math.round(gap * 0.7)}px`,
          ...style,
        }}
      >
        <MarkSVG p={p} iconPx={iconPx} />
        <WordmarkSVG p={p} textHeight={wH} />
      </span>
    );
  }

  return null;
};

export default Logo;
