import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Palette,
  Monitor,
  Check,
  Server,
  Activity,
  Layers,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import WPStatusBar from '@/components/wp/WPStatusBar';
import WPNavBar from '@/components/wp/WPNavBar';
import {
  useWPTheme,
  WP_ACCENT_COLORS,
  WP_BACKGROUNDS,
} from '@/contexts/WPThemeContext';
import { toast } from 'sonner';

interface WPSettingsProps {
  isDark: boolean;
  toggleTheme: () => void;
}

const WPSettings: React.FC<WPSettingsProps> = ({ isDark, toggleTheme }) => {
  const navigate = useNavigate();
  const {
    accent,
    setAccent,
    background,
    setBackground,
    transparentTiles,
    setTransparentTiles,
    setForceView,
  } = useWPTheme();

  const [activePivot, setActivePivot] = useState<'theme' | 'system' | 'desktop'>('theme');
  const [visitorStats, setVisitorStats] = useState<{ total: number; today: number } | null>(null);

  useEffect(() => {
    fetch('/api/visitor-counter')
      .then((r) => r.json())
      .then((d) => setVisitorStats(d))
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-['Segoe_UI',sans-serif] flex flex-col select-none">
      <WPStatusBar />

      {/* Main Header & Pivot */}
      <div className="px-5 pt-4 pb-2">
        <h1 className="text-[44px] font-extralight tracking-tight text-white lowercase leading-none">
          settings
        </h1>

        <div className="flex items-center gap-6 mt-4 border-b border-white/10 pb-2 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setActivePivot('theme')}
            className={`text-[20px] font-light lowercase transition-colors whitespace-nowrap ${
              activePivot === 'theme'
                ? 'text-[hsl(var(--wp-accent))] font-medium'
                : 'text-white/40 hover:text-white/70'
            }`}
          >
            start+theme
          </button>
          <button
            onClick={() => setActivePivot('system')}
            className={`text-[20px] font-light lowercase transition-colors whitespace-nowrap ${
              activePivot === 'system'
                ? 'text-[hsl(var(--wp-accent))] font-medium'
                : 'text-white/40 hover:text-white/70'
            }`}
          >
            system info
          </button>
          <button
            onClick={() => setActivePivot('desktop')}
            className={`text-[20px] font-light lowercase transition-colors whitespace-nowrap ${
              activePivot === 'desktop'
                ? 'text-[hsl(var(--wp-accent))] font-medium'
                : 'text-white/40 hover:text-white/70'
            }`}
          >
            desktop mode
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 pt-4 pb-24 space-y-6">
        {activePivot === 'theme' ? (
          <div className="space-y-6 max-w-lg">
            {/* Background Theme: Dark / Light */}
            <div>
              <label className="text-[12px] uppercase tracking-wider text-white/60 block mb-2 font-semibold">
                Background Mode
              </label>
              <div className="flex gap-3">
                <button
                  onClick={() => !isDark && toggleTheme()}
                  className={`flex-1 py-3 px-4 rounded border text-center transition-all ${
                    isDark
                      ? 'bg-black border-[hsl(var(--wp-accent))] shadow'
                      : 'bg-white/5 border-white/20 text-white/60'
                  }`}
                >
                  <span className="text-[14px] font-semibold block">Dark</span>
                  <span className="text-[11px] text-white/50">Classic OLED Black</span>
                </button>
                <button
                  onClick={() => isDark && toggleTheme()}
                  className={`flex-1 py-3 px-4 rounded border text-center transition-all ${
                    !isDark
                      ? 'bg-white text-black border-[hsl(var(--wp-accent))] shadow'
                      : 'bg-white/5 border-white/20 text-white/60'
                  }`}
                >
                  <span className="text-[14px] font-semibold block">Light</span>
                  <span className="text-[11px] text-white/50">Clean High-Contrast</span>
                </button>
              </div>
            </div>

            {/* Accent Color 20 Swatch Grid */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[12px] uppercase tracking-wider text-white/60 font-semibold">
                  Accent Color
                </label>
                <span className="text-[13px] font-medium text-[hsl(var(--wp-accent))]">
                  {accent.name}
                </span>
              </div>
              <div className="grid grid-cols-5 gap-2.5">
                {WP_ACCENT_COLORS.map((col) => {
                  const isSelected = accent.id === col.id;
                  return (
                    <button
                      key={col.id}
                      onClick={() => {
                        setAccent(col);
                        toast.success(`Accent color changed to ${col.name}`);
                      }}
                      className="aspect-square rounded flex items-center justify-center relative active:scale-95 transition-transform shadow"
                      style={{ backgroundColor: col.hex }}
                      title={col.name}
                    >
                      {isSelected && (
                        <Check className="w-5 h-5 text-white drop-shadow stroke-[3]" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Transparent Live Tiles Toggle */}
            <div className="p-4 bg-white/5 border border-white/10 rounded space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-[15px] font-medium text-white">
                    Transparent Live Tiles
                  </h4>
                  <p className="text-[12px] text-white/60 font-light">
                    WP 8.1 parallax window effect over background
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={transparentTiles}
                  onChange={(e) => setTransparentTiles(e.target.checked)}
                  className="w-5 h-5 accent-[hsl(var(--wp-accent))] cursor-pointer"
                />
              </div>

              {/* Wallpaper Picker */}
              {transparentTiles && (
                <div className="pt-2 border-t border-white/10 space-y-2">
                  <label className="text-[12px] text-white/70 block uppercase font-medium">
                    Start Screen Wallpaper
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {WP_BACKGROUNDS.map((bg) => (
                      <button
                        key={bg.id}
                        onClick={() => setBackground(bg.url || 'none')}
                        className={`p-2 rounded text-left border text-[12px] transition-colors ${
                          background === (bg.url || 'none')
                            ? 'border-[hsl(var(--wp-accent))] bg-white/20'
                            : 'border-white/10 bg-white/5 text-white/70'
                        }`}
                      >
                        {bg.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : activePivot === 'system' ? (
          /* System Telemetry */
          <div className="space-y-4 max-w-lg">
            <div className="p-4 bg-white/5 border-l-4 border-[hsl(var(--wp-accent))] rounded-r space-y-2">
              <div className="flex items-center gap-2">
                <Server className="w-5 h-5 text-[hsl(var(--wp-accent))]" />
                <h3 className="text-[16px] font-semibold text-white">
                  Vercel Cloud Ecosystem
                </h3>
              </div>
              <p className="text-[13px] text-white/70 font-light leading-relaxed">
                100% dynamic cloud deployment leveraging Vercel Blob storage, Edge Config, and Serverless compute functions.
              </p>
              <div className="grid grid-cols-2 gap-2 pt-2 text-[12px]">
                <div className="p-2 bg-white/5 rounded">
                  <span className="text-white/40 block text-[10px]">ENVIRONMENT</span>
                  <span className="text-white font-mono font-semibold">Preview / Production</span>
                </div>
                <div className="p-2 bg-white/5 rounded">
                  <span className="text-white/40 block text-[10px]">VERCEL REGION</span>
                  <span className="text-white font-mono font-semibold">bom1 / iad1</span>
                </div>
                <div className="p-2 bg-white/5 rounded">
                  <span className="text-white/40 block text-[10px]">SERVERLESS API</span>
                  <span className="text-emerald-400 font-mono font-semibold">12 Functions (Active)</span>
                </div>
                <div className="p-2 bg-white/5 rounded">
                  <span className="text-white/40 block text-[10px]">STORAGE STATE</span>
                  <span className="text-cyan-400 font-mono font-semibold">Vercel Blob JSON</span>
                </div>
              </div>
            </div>

            {/* Visitor Counter */}
            <div className="p-4 bg-white/5 border-l-4 border-emerald-500 rounded-r space-y-2">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-400" />
                <h3 className="text-[16px] font-semibold text-white">
                  Visitor Counter Odometer
                </h3>
              </div>
              <div className="flex items-center justify-between pt-1">
                <div>
                  <span className="text-white/50 text-[11px] block">TOTAL VISITS</span>
                  <span className="text-[28px] font-mono font-bold text-emerald-400">
                    {visitorStats?.total ?? 0}
                  </span>
                </div>
                <div>
                  <span className="text-white/50 text-[11px] block">TODAY'S VISITS</span>
                  <span className="text-[28px] font-mono font-bold text-emerald-400">
                    {visitorStats?.today ?? 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Desktop Mode Switcher */
          <div className="space-y-4 max-w-lg">
            <div className="p-5 bg-white/5 border border-white/10 rounded space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-600 rounded flex items-center justify-center text-white">
                  <Monitor className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-[18px] font-semibold text-white">
                    Windows XP Professional
                  </h3>
                  <span className="text-[12px] text-white/60">
                    Service Pack 2 • Luna Blue Edition
                  </span>
                </div>
              </div>

              <p className="text-[14px] text-white/80 font-light leading-relaxed">
                Want to explore the authentic retro desktop experience? Switch to the full Windows XP interface with moveable windows, desktop icons, Start Menu, taskbar, and classic games.
              </p>

              <button
                onClick={() => {
                  setForceView('desktop');
                  window.location.href = '/?view=desktop';
                }}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-semibold text-[15px] rounded flex items-center justify-center gap-2 transition-transform shadow"
              >
                <span>Launch Windows XP Desktop</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      <WPNavBar />
    </div>
  );
};

export default WPSettings;
