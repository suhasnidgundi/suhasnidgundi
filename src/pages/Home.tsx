import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import useAnalytics from "@/hooks/useAnalytics";
import useXPSound from "@/hooks/useXPSound";
import XPTaskbar from "@/components/xp/XPTaskbar";
import XPBrowser from "@/components/xp/XPBrowser";
import XPWordDocument from "@/components/xp/XPWordDocument";
import XPPdfViewer from "@/components/xp/XPPdfViewer";
import XPDesktop from "@/components/xp/XPDesktop";
import XPMyComputerWindow from "@/components/xp/XPMyComputerWindow";
import XPAIChatWindow from "@/components/xp/XPAIChatWindow";
import XPNotepad from "@/components/xp/XPNotepad";
import XPCalculator from "@/components/xp/XPCalculator";
import XPMinesweeper from "@/components/xp/XPMinesweeper";
import XPGuestbook from "@/components/xp/XPGuestbook";
import WPHome from "./WPHome";
import {
  WindowManagerProvider,
  useWindowManager,
  ManagedWindow,
} from "@/contexts/WindowManagerContext";

interface HomeProps {
  isDark: boolean;
  toggleTheme: () => void;
}

const TASKBAR_HEIGHT = 30;

const HomeContent: React.FC<HomeProps> = ({ isDark, toggleTheme }) => {
  const navigate = useNavigate();
  const { playSound, toggleMute } = useXPSound();
  const [isMuted, setIsMuted] = useState(false);

  const {
    windows,
    openWindow,
    closeWindow,
    focusWindow,
    unfocusAll,
    minimizeWindow,
    toggleMaximizeWindow,
    updateWindowBounds,
    updateWindowTitle,
    taskbarItemClick,
    minimizeAll,
    undoMinimizeAll,
    isAllMinimized,
    arrangeWindows,
  } = useWindowManager();

  // Track page view
  useAnalytics();

  // Play startup sound on mount (only once)
  useEffect(() => {
    const hasPlayedStartup = sessionStorage.getItem('xp-startup-played');
    if (!hasPlayedStartup) {
      const timer = setTimeout(() => {
        playSound('startup');
        sessionStorage.setItem('xp-startup-played', 'true');
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [playSound]);

  const handleToggleMute = useCallback(() => {
    const newMuted = toggleMute();
    setIsMuted(newMuted);
  }, [toggleMute]);

  const handleLogOff = useCallback(() => {
    playSound('logoff');
    // Minimize or close all windows on logoff
    windows.forEach(w => closeWindow(w.id));
    setTimeout(() => {
      openWindow({ appId: 'my-computer' });
    }, 400);
  }, [playSound, windows, closeWindow, openWindow]);

  // Window openers
  const handleOpenMyComputer = useCallback(() => {
    openWindow({ appId: 'my-computer' });
  }, [openWindow]);

  const handleOpenWordDoc = useCallback(() => {
    openWindow({ appId: 'word-doc' });
  }, [openWindow]);

  const handleOpenPdfViewer = useCallback(() => {
    openWindow({ appId: 'pdf-viewer' });
  }, [openWindow]);

  const handleOpenBrowser = useCallback(
    (url: string) => {
      openWindow({ appId: 'browser', data: { url } });
    },
    [openWindow]
  );

  const handleOpenAIChat = useCallback(() => {
    openWindow({ appId: 'ai-chat' });
  }, [openWindow]);

  const handleOpenNotepad = useCallback(() => {
    openWindow({ appId: 'notepad' });
  }, [openWindow]);

  const handleOpenCalculator = useCallback(() => {
    openWindow({ appId: 'calculator' });
  }, [openWindow]);

  const handleOpenMinesweeper = useCallback(() => {
    openWindow({ appId: 'minesweeper' });
  }, [openWindow]);

  const handleOpenGuestbook = useCallback(() => {
    openWindow({ appId: 'guestbook' });
  }, [openWindow]);

  // Render individual windows according to their appId
  const renderWindow = (win: ManagedWindow) => {
    const isMaximized = win.state === 'maximized';
    const isMinimized = win.state === 'minimized';

    // Style according to normal coordinates or maximized
    const windowStyle: React.CSSProperties = isMaximized
      ? {
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: TASKBAR_HEIGHT,
          zIndex: win.zIndex,
          display: isMinimized ? 'none' : 'flex',
        }
      : {
          position: 'fixed',
          top: `${win.y}px`,
          left: `${win.x}px`,
          width: `${win.w}px`,
          height: `${win.h}px`,
          zIndex: win.zIndex,
          display: isMinimized ? 'none' : 'flex',
        };

    const commonProps = {
      id: win.id,
      isMaximized,
      isActive: win.focused,
      zIndex: win.zIndex,
      onMinimize: () => minimizeWindow(win.id),
      onMaximize: () => toggleMaximizeWindow(win.id),
      onClose: () => closeWindow(win.id),
      onFocus: () => focusWindow(win.id),
      onPositionChange: (pos: { x: number; y: number }) => updateWindowBounds(win.id, pos),
      onSizeChange: (size: { width: number; height: number }) =>
        updateWindowBounds(win.id, { w: size.width, h: size.height }),
    };

    switch (win.appId) {
      case 'my-computer':
        return (
          <div key={win.id} data-win-id={win.id} style={windowStyle}>
            <XPMyComputerWindow
              isDark={isDark}
              currentFolderProp={win.data?.folder}
              onTitleChange={(title) => updateWindowTitle(win.id, title)}
              onMinimize={commonProps.onMinimize}
              onMaximize={commonProps.onMaximize}
              onClose={commonProps.onClose}
              onOpenWordDoc={handleOpenWordDoc}
              onOpenPdfViewer={handleOpenPdfViewer}
              onOpenBrowser={handleOpenBrowser}
              zIndex={win.zIndex}
              onFocus={commonProps.onFocus}
              isMaximized={isMaximized}
              isActive={win.focused}
              onPositionChange={commonProps.onPositionChange}
              onSizeChange={commonProps.onSizeChange}
            />
          </div>
        );

      case 'browser':
        return (
          <div key={win.id} data-win-id={win.id} style={windowStyle}>
            <XPBrowser
              initialUrl={win.data?.url || 'https://www.bing.com/'}
              onClose={commonProps.onClose}
              onMinimize={commonProps.onMinimize}
              onMaximize={commonProps.onMaximize}
              onFocus={commonProps.onFocus}
              zIndex={win.zIndex}
              isMaximized={isMaximized}
              isActive={win.focused}
              onPositionChange={commonProps.onPositionChange}
              onSizeChange={commonProps.onSizeChange}
            />
          </div>
        );

      case 'word-doc':
        return (
          <div key={win.id} data-win-id={win.id} style={windowStyle}>
            <XPWordDocument
              onClose={commonProps.onClose}
              onMinimize={commonProps.onMinimize}
              onMaximize={commonProps.onMaximize}
              onFocus={commonProps.onFocus}
              zIndex={win.zIndex}
              isMaximized={isMaximized}
              isActive={win.focused}
              onPositionChange={commonProps.onPositionChange}
              onSizeChange={commonProps.onSizeChange}
            />
          </div>
        );

      case 'pdf-viewer':
        return (
          <div key={win.id} data-win-id={win.id} style={windowStyle}>
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
              isMaximized={isMaximized}
              isActive={win.focused}
              onPositionChange={commonProps.onPositionChange}
              onSizeChange={commonProps.onSizeChange}
            />
          </div>
        );

      case 'ai-chat':
        return (
          <div key={win.id} data-win-id={win.id} style={windowStyle}>
            <XPAIChatWindow
              onClose={commonProps.onClose}
              onMinimize={commonProps.onMinimize}
              onMaximize={commonProps.onMaximize}
              onFocus={commonProps.onFocus}
              zIndex={win.zIndex}
              isMaximized={isMaximized}
              isActive={win.focused}
            />
          </div>
        );

      case 'notepad':
        return (
          <div key={win.id} data-win-id={win.id} style={windowStyle}>
            <XPNotepad
              onClose={commonProps.onClose}
              onMinimize={commonProps.onMinimize}
              onMaximize={commonProps.onMaximize}
              onFocus={commonProps.onFocus}
              zIndex={win.zIndex}
              isMaximized={isMaximized}
              isActive={win.focused}
              onPositionChange={commonProps.onPositionChange}
              onSizeChange={commonProps.onSizeChange}
            />
          </div>
        );

      case 'calculator':
        return (
          <div key={win.id} data-win-id={win.id} style={windowStyle}>
            <XPCalculator
              onClose={commonProps.onClose}
              onMinimize={commonProps.onMinimize}
              onMaximize={commonProps.onMaximize}
              onFocus={commonProps.onFocus}
              zIndex={win.zIndex}
              isMaximized={isMaximized}
              isActive={win.focused}
              onPositionChange={commonProps.onPositionChange}
              onSizeChange={commonProps.onSizeChange}
            />
          </div>
        );

      case 'minesweeper':
        return (
          <div key={win.id} data-win-id={win.id} style={windowStyle}>
            <XPMinesweeper
              onClose={commonProps.onClose}
              onMinimize={commonProps.onMinimize}
              onMaximize={commonProps.onMaximize}
              onFocus={commonProps.onFocus}
              zIndex={win.zIndex}
              isMaximized={isMaximized}
              isActive={win.focused}
              onPositionChange={commonProps.onPositionChange}
              onSizeChange={commonProps.onSizeChange}
            />
          </div>
        );

      case 'guestbook':
        return (
          <div key={win.id} data-win-id={win.id} style={windowStyle}>
            <XPGuestbook
              onClose={commonProps.onClose}
              onMinimize={commonProps.onMinimize}
              onMaximize={commonProps.onMaximize}
              onFocus={commonProps.onFocus}
              zIndex={win.zIndex}
              isMaximized={isMaximized}
              isActive={win.focused}
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
    <div className="h-screen w-screen flex flex-col overflow-hidden relative select-none">
      {/* Desktop Background with Icons */}
      <XPDesktop
        onOpenMyComputer={handleOpenMyComputer}
        onOpenBrowser={handleOpenBrowser}
        onNavigateToProjects={() => openWindow({ appId: 'my-computer', data: { folder: 'projects' } })}
        onNavigateToExperience={() => openWindow({ appId: 'my-computer', data: { folder: 'experience' } })}
        onOpenAIChat={handleOpenAIChat}
        onOpenWordDoc={handleOpenWordDoc}
        onOpenPdfViewer={handleOpenPdfViewer}
        onOpenNotepad={handleOpenNotepad}
        onOpenCalculator={handleOpenCalculator}
        onOpenMinesweeper={handleOpenMinesweeper}
        onOpenGuestbook={handleOpenGuestbook}
        onUnfocusAll={unfocusAll}
        isDark={isDark}
      />

      {/* All Windows rendered from WindowManager store */}
      {windows.map(win => renderWindow(win))}

      {/* Taskbar - Sticky at Bottom */}
      <XPTaskbar
        isDark={isDark}
        toggleTheme={toggleTheme}
        activeWindows={windows.map(w => ({
          id: w.id,
          title: w.title,
          icon: w.icon,
          isMinimized: w.state === 'minimized',
          isActive: w.focused && w.state !== 'minimized',
        }))}
        onWindowClick={taskbarItemClick}
        onOpenMyComputer={handleOpenMyComputer}
        onOpenFolder={(folder) => openWindow({ appId: 'my-computer', data: { folder } })}
        onOpenWordDoc={handleOpenWordDoc}
        onOpenBrowser={handleOpenBrowser}
        onOpenAIChat={handleOpenAIChat}
        onOpenNotepad={handleOpenNotepad}
        onOpenCalculator={handleOpenCalculator}
        onOpenMinesweeper={handleOpenMinesweeper}
        onOpenGuestbook={handleOpenGuestbook}
        onLogOff={handleLogOff}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        playSound={playSound}
        onMinimizeAll={minimizeAll}
        onUndoMinimizeAll={undoMinimizeAll}
        isAllMinimized={isAllMinimized}
        onArrangeWindows={arrangeWindows}
      />
    </div>
  );
};

const Home: React.FC<HomeProps> = (props) => {
  const isMobile = useIsMobile();
  if (isMobile) {
    return <WPHome isDark={props.isDark} toggleTheme={props.toggleTheme} />;
  }

  return (
    <WindowManagerProvider>
      <HomeContent {...props} />
    </WindowManagerProvider>
  );
};

export default Home;
