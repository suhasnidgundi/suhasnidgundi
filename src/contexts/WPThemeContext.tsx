import React, { createContext, useContext, useState, useEffect } from 'react';

export interface WPAccentColor {
  id: string;
  name: string;
  hex: string;
  hsl: string; // e.g. "207 90% 54%"
}

export const WP_ACCENT_COLORS: WPAccentColor[] = [
  { id: 'cobalt', name: 'Cobalt', hex: '#0050ef', hsl: '225 100% 47%' },
  { id: 'cyan', name: 'Cyan', hex: '#1ba1e2', hsl: '199 84% 50%' },
  { id: 'teal', name: 'Teal', hex: '#00aba9', hsl: '179 100% 33%' },
  { id: 'emerald', name: 'Emerald', hex: '#339933', hsl: '120 50% 40%' },
  { id: 'green', name: 'Green', hex: '#60a917', hsl: '90 76% 37%' },
  { id: 'lime', name: 'Lime', hex: '#a4c400', hsl: '70 100% 38%' },
  { id: 'amber', name: 'Amber', hex: '#f0a30a', hsl: '40 92% 49%' },
  { id: 'orange', name: 'Orange', hex: '#fa6800', hsl: '25 100% 49%' },
  { id: 'mango', name: 'Mango', hex: '#f09609', hsl: '37 93% 49%' },
  { id: 'red', name: 'Red', hex: '#e51400', hsl: '5 100% 45%' },
  { id: 'crimson', name: 'Crimson', hex: '#a20025', hsl: '346 100% 32%' },
  { id: 'magenta', name: 'Magenta', hex: '#d80073', hsl: '328 100% 42%' },
  { id: 'pink', name: 'Pink', hex: '#f472d0', hsl: '317 84% 70%' },
  { id: 'purple', name: 'Purple', hex: '#76608a', hsl: '272 18% 46%' },
  { id: 'violet', name: 'Violet', hex: '#6a00ff', hsl: '265 100% 50%' },
  { id: 'indigo', name: 'Indigo', hex: '#4b0082', hsl: '275 100% 25%' },
  { id: 'steel', name: 'Steel', hex: '#647687', hsl: '210 15% 46%' },
  { id: 'taupe', name: 'Taupe', hex: '#87794e', hsl: '45 27% 42%' },
  { id: 'brown', name: 'Brown', hex: '#825a2c', hsl: '32 50% 34%' },
  { id: 'darkslate', name: 'Dark Slate', hex: '#404040', hsl: '0 0% 25%' },
];

export const WP_BACKGROUNDS = [
  { id: 'none', name: 'Lumia Theme Prism (Adaptive)' },
  { id: 'poly', name: 'Lumia Polygon', url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1080&auto=format&fit=crop' },
  { id: 'nature', name: 'Bing Landscape', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1080&auto=format&fit=crop' },
  { id: 'dark-cyber', name: 'Cyber Mesh', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1080&auto=format&fit=crop' },
];

interface WPThemeContextType {
  accent: WPAccentColor;
  setAccent: (accent: WPAccentColor) => void;
  cycleNextAccent: () => void;
  background: string;
  setBackground: (url: string) => void;
  transparentTiles: boolean;
  setTransparentTiles: (val: boolean) => void;
  actionCenterOpen: boolean;
  setActionCenterOpen: (open: boolean) => void;
  toggleActionCenter: () => void;
  cortanaOpen: boolean;
  setCortanaOpen: (open: boolean) => void;
  forceView: 'auto' | 'mobile' | 'desktop';
  setForceView: (mode: 'auto' | 'mobile' | 'desktop') => void;
  isLocked: boolean;
  setIsLocked: (locked: boolean) => void;
  lockScreen: () => void;
  unlockScreen: () => void;
}

const WPThemeContext = createContext<WPThemeContextType | undefined>(undefined);

export const WPThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accent, setAccentState] = useState<WPAccentColor>(() => {
    const saved = localStorage.getItem('wp_accent_id');
    const found = WP_ACCENT_COLORS.find((c) => c.id === saved);
    return found || WP_ACCENT_COLORS[0]; // Cobalt default
  });

  const [background, setBackgroundState] = useState<string>(() => {
    return localStorage.getItem('wp_background') || 'none';
  });

  const [transparentTiles, setTransparentTilesState] = useState<boolean>(() => {
    return localStorage.getItem('wp_trans_tiles') === 'true';
  });

  const [actionCenterOpen, setActionCenterOpen] = useState(false);
  const [cortanaOpen, setCortanaOpen] = useState(false);
  const [isLocked, setIsLocked] = useState<boolean>(true);
  const [forceView, setForceViewState] = useState<'auto' | 'mobile' | 'desktop'>(() => {
    return (localStorage.getItem('wp_force_view') as any) || 'auto';
  });

  const lockScreen = () => {
    setIsLocked(true);
    setActionCenterOpen(false);
    setCortanaOpen(false);
  };

  const unlockScreen = () => {
    setIsLocked(false);
  };

  const setAccent = (newAccent: WPAccentColor) => {
    setAccentState(newAccent);
    localStorage.setItem('wp_accent_id', newAccent.id);
    document.documentElement.style.setProperty('--wp-accent', newAccent.hsl);
  };

  const cycleNextAccent = () => {
    const currentIndex = WP_ACCENT_COLORS.findIndex((c) => c.id === accent.id);
    const nextIndex = (currentIndex + 1) % WP_ACCENT_COLORS.length;
    setAccent(WP_ACCENT_COLORS[nextIndex]);
  };

  const setBackground = (bg: string) => {
    setBackgroundState(bg);
    localStorage.setItem('wp_background', bg);
  };

  const setTransparentTiles = (val: boolean) => {
    setTransparentTilesState(val);
    localStorage.setItem('wp_trans_tiles', String(val));
  };

  const toggleActionCenter = () => {
    setActionCenterOpen((prev) => !prev);
  };

  const setForceView = (mode: 'auto' | 'mobile' | 'desktop') => {
    setForceViewState(mode);
    localStorage.setItem('wp_force_view', mode);
  };

  useEffect(() => {
    document.documentElement.style.setProperty('--wp-accent', accent.hsl);
  }, [accent]);

  return (
    <WPThemeContext.Provider
      value={{
        accent,
        setAccent,
        cycleNextAccent,
        background,
        setBackground,
        transparentTiles,
        setTransparentTiles,
        actionCenterOpen,
        setActionCenterOpen,
        toggleActionCenter,
        cortanaOpen,
        setCortanaOpen,
        forceView,
        setForceView,
        isLocked,
        setIsLocked,
        lockScreen,
        unlockScreen,
      }}
    >
      {children}
    </WPThemeContext.Provider>
  );
};

export const useWPTheme = () => {
  const context = useContext(WPThemeContext);
  if (!context) {
    throw new Error('useWPTheme must be used within a WPThemeProvider');
  }
  return context;
};
