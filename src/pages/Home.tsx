import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import MyComputerIcon from "@/assets/xp/icons/my_computer.png";
import InternetExplorerIcon from "@/assets/xp/icons/internet_explorer_icon.png";
import WordIcon from "@/assets/xp/icons/ms_word_logo_icon.png";
import PdfIcon from "@/assets/xp/icons/notepad_icon.png";
import { useIsMobile } from "@/hooks/use-mobile";
import useAnalytics from "@/hooks/useAnalytics";
import useXPSound from "@/hooks/useXPSound";
import XPTaskbar from "@/components/xp/XPTaskbar";
import XPBrowser from "@/components/xp/XPBrowser";
import XPWordDocument from "@/components/xp/XPWordDocument";
import XPPdfViewer from "@/components/xp/XPPdfViewer";
import XPDesktop from "@/components/xp/XPDesktop";
import XPMyComputerWindow from "@/components/xp/XPMyComputerWindow";
import WPHome from "./WPHome";

interface HomeProps {
  isDark: boolean;
  toggleTheme: () => void;
}

interface WindowState {
  id: string;
  type: 'my-computer' | 'browser' | 'word-doc' | 'pdf-viewer';
  title: string;
  icon: string;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  // Per-window pixel position (win32.run pattern)
  position: { x: number; y: number };
  size: { width: number; height: number };
  // Saved rect for maximize/restore
  savedRect?: { x: number; y: number; width: number; height: number };
  data?: Record<string, string>;
}

// Taskbar height constant
const TASKBAR_HEIGHT = 30;
// Auto-nudge offset for cascading windows
const NUDGE_OFFSET = 30;

/** Calculate a centered default position for a window of given size */
function getDefaultPosition(width: number, height: number): { x: number; y: number } {
  const viewW = window.innerWidth;
  const viewH = window.innerHeight - TASKBAR_HEIGHT;
  return {
    x: Math.max(0, Math.round((viewW - width) / 2)),
    y: Math.max(0, Math.round((viewH - height) / 2)),
  };
}

/** Default sizes per window type */
function getDefaultSize(type: WindowState['type']): { width: number; height: number } {
  const viewW = window.innerWidth;
  const viewH = window.innerHeight - TASKBAR_HEIGHT;
  switch (type) {
    case 'my-computer':
      return { width: Math.min(1200, viewW * 0.92), height: Math.min(viewH * 0.88, viewH - 20) };
    case 'browser':
      return { width: Math.min(1200, viewW * 0.88), height: Math.min(viewH * 0.88, viewH - 20) };
    case 'word-doc':
      return { width: Math.min(1200, viewW * 0.92), height: Math.min(viewH * 0.94, viewH - 10) };
    case 'pdf-viewer':
      return { width: Math.min(1000, viewW * 0.85), height: Math.min(viewH * 0.88, viewH - 20) };
    default:
      return { width: Math.min(1000, viewW * 0.85), height: viewH * 0.8 };
  }
}

const Home = ({ isDark, toggleTheme }: HomeProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { playSound, toggleMute } = useXPSound();
  const globalZIndex = useRef(100);

  const getNextZIndex = useCallback(() => {
    globalZIndex.current += 1;
    return globalZIndex.current;
  }, []);

  // Create initial "My Computer" window with calculated position
  const createInitialWindow = useCallback((): WindowState => {
    const size = getDefaultSize('my-computer');
    const position = getDefaultPosition(size.width, size.height);
    return {
      id: 'my-computer',
      type: 'my-computer',
      title: 'My Portfolio',
      icon: MyComputerIcon,
      isMinimized: false,
      isMaximized: false,
      zIndex: 100,
      position,
      size,
    };
  }, []);

  const [windows, setWindows] = useState<WindowState[]>(() => [createInitialWindow()]);
  const [isMuted, setIsMuted] = useState(false);

  // Track page view
  useAnalytics();

  // Play startup sound on mount (only once)
  useEffect(() => {
    if (isMobile) return;
    const hasPlayedStartup = sessionStorage.getItem('xp-startup-played');
    if (!hasPlayedStartup) {
      const timer = setTimeout(() => {
        playSound('startup');
        sessionStorage.setItem('xp-startup-played', 'true');
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [playSound, isMobile]);

  // Auto-nudge: find an offset so the new window doesn't overlap existing ones
  const calcNudgedPosition = useCallback((basePos: { x: number; y: number }, size: { width: number; height: number }, existingWindows: WindowState[]): { x: number; y: number } => {
    let pos = { ...basePos };
    const viewW = window.innerWidth;
    const viewH = window.innerHeight - TASKBAR_HEIGHT;

    for (let i = 0; i < 10; i++) {
      const overlaps = existingWindows.some(w =>
        !w.isMinimized && Math.abs(w.position.x - pos.x) < 20 && Math.abs(w.position.y - pos.y) < 20
      );
      if (!overlaps) break;
      pos = {
        x: Math.min(pos.x + NUDGE_OFFSET, viewW - size.width),
        y: Math.min(pos.y + NUDGE_OFFSET, viewH - size.height),
      };
    }
    return pos;
  }, []);

  // Window management functions
  const openWindow = useCallback((id: string, type: WindowState['type'], title: string, icon: string, data?: Record<string, string>) => {
    setWindows(prev => {
      const existing = prev.find(w => w.id === id);
      if (existing) {
        const newZ = getNextZIndex();
        if (existing.isMinimized) {
          playSound('restore');
          return prev.map(w =>
            w.id === id ? { ...w, isMinimized: false, zIndex: newZ } : w
          );
        }
        return prev.map(w =>
          w.id === id ? { ...w, zIndex: newZ } : w
        );
      }
      // Create new window with auto-nudge
      playSound('restore');
      const size = getDefaultSize(type);
      const basePos = getDefaultPosition(size.width, size.height);
      const position = calcNudgedPosition(basePos, size, prev);
      const newZ = getNextZIndex();
      return [...prev, { id, type, title, icon, isMinimized: false, isMaximized: false, zIndex: newZ, position, size, data }];
    });
  }, [playSound, getNextZIndex, calcNudgedPosition]);

  const closeWindow = useCallback((id: string) => {
    playSound('close');
    setWindows(prev => prev.filter(w => w.id !== id));
  }, [playSound]);

  const minimizeWindow = useCallback((id: string) => {
    playSound('minimize');
    setWindows(prev => prev.map(w =>
      w.id === id ? { ...w, isMinimized: true } : w
    ));
  }, [playSound]);

  const maximizeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => {
      if (w.id !== id) return w;
      if (w.isMaximized) {
        // Restore from saved rect
        return {
          ...w,
          isMaximized: false,
          position: w.savedRect ? { x: w.savedRect.x, y: w.savedRect.y } : w.position,
          size: w.savedRect ? { width: w.savedRect.width, height: w.savedRect.height } : w.size,
          savedRect: undefined,
        };
      } else {
        // Save current rect and maximize
        return {
          ...w,
          isMaximized: true,
          savedRect: { x: w.position.x, y: w.position.y, width: w.size.width, height: w.size.height },
        };
      }
    }));
  }, []);

  const focusWindow = useCallback((id: string) => {
    const newZ = getNextZIndex();
    setWindows(prev => prev.map(w =>
      w.id === id ? { ...w, zIndex: newZ } : w
    ));
  }, [getNextZIndex]);

  const updateWindowPosition = useCallback((id: string, position: { x: number; y: number }) => {
    setWindows(prev => prev.map(w =>
      w.id === id ? { ...w, position } : w
    ));
  }, []);

  const updateWindowSize = useCallback((id: string, size: { width: number; height: number }) => {
    setWindows(prev => prev.map(w =>
      w.id === id ? { ...w, size } : w
    ));
  }, []);

  const handleWindowClick = useCallback((id: string) => {
    setWindows(prev => {
      const win = prev.find(w => w.id === id);
      const newZ = getNextZIndex();
      if (win?.isMinimized) {
        playSound('restore');
        return prev.map(w =>
          w.id === id ? { ...w, isMinimized: false, zIndex: newZ } : w
        );
      }
      return prev.map(w =>
        w.id === id ? { ...w, zIndex: newZ } : w
      );
    });
  }, [playSound, getNextZIndex]);

  // Unified open handlers
  const openBrowser = useCallback((url: string) => {
    playSound('click');
    const browserId = 'browser';
    setWindows(prev => {
      const existing = prev.find(w => w.id === browserId);
      const newZ = getNextZIndex();
      if (existing) {
        return prev.map(w =>
          w.id === browserId ? { ...w, isMinimized: false, zIndex: newZ, data: { url } } : w
        );
      }
      const size = getDefaultSize('browser');
      const basePos = getDefaultPosition(size.width, size.height);
      const position = calcNudgedPosition(basePos, size, prev);
      return [...prev, {
        id: browserId,
        type: 'browser' as const,
        title: 'Internet Explorer',
        icon: InternetExplorerIcon,
        isMinimized: false,
        isMaximized: false,
        zIndex: newZ,
        position,
        size,
        data: { url },
      }];
    });
  }, [playSound, getNextZIndex, calcNudgedPosition]);

  const handleOpenMyComputer = useCallback(() => {
    openWindow('my-computer', 'my-computer', 'My Portfolio', MyComputerIcon);
  }, [openWindow]);

  const handleOpenWordDoc = useCallback(() => {
    playSound('click');
    openWindow('word-doc', 'word-doc', 'About Me - Microsoft Word', WordIcon);
  }, [openWindow, playSound]);

  const handleOpenPdfViewer = useCallback(() => {
    playSound('click');
    openWindow('pdf-viewer', 'pdf-viewer', 'Resume.pdf - Adobe Reader', PdfIcon);
  }, [openWindow, playSound]);

  const handleToggleMute = useCallback(() => {
    const newMuted = toggleMute();
    setIsMuted(newMuted);
  }, [toggleMute]);

  const handleLogOff = useCallback(() => {
    playSound('logoff');
    setWindows([createInitialWindow()]);
    globalZIndex.current = 100;
  }, [playSound, createInitialWindow]);

  // Render Windows Phone UI on mobile
  if (isMobile) {
    return <WPHome isDark={isDark} toggleTheme={toggleTheme} />;
  }

  // Get the highest z-index for active window detection
  const maxZIndex = Math.max(...windows.map(w => w.zIndex));

  // Render all windows from the unified state
  const renderWindow = (win: WindowState) => {
    if (win.isMinimized) return null;

    const isActive = win.zIndex === maxZIndex;

    // Position and size: either maximized (fill viewport) or use per-window coords
    const windowStyle: React.CSSProperties = win.isMaximized
      ? {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: TASKBAR_HEIGHT,
        zIndex: win.zIndex,
      }
      : {
        position: 'fixed',
        top: win.position.y,
        left: win.position.x,
        width: win.size.width,
        height: win.size.height,
        zIndex: win.zIndex,
      };

    const commonProps = {
      onMinimize: () => minimizeWindow(win.id),
      onMaximize: () => maximizeWindow(win.id),
      onClose: () => closeWindow(win.id),
      onFocus: () => focusWindow(win.id),
      onPositionChange: (pos: { x: number; y: number }) => updateWindowPosition(win.id, pos),
      onSizeChange: (size: { width: number; height: number }) => updateWindowSize(win.id, size),
      zIndex: win.zIndex,
      isMaximized: win.isMaximized,
      isActive,
    };

    switch (win.type) {
      case 'my-computer':
        return (
          <div key={win.id} className="flex flex-col" style={windowStyle}>
            <XPMyComputerWindow
              isDark={isDark}
              onMinimize={commonProps.onMinimize}
              onMaximize={commonProps.onMaximize}
              onClose={commonProps.onClose}
              onOpenWordDoc={handleOpenWordDoc}
              onOpenPdfViewer={handleOpenPdfViewer}
              onOpenBrowser={openBrowser}
              zIndex={win.zIndex}
              onFocus={commonProps.onFocus}
              isMaximized={win.isMaximized}
              isActive={isActive}
              onPositionChange={commonProps.onPositionChange}
              onSizeChange={commonProps.onSizeChange}
            />
          </div>
        );

      case 'browser':
        return (
          <div key={win.id} className="flex flex-col" style={windowStyle}>
            <XPBrowser
              initialUrl={win.data?.url || 'https://www.bing.com/'}
              onClose={commonProps.onClose}
              onMinimize={commonProps.onMinimize}
              onMaximize={commonProps.onMaximize}
              onFocus={commonProps.onFocus}
              zIndex={win.zIndex}
              isMaximized={win.isMaximized}
              isActive={isActive}
              onPositionChange={commonProps.onPositionChange}
              onSizeChange={commonProps.onSizeChange}
            />
          </div>
        );

      case 'word-doc':
        return (
          <div key={win.id} className="flex flex-col" style={windowStyle}>
            <XPWordDocument
              onClose={commonProps.onClose}
              onMinimize={commonProps.onMinimize}
              onMaximize={commonProps.onMaximize}
              onFocus={commonProps.onFocus}
              zIndex={win.zIndex}
              isMaximized={win.isMaximized}
              isActive={isActive}
              onPositionChange={commonProps.onPositionChange}
              onSizeChange={commonProps.onSizeChange}
            />
          </div>
        );

      case 'pdf-viewer':
        return (
          <div key={win.id} className="flex flex-col" style={windowStyle}>
            <XPPdfViewer
              onClose={commonProps.onClose}
              onDownload={() => {
                const link = document.createElement('a');
                link.href = '/resume.pdf';
                link.download = 'Suhas_Nidgundi_Resume.pdf';
                link.click();
              }}
              onMinimize={commonProps.onMinimize}
              onMaximize={commonProps.onMaximize}
              onFocus={commonProps.onFocus}
              zIndex={win.zIndex}
              isMaximized={win.isMaximized}
              isActive={isActive}
              onPositionChange={commonProps.onPositionChange}
              onSizeChange={commonProps.onSizeChange}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden relative">
      {/* Desktop Background with Icons */}
      <XPDesktop
        onOpenMyComputer={handleOpenMyComputer}
        onOpenBrowser={openBrowser}
        onNavigateToProjects={() => navigate('/projects')}
        onNavigateToExperience={() => navigate('/experience')}
        isDark={isDark}
      />

      {/* All Windows rendered from unified state */}
      {windows.map(win => renderWindow(win))}

      {/* Taskbar - Sticky at Bottom */}
      <XPTaskbar
        isDark={isDark}
        toggleTheme={toggleTheme}
        activeWindows={windows.map(w => ({
          id: w.id,
          title: w.title,
          icon: w.icon,
          isMinimized: w.isMinimized
        }))}
        onWindowClick={handleWindowClick}
        onOpenMyComputer={handleOpenMyComputer}
        onOpenWordDoc={handleOpenWordDoc}
        onOpenBrowser={openBrowser}
        onLogOff={handleLogOff}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        playSound={playSound}
      />
    </div>
  );
};

export default Home;
