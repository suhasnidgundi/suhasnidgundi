import { ReactNode, useState } from 'react';
import MinimizeIcon from '@/assets/xp/icons/minimize_icon.png';
import MaximizeIcon from '@/assets/xp/icons/maximize_icon.png';
import ExitIcon from '@/assets/xp/icons/exit_icon.png';

interface XPWindowProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  onMinimize?: () => void;
  onMaximize?: () => void;
  onClose?: () => void;
  isMaximized?: boolean;
  zIndex?: number;
  onFocus?: () => void;
}

const XPWindow = ({ 
  title, 
  icon, 
  children, 
  className = '',
  onMinimize,
  onMaximize,
  onClose,
  isMaximized: controlledMaximized,
  zIndex = 1,
  onFocus
}: XPWindowProps) => {
  const [internalMaximized, setInternalMaximized] = useState(true);
  const isMaximized = controlledMaximized !== undefined ? controlledMaximized : internalMaximized;

  const handleMaximize = () => {
    if (onMaximize) {
      onMaximize();
    } else {
      setInternalMaximized(!internalMaximized);
    }
  };

  return (
    <div 
      className={`flex flex-col h-full rounded-t-lg overflow-hidden xp-window-shadow ${className}`}
      style={{
        borderTopLeftRadius: '8px',
        borderTopRightRadius: '8px',
        zIndex,
      }}
      onClick={onFocus}
    >
      {/* Title Bar - Authentic XP styling */}
      <div className="xp-title-bar h-[28px] flex items-center justify-between px-1 select-none shrink-0">
        <div className="flex items-center gap-1 ml-1">
          {icon && <div className="w-5 h-5 flex items-center justify-center">{icon}</div>}
          <span className="text-white font-semibold text-[12px] drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)] leading-tight line-clamp-1">{title}</span>
        </div>
        <div className="flex items-center mr-0.5 shrink-0">
          <button 
            className="xp-control-btn xp-minimize hover:brightness-110 transition-all ml-1"
            onClick={(e) => {
              e.stopPropagation();
              onMinimize?.();
            }}
            title="Minimize"
          >
            <img src={MinimizeIcon} alt="Minimize" className="w-5 h-5" />
          </button>
          <button 
            className="xp-control-btn xp-maximize hover:brightness-110 transition-all ml-1"
            onClick={(e) => {
              e.stopPropagation();
              handleMaximize();
            }}
            title={isMaximized ? "Restore" : "Maximize"}
          >
            <img src={MaximizeIcon} alt="Maximize" className="w-5 h-5" />
          </button>
          <button 
            className="xp-control-btn xp-close hover:brightness-110 transition-all ml-1"
            onClick={(e) => {
              e.stopPropagation();
              onClose?.();
            }}
            title="Close"
          >
            <img src={ExitIcon} alt="Close" className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* Content - XP Yellow background */}
      <div className="flex-1 flex flex-col overflow-hidden" style={{ backgroundColor: 'var(--xp-yellow)' }}>
        {children}
      </div>
    </div>
  );
};

export default XPWindow;
