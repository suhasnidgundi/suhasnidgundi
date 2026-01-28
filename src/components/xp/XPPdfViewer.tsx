import { useState } from 'react';
import { X, Minus, Square, ZoomIn, ZoomOut, Download, Printer, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import MinimizeIcon from '@/assets/xp/icons/minimize_icon.png';
import MaximizeIcon from '@/assets/xp/icons/maximize_icon.png';
import ExitIcon from '@/assets/xp/icons/exit_icon.png';


interface XPPdfViewerProps {
  onClose: () => void;
  onDownload: () => void;
}

const XPPdfViewer = ({ onClose, onDownload }: XPPdfViewerProps) => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [zoom, setZoom] = useState(100); // controls embed scaling

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/30 z-[100]"
        onClick={onClose}
      />

      {/* PDF Viewer Window */}
      <div 
        className={`fixed z-[101] flex flex-col bg-card shadow-lg transition-all duration-200 ${
          isMaximized 
            ? 'inset-2' 
            : 'top-[5%] left-1/2 -translate-x-1/2 w-[90vw] h-[85vh] max-w-[1000px]'
        }`}
        style={{
          border: '2px solid hsl(var(--primary) / 0.6)',
          borderRadius: isMaximized ? '0' : '8px 8px 0 0',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title Bar */}
        <div className="xp-title-bar h-[30px] flex items-center justify-between px-1 select-none">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-primary-foreground">
                <rect x="3" y="3" width="18" height="18" rx="2" fill="#D32F2F" stroke="white" strokeWidth="1"/>
                <text x="4" y="16" fontSize="9" fontWeight="bold" fill="white">PDF</text>
              </svg>
            </div>
            <span className="text-primary-foreground font-bold text-[13px] drop-shadow-sm">
              Suhas_Nidgundi_Resume.pdf - Adobe Reader
            </span>
          </div>
          
          <div className="flex items-center gap-[2px]">
            <button className="xp-control-btn xp-minimize hover:brightness-110" title="Minimize">
              <img src={MinimizeIcon} alt="Minimize" className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsMaximized(!isMaximized)}
              className="xp-control-btn xp-maximize hover:brightness-110"
              title={isMaximized ? "Restore" : "Maximize"}
            >
              <img src={MaximizeIcon} alt={isMaximized ? "Restore" : "Maximize"} className="w-5 h-5"  />
            </button>
            <button
              onClick={onClose}
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
    </>
  );
};

export default XPPdfViewer;
