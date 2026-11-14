import { useEffect, useState } from 'react';
import { Wifi, Palette, Moon, Sun, Monitor, Bell, X, ExternalLink } from 'lucide-react';
import { useWPTheme, WP_ACCENT_COLORS } from '@/contexts/WPThemeContext';
import { useEdgeConfig } from '@/hooks/useEdgeConfig';

interface WPActionCenterProps {
  isDark: boolean;
  toggleTheme: () => void;
}

const WPActionCenter = ({ isDark, toggleTheme }: WPActionCenterProps) => {
  const { actionCenterOpen, setActionCenterOpen, accent, cycleNextAccent, setForceView } = useWPTheme();
  const { data: edgeConfig } = useEdgeConfig();
  const [visitorStats, setVisitorStats] = useState<{ total: number; today: number } | null>(null);

  useEffect(() => {
    if (actionCenterOpen) {
      fetch('/api/visitor-counter')
        .then((r) => r.json())
        .then((d) => setVisitorStats(d))
        .catch(() => {});
    }
  }, [actionCenterOpen]);

  if (!actionCenterOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/80 backdrop-blur-xl animate-in slide-in-from-top-6 duration-200 select-none font-['Segoe_UI',sans-serif]">
      {/* Top Drag / Dismiss Area */}
      <div className="p-4 pb-2 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <span className="text-white text-[13px] tracking-widest uppercase font-semibold text-white/70">
            Action Center
          </span>
          <button
            onClick={() => setActionCenterOpen(false)}
            className="p-1 rounded-full text-white/70 hover:text-white active:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Quick Settings Tiles */}
        <div className="grid grid-cols-4 gap-2 mb-3">
          {/* Quick Toggle 1: Wi-Fi */}
          <div className="flex flex-col items-center justify-center p-2.5 bg-white/10 rounded active:scale-95 transition-transform text-center">
            <Wifi className="w-5 h-5 text-white mb-1" />
            <span className="text-[10px] text-white/80 font-medium">Wi-Fi</span>
            <span className="text-[9px] text-emerald-400 font-mono">Edge CDN</span>
          </div>

          {/* Quick Toggle 2: Accent Color */}
          <button
            onClick={cycleNextAccent}
            className="flex flex-col items-center justify-center p-2.5 bg-white/10 rounded active:scale-95 transition-transform text-center"
          >
            <div
              className="w-5 h-5 rounded-full mb-1 border-2 border-white shadow-sm"
              style={{ backgroundColor: accent.hex }}
            />
            <span className="text-[10px] text-white/80 font-medium">Accent</span>
            <span className="text-[9px] text-white/60 truncate max-w-[50px]">{accent.name}</span>
          </button>

          {/* Quick Toggle 3: Dark / Light */}
          <button
            onClick={toggleTheme}
            className="flex flex-col items-center justify-center p-2.5 bg-white/10 rounded active:scale-95 transition-transform text-center"
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-amber-400 mb-1" />
            ) : (
              <Moon className="w-5 h-5 text-indigo-300 mb-1" />
            )}
            <span className="text-[10px] text-white/80 font-medium">Theme</span>
            <span className="text-[9px] text-white/60">{isDark ? 'Dark' : 'Light'}</span>
          </button>

          {/* Quick Toggle 4: Desktop XP */}
          <button
            onClick={() => {
              setForceView('desktop');
              setActionCenterOpen(false);
              window.location.href = '/?view=desktop';
            }}
            className="flex flex-col items-center justify-center p-2.5 bg-white/10 rounded active:scale-95 transition-transform text-center"
          >
            <Monitor className="w-5 h-5 text-cyan-400 mb-1" />
            <span className="text-[10px] text-white/80 font-medium">Desktop</span>
            <span className="text-[9px] text-white/60">XP Luna</span>
          </button>
        </div>
      </div>

      {/* Notifications Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-white/60 text-[12px] uppercase tracking-wider font-semibold">
            Notifications
          </span>
          <span className="text-[11px] text-white/40">3 items</span>
        </div>

        {/* Card 1: Edge Announcement */}
        <div className="p-3 bg-white/10 rounded border-l-4 border-[hsl(var(--wp-accent))]">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[12px] font-semibold text-white">Vercel Edge Config</span>
            <span className="text-[10px] text-white/50">LIVE</span>
          </div>
          <p className="text-[13px] text-white/80 leading-snug">
            {edgeConfig?.announcement ||
              'Welcome to my portfolio! Built with React, Vite & Vercel ecosystem.'}
          </p>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-[10px] px-1.5 py-0.5 bg-emerald-500/20 text-emerald-300 rounded font-mono">
              ● {edgeConfig?.role || 'Full Stack Engineer'}
            </span>
          </div>
        </div>

        {/* Card 2: Visitor Counter */}
        <div className="p-3 bg-white/10 rounded border-l-4 border-emerald-500">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[12px] font-semibold text-white">Visitor Telemetry</span>
            <span className="text-[10px] text-white/50">BLOB</span>
          </div>
          <p className="text-[13px] text-white/80 leading-snug">
            {visitorStats
              ? `Total Visits: ${visitorStats.total} | Today: ${visitorStats.today}`
              : 'Syncing live visitor counts from Vercel Blob...'}
          </p>
        </div>

        {/* Card 3: Windows Phone System */}
        <div className="p-3 bg-white/10 rounded border-l-4 border-indigo-500">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[12px] font-semibold text-white">Windows Phone 8.1</span>
            <span className="text-[10px] text-white/50">SYSTEM</span>
          </div>
          <p className="text-[13px] text-white/80 leading-snug">
            Interactive Metro UI simulation with live flip tiles, panorama pivots, and Cortana AI.
          </p>
        </div>
      </div>

      {/* Bottom Dismiss Handle */}
      <div
        onClick={() => setActionCenterOpen(false)}
        className="p-3 bg-white/5 border-t border-white/10 flex items-center justify-center cursor-pointer active:bg-white/20 transition-colors"
      >
        <div className="w-12 h-1 bg-white/40 rounded-full" />
      </div>
    </div>
  );
};

export default WPActionCenter;
