import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type TileSize = 'small' | 'medium' | 'wide';

interface WPTileProps {
  icon?: ReactNode;
  label: string;
  size?: TileSize;
  color?: string;
  count?: number;
  onClick?: () => void;
  className?: string;
}

const sizeClasses: Record<TileSize, string> = {
  small: 'w-[70px] h-[70px]',
  medium: 'w-[50%] h-[150px]',
  wide: 'w-[100%] h-[150px]',
};

const WPTile = ({
  icon,
  label,
  size = 'medium',
  color = 'bg-wp-accent',
  count,
  onClick,
  className
}: WPTileProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'wp-tile-anim',
        'relative flex flex-col justify-between p-3',
        'transition-all duration-200 ease-out',
        'active:scale-[0.97] active:opacity-90',
        'focus:outline-none focus:ring-2 focus:ring-wp-accent/40',
        sizeClasses[size],
        color,
        className
      )}
    >
      {/* Count Badge */}
      {count !== undefined && count > 0 && (
        <span className="absolute top-2 right-2 text-wp-text text-[13px] font-semibold">
          {count}
        </span>
      )}

      {/* Icon – bigger Metro size */}
      <div className="flex-1 flex items-center justify-center">
        {icon && (
          <div className="w-24 h-24 flex items-center justify-center text-wp-text">
            {icon}
          </div>
        )}
      </div>

      {/* Label */}
      <span className="text-wp-text text-[14px] font-light tracking-wide truncate">
        {label}
      </span>
    </button>
  );
};

export default WPTile;
