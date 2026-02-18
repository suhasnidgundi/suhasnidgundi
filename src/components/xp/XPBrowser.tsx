import { useState, useRef, useEffect, useCallback } from 'react';
import { Home, RefreshCw, ArrowLeft, ArrowRight, Search, ExternalLink } from 'lucide-react';
import MinimizeIcon from '@/assets/xp/icons/minimize_icon.png';
import MaximizeIcon from '@/assets/xp/icons/maximize_icon.png';
import ExitIcon from '@/assets/xp/icons/exit_icon.png';
import InternetExplorerIcon from '@/assets/xp/icons/internet_explorer_icon.png';

interface XPBrowserProps {
  initialUrl?: string;
  onClose: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
  onFocus?: () => void;
  zIndex?: number;
  isMaximized?: boolean;
  isActive?: boolean;
  onPositionChange?: (pos: { x: number; y: number }) => void;
  onSizeChange?: (size: { width: number; height: number }) => void;
}

const XPBrowser = ({
  initialUrl = 'https://www.bing.com/',
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  zIndex = 1,
  isMaximized = false,
  isActive = true,
  onPositionChange,
  onSizeChange,
}: XPBrowserProps) => {
  const [url, setUrl] = useState(initialUrl);
  const [inputUrl, setInputUrl] = useState(initialUrl);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);

  // Drag state - delegates to parent via onPositionChange
  const isDragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  // Most external sites block iframe embedding, so we'll show a fallback
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadError(true);
      setIsLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, [url]);

  // Drag handlers - position is managed by parent
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

  const handleNavigate = () => {
    let newUrl = inputUrl.trim();
    if (!newUrl.startsWith('http://') && !newUrl.startsWith('https://')) {
      newUrl = 'https://' + newUrl;
    }
    setUrl(newUrl);
    setInputUrl(newUrl);
    setIsLoading(true);
    setLoadError(false);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setLoadError(false);
    if (iframeRef.current) {
      iframeRef.current.src = url;
    }
  };

  const handleHome = () => {
    setUrl(initialUrl);
    setInputUrl(initialUrl);
    setIsLoading(true);
    setLoadError(false);
  };

  const openInNewTab = () => {
    window.open(url, '_blank');
  };

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
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 flex items-center justify-center">
            <img src={InternetExplorerIcon} alt="Internet Explorer" className="w-5 h-5" />
          </div>
          <span className="text-primary-foreground font-bold text-[13px] drop-shadow-sm">
            Microsoft Internet Explorer
          </span>
        </div>

        <div className="flex items-center gap-[2px]">
          <button
            onClick={(e) => { e.stopPropagation(); onMinimize?.(); }}
            onMouseDown={(e) => e.stopPropagation()}
            className="xp-control-btn xp-minimize hover:brightness-110 transition-all"
            title="Minimize"
          >
            <img src={MinimizeIcon} alt="Minimize" className="w-5 h-5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onMaximize?.(); }}
            onMouseDown={(e) => e.stopPropagation()}
            className="xp-control-btn xp-maximize hover:brightness-110 transition-all"
            title={isMaximized ? "Restore" : "Maximize"}
          >
            <img src={MaximizeIcon} alt={isMaximized ? "Restore" : "Maximize"} className="w-5 h-5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            onMouseDown={(e) => e.stopPropagation()}
            className="xp-control-btn xp-close hover:brightness-110 transition-all"
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
        <span className="hover:bg-primary/20 px-2 py-1 cursor-pointer rounded">Favorites</span>
        <span className="hover:bg-primary/20 px-2 py-1 cursor-pointer rounded">Tools</span>
        <span className="hover:bg-primary/20 px-2 py-1 cursor-pointer rounded">Help</span>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 px-2 py-2 bg-[hsl(var(--xp-toolbar-bg))] border-b border-border">
        <button
          onClick={() => { }}
          className="xp-button flex items-center gap-1 hover:brightness-95 active:brightness-90 text-[11px] opacity-50 cursor-not-allowed"
          title="Back"
        >
          <ArrowLeft size={14} />
          <span>Back</span>
        </button>

        <button
          onClick={() => { }}
          className="xp-button flex items-center gap-1 hover:brightness-95 active:brightness-90 opacity-50 cursor-not-allowed"
          title="Forward"
        >
          <ArrowRight size={14} />
        </button>

        <div className="w-px h-6 bg-border" />

        <button
          onClick={handleRefresh}
          className="xp-button flex items-center gap-1 hover:brightness-95 active:brightness-90"
          title="Refresh"
        >
          <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
        </button>

        <button
          onClick={handleHome}
          className="xp-button flex items-center gap-1 hover:brightness-95 active:brightness-90 text-[11px]"
          title="Home"
        >
          <Home size={14} />
          <span>Home</span>
        </button>

        <div className="w-px h-6 bg-border" />

        <button
          className="xp-button flex items-center gap-1 hover:brightness-95 active:brightness-90 text-[11px]"
          title="Search"
        >
          <Search size={14} />
          <span>Search</span>
        </button>

        <button
          onClick={openInNewTab}
          className="xp-button flex items-center gap-1 hover:brightness-95 active:brightness-90 text-[11px]"
          title="Open in New Tab"
        >
          <ExternalLink size={14} />
          <span>Open External</span>
        </button>
      </div>

      {/* Address Bar */}
      <div className="flex items-center gap-2 px-2 py-2 bg-[hsl(var(--xp-toolbar-bg))] border-b border-border">
        <span className="text-[11px] text-muted-foreground">Address</span>
        <div className="flex-1 flex items-center gap-1 bg-input border border-border rounded-sm">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 ml-2 text-muted-foreground">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
          <input
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleNavigate()}
            className="flex-1 px-2 py-1 bg-transparent text-[11px] outline-none"
            placeholder="Enter web address"
          />
        </div>
        <button
          onClick={handleNavigate}
          className="xp-button hover:brightness-95 active:brightness-90 text-[11px] font-bold px-3"
          title="Go"
        >
          Go
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 relative bg-card overflow-hidden">
        {isLoading && !loadError && (
          <div className="absolute inset-0 flex items-center justify-center bg-card z-10">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-[11px] text-muted-foreground">Connecting to website...</p>
            </div>
          </div>
        )}

        {/* Fallback UI for blocked sites */}
        {loadError && (
          <div className="absolute inset-0 flex items-center justify-center bg-card z-10">
            <div className="text-center max-w-md px-4">
              <div className="w-24 h-24 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-12 h-12 text-primary">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              </div>
              <h2 className="text-[16px] font-bold text-foreground mb-2">
                This webpage cannot be displayed in an embedded browser
              </h2>
              <p className="text-[12px] text-muted-foreground mb-4">
                For security reasons, most websites block embedded viewing. Click below to open in a new browser tab.
              </p>
              <div className="flex flex-col gap-2">
                <button
                  onClick={openInNewTab}
                  className="xp-button px-4 py-2 bg-primary text-primary-foreground hover:brightness-110 flex items-center justify-center gap-2 mx-auto"
                >
                  <ExternalLink size={16} />
                  <span>Open {new URL(url).hostname} in New Tab</span>
                </button>
                <p className="text-[10px] text-muted-foreground mt-2">
                  URL: {url}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Hidden iframe - kept for potential compatible sites */}
        <iframe
          ref={iframeRef}
          src={url}
          className={`w-full h-full border-none ${loadError ? 'invisible' : ''}`}
          title="Browser Content"
          onLoad={() => { setIsLoading(false); }}
          onError={() => { setLoadError(true); setIsLoading(false); }}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
        />
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-2 py-1 bg-[hsl(var(--xp-toolbar-bg))] border-t border-border text-[11px] text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-sm border border-muted-foreground/30" />
          <span>{isLoading ? 'Opening page...' : loadError ? 'Page blocked - use external link' : 'Done'}</span>
        </div>

        <div className="flex items-center gap-2">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3 text-muted-foreground">
            <circle cx="12" cy="12" r="10" />
            <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
          <span className="text-[10px]">Internet</span>
        </div>
      </div>
    </div>
  );
};

export default XPBrowser;