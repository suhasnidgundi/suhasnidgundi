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
}

interface XPTaskbarProps {
  isDark: boolean;
  toggleTheme: () => void;
  activeWindows?: TaskbarWindowButton[];
  onWindowClick?: (id: string) => void;
  onOpenMyComputer?: () => void;
  onOpenWordDoc?: () => void;
  onOpenBrowser?: (url: string) => void;
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
        {/* Start Button - Authentic XP Start Button Image */}
        <button 
          className={`h-full w-[100px] shrink-0 transition-all ${isStartMenuOpen ? 'brightness-90' : 'hover:brightness-110'}`}
          style={{
            backgroundImage: `url(${StartBtnNormal})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
          aria-label="Start Menu"
          onClick={handleStartClick}
        >
          <span className="sr-only">Start</span>
        </button>

        {/* Program Tray - Active Windows */}
        <div className="flex-1 flex items-center h-full pt-1 px-2 overflow-hidden gap-1">
          {activeWindows.length === 0 ? (
            /* Default My Portfolio button when no windows */
            <button 
              className="h-[22px] px-3 flex items-center gap-2 text-white text-[11px] min-w-[150px] shrink-0"
              style={{
                background: 'linear-gradient(180deg, rgb(60, 127, 177) 0%, rgb(34, 99, 170) 8%, rgb(31, 85, 153) 40%, rgb(27, 65, 137) 88%, rgb(34, 73, 138) 93%, rgb(40, 90, 165) 95%, rgb(49, 112, 192) 100%)',
                boxShadow: 'rgb(0 0 0 / 30%) -1px 0px inset, rgb(255 255 255 / 20%) 1px 1px 1px inset',
                borderRadius: '2px',
              }}
              onClick={() => onOpenMyComputer?.()}
            >
              <img src={MyComputerIcon} alt="My Computer" className="w-4 h-4" />
              <span className="truncate">My Portfolio</span>
            </button>
          ) : (
            activeWindows.map((window) => (
              <button 
                key={window.id}
                className={`h-[22px] px-3 flex items-center gap-2 text-white text-[11px] min-w-[120px] max-w-[180px] shrink-0 ${
                  window.isMinimized ? 'opacity-70' : ''
                }`}
                style={{
                  background: window.isMinimized 
                    ? 'linear-gradient(180deg, rgb(80, 130, 170) 0%, rgb(60, 110, 160) 50%, rgb(50, 90, 140) 100%)'
                    : 'linear-gradient(180deg, rgb(60, 127, 177) 0%, rgb(34, 99, 170) 8%, rgb(31, 85, 153) 40%, rgb(27, 65, 137) 88%, rgb(34, 73, 138) 93%, rgb(40, 90, 165) 95%, rgb(49, 112, 192) 100%)',
                  boxShadow: 'rgb(0 0 0 / 30%) -1px 0px inset, rgb(255 255 255 / 20%) 1px 1px 1px inset',
                  borderRadius: '2px',
                }}
                onClick={() => {
                  playSound?.('click');
                  onWindowClick?.(window.id);
                }}
              >
                <img src={window.icon} alt={window.title} className="w-4 h-4" />
                <span className="truncate">{window.title}</span>
              </button>
            ))
          )}
        </div>

        {/* System Tray - Authentic XP Style */}
        <div 
          className="flex items-center gap-2 px-3 h-full shrink-0"
          style={{
            background: 'linear-gradient(180deg, rgb(12, 89, 185) 1%, rgb(19, 158, 233) 6%, rgb(24, 181, 242) 10%, rgb(19, 155, 235) 14%, rgb(18, 144, 232) 19%, rgb(13, 141, 234) 63%, rgb(13, 159, 241) 81%, rgb(15, 158, 237) 88%, rgb(17, 155, 233) 91%, rgb(19, 146, 226) 94%, rgb(19, 126, 215) 97%, rgb(9, 91, 201) 100%)',
            borderLeft: '1px solid rgb(16, 66, 175)',
            boxShadow: 'rgb(24 187 255) 1px 0px 1px inset',
          }}
        >
          {/* Mute button */}
          <button
            onClick={onToggleMute}
            className="hover:bg-white/10 p-1 rounded transition-colors"
            title={isMuted ? "Unmute sounds" : "Mute sounds"}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-slate-50" />
            ) : (
              <Volume2 className="w-4 h-4 text-slate-50" />
            )}
          </button>
          <button
            onClick={toggleTheme}
            className="hover:bg-white/10 p-1 rounded transition-colors"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-yellow-300" />
            ) : (
              <Moon className="w-4 h-4 text-slate-50" />
            )}
          </button>
          <span className="text-slate-50 text-[11px] px-1">
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
        onLogOff={() => {
          onLogOff?.();
          handleCloseStartMenu();
        }}
      />
    </>
  );
};

export default XPTaskbar;
