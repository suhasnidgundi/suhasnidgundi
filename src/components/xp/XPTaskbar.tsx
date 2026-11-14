import { useState, useEffect } from "react";
import { Sun, Moon, Volume2, VolumeX } from "lucide-react";
import MyComputerIcon from "@/assets/xp/icons/my_computer.png";
import StartBtnNormal from "@/assets/xp/start_btn_normal.png";
import XPStartMenu from "./XPStartMenu";

interface TaskbarWindowButton {
  id: string;
  title: string;
  icon: string;
  isMinimized: boolean;
  isActive?: boolean;
}

interface XPTaskbarProps {
  isDark: boolean;
  toggleTheme: () => void;
  activeWindows?: TaskbarWindowButton[];
  onWindowClick?: (id: string) => void;
  onOpenMyComputer?: () => void;
  onOpenWordDoc?: () => void;
  onOpenBrowser?: (url: string) => void;
  onOpenAIChat?: () => void;
  onLogOff?: () => void;
  isMuted?: boolean;
  onToggleMute?: () => void;
  playSound?: (type: string) => void;
}

const XPTaskbar = ({ 
  isDark, 
  toggleTheme, 
  activeWindows = [],
  onWindowClick,
  onOpenMyComputer,
  onOpenWordDoc,
  onOpenBrowser,
  onOpenAIChat,
  onLogOff,
  isMuted = false,
  onToggleMute,
  playSound
}: XPTaskbarProps) => {
  const [time, setTime] = useState(new Date());
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleStartClick = () => {
    setIsStartMenuOpen(!isStartMenuOpen);
    if (!isStartMenuOpen) {
      playSound?.('start');
    }
  };

  const handleCloseStartMenu = () => {
    setIsStartMenuOpen(false);
  };

  return (
    <>
      <div className="xp-taskbar flex items-center justify-between">
        {/* Start Button - Authentic Luna XP Start Button */}
        <button 
          className={`h-full w-[97px] shrink-0 border-none transition-all cursor-pointer ${
            isStartMenuOpen ? 'brightness-90' : 'hover:brightness-110 active:brightness-90'
          }`}
          style={{
            backgroundImage: "url('/luna/start.png')",
            backgroundSize: '97px 30px',
            backgroundPosition: 'left center',
            backgroundRepeat: 'no-repeat',
          }}
          aria-label="Start Menu"
          onClick={handleStartClick}
        >
          <span className="sr-only">Start</span>
        </button>

        {/* Program Tray - Active Windows */}
        <div className="flex-1 flex items-center h-full px-2 overflow-hidden gap-1">
          {activeWindows.length === 0 ? (
            /* Default My Portfolio button when no windows */
            <button 
              className="xp-taskbar-item active"
              onClick={() => onOpenMyComputer?.()}
            >
              <img src={MyComputerIcon} alt="My Computer" className="w-3.5 h-3.5 object-contain" />
              <span className="truncate">My Portfolio</span>
            </button>
          ) : (
            activeWindows.map((window) => (
              <button 
                key={window.id}
                className={`xp-taskbar-item ${window.isActive ? 'active' : ''} ${
                  window.isMinimized ? 'minimized' : ''
                }`}
                onClick={() => {
                  playSound?.('click');
                  onWindowClick?.(window.id);
                }}
                title={window.title}
              >
                <img src={window.icon} alt={window.title} className="w-3.5 h-3.5 object-contain shrink-0" />
                <span className="truncate">{window.title}</span>
              </button>
            ))
          )}
        </div>

        {/* System Tray - Authentic Luna XP Style */}
        <div 
          className="flex items-center gap-2 px-3 h-full shrink-0 select-none"
          style={{
            backgroundImage: "url('/luna/tray.png')",
            backgroundRepeat: 'repeat-x',
            backgroundSize: '1px 30px',
            backgroundColor: '#0c59b9',
            borderLeft: '1px solid #0944a1',
            boxShadow: 'inset 1px 0 1px #1bbbfb',
          }}
        >
          {/* Mute button */}
          <button
            onClick={onToggleMute}
            className="hover:bg-white/10 p-1 rounded transition-colors"
            title={isMuted ? "Unmute sounds" : "Mute sounds"}
          >
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5 text-slate-50" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-slate-50" />
            )}
          </button>
          <button
            onClick={toggleTheme}
            className="hover:bg-white/10 p-1 rounded transition-colors"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDark ? (
              <Sun className="w-3.5 h-3.5 text-yellow-300" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-slate-50" />
            )}
          </button>
          <span 
            className="text-white text-[11px] font-['MSSans',Tahoma,sans-serif] px-1 drop-shadow-[0_1px_1px_rgba(0,0,0,0.6)] cursor-default"
            title={time.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          >
            {formatTime(time)}
          </span>
        </div>
      </div>

      {/* Start Menu */}
      <XPStartMenu
        isOpen={isStartMenuOpen}
        onClose={handleCloseStartMenu}
        onOpenMyComputer={() => {
          onOpenMyComputer?.();
          handleCloseStartMenu();
        }}
        onOpenWordDoc={() => {
          onOpenWordDoc?.();
          handleCloseStartMenu();
        }}
        onOpenBrowser={(url) => {
          onOpenBrowser?.(url);
          handleCloseStartMenu();
        }}
        onOpenAIChat={() => {
          onOpenAIChat?.();
          handleCloseStartMenu();
        }}
        onLogOff={() => {
          onLogOff?.();
          handleCloseStartMenu();
        }}
      />
    </>
  );
};

export default XPTaskbar;
