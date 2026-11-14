import { useState, useEffect, useRef } from 'react';
import { useWPTheme } from '@/contexts/WPThemeContext';
import { useDeviceTelemetry } from '@/hooks/useDeviceTelemetry';
import { WPIcon } from './WPIcons';

interface WPStatusBarProps {
  className?: string;
  hasNotifications?: boolean;
}

const WPStatusBar = ({ className = '', hasNotifications = false }: WPStatusBarProps) => {
  const { toggleActionCenter, actionCenterOpen, lockScreen } = useWPTheme();
  const telemetry = useDeviceTelemetry();
  const [time, setTime] = useState('');
  const touchStartY = useRef(0);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setTime(`${hours}:${minutes}`);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = e.changedTouches[0].clientY - touchStartY.current;
    if (diff > 25 && !actionCenterOpen) {
      toggleActionCenter();
    }
  };

  return (
    <header
      onClick={toggleActionCenter}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onDoubleClick={(e) => {
        e.stopPropagation();
        lockScreen();
      }}
      className={`flex items-center justify-between px-3 py-1.5 bg-black/40 backdrop-blur-md text-white select-none cursor-pointer border-b border-white/5 active:bg-white/10 transition-colors z-40 ${className}`}
      title="Tap or swipe down for Action Center, double-tap to lock screen"
    >
      {/* Carrier, Network Gen & Signal */}
      <div className="flex items-center gap-1.5">
        {/* 5-bar cellular gauge */}
        <div className="flex items-end gap-[1.5px] h-3" title={`Signal: ${telemetry.signalBars}/5`}>
          {[1, 2, 3, 4, 5].map(bar => (
            <span
              key={bar}
              className="w-[2px] bg-white rounded-[0.5px] transition-opacity duration-200"
              style={{
                height: `${bar * 2 + 2}px`,
                opacity: bar <= telemetry.signalBars ? 1 : 0.25,
              }}
            />
          ))}
        </div>

        {/* Carrier name */}
        <span className="text-[11px] font-['Segoe_UI',sans-serif] tracking-wider text-white/90 uppercase font-medium">
          {telemetry.carrierName}
        </span>

        {/* Generation */}
        <span className="text-[10px] font-bold text-white/90">
          {telemetry.networkGen}
        </span>

        {/* Data transfer arrows */}
        <span
          className={`inline-flex flex-col text-[6px] leading-[5px] transition-opacity duration-150 -ml-0.5 ${
            telemetry.isTransferring ? 'opacity-100 text-white animate-pulse' : 'opacity-25 text-white/50'
          }`}
          title="Data transfer"
        >
          <span>▲</span>
          <span>▼</span>
        </span>
      </div>

      {/* Clock */}
      <div className="flex items-center">
        <span className="text-[12px] font-segoe font-light tracking-wide text-white">
          {time || '12:00'}
        </span>
      </div>

      {/* Connectivity & Battery */}
      <div className="flex items-center gap-2">
        {hasNotifications && (
          <WPIcon name="bell" size={12} className="text-white/80 animate-pulse" />
        )}

        {/* Wi-Fi with speed-responsive arcs & live traffic */}
        {telemetry.connectionType === 'wifi' && (
          <div
            className={`flex items-center text-white ${
              telemetry.isTransferring ? 'drop-shadow-[0_0_2px_rgba(255,255,255,0.9)]' : ''
            }`}
            title={`Wi-Fi: ~${Math.round(telemetry.downlinkSpeed)} Mbps`}
          >
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-current" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="19" r="1.5" className="fill-current stroke-none" />
              <path d="M8.5 14.5c2-2 5-2 7 0" opacity={telemetry.signalBars >= 2 ? 1 : 0.25} />
              <path d="M5 11c4-4 10-4 14 0" opacity={telemetry.signalBars >= 3 ? 1 : 0.25} />
              <path d="M1.5 7.5c6-6 15-6 21 0" opacity={telemetry.signalBars >= 4 ? 1 : 0.25} />
            </svg>
          </div>
        )}

        {/* Battery with real % and charging status */}
        <div
          className="flex items-center gap-1"
          title={`Battery: ${telemetry.batteryLevel}% ${telemetry.isCharging ? '(Charging)' : ''}`}
        >
          <div
            className={`relative w-4 h-2.5 border p-[1px] flex items-center bg-black/20 ${
              telemetry.batteryLevel <= 20 && !telemetry.isCharging
                ? 'border-[#E51400]'
                : 'border-white/80'
            }`}
          >
            <div
              className="h-full rounded-[0.5px] transition-all duration-300"
              style={{
                width: `${telemetry.batteryLevel}%`,
                backgroundColor:
                  telemetry.batteryLevel <= 20 && !telemetry.isCharging ? '#E51400' : '#FFFFFF',
              }}
            />
            {telemetry.isCharging && (
              <svg
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 text-white animate-pulse"
                viewBox="0 0 24 24"
              >
                <path
                  d="M11 21h-1l1-7H7.5c-.58 0-.57-.32-.38-.66.19-.34.05-.08.08-.14L13 3h1l-1 7h3.5c.49 0 .56.33.47.51l-.07.15L11 21z"
                  fill="#000"
                  stroke="#FFF"
                  strokeWidth="0.8"
                />
              </svg>
            )}
          </div>
          <div className="w-[1.5px] h-1 bg-white/80 -ml-[1px]" />
          <span className="text-[10px] font-['Segoe_UI',sans-serif] text-white/80">
            {telemetry.batteryLevel}%
          </span>
        </div>
      </div>
    </header>
  );
};

export default WPStatusBar;
