import React, { useMemo } from 'react';

interface WPLumiaPrismWallpaperProps {
  accentHex: string;
  className?: string;
}

function hexToRgb(hex: string) {
  const clean = hex.replace('#', '');
  const full = clean.length === 3 ? clean.split('').map(c => c + c).join('') : clean;
  const num = parseInt(full || '0050ef', 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

function adjustColor(hex: string, factor: number) {
  const { r, g, b } = hexToRgb(hex);
  const clamp = (val: number) => Math.min(255, Math.max(0, Math.round(val)));
  return `rgb(${clamp(r * factor)}, ${clamp(g * factor)}, ${clamp(b * factor)})`;
}

function rgbaColor(hex: string, alpha: number) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export const WPLumiaPrismWallpaper: React.FC<WPLumiaPrismWallpaperProps> = ({
  accentHex,
  className = '',
}) => {
  const colors = useMemo(() => {
    return {
      specular: adjustColor(accentHex, 1.45),
      highlight: adjustColor(accentHex, 1.2),
      midtone: accentHex,
      deep: adjustColor(accentHex, 0.7),
      shadow: adjustColor(accentHex, 0.45),
      abyss: adjustColor(accentHex, 0.22),
      glow: rgbaColor(accentHex, 0.35),
      glowSubtle: rgbaColor(accentHex, 0.15),
    };
  }, [accentHex]);

  return (
    <div className={`absolute inset-0 overflow-hidden bg-[#050608] pointer-events-none select-none ${className}`}>
      {/* 1. Ambient theme-accent atmospheric glow spheres */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full blur-[100px] -top-32 -right-24 opacity-60 transition-colors duration-500"
        style={{ background: colors.glow }}
      />
      <div
        className="absolute w-[450px] h-[450px] rounded-full blur-[120px] top-1/3 -left-32 opacity-45 transition-colors duration-500"
        style={{ background: colors.glowSubtle }}
      />
      <div
        className="absolute w-[380px] h-[380px] rounded-full blur-[90px] bottom-10 right-0 opacity-40 transition-colors duration-500"
        style={{ background: colors.glow }}
      />

      {/* 2. Crystalline Low-Poly Faceted Prism Mesh (Signature Windows Phone / Nokia Lumia 8.1 Geometry) */}
      <svg
        className="absolute inset-0 w-full h-full object-cover"
        viewBox="0 0 400 800"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="facet-specular" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors.specular} stopOpacity="0.85" />
            <stop offset="100%" stopColor={colors.highlight} stopOpacity="0.6" />
          </linearGradient>
          <linearGradient id="facet-bright" x1="10%" y1="0%" x2="90%" y2="100%">
            <stop offset="0%" stopColor={colors.highlight} stopOpacity="0.75" />
            <stop offset="100%" stopColor={colors.midtone} stopOpacity="0.55" />
          </linearGradient>
          <linearGradient id="facet-mid" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colors.midtone} stopOpacity="0.6" />
            <stop offset="100%" stopColor={colors.deep} stopOpacity="0.45" />
          </linearGradient>
          <linearGradient id="facet-shadow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={colors.deep} stopOpacity="0.5" />
            <stop offset="100%" stopColor={colors.shadow} stopOpacity="0.35" />
          </linearGradient>
          <linearGradient id="facet-abyss" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={colors.shadow} stopOpacity="0.4" />
            <stop offset="100%" stopColor={colors.abyss} stopOpacity="0.25" />
          </linearGradient>
        </defs>

        {/* Polygons with subtle edge highlights */}
        <g stroke="rgba(255, 255, 255, 0.09)" strokeWidth="0.6" strokeLinejoin="round">
          {/* Top row facets */}
          <polygon points="0,0 190,0 150,180" fill="url(#facet-shadow)" />
          <polygon points="190,0 400,0 320,150" fill="url(#facet-bright)" />
          <polygon points="190,0 320,150 150,180" fill="url(#facet-specular)" />
          <polygon points="0,0 150,180 0,230" fill="url(#facet-abyss)" />
          <polygon points="400,0 400,270 320,150" fill="url(#facet-mid)" />

          {/* Upper-mid facets */}
          <polygon points="0,230 150,180 130,390" fill="url(#facet-mid)" />
          <polygon points="150,180 320,150 270,360" fill="url(#facet-bright)" />
          <polygon points="150,180 270,360 130,390" fill="url(#facet-specular)" />
          <polygon points="320,150 400,270 270,360" fill="url(#facet-shadow)" />
          <polygon points="400,270 400,480 270,360" fill="url(#facet-abyss)" />

          {/* Center-mid facets */}
          <polygon points="0,230 130,390 0,460" fill="url(#facet-shadow)" />
          <polygon points="0,460 130,390 180,590" fill="url(#facet-mid)" />
          <polygon points="130,390 270,360 180,590" fill="url(#facet-bright)" />
          <polygon points="270,360 400,480 340,630" fill="url(#facet-mid)" />
          <polygon points="270,360 340,630 180,590" fill="url(#facet-shadow)" />

          {/* Lower facets */}
          <polygon points="0,460 180,590 0,660" fill="url(#facet-abyss)" />
          <polygon points="400,480 400,690 340,630" fill="url(#facet-abyss)" />
          <polygon points="0,660 180,590 190,800" fill="url(#facet-shadow)" />
          <polygon points="0,660 190,800 0,800" fill="url(#facet-abyss)" />
          <polygon points="180,590 340,630 190,800" fill="url(#facet-mid)" />
          <polygon points="340,630 400,690 400,800" fill="url(#facet-shadow)" />
          <polygon points="340,630 400,800 190,800" fill="url(#facet-bright)" />
        </g>
      </svg>

      {/* 3. Deep Metro vignette: Darkens top status bar & bottom lock screen text area for 100% crisp typography */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.1) 22%, rgba(0,0,0,0.2) 55%, rgba(0,0,0,0.92) 100%)',
        }}
      />
    </div>
  );
};