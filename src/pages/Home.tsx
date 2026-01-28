import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import MyComputerIcon from "@/assets/xp/icons/my_computer.png";
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
  title: string;
  icon: string;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
}

const Home = ({ isDark, toggleTheme }: HomeProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { playSound, toggleMute } = useXPSound();

  // Window management state
  const [windows, setWindows] = useState<WindowState[]>([
    { id: 'my-computer', title: 'My Portfolio', icon: MyComputerIcon, isMinimized: false, isMaximized: false, zIndex: 100 }
  ]);

  // Modal windows state
  const [showWordDoc, setShowWordDoc] = useState(false);
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [showBrowser, setShowBrowser] = useState(false);
  const [browserUrl, setBrowserUrl] = useState("");
  const [isMuted, setIsMuted] = useState(false);

  // Track page view
  useAnalytics();

  // Play startup sound on mount (only once)
  useEffect(() => {
    if (isMobile) return; // Don't play on mobile

    const hasPlayedStartup = sessionStorage.getItem('xp-startup-played');
    if (!hasPlayedStartup) {
      // Small delay to ensure audio context is ready
      const timer = setTimeout(() => {
        playSound('startup');
        sessionStorage.setItem('xp-startup-played', 'true');
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [playSound, isMobile]);

  // Window management functions - all useCallback hooks must be called before any return
  const getMaxZIndex = useCallback((windowsArray: WindowState[]) => {
    return windowsArray.length > 0 ? Math.max(...windowsArray.map(pw => pw.zIndex)) : 99;
  }, []);

  const openWindow = useCallback((id: string, title: string, icon: string) => {
    setWindows(prev => {
      const existing = prev.find(w => w.id === id);
      if (existing) {
        // If exists but minimized, restore it
        if (existing.isMinimized) {
          playSound('restore');
          return prev.map(w =>
            w.id === id
              ? { ...w, isMinimized: false, zIndex: getMaxZIndex(prev) + 1 }
              : w
          );
        }
        // Just focus it
        return prev.map(w =>
          w.id === id
            ? { ...w, zIndex: getMaxZIndex(prev) + 1 }
            : w
        );
      }
      // Create new window
      playSound('restore');
      return [...prev, {
        id,
        title,
        icon,
        isMinimized: false,
        isMaximized: false,
        zIndex: getMaxZIndex(prev) + 1
      }];
    });
  }, [playSound, getMaxZIndex]);

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

  const restoreWindow = useCallback((id: string) => {
    playSound('restore');
    setWindows(prev => prev.map(w =>
      w.id === id
        ? { ...w, isMinimized: false, zIndex: getMaxZIndex(prev) + 1 }
        : w
    ));
  }, [playSound, getMaxZIndex]);

  const maximizeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w =>
      w.id === id ? { ...w, isMaximized: !w.isMaximized } : w
    ));
  }, []);

  const focusWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w =>
      w.id === id
        ? { ...w, zIndex: getMaxZIndex(prev) + 1 }
        : w
    ));
  }, [getMaxZIndex]);

  const handleWindowClick = useCallback((id: string) => {
    setWindows(prev => {
      const window = prev.find(w => w.id === id);
      if (window?.isMinimized) {
        playSound('restore');
        return prev.map(w =>
          w.id === id
            ? { ...w, isMinimized: false, zIndex: getMaxZIndex(prev) + 1 }
            : w
        );
      } else {
        return prev.map(w =>
          w.id === id
            ? { ...w, zIndex: getMaxZIndex(prev) + 1 }
            : w
        );
      }
    });
  }, [playSound, getMaxZIndex]);

  const openBrowser = useCallback((url: string) => {
    playSound('click');
    setBrowserUrl(url);
    setShowBrowser(true);
  }, [playSound]);

  const handleOpenMyComputer = useCallback(() => {
    openWindow('my-computer', 'My Portfolio', MyComputerIcon);
  }, [openWindow]);

  const handleToggleMute = useCallback(() => {
    const newMuted = toggleMute();
    setIsMuted(newMuted);
  }, [toggleMute]);

  const handleLogOff = useCallback(() => {
    playSound('logoff');
    // Reset all state - close modal windows and reset to just My Computer
    setShowWordDoc(false);
    setShowPdfViewer(false);
    setShowBrowser(false);
    setWindows([{ id: 'my-computer', title: 'My Portfolio', icon: MyComputerIcon, isMinimized: false, isMaximized: false, zIndex: 100 }]);
  }, [playSound]);

  const handleOpenWordDoc = useCallback(() => {
    playSound('click');
    setShowWordDoc(true);
  }, [playSound]);

  const handleOpenPdfViewer = useCallback(() => {
    playSound('click');
    setShowPdfViewer(true);
  }, [playSound]);

  const handleCloseWordDoc = useCallback(() => {
    playSound('close');
    setShowWordDoc(false);
  }, [playSound]);

  const handleClosePdfViewer = useCallback(() => {
    playSound('close');
    setShowPdfViewer(false);
  }, [playSound]);

  const handleCloseBrowser = useCallback(() => {
    playSound('close');
    setShowBrowser(false);
  }, [playSound]);

  // Render Windows Phone UI on mobile - this must come after all hooks
  if (isMobile) {
    return <WPHome isDark={isDark} toggleTheme={toggleTheme} />;
  }

  // Get window state for My Computer
  const myComputerWindow = windows.find(w => w.id === 'my-computer');

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

      {/* My Computer Window */}
      {myComputerWindow && !myComputerWindow.isMinimized && (
        <div
          className={`fixed flex flex-col transition-all duration-200 ${myComputerWindow.isMaximized
            ? 'inset-2 bottom-[34px]'
            : 'top-[3%] left-1/2 -translate-x-1/2 w-[95vw] h-[85vh] max-w-[1200px]'
            }`}
          style={{ zIndex: myComputerWindow.zIndex }}
        >
          <XPMyComputerWindow
            isDark={isDark}
            onMinimize={() => minimizeWindow('my-computer')}
            onMaximize={() => maximizeWindow('my-computer')}
            onClose={() => closeWindow('my-computer')}
            onOpenWordDoc={handleOpenWordDoc}
            onOpenPdfViewer={handleOpenPdfViewer}
            onOpenBrowser={openBrowser}
            zIndex={myComputerWindow.zIndex}
            onFocus={() => focusWindow('my-computer')}
          />
        </div>
      )}

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

      {/* Browser Window */}
      {showBrowser && (
        <XPBrowser
          initialUrl={browserUrl}
          onClose={handleCloseBrowser}
        />
      )}

      {/* Word Document Viewer */}
      {showWordDoc && (
        <XPWordDocument onClose={handleCloseWordDoc} />
      )}

      {/* PDF Viewer */}
      {showPdfViewer && (
        <XPPdfViewer
          onClose={handleClosePdfViewer}
          onDownload={() => {
            // Trigger resume download
            const link = document.createElement('a');
            link.href = '/resume.pdf';
            link.download = 'Suhas_Nidgundi_Resume.pdf';
            link.click();
          }}
        />
      )}
    </div>
  );
};

export default Home;
