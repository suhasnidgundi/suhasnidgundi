import { useState, useEffect } from 'react';
import { X, Moon, Sun, Users, MapPin, Clock, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WPInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
  toggleTheme: () => void;
}

const WPInfoModal = ({ isOpen, onClose, isDark, toggleTheme }: WPInfoModalProps) => {
  const [currentTime, setCurrentTime] = useState('');
  
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const puneTime = now.toLocaleTimeString('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
      setCurrentTime(puneTime);
    };
    
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-wp-bg/95 z-50 flex flex-col animate-fade-in"
      onClick={onClose}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-wp-border">
        <h2 className="text-wp-text text-[18px] font-light">About</h2>
        <button 
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center"
        >
          <X className="w-6 h-6 text-wp-text" />
        </button>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" onClick={(e) => e.stopPropagation()}>
        {/* Crafted By */}
        <div className="flex items-center gap-3 py-4 border-b border-wp-border">
          <Heart className="w-6 h-6 text-wp-magenta" />
          <div>
            <p className="text-wp-text/60 text-[12px] uppercase tracking-wide">Crafted with love by</p>
            <p className="text-wp-text text-[16px] font-medium">Suhas Nidgundi</p>
          </div>
        </div>
        
        {/* Location & Time */}
        <div className="flex items-center gap-3 py-4 border-b border-wp-border">
          <MapPin className="w-6 h-6 text-wp-emerald" />
          <div>
            <p className="text-wp-text/60 text-[12px] uppercase tracking-wide">Location</p>
            <p className="text-wp-text text-[16px]">Pune, India</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 py-4 border-b border-wp-border">
          <Clock className="w-6 h-6 text-wp-cyan" />
          <div>
            <p className="text-wp-text/60 text-[12px] uppercase tracking-wide">Current Time (IST)</p>
            <p className="text-wp-text text-[16px]">{currentTime}</p>
          </div>
        </div>
        
        {/* Last Visitor */}
        <div className="flex items-center gap-3 py-4 border-b border-wp-border">
          <Users className="w-6 h-6 text-wp-violet" />
          <div>
            <p className="text-wp-text/60 text-[12px] uppercase tracking-wide">Last Visitor</p>
            <p className="text-wp-text text-[16px]">Maharashtra, India</p>
          </div>
        </div>
        
        {/* Visitor Count */}
        <div className="flex items-center gap-3 py-4 border-b border-wp-border">
          <div className="w-6 h-6 flex items-center justify-center">
            <span className="text-wp-orange text-[18px] font-bold">#</span>
          </div>
          <div>
            <p className="text-wp-text/60 text-[12px] uppercase tracking-wide">Total Visitors</p>
            <p className="text-wp-text text-[16px]">1,247</p>
          </div>
        </div>
        
        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="flex items-center gap-3 py-4 w-full"
        >
          {isDark ? (
            <Sun className="w-6 h-6 text-wp-orange" />
          ) : (
            <Moon className="w-6 h-6 text-wp-cobalt" />
          )}
          <div className="text-left">
            <p className="text-wp-text/60 text-[12px] uppercase tracking-wide">Theme</p>
            <p className="text-wp-text text-[16px]">{isDark ? 'Switch to Light' : 'Switch to Dark'}</p>
          </div>
          <div className={cn(
            "ml-auto w-12 h-6 rounded-full relative transition-colors",
            isDark ? "bg-wp-accent" : "bg-wp-border"
          )}>
            <div className={cn(
              "absolute top-1 w-4 h-4 rounded-full bg-wp-bg transition-transform",
              isDark ? "translate-x-7" : "translate-x-1"
            )} />
          </div>
        </button>
      </div>
    </div>
  );
};

export default WPInfoModal;
