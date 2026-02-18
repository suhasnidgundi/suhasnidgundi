import { ReactNode, useState, useRef, useCallback, useEffect } from 'react';
import MinimizeIcon from '@/assets/xp/icons/minimize_icon.png';
import MaximizeIcon from '@/assets/xp/icons/maximize_icon.png';
import ExitIcon from '@/assets/xp/icons/exit_icon.png';

const TASKBAR_HEIGHT = 30;
const MIN_WIDTH = 320;
const MIN_HEIGHT = 200;

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
  draggable?: boolean;
  isActive?: boolean;
  onPositionChange?: (pos: { x: number; y: number }) => void;
  onSizeChange?: (size: { width: number; height: number }) => void;
}

type ResizeDir = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

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
  onFocus,
  draggable = true,
  isActive = true,
  onPositionChange,
  onSizeChange,
}: XPWindowProps) => {
  const [internalMaximized, setInternalMaximized] = useState(false);
  const isMaximized = controlledMaximized !== undefined ? controlledMaximized : internalMaximized;

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

  // --- Drag handlers ---
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!draggable || isMaximized) return;
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
    <div
      ref={windowRef}
      className={`flex flex-col h-full rounded-t-lg overflow-hidden ${className}`}
      style={{
        borderTopLeftRadius: '8px',
        borderTopRightRadius: '8px',
        zIndex,
        boxShadow: isActive
          ? '2px 3px 12px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(0, 0, 0, 0.15)'
          : '1px 2px 6px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.1)',
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

      {/* Title Bar - XP styling with drag support */}
      <div
        className={`h-[28px] flex items-center justify-between px-1 select-none shrink-0 ${isActive ? 'xp-title-bar' : 'xp-title-bar-inactive'
          }`}
        onMouseDown={handleMouseDown}
        style={{ cursor: draggable && !isMaximized ? 'grab' : 'default' }}
      >
        <div className="flex items-center gap-1 ml-1 overflow-hidden">
          {icon && <div className="w-5 h-5 flex items-center justify-center shrink-0">{icon}</div>}
          <span className="text-white font-semibold text-[12px] drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)] leading-tight line-clamp-1 whitespace-nowrap">{title}</span>
        </div>
        <div className="flex items-center mr-0.5 shrink-0">
          <button
            className="xp-control-btn xp-minimize hover:brightness-110 transition-all ml-1"
            onClick={(e) => {
              e.stopPropagation();
              onMinimize?.();
            }}
            onMouseDown={(e) => e.stopPropagation()}
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
            onMouseDown={(e) => e.stopPropagation()}
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
            onMouseDown={(e) => e.stopPropagation()}
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

export { XPWindow };
export type { XPWindowProps };
export default XPWindow;
