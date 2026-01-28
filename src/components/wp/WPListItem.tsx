import { ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WPListItemProps {
  icon?: ReactNode;
  title: string;
  subtitle?: string;
  meta?: string;
  onClick?: () => void;
  showChevron?: boolean;
  className?: string;
}

const WPListItem = ({ 
  icon, 
  title, 
  subtitle, 
  meta,
  onClick, 
  showChevron = true,
  className 
}: WPListItemProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 w-full py-3 px-2 text-left',
        'active:bg-wp-text/10 transition-colors',
        className
      )}
    >
      {/* Icon */}
      {icon && (
        <div className="w-10 h-10 bg-wp-accent flex items-center justify-center flex-shrink-0">
          <span className="text-wp-text">{icon}</span>
        </div>
      )}
      
      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="text-wp-text text-[17px] font-normal truncate">
          {title}
        </h3>
        {subtitle && (
          <p className="text-wp-text/60 text-[14px] font-light truncate">
            {subtitle}
          </p>
        )}
      </div>
      
      {/* Meta & Chevron */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {meta && (
          <span className="text-wp-text/50 text-[12px]">{meta}</span>
        )}
        {showChevron && (
          <ChevronRight className="w-5 h-5 text-wp-text/30" />
        )}
      </div>
    </button>
  );
};

export default WPListItem;
