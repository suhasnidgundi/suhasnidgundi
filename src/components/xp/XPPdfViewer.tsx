import { useState, useRef, useEffect, useCallback } from 'react';
import { ZoomIn, ZoomOut, Download, Printer, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import MinimizeIcon from '@/assets/xp/icons/minimize_icon.png';
import MaximizeIcon from '@/assets/xp/icons/maximize_icon.png';
import ExitIcon from '@/assets/xp/icons/exit_icon.png';


interface XPPdfViewerProps {
  onClose: () => void;
  onDownload: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
  onFocus?: () => void;
  zIndex?: number;
  isMaximized?: boolean;
  isActive?: boolean;
  onPositionChange?: (pos: { x: number; y: number }) => void;
  onSizeChange?: (size: { width: number; height: number }) => void;
}

const XPPdfViewer = ({
  onClose,
  onDownload,
  onMinimize,
  onMaximize,
  onFocus,
  zIndex = 1,
  isMaximized = false,
  isActive = true,
  onPositionChange,
  onSizeChange,
}: XPPdfViewerProps) => {
  const [zoom, setZoom] = useState(100);

  // Drag state - delegates to parent via onPositionChange
  const isDragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  const handleTitleMouseDown = useCallback((e: React.MouseEvent) => {
    if (isMaximized || !onPositionChange) return;
    e.preventDefault();
    isDragging.current = true;
    const rect = windowRef.current?.getBoundingClientRect();
    if (rect) {
      dragOffset.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
    onFocus?.();
  }, [isMaximized, onFocus, onPositionChange]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !onPositionChange) return;
      e.preventDefault();
      const TASKBAR_HEIGHT = 30;
      const viewW = window.innerWidth;
      const viewH = window.innerHeight - TASKBAR_HEIGHT;
      const rect = windowRef.current?.getBoundingClientRect();
      const winW = rect?.width || 400;
      const winH = rect?.height || 300;
      const newX = Math.max(0, Math.min(e.clientX - dragOffset.current.x, viewW - winW));
      const newY = Math.max(0, Math.min(e.clientY - dragOffset.current.y, viewH - winH));
      onPositionChange({ x: newX, y: newY });
    };
    const handleMouseUp = () => { isDragging.current = false; };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [onPositionChange]);

  return (
    <div
      ref={windowRef}
      className={`flex flex-col h-full bg-card shadow-lg overflow-hidden ${isMaximized ? '' : 'rounded-t-lg'
        }`}
      style={{
        border: '2px solid hsl(var(--primary) / 0.6)',
        borderRadius: isMaximized ? '0' : '8px 8px 0 0',
        zIndex,
        boxShadow: isActive
          ? 'var(--window-box-shadow)'
          : 'var(--window-box-shadow-inactive)',
      }}
      onMouseDown={onFocus}
    >
      {/* Title Bar - Draggable */}
      <div
        className={`h-[30px] flex items-center justify-between px-1 select-none shrink-0 ${isActive ? 'xp-title-bar' : 'xp-title-bar-inactive'}`}
        onMouseDown={handleTitleMouseDown}
        style={{ cursor: !isMaximized ? 'grab' : 'default' }}
      >
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-primary-foreground">
              <rect x="3" y="3" width="18" height="18" rx="2" fill="#D32F2F" stroke="white" strokeWidth="1" />
              <text x="4" y="16" fontSize="9" fontWeight="bold" fill="white">PDF</text>
            </svg>
          </div>
          <span className="text-primary-foreground font-bold text-[13px] drop-shadow-sm">
            Suhas_Nidgundi_Resume.pdf - Adobe Reader
          </span>
        </div>

        <div className="flex items-center gap-[2px]">
          <button
            onClick={(e) => { e.stopPropagation(); onMinimize?.(); }}
            onMouseDown={(e) => e.stopPropagation()}
            className="xp-control-btn xp-minimize hover:brightness-110"
            title="Minimize"
          >
            <img src={MinimizeIcon} alt="Minimize" className="w-5 h-5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onMaximize?.(); }}
            onMouseDown={(e) => e.stopPropagation()}
            className="xp-control-btn xp-maximize hover:brightness-110"
            title={isMaximized ? "Restore" : "Maximize"}
          >
            <img src={MaximizeIcon} alt={isMaximized ? "Restore" : "Maximize"} className="w-5 h-5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            onMouseDown={(e) => e.stopPropagation()}
            className="xp-control-btn xp-close hover:brightness-110"
            title="Close"
          >
            <img src={ExitIcon} alt="Close" className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Menu Bar */}
      <div className="flex items-center gap-4 px-2 py-1 bg-[hsl(var(--xp-toolbar-bg))] border-b border-border text-[11px]">
        <span className="hover:bg-primary/20 px-2 py-1 cursor-pointer rounded">File</span>
        <span className="hover:bg-primary/20 px-2 py-1 cursor-pointer rounded">Edit</span>
        <span className="hover:bg-primary/20 px-2 py-1 cursor-pointer rounded">View</span>
        <span className="hover:bg-primary/20 px-2 py-1 cursor-pointer rounded">Document</span>
        <span className="hover:bg-primary/20 px-2 py-1 cursor-pointer rounded">Tools</span>
        <span className="hover:bg-primary/20 px-2 py-1 cursor-pointer rounded">Help</span>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 px-2 py-2 bg-[hsl(var(--xp-toolbar-bg))] border-b border-border">
        <button className="xp-button" title="Print" onClick={() => window.print()}>
          <Printer size={14} />
        </button>
        <button className="xp-button" title="Download" onClick={onDownload}>
          <Download size={14} />
        </button>
        <div className="w-px h-5 bg-border" />
        <button className="xp-button" title="Search">
          <Search size={14} />
        </button>
        <div className="w-px h-5 bg-border" />
        <button className="xp-button" title="Previous Page">
          <ChevronLeft size={14} />
        </button>
        <span className="text-[11px] px-2">1 / 1</span>
        <button className="xp-button" title="Next Page">
          <ChevronRight size={14} />
        </button>
        <div className="w-px h-5 bg-border" />
        <button
          className="xp-button"
          title="Zoom Out"
          onClick={() => setZoom(Math.max(50, zoom - 25))}
        >
          <ZoomOut size={14} />
        </button>
        <span className="text-[11px] px-2 w-12 text-center">{zoom}%</span>
        <button
          className="xp-button"
          title="Zoom In"
          onClick={() => setZoom(Math.min(200, zoom + 25))}
        >
          <ZoomIn size={14} />
        </button>
      </div>

      {/* PDF Embed Area */}
      <div className="flex-1 bg-muted/70 overflow-auto flex justify-center p-4">
        <embed
          src="/resume.pdf#toolbar=0"
          type="application/pdf"
          className="shadow-lg border border-border"
          style={{
            width: `${zoom}%`,
            height: `${zoom * 1.3}%`,
          }}
        />
      </div>

      {/* Footer Status Bar */}
      <div className="flex items-center justify-between px-2 py-1 bg-[hsl(var(--xp-toolbar-bg))] border-t border-border text-[11px] text-muted-foreground">
        <span>Page 1 of 1</span>
        <span>File size: ~125 KB</span>
      </div>
    </div>
  );
};

export default XPPdfViewer;

