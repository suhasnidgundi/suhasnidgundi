import React, { ReactNode, useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useWPTheme } from '@/contexts/WPThemeContext';

export type TileSize = 'small' | 'medium' | 'wide';

export interface WPTileProps {
  icon?: ReactNode;
  label: string;
  size?: TileSize;
  color?: string; // Tailwind class or inline background
  count?: number;
  onClick?: () => void;
  className?: string;
  badge?: string;
  // Live Tile Flip support
  backContent?: ReactNode;
  flipInterval?: number; // ms to flip, 0 to disable
}

const WPTile = ({
  icon,
  label,
  size = 'medium',
  color = 'bg-[hsl(var(--wp-accent))]',
  count,
  onClick,
  className,
  badge,
  backContent,
  flipInterval = 0,
}: WPTileProps) => {
  const { transparentTiles } = useWPTheme();
  const [flipped, setFlipped] = useState(false);
  const [tiltStyle, setTiltStyle] = useState<React.CSSProperties>({});
  const tileRef = useRef<HTMLDivElement>(null);

  // Live Tile Flip Timer
  useEffect(() => {
    if (!flipInterval || !backContent) return;
    const interval = setInterval(() => {
      setFlipped((prev) => !prev);
    }, flipInterval);
    return () => clearInterval(interval);
  }, [flipInterval, backContent]);

  // Realistic 3D Tilt Effect on Touch / Pointer
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!tileRef.current) return;
    const rect = tileRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left; // x position within the element
    const y = e.clientY - rect.top;  // y position within the element
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -12; // tilt angle
    const rotateY = ((x - centerX) / centerX) * 12;

    setTiltStyle({
      transform: `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(0.97)`,
      transition: 'transform 0.08s ease-out',
    });
  };

  const handlePointerUpOrLeave = () => {
    setTiltStyle({
      transform: 'perspective(600px) rotateX(0deg) rotateY(0deg) scale(1)',
      transition: 'transform 0.22s cubic-bezier(0.19, 1, 0.22, 1)',
    });
  };

  // Determine size classes in grid layout
  const sizeClasses: Record<TileSize, string> = {
    small: 'col-span-1 row-span-1 aspect-square h-[72px]',
    medium: 'col-span-1 row-span-1 aspect-square min-h-[148px]',
    wide: 'col-span-2 aspect-[2.05/1] min-h-[148px]',
  };

  const isGlass = transparentTiles;

  return (
    <div
      ref={tileRef}
      onClick={onClick}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUpOrLeave}
      onPointerLeave={handlePointerUpOrLeave}
      onPointerCancel={handlePointerUpOrLeave}
      style={tiltStyle}
      className={cn(
        'group relative overflow-hidden select-none cursor-pointer',
        'font-["Segoe_UI",sans-serif] text-white',
        sizeClasses[size],
        isGlass
          ? 'bg-black/40 backdrop-blur-md border border-white/20'
          : color,
        'shadow-[0_2px_8px_rgba(0,0,0,0.3)]',
        className
      )}
    >
      {/* 3D Flipped Container */}
      <div
        className={cn(
          'w-full h-full transition-transform duration-700 [transform-style:preserve-3d]',
          flipped ? '[transform:rotateX(180deg)]' : ''
        )}
      >
        {/* Front Face */}
        <div className="absolute inset-0 p-3 flex flex-col justify-between [backface-visibility:hidden]">
          {/* Top Row: Badges / Counts */}
          <div className="flex items-center justify-between w-full">
            {badge ? (
              <span className="text-[10px] font-semibold uppercase tracking-wider bg-black/40 px-1.5 py-0.5 rounded">
                {badge}
              </span>
            ) : <span />}

            {count !== undefined && count > 0 && (
              <span className="text-[13px] font-bold bg-white text-black rounded-full px-2 py-0.2 min-w-[20px] text-center shadow">
                {count}
              </span>
            )}
          </div>

          {/* Center: Main Icon */}
          <div className="flex-1 flex items-center justify-center">
            {icon && (
              <div className="text-white drop-shadow-md transition-transform group-hover:scale-110">
                {icon}
              </div>
            )}
          </div>

          {/* Bottom Row: Title Label */}
          <div className="w-full">
            <span className="text-[13px] font-medium tracking-wide drop-shadow truncate block leading-tight">
              {label}
            </span>
          </div>
        </div>

        {/* Back Face (Live Tile Content) */}
        {backContent && (
          <div className="absolute inset-0 p-3 bg-black/85 flex flex-col justify-between [transform:rotateX(180deg)] [backface-visibility:hidden]">
            {backContent}
          </div>
        )}
      </div>
    </div>
  );
};

export default WPTile;
