import { ReactNode, useState, useRef, useCallback, useEffect } from 'react';
import { XPSystemMenu } from './XPSystemMenu';

const TASKBAR_HEIGHT = 30;
const MIN_WIDTH = 320;
const MIN_HEIGHT = 200;

interface XPWindowProps {
  id?: string;
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
  draggable?: boolean;
  isActive?: boolean;
  onPositionChange?: (pos: { x: number; y: number }) => void;
  onSizeChange?: (size: { width: number; height: number }) => void;
}

type ResizeDir = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

const XPWindow = ({
  id,
  title,
  icon,
  children,
  className = '',
  onMinimize,
  onMaximize,
  onClose,
  isMaximized: controlledMaximized,
  zIndex = 1,
  onFocus,
  draggable = true,
  isActive = true,
  onPositionChange,
  onSizeChange,
}: XPWindowProps) => {
  const [internalMaximized, setInternalMaximized] = useState(false);
  const isMaximized = controlledMaximized !== undefined ? controlledMaximized : internalMaximized;

  // System Menu state
  const [systemMenuPos, setSystemMenuPos] = useState<{ x: number; y: number } | null>(null);

  // Drag state
  const isDragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  // Resize state
  const isResizing = useRef(false);
  const resizeDir = useRef<ResizeDir | null>(null);
  const resizeStart = useRef({ mouseX: 0, mouseY: 0, x: 0, y: 0, w: 0, h: 0 });

  const handleMaximize = () => {
    if (onMaximize) {
      onMaximize();
    } else {
      setInternalMaximized(!internalMaximized);
    }
  };

  // Double click title bar to toggle maximize
  const handleTitleDoubleClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button, .xp-caption-btn, .sys-icon')) return;
    e.stopPropagation();
    handleMaximize();
  };

  // Alt + Space to open system menu
  useEffect(() => {
    if (!isActive) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.code === 'Space') {
        e.preventDefault();
        const rect = windowRef.current?.getBoundingClientRect();
        if (rect) {
          setSystemMenuPos({ x: rect.left + 4, y: rect.top + 30 });
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActive]);

  // Context menu on titlebar
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSystemMenuPos({ x: e.clientX, y: e.clientY });
  };

  // Icon click (single click: open menu, double click: close window)
  const handleIconMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (e.detail >= 2) {
      setSystemMenuPos(null);
      onClose?.();
    } else {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      setSystemMenuPos({ x: rect.left, y: rect.bottom + 2 });
    }
  };

  // --- Drag handlers ---
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!draggable || isMaximized) return;
    if ((e.target as HTMLElement).closest('button, .xp-caption-btn, .sys-icon')) return;
    e.preventDefault();
    isDragging.current = true;
    const parentRect = windowRef.current?.getBoundingClientRect();
    if (parentRect) {
      dragOffset.current = {
        x: e.clientX - parentRect.left,
        y: e.clientY - parentRect.top,
      };
    }
    onFocus?.();
  }, [draggable, isMaximized, onFocus]);

  // --- Resize handlers ---
  const handleResizeMouseDown = useCallback((dir: ResizeDir) => (e: React.MouseEvent) => {
    if (isMaximized) return;
    e.preventDefault();
    e.stopPropagation();
    isResizing.current = true;
    resizeDir.current = dir;
    const rect = windowRef.current?.parentElement?.getBoundingClientRect();
    if (rect) {
      resizeStart.current = {
        mouseX: e.clientX,
        mouseY: e.clientY,
        x: rect.left,
        y: rect.top,
        w: rect.width,
        h: rect.height,
      };
    }
    onFocus?.();
  }, [isMaximized, onFocus]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging.current && onPositionChange) {
        e.preventDefault();
        const viewW = window.innerWidth;
        const viewH = window.innerHeight - TASKBAR_HEIGHT;
        const rect = windowRef.current?.parentElement?.getBoundingClientRect();
        const winW = rect?.width || 400;
        const winH = rect?.height || 300;
        // Clamp within viewport
        const newX = Math.max(0, Math.min(e.clientX - dragOffset.current.x, viewW - winW));
        const newY = Math.max(0, Math.min(e.clientY - dragOffset.current.y, viewH - winH));
        onPositionChange({ x: newX, y: newY });
        return;
      }

      if (isResizing.current && resizeDir.current) {
        e.preventDefault();
        const dir = resizeDir.current;
        const start = resizeStart.current;
        const dx = e.clientX - start.mouseX;
        const dy = e.clientY - start.mouseY;
        const viewW = window.innerWidth;
        const viewH = window.innerHeight - TASKBAR_HEIGHT;

        let newX = start.x;
        let newY = start.y;
        let newW = start.w;
        let newH = start.h;

        if (dir.includes('e')) {
          newW = Math.max(MIN_WIDTH, Math.min(start.w + dx, viewW - start.x));
        }
        if (dir.includes('w')) {
          const maxDx = start.w - MIN_WIDTH;
          const clampedDx = Math.max(-start.x, Math.min(dx, maxDx));
          newX = start.x + clampedDx;
          newW = start.w - clampedDx;
        }
        if (dir.includes('s')) {
          newH = Math.max(MIN_HEIGHT, Math.min(start.h + dy, viewH - start.y));
        }
        if (dir.includes('n')) {
          const maxDy = start.h - MIN_HEIGHT;
          const clampedDy = Math.max(-start.y, Math.min(dy, maxDy));
          newY = start.y + clampedDy;
          newH = start.h - clampedDy;
        }

        onPositionChange?.({ x: newX, y: newY });
        onSizeChange?.({ width: newW, height: newH });
      }
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      isResizing.current = false;
      resizeDir.current = null;
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [onPositionChange, onSizeChange]);

  // Resize handle CSS
  const resizeHandleBase = 'absolute z-10';
  const resizeHandles: { dir: ResizeDir; className: string; cursor: string }[] = [
    { dir: 'n', className: `${resizeHandleBase} top-0 left-1 right-1 h-[4px]`, cursor: 'ns-resize' },
    { dir: 's', className: `${resizeHandleBase} bottom-0 left-1 right-1 h-[4px]`, cursor: 'ns-resize' },
    { dir: 'e', className: `${resizeHandleBase} top-1 right-0 bottom-1 w-[4px]`, cursor: 'ew-resize' },
    { dir: 'w', className: `${resizeHandleBase} top-1 left-0 bottom-1 w-[4px]`, cursor: 'ew-resize' },
    { dir: 'ne', className: `${resizeHandleBase} top-0 right-0 w-[8px] h-[8px]`, cursor: 'nesw-resize' },
    { dir: 'nw', className: `${resizeHandleBase} top-0 left-0 w-[8px] h-[8px]`, cursor: 'nwse-resize' },
    { dir: 'se', className: `${resizeHandleBase} bottom-0 right-0 w-[8px] h-[8px]`, cursor: 'nwse-resize' },
    { dir: 'sw', className: `${resizeHandleBase} bottom-0 left-0 w-[8px] h-[8px]`, cursor: 'nesw-resize' },
  ];

  return (
    <>
      <div
        ref={windowRef}
        data-win-id={id}
        className={`flex flex-col w-full h-full overflow-hidden ${
          isMaximized ? '' : 'xp-window-frame'
        } ${!isActive ? 'inactive' : ''} ${className}`}
        style={{
          width: '100%',
          height: '100%',
          zIndex,
          borderRadius: isMaximized ? '0' : '8px 8px 0 0',
        }}
        onMouseDown={onFocus}
      >
        {/* Resize handles - only show when not maximized */}
        {!isMaximized && resizeHandles.map(h => (
          <div
            key={h.dir}
            className={h.className}
            style={{ cursor: h.cursor }}
            onMouseDown={handleResizeMouseDown(h.dir)}
          />
        ))}

        {/* Title Bar - Authentic Luna XP styling with drag, double-click & context menu */}
        <div
          className={`h-[30px] flex items-center justify-between px-1.5 select-none shrink-0 ${
            isActive ? 'xp-title-bar' : 'xp-title-bar-inactive'
          }`}
          onMouseDown={handleMouseDown}
          onDoubleClick={handleTitleDoubleClick}
          onContextMenu={handleContextMenu}
          style={{ cursor: 'default' }}
        >
          <div className="flex items-center gap-1.5 ml-1 overflow-hidden pointer-events-auto">
            {icon && (
              <div
                className="w-4 h-4 flex items-center justify-center shrink-0 cursor-pointer sys-icon"
                onMouseDown={handleIconMouseDown}
                title="System Menu (Double click to close)"
              >
                {icon}
              </div>
            )}
            <span className="font-['Trebuchet_MS',Tahoma,sans-serif] font-bold text-[13px] text-white leading-tight line-clamp-1 whitespace-nowrap drop-shadow-[1px_1px_1px_rgba(15,16,137,0.8)] pointer-events-none">
              {title}
            </span>
          </div>
          <div className="flex items-center mr-1 shrink-0">
            <button
              className="xp-caption-btn xp-caption-min"
              onClick={(e) => {
                e.stopPropagation();
                onMinimize?.();
              }}
              onMouseDown={(e) => e.stopPropagation()}
              title="Minimize"
              aria-label="Minimize"
            />
            <button
              className={`xp-caption-btn ${isMaximized ? 'xp-caption-restore' : 'xp-caption-max'}`}
              onClick={(e) => {
                e.stopPropagation();
                handleMaximize();
              }}
              onMouseDown={(e) => e.stopPropagation()}
              title={isMaximized ? "Restore" : "Maximize"}
              aria-label={isMaximized ? "Restore" : "Maximize"}
            />
            <button
              className="xp-caption-btn xp-caption-close"
              onClick={(e) => {
                e.stopPropagation();
                onClose?.();
              }}
              onMouseDown={(e) => e.stopPropagation()}
              title="Close"
              aria-label="Close"
            />
          </div>
        </div>

        {/* Content - XP Yellow/Cream background */}
        <div
          className="flex-1 flex flex-col overflow-hidden bg-[#ece9d8] dark:bg-gray-900 border-l-[3px] border-r-[3px] border-b-[3px]"
          style={{ borderColor: isActive ? '#0055ea' : '#7a96df' }}
        >
          {children}
        </div>
      </div>

      {/* System Context Menu */}
      {systemMenuPos && (
        <XPSystemMenu
          x={systemMenuPos.x}
          y={systemMenuPos.y}
          isMaximized={!!isMaximized}
          onRestore={() => handleMaximize()}
          onMinimize={() => onMinimize?.()}
          onMaximize={() => handleMaximize()}
          onClose={() => onClose?.()}
          onDismiss={() => setSystemMenuPos(null)}
        />
      )}
    </>
  );
};

export { XPWindow };
export type { XPWindowProps };
export default XPWindow;
