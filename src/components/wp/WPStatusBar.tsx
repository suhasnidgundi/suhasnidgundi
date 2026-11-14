import { useState, useEffect } from 'react';
import { Signal, Wifi, Battery, ChevronDown, Bell } from 'lucide-react';
import { useWPTheme } from '@/contexts/WPThemeContext';

interface WPStatusBarProps {
  className?: string;
}

const WPStatusBar = ({ className = '' }: WPStatusBarProps) => {
  const { toggleActionCenter, actionCenterOpen } = useWPTheme();
  const [time, setTime] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setTime(`${hours}:${minutes}`);
    };
    update();
    const interval = setInterval(update, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header
      onClick={toggleActionCenter}
      className={`flex items-center justify-between px-3 py-1.5 bg-black/40 backdrop-blur-md text-white select-none cursor-pointer border-b border-white/5 active:bg-white/10 transition-colors z-40 ${className}`}
      title="Tap to toggle Action Center"
    >
      {/* Carrier & Signal */}
      <div className="flex items-center gap-1.5">
        <Signal className="w-3.5 h-3.5 text-white/90" />
        <span className="text-[11px] font-['Segoe_UI',sans-serif] tracking-wider text-white/80 uppercase font-medium">
          Vercel Edge
        </span>
      </div>

      {/* Clock & Action Center indicator */}
      <div className="flex items-center gap-1.5">
        <span className="text-[12px] font-['Segoe_UI',sans-serif] font-normal tracking-wide text-white">
          {time || '12:00'}
        </span>
        <ChevronDown
          className={`w-3 h-3 text-white/60 transition-transform duration-200 ${
            actionCenterOpen ? 'rotate-180' : ''
          }`}
        />
      </div>

      {/* Connectivity & Battery */}
      <div className="flex items-center gap-2">
        <Bell className="w-3 h-3 text-white/70 animate-pulse" />
        <Wifi className="w-3.5 h-3.5 text-white/90" />
        <div className="flex items-center gap-0.5">
          <Battery className="w-4 h-3.5 text-white/90" />
          <span className="text-[10px] font-['Segoe_UI',sans-serif] text-white/70">100%</span>
        </div>
      </div>
    </header>
  );
};

export default WPStatusBar;
