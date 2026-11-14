import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useWPTheme } from '@/contexts/WPThemeContext';
import { useDeviceTelemetry } from '@/hooks/useDeviceTelemetry';
import { WPLumiaPrismWallpaper } from '@/components/wp/WPLumiaPrismWallpaper';

interface WPLockScreenProps {
  onUnlock?: () => void;
}

export const WPLockScreen: React.FC<WPLockScreenProps> = ({ onUnlock }) => {
  const { isLocked, unlockScreen, background, accent } = useWPTheme();
  const telemetry = useDeviceTelemetry();
  const [time, setTime] = useState(() => new Date());
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isPeeking, setIsPeeking] = useState(false);

  const startY = useRef(0);
  const startTime = useRef(0);
  const lastTap = useRef(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Live clock
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = () => {
    const hours = time.getHours();
    const minutes = time.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const formatDate = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return `${days[time.getDay()]}, ${months[time.getMonth()]} ${time.getDate()}`;
  };

  const handleUnlock = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      unlockScreen();
      onUnlock?.();
      setIsExiting(false);
      setDragY(0);
    }, 280);
  }, [unlockScreen, onUnlock]);

  const peekHint = () => {
    setIsPeeking(true);
    setTimeout(() => setIsPeeking(false), 240);
  };

  const checkDoubleTap = () => {
    const now = Date.now();
    if (now - lastTap.current < 280) {
      peekHint();
    }
    lastTap.current = now;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    checkDoubleTap();
    startY.current = e.touches[0].clientY;
    startTime.current = e.timeStamp;
    setIsDragging(true);
    setIsPeeking(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentY = e.touches[0].clientY;
    const diff = startY.current - currentY;
    const height = containerRef.current?.clientHeight || window.innerHeight;
    if (diff > 0) {
      setDragY(Math.min(diff, height));
    } else {
      // Gentle rubber-band downward resistance
      setDragY(diff * 0.15);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging) return;
    setIsDragging(false);

    const height = containerRef.current?.clientHeight || window.innerHeight;
    const timeDiff = e.timeStamp - startTime.current;
    const velocity = dragY / (timeDiff || 1);

    if (dragY > height * 0.22 || (velocity > 0.35 && dragY > 30)) {
      handleUnlock();
    } else if (dragY < 10) {
      peekHint();
      setDragY(0);
    } else {
      setDragY(0);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    checkDoubleTap();
    startY.current = e.clientY;
    startTime.current = e.timeStamp;
    setIsDragging(true);
    setIsPeeking(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const diff = startY.current - e.clientY;
    const height = containerRef.current?.clientHeight || window.innerHeight;
    if (diff > 0) {
      setDragY(Math.min(diff, height));
    } else {
      setDragY(diff * 0.15);
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setIsDragging(false);

    const height = containerRef.current?.clientHeight || window.innerHeight;
    const timeDiff = e.timeStamp - startTime.current;
    const velocity = dragY / (timeDiff || 1);

    if (dragY > height * 0.22 || (velocity > 0.35 && dragY > 30)) {
      handleUnlock();
    } else if (dragY < 10) {
      peekHint();
      setDragY(0);
    } else {
      setDragY(0);
    }
  };

  useEffect(() => {
    if (!isLocked) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowUp') {
        e.preventDefault();
        handleUnlock();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLocked, handleUnlock]);

  if (!isLocked) return null;

  const translateY = isExiting ? -100 : isPeeking ? -35 : -dragY;
  const transform = isExiting
    ? 'translateY(-100%)'
    : isPeeking
    ? 'translateY(-35px)'
    : `translateY(${translateY}px)`;

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-label="Windows Phone Lock Screen"
      className={`fixed inset-0 z-50 flex flex-col justify-between overflow-hidden select-none touch-none bg-black transition-transform ${
        isDragging ? '!transition-none cursor-grabbing' : 'duration-300 ease-out cursor-grab'
      }`}
      style={{
        transform,
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Theme-Adaptive Crystalline Low-Poly Prism Wallpaper or Accent-Harmonized Custom Image */}
      {background && background !== 'none' ? (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center pointer-events-none"
            style={{ backgroundImage: `url(${background})` }}
          />
          {/* Subtle accent tone overlay so custom wallpapers harmoniously match the chosen theme */}
          <div
            className="absolute inset-0 pointer-events-none opacity-25 mix-blend-color"
            style={{ backgroundColor: accent.hex }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.08) 25%, rgba(0,0,0,0.2) 55%, rgba(0,0,0,0.92) 100%)',
            }}
          />
        </>
      ) : (
        <WPLumiaPrismWallpaper accentHex={accent.hex} />
      )}

      {/* 1. Authentic Windows Phone 8.1 Status Bar with Live Telemetry */}
      <div className="relative z-10 flex items-center justify-between px-5 pt-2.5 pb-1 text-white select-none">
        {/* Left: Signal Bars, Carrier, Generation & Data Activity */}
        <div className="flex items-center gap-2">
          {/* Authentic 5-bar cellular signal */}
          <div className="flex items-end gap-[2px] h-3" title={`Signal: ${telemetry.signalBars}/5`}>
            {[1, 2, 3, 4, 5].map(bar => (
              <span
                key={bar}
                className="w-[2.5px] bg-white rounded-[0.5px] transition-opacity duration-200"
                style={{
                  height: `${bar * 2.2 + 2}px`,
                  opacity: bar <= telemetry.signalBars ? 1 : 0.25,
                }}
              />
            ))}
          </div>

          {/* Auto-detected Carrier Name */}
          <span className="text-[12px] font-['Segoe_WP','Segoe_UI',sans-serif] font-light tracking-wide text-white/95">
            {telemetry.carrierName}
          </span>

          {/* Cellular Generation Badge */}
          <span className="text-[10px] font-['Segoe_WP','Segoe_UI',sans-serif] font-bold tracking-wider text-white">
            {telemetry.networkGen}
          </span>

          {/* Data Transfer Arrows (▲▼) */}
          <span
            className={`inline-flex flex-col text-[6px] leading-[5px] transition-opacity duration-150 -ml-1 ${
              telemetry.isTransferring ? 'opacity-100 text-white animate-pulse' : 'opacity-25 text-white/50'
            }`}
            title="Data transfer"
          >
            <span>▲</span>
            <span>▼</span>
          </span>
        </div>

        {/* Right: Wi-Fi, Live Battery & Time */}
        <div className="flex items-center gap-2.5">
          {/* Wi-Fi with speed-responsive arcs & live traffic */}
          {telemetry.connectionType === 'wifi' && (
            <div
              className={`flex items-center text-white ${telemetry.isTransferring ? 'drop-shadow-[0_0_3px_rgba(255,255,255,0.9)]' : ''}`}
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

          {/* Live Battery Capsule with Charging Lightning Bolt & Level */}
          <div
            className="flex items-center gap-1"
            title={`Battery: ${telemetry.batteryLevel}% ${telemetry.isCharging ? '(Charging)' : ''}`}
          >
            <div
              className={`relative w-5 h-2.5 border p-[1px] flex items-center bg-black/20 ${
                telemetry.batteryLevel <= 20 && !telemetry.isCharging
                  ? 'border-[#E51400]'
                  : 'border-white/90'
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
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 text-white drop-shadow-[0_0_2px_rgba(255,255,255,0.8)] animate-pulse"
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
            <div className="w-[1.5px] h-1 bg-white/90 -ml-[1px]" />
            <span className="text-[10px] font-['Segoe_WP','Segoe_UI',sans-serif] font-light text-white/90">
              {telemetry.batteryLevel}%
            </span>
          </div>

          <span className="text-[12px] font-['Segoe_WP','Segoe_UI',sans-serif] font-light text-white pl-0.5">
            {formatTime()}
          </span>
        </div>
      </div>

      {/* 2. Main Lock Screen Typography (Pure Metro WP8.1 layout: Huge Clock & Date) */}
      <div className="relative z-10 flex-1 flex flex-col justify-end px-7 pb-16 text-white">
        {/* Massive Segoe WP Clock */}
        <div>
          <div
            className="text-[104px] font-[200] leading-[0.88] tracking-[-4px] text-white"
            style={{
              fontFamily: "'Segoe WP', 'Segoe UI Light', 'Segoe UI', -apple-system, sans-serif",
              textShadow: '0 2px 14px rgba(0,0,0,0.6)',
            }}
          >
            {formatTime()}
          </div>
          <div
            className="text-[23px] font-[300] text-white/95 mt-2 tracking-[-0.3px]"
            style={{
              fontFamily: "'Segoe WP', 'Segoe UI', -apple-system, sans-serif",
              textShadow: '0 2px 8px rgba(0,0,0,0.6)',
            }}
          >
            {formatDate()}
          </div>
        </div>
      </div>

      {/* 4. Elegant Animated Swipe Up to Portfolio Indicator */}
      <div
        onClick={handleUnlock}
        className="relative z-10 pb-5 flex flex-col items-center justify-center gap-1 cursor-pointer select-none group"
      >
        {/* Animated kinetic upward chevron nudge */}
        <div className="animate-bounce">
          <svg
            className="w-4 h-4 text-white/80 group-hover:text-white transition-colors duration-200"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 15l-6-6-6 6" />
          </svg>
        </div>

        <span
          className="text-[13px] font-[300] lowercase tracking-[1.4px] text-white/80 group-hover:text-white transition-all duration-200"
          style={{
            fontFamily: "'Segoe WP', 'Segoe UI', sans-serif",
            textShadow: '0 1px 6px rgba(0,0,0,0.8)',
          }}
        >
          swipe up to explore portfolio
        </span>
      </div>
    </div>
  );
};

export default WPLockScreen;
