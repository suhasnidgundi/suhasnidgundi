import { cn } from '@/lib/utils';

interface WPProfileTileProps {
  imageSrc: string;
  name: string;
  subtitle?: string;
  onClick?: () => void;
  accentColor?: string;
  className?: string;
}

const WPProfileTile = ({ 
  imageSrc, 
  name, 
  subtitle,
  onClick,
  accentColor = 'bg-wp-cobalt/80',
  className 
}: WPProfileTileProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'relative w-[100%] h-[150px] overflow-hidden',
        'active:scale-95 active:opacity-80 transition-all duration-150',
        'focus:outline-none focus:ring-2 focus:ring-wp-accent/50',
        className
      )}
    >
      {/* Background Image */}
      <img 
        src={imageSrc} 
        alt={name}
        className="absolute inset-0 w-full h-full object-cover object-center bg-black"
      />
      
      {/* Theme-aware Color Overlay */}
      <div className={cn(
        'absolute inset-0',
        accentColor,
        'opacity-40'
      )} />
      
      {/* Gradient Overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
      
      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <h3 className="text-white text-[17px] font-semibold drop-shadow-lg">
          {name}
        </h3>
        {subtitle && (
          <p className="text-white/80 text-[13px] font-light drop-shadow">
            {subtitle}
          </p>
        )}
      </div>
    </button>
  );
};

export default WPProfileTile;
