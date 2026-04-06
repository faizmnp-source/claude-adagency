import React from 'react';

interface CSLogoProps {
  size?: number;
  showText?: boolean;
}

// Circuit-board CS> logo matching the brand image
export const CSLogo = ({ size = 44, showText = false }: CSLogoProps) => (
  <div className="flex items-center gap-3">
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="blueGrad" x1="0" y1="0" x2="60" y2="60" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#5B8DEF" />
          <stop offset="60%" stopColor="#4A6CF7" />
          <stop offset="100%" stopColor="#7B5EA7" />
        </linearGradient>
        <linearGradient id="goldGrad" x1="0" y1="0" x2="60" y2="60" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
        <linearGradient id="sGrad" x1="0" y1="0" x2="60" y2="60" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#5B8DEF" />
          <stop offset="50%" stopColor="#7B5EA7" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="goldGlow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* C letter — circuit style */}
      <g filter="url(#glow)">
        {/* C arc as thick stroked path */}
        <path d="M28 10 C14 10 6 18 6 30 C6 42 14 50 28 50" stroke="url(#blueGrad)" strokeWidth="4.5" fill="none" strokeLinecap="round"/>
        {/* Circuit nodes on C */}
        <circle cx="28" cy="10" r="2.5" fill="#5B8DEF"/>
        <circle cx="15" cy="14" r="2" fill="#4A6CF7"/>
        <circle cx="8" cy="22" r="2" fill="#4A6CF7"/>
        <circle cx="6" cy="30" r="2.5" fill="#5B8DEF"/>
        <circle cx="8" cy="38" r="2" fill="#4A6CF7"/>
        <circle cx="15" cy="46" r="2" fill="#5B8DEF"/>
        <circle cx="28" cy="50" r="2.5" fill="#5B8DEF"/>
      </g>

      {/* S letter — circuit style with gradient */}
      <g filter="url(#glow)">
        {/* Top arc of S */}
        <path d="M38 14 C48 14 52 18 52 24 C52 30 44 30 38 30 C32 30 28 34 28 38 C28 44 32 46 42 46" stroke="url(#sGrad)" strokeWidth="4" fill="none" strokeLinecap="round"/>
        {/* Circuit nodes on S */}
        <circle cx="38" cy="14" r="2" fill="#5B8DEF"/>
        <circle cx="48" cy="16" r="2" fill="#7B5EA7"/>
        <circle cx="52" cy="24" r="2" fill="#7B5EA7"/>
        <circle cx="44" cy="30" r="2" fill="#8B6EC7"/>
        <circle cx="38" cy="30" r="2" fill="#9B7FD7"/>
        <circle cx="32" cy="34" r="2" fill="#C8913F"/>
        <circle cx="28" cy="38" r="2" fill="#E59830"/>
        <circle cx="30" cy="44" r="2" fill="#F59E0B"/>
        <circle cx="42" cy="46" r="2.5" fill="#F59E0B"/>
        {/* Small connector lines */}
        <line x1="28" y1="38" x2="28" y2="42" stroke="#E59830" strokeWidth="1.5" opacity="0.6"/>
        <line x1="38" y1="14" x2="36" y2="14" stroke="#5B8DEF" strokeWidth="1.5" opacity="0.6"/>
      </g>

      {/* > play arrow — gold */}
      <g filter="url(#goldGlow)">
        <polygon points="53,22 61,30 53,38" fill="url(#goldGrad)"/>
        <circle cx="53" cy="22" r="1.5" fill="#FCD34D"/>
        <circle cx="53" cy="38" r="1.5" fill="#F59E0B"/>
      </g>
    </svg>

    {showText && (
      <div>
        <span className="font-bold text-lg text-white">thecraft</span>
        <span className="font-bold text-lg" style={{ color: '#F59E0B' }}>studios</span>
        <span className="font-bold text-lg text-white">.in</span>
      </div>
    )}
  </div>
);

export default CSLogo;
