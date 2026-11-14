import React, { createContext, useContext, useState, useCallback, useRef, useEffect, ReactNode } from 'react';
import useXPSound from '@/hooks/useXPSound';
import MyComputerIcon from '@/assets/xp/icons/my_computer.png';
import InternetExplorerIcon from '@/assets/xp/icons/internet_explorer_icon.png';
import WordIcon from '@/assets/xp/icons/ms_word_logo_icon.png';
import PdfIcon from '@/assets/xp/icons/notepad_icon.png';
import SearchIcon from '@/assets/xp/icons/search_icon.png';

export type WindowAppId =
  | 'my-computer'
  | 'word-doc'
  | 'browser'
  | 'pdf-viewer'
  | 'ai-chat'
  | 'notepad'
  | 'calculator'
  | 'minesweeper'
  | 'guestbook'
  | 'windows-phone';

export interface ManagedWindow {
  id: string;
  appId: WindowAppId;
  title: string;
  icon: string;
  x: number;
  y: number;
  w: number;
  h: number;
  zIndex: number;
  state: 'normal' | 'minimized' | 'maximized';
  restoreState: 'normal' | 'maximized';
  focused: boolean;
  resizable: boolean;
  singleInstance: boolean;
  savedRect?: { x: number; y: number; w: number; h: number };
  data?: Record<string, any>;
}

export interface OpenWindowOptions {
  id?: string;
  appId: WindowAppId;
  title?: string;
  icon?: string;
  data?: Record<string, any>;
  resizable?: boolean;
  singleInstance?: boolean;
  defaultSize?: { w: number; h: number };
}

interface WindowManagerContextType {
  windows: ManagedWindow[];
  activeWindow: ManagedWindow | null;
  openWindow: (opts: OpenWindowOptions) => void;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  unfocusAll: () => void;
  minimizeWindow: (id: string) => void;
  toggleMaximizeWindow: (id: string) => void;
  updateWindowBounds: (id: string, bounds: { x?: number; y?: number; w?: number; h?: number }) => void;
  updateWindowTitle: (id: string, title: string) => void;
  taskbarItemClick: (id: string) => void;
  minimizeAll: () => void;
  undoMinimizeAll: () => void;
  isAllMinimized: boolean;
  arrangeWindows: (mode: 'cascade' | 'tile-horizontal' | 'tile-vertical') => void;
}

const TASKBAR_HEIGHT = 30;
const MIN_WIDTH = 320;
const MIN_HEIGHT = 200;

// Re-index windows so zIndex is strictly 1..N and targetId is on top
function reorderZIndex(windows: ManagedWindow[], targetId?: string): ManagedWindow[] {
  const sorted = [...windows].sort((a, b) => {
    if (a.id === targetId) return 1;
    if (b.id === targetId) return -1;
    return a.zIndex - b.zIndex;
  });
  return windows.map(w => ({
    ...w,
    zIndex: sorted.indexOf(w) + 1,
  }));
}

// Update focused flag to match topmost unminimized window
function updateTopmostFocus(windows: ManagedWindow[]): ManagedWindow[] {
  const topWindow = windows
    .filter(w => w.state !== 'minimized')
    .reduce<ManagedWindow | null>((prev, curr) => (!prev || curr.zIndex > prev.zIndex ? curr : prev), null);

  return windows.map(w => ({
    ...w,
    focused: topWindow ? w.id === topWindow.id : false,
  }));
}

// Winxp.si style flying caption animation when minimizing or restoring
function animateWindowCaption(fromRect: DOMRect, toRect: DOMRect, title: string, icon: string, isFocused: boolean) {
  if (typeof document === 'undefined' || !document.body.animate) return;

  const anim = document.createElement('div');
  anim.className = `xp-title-bar caption-anim ${isFocused ? '' : 'xp-title-bar-inactive'}`;
  anim.style.position = 'fixed';
  anim.style.zIndex = '99999';
  anim.style.pointerEvents = 'none';
  anim.style.overflow = 'hidden';
  anim.style.display = 'flex';
  anim.style.alignItems = 'center';
  anim.style.gap = '6px';
  anim.style.padding = '0 6px';
  anim.style.borderRadius = '6px 6px 0 0';

  const iconEl = document.createElement('img');
  iconEl.src = icon;
  iconEl.style.width = '16px';
  iconEl.style.height = '16px';
  iconEl.style.objectFit = 'contain';

  const textEl = document.createElement('span');
  textEl.textContent = title;
  textEl.style.fontSize = '12px';
  textEl.style.fontWeight = 'bold';
  textEl.style.color = '#fff';
  textEl.style.whiteSpace = 'nowrap';
  textEl.style.overflow = 'hidden';
  textEl.style.textOverflow = 'ellipsis';

  anim.appendChild(iconEl);
  anim.appendChild(textEl);
  document.body.appendChild(anim);

  const start = {
    left: `${fromRect.left}px`,
    top: `${fromRect.top}px`,
    width: `${fromRect.width}px`,
    height: `${Math.min(fromRect.height, 30)}px`,
    opacity: 1,
  };
  const end = {
    left: `${toRect.left}px`,
    top: `${toRect.top}px`,
    width: `${toRect.width}px`,
    height: `${Math.min(toRect.height, 30)}px`,
    opacity: 0.7,
  };

  const player = anim.animate([start, end], {
    duration: 180,
    easing: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
  });

  player.onfinish = () => anim.remove();
  player.oncancel = () => anim.remove();
}

function getDefaultAppMeta(appId: WindowAppId) {
  switch (appId) {
    case 'my-computer':
      return {
        title: 'My Portfolio',
        icon: MyComputerIcon,
        w: 960,
        h: 600,
        resizable: true,
      };
    case 'word-doc':
      return {
        title: 'Suhas_Nidgundi_About_Me.doc - Microsoft Word',
        icon: WordIcon,
        w: 920,
        h: 640,
        resizable: true,
      };
    case 'browser':
      return {
        title: 'Microsoft Internet Explorer',
        icon: InternetExplorerIcon,
        w: 900,
        h: 620,
        resizable: true,
      };
    case 'pdf-viewer':
      return {
        title: 'Suhas_Nidgundi_Resume.pdf - Adobe Reader',
        icon: PdfIcon,
        w: 880,
        h: 620,
        resizable: true,
      };
    case 'ai-chat':
      return {
        title: 'Windows Assistant — Suhas Portfolio AI',
        icon: SearchIcon,
        w: 480,
        h: 580,
        resizable: true,
      };
    case 'notepad':
      return {
        title: 'README.txt - Notepad',
        icon: '/icons/notepad_32.png',
        w: 640,
        h: 480,
        resizable: true,
      };
    case 'calculator':
      return {
        title: 'Calculator',
        icon: '/icons/calculator_32.png',
        w: 280,
        h: 340,
        resizable: false,
      };
    case 'minesweeper':
      return {
        title: 'Minesweeper',
        icon: '/icons/minesweeper_32.png',
        w: 240,
        h: 300,
        resizable: false,
      };
    case 'guestbook':
      return {
        title: 'Guestbook — Suhas Nidgundi Portfolio',
        icon: '/icons/display_properties_32.png',
        w: 740,
        h: 520,
        resizable: true,
      };
    case 'windows-phone':
      return {
        title: 'Windows Phone 8.1 — Lumia Simulator',
        icon: '/icons/display_properties_32.png',
        w: 420,
        h: 740,
        resizable: true,
      };
  }
}

const WindowManagerContext = createContext<WindowManagerContextType | null>(null);

export const WindowManagerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { playSound } = useXPSound();
  const [minimizedHistory, setMinimizedHistory] = useState<string[]>([]);

  // Default initial window
  const [windows, setWindows] = useState<ManagedWindow[]>(() => {
    if (typeof window === 'undefined') return [];
    const meta = getDefaultAppMeta('my-computer');
    const viewW = window.innerWidth;
    const viewH = window.innerHeight - TASKBAR_HEIGHT;
    const w = Math.min(meta.w, viewW * 0.92);
    const h = Math.min(meta.h, viewH * 0.88);
    const x = Math.max(0, Math.round((viewW - w) / 2));
    const y = Math.max(0, Math.round((viewH - h) / 2));

    return [
      {
        id: 'my-computer',
        appId: 'my-computer',
        title: meta.title,
        icon: meta.icon,
        x,
        y,
        w,
        h,
        zIndex: 1,
        state: 'normal',
        restoreState: 'normal',
        focused: true,
        resizable: meta.resizable,
        singleInstance: true,
      },
    ];
  });

  const activeWindow = windows.find(w => w.focused && w.state !== 'minimized') || null;

  // Open or focus an app
  const openWindow = useCallback(
    (opts: OpenWindowOptions) => {
      const appId = opts.appId;
      const id = opts.id || appId;
      const singleInstance = opts.singleInstance ?? true;
      const meta = getDefaultAppMeta(appId);

      setWindows(prev => {
        const existing = prev.find(w => w.id === id || (singleInstance && w.appId === appId));
        if (existing) {
          // If already open, bring to front and unminimize
          const reordered = reorderZIndex(prev, existing.id);
          const wasMinimized = existing.state === 'minimized';
          if (wasMinimized) {
            playSound('restore');
          }
          return reordered.map(w => {
            if (w.id === existing.id) {
              return {
                ...w,
                state: wasMinimized ? w.restoreState : w.state,
                focused: true,
                data: opts.data !== undefined ? { ...w.data, ...opts.data } : w.data,
              };
            }
            return { ...w, focused: false };
          });
        }

        // New window: cascade offset
        playSound('restore');
        const viewW = window.innerWidth;
        const viewH = window.innerHeight - TASKBAR_HEIGHT;
        const targetW = Math.min(opts.defaultSize?.w ?? meta.w, viewW * 0.94);
        const targetH = Math.min(opts.defaultSize?.h ?? meta.h, viewH * 0.92);
        const cascadeOffset = (prev.length % 10) * 26;
        const x = Math.max(0, Math.min(30 + cascadeOffset, viewW - targetW));
        const y = Math.max(0, Math.min(25 + cascadeOffset, viewH - targetH));

        const newWindow: ManagedWindow = {
          id,
          appId,
          title: opts.title ?? meta.title,
          icon: opts.icon ?? meta.icon,
          x,
          y,
          w: targetW,
          h: targetH,
          zIndex: prev.length + 1,
          state: 'normal',
          restoreState: 'normal',
          focused: true,
          resizable: opts.resizable ?? meta.resizable,
          singleInstance,
          data: opts.data,
        };

        const withNew = [...prev.map(w => ({ ...w, focused: false })), newWindow];
        return reorderZIndex(withNew, id);
      });
    },
    [playSound]
  );

  // Focus a window
  const focusWindow = useCallback(
    (id: string) => {
      setWindows(prev => {
        const target = prev.find(w => w.id === id);
        if (!target) return prev;

        const wasMinimized = target.state === 'minimized';
        if (wasMinimized) {
          playSound('restore');
        }

        const reordered = reorderZIndex(prev, id);
        return reordered.map(w => {
          if (w.id === id) {
            return {
              ...w,
              state: wasMinimized ? w.restoreState : w.state,
              focused: true,
            };
          }
          return { ...w, focused: false };
        });
      });
    },
    [playSound]
  );

  // Unfocus all windows (clicking desktop or empty taskbar area)
  const unfocusAll = useCallback(() => {
    setWindows(prev => {
      if (!prev.some(w => w.focused)) return prev;
      return prev.map(w => ({ ...w, focused: false }));
    });
  }, []);

  // Minimize a window with animation
  const minimizeWindow = useCallback(
    (id: string) => {
      playSound('minimize');

      // Trigger fly-to-taskbar animation
      const winEl = document.querySelector(`[data-win-id="${id}"]`);
      const taskEl = document.querySelector(`[data-task-id="${id}"]`);
      const win = windows.find(w => w.id === id);

      if (winEl && taskEl && win) {
        animateWindowCaption(
          winEl.getBoundingClientRect(),
          taskEl.getBoundingClientRect(),
          win.title,
          win.icon,
          win.focused
        );
      }

      setWindows(prev => {
        const updated = prev.map(w => {
          if (w.id === id) {
            return {
              ...w,
              state: 'minimized' as const,
              restoreState: w.state === 'minimized' ? w.restoreState : w.state,
              focused: false,
            };
          }
          return w;
        });
        return updateTopmostFocus(updated);
      });
    },
    [playSound, windows]
  );

  // Toggle maximize / restore
  const toggleMaximizeWindow = useCallback(
    (id: string) => {
      setWindows(prev => {
        const target = prev.find(w => w.id === id);
        if (!target) return prev;

        if (target.state === 'maximized') {
          playSound('restore');
          return prev.map(w => {
            if (w.id !== id) return w;
            return {
              ...w,
              state: 'normal' as const,
              x: w.savedRect?.x ?? w.x,
              y: w.savedRect?.y ?? w.y,
              w: w.savedRect?.w ?? w.w,
              h: w.savedRect?.h ?? w.h,
              savedRect: undefined,
              focused: true,
            };
          });
        } else {
          playSound('restore');
          return prev.map(w => {
            if (w.id !== id) return w;
            return {
              ...w,
              state: 'maximized' as const,
              savedRect: { x: w.x, y: w.y, w: w.w, h: w.h },
              focused: true,
            };
          });
        }
      });
    },
    [playSound]
  );

  // Close a window
  const closeWindow = useCallback(
    (id: string) => {
      playSound('close');
      setWindows(prev => {
        const remaining = prev.filter(w => w.id !== id);
        return updateTopmostFocus(reorderZIndex(remaining));
      });
    },
    [playSound]
  );

  // Update position or size during drag/resize
  const updateWindowBounds = useCallback((id: string, bounds: { x?: number; y?: number; w?: number; h?: number }) => {
    setWindows(prev =>
      prev.map(w => {
        if (w.id !== id) return w;
        return {
          ...w,
          x: bounds.x !== undefined ? bounds.x : w.x,
          y: bounds.y !== undefined ? bounds.y : w.y,
          w: bounds.w !== undefined ? Math.max(MIN_WIDTH, bounds.w) : w.w,
          h: bounds.h !== undefined ? Math.max(MIN_HEIGHT, bounds.h) : w.h,
        };
      })
    );
  }, []);

  // Authentic Windows XP Taskbar click behavior
  const taskbarItemClick = useCallback(
    (id: string) => {
      const win = windows.find(w => w.id === id);
      if (!win) return;

      if (win.focused && win.state !== 'minimized') {
        // If already focused and active: minimize it!
        minimizeWindow(id);
      } else {
        // If minimized or behind other windows: focus and bring to front!
        focusWindow(id);
      }
    },
    [windows, minimizeWindow, focusWindow]
  );

  // "Show Desktop" / Minimize All
  const minimizeAll = useCallback(() => {
    playSound('minimize');
    const openIds = windows.filter(w => w.state !== 'minimized').map(w => w.id);
    setMinimizedHistory(openIds);

    setWindows(prev =>
      prev.map(w => ({
        ...w,
        state: 'minimized',
        restoreState: w.state === 'minimized' ? w.restoreState : w.state,
        focused: false,
      }))
    );
  }, [windows, playSound]);

  // Restore all windows
  const undoMinimizeAll = useCallback(() => {
    playSound('restore');
    setWindows(prev => {
      const restored = prev.map(w => {
        if (minimizedHistory.includes(w.id)) {
          return {
            ...w,
            state: w.restoreState,
          };
        }
        return w;
      });
      return updateTopmostFocus(restored);
    });
    setMinimizedHistory([]);
  }, [minimizedHistory, playSound]);

  const isAllMinimized = windows.length > 0 && windows.every(w => w.state === 'minimized');

  // Cascade or Tile windows
  const arrangeWindows = useCallback((mode: 'cascade' | 'tile-horizontal' | 'tile-vertical') => {
    setWindows(prev => {
      const activeList = prev.filter(w => w.state !== 'minimized');
      if (activeList.length === 0) return prev;

      const viewW = window.innerWidth;
      const viewH = window.innerHeight - TASKBAR_HEIGHT;

      if (mode === 'cascade') {
        const baseW = Math.min(800, viewW * 0.75);
        const baseH = Math.min(520, viewH * 0.75);
        return prev.map(w => {
          const idx = activeList.indexOf(w);
          if (idx === -1) return w;
          const offset = idx * 28;
          return {
            ...w,
            state: 'normal',
            x: Math.min(offset, viewW - baseW),
            y: Math.min(offset, viewH - baseH),
            w: baseW,
            h: baseH,
          };
        });
      }

      if (mode === 'tile-horizontal') {
        const rows = activeList.length;
        const rowH = Math.floor(viewH / rows);
        return prev.map(w => {
          const idx = activeList.indexOf(w);
          if (idx === -1) return w;
          return {
            ...w,
            state: 'normal',
            x: 0,
            y: idx * rowH,
            w: viewW,
            h: rowH,
          };
        });
      }

      if (mode === 'tile-vertical') {
        const cols = activeList.length;
        const colW = Math.floor(viewW / cols);
        return prev.map(w => {
          const idx = activeList.indexOf(w);
          if (idx === -1) return w;
          return {
            ...w,
            state: 'normal',
            x: idx * colW,
            y: 0,
            w: colW,
            h: viewH,
          };
        });
      }

      return prev;
    });
  }, []);

  const updateWindowTitle = useCallback((id: string, title: string) => {
    setWindows(prev => prev.map(w => (w.id === id ? { ...w, title } : w)));
  }, []);

  return (
    <WindowManagerContext.Provider
      value={{
        windows,
        activeWindow,
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
      }}
    >
      {children}
    </WindowManagerContext.Provider>
  );
};

export const useWindowManager = () => {
  const context = useContext(WindowManagerContext);
  if (!context) {
    throw new Error('useWindowManager must be used within a WindowManagerProvider');
  }
  return context;
};
