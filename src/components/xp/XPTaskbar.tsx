import { useState, useEffect } from "react";
import { Sun, Moon, Volume2, VolumeX } from "lucide-react";
import MyComputerIcon from "@/assets/xp/icons/my_computer.png";
import InternetExplorerIcon from "@/assets/xp/icons/internet_explorer_icon.png";
import XPStartMenu from "./XPStartMenu";
import { XPTaskbarContextMenu } from "./XPTaskbarContextMenu";

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
  onMinimizeAll?: () => void;
  onUndoMinimizeAll?: () => void;
  isAllMinimized?: boolean;
  onArrangeWindows?: (mode: 'cascade' | 'tile-horizontal' | 'tile-vertical') => void;
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
  playSound,
  onMinimizeAll,
  onUndoMinimizeAll,
  isAllMinimized = false,
  onArrangeWindows,
}: XPTaskbarProps) => {
  const [time, setTime] = useState(new Date());
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const [contextMenuPos, setContextMenuPos] = useState<{ x: number; y: number } | null>(null);

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

  const handleStartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsStartMenuOpen(!isStartMenuOpen);
    if (!isStartMenuOpen) {
      playSound?.('start');
    }
  };

  const handleCloseStartMenu = () => {
    setIsStartMenuOpen(false);
  };

  const handleTaskbarContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenuPos({ x: e.clientX, y: e.clientY });
  };

  const handleToggleShowDesktop = () => {
    if (isAllMinimized) {
      onUndoMinimizeAll?.();
    } else {
      onMinimizeAll?.();
    }
  };

  return (
    <>
      <div 
        className="xp-taskbar flex items-center justify-between"
        onContextMenu={handleTaskbarContextMenu}
      >
        {/* Left Section: Start Button + Quick Launch */}
        <div className="flex items-center h-full shrink-0">
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

          {/* Quick Launch Separator & Buttons */}
          <div className="hidden sm:flex items-center gap-1 px-1.5 h-full border-r border-[#1941a5]/50 shadow-[1px_0_0_rgba(255,255,255,0.15)]">
            {/* Show Desktop Button */}
            <button
              onClick={handleToggleShowDesktop}
              className="p-1 hover:bg-white/20 active:bg-black/20 rounded transition-colors"
              title={isAllMinimized ? "Show Open Windows" : "Show Desktop"}
              aria-label="Show Desktop"
            >
              <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none">
                <rect x="2" y="2" width="12" height="10" rx="1" fill="#fff" stroke="#1542a0" strokeWidth="1.5" />
                <rect x="4" y="4" width="8" height="6" fill="#4d90fe" />
                <path d="M5 14h6" stroke="#1542a0" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>

            {/* Quick Launch: Internet Explorer */}
            <button
              onClick={() => onOpenBrowser?.('https://github.com/suhasnidgundi')}
              className="p-1 hover:bg-white/20 active:bg-black/20 rounded transition-colors"
              title="Launch Internet Explorer Browser"
              aria-label="Internet Explorer"
            >
              <img src={InternetExplorerIcon} alt="IE" className="w-4 h-4 object-contain" />
            </button>
          </div>
        </div>

        {/* Program Tray - Active Windows */}
        <div className="flex-1 flex items-center h-full px-2 overflow-hidden gap-1">
          {activeWindows.length === 0 ? (
            /* Default My Portfolio button when no windows */
            <button 
              data-task-id="my-computer"
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
                data-task-id={window.id}
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

      {/* Taskbar Right Click Context Menu */}
      {contextMenuPos && (
        <XPTaskbarContextMenu
          x={contextMenuPos.x}
          y={contextMenuPos.y}
          isAllMinimized={isAllMinimized}
          onCascade={() => onArrangeWindows?.('cascade')}
          onTileHorizontal={() => onArrangeWindows?.('tile-horizontal')}
          onTileVertical={() => onArrangeWindows?.('tile-vertical')}
          onToggleShowDesktop={handleToggleShowDesktop}
          onOpenMyComputer={() => onOpenMyComputer?.()}
          onDismiss={() => setContextMenuPos(null)}
        />
      )}
    </>
  );
};

export default XPTaskbar;
