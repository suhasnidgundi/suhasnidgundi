import { useState, useRef, useEffect, useCallback } from "react";
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Save,
  Printer,
} from "lucide-react";
import WordIcon from '@/assets/xp/icons/ms_word_logo_icon.png';
import { useProfile } from '@/hooks/useProfile';

interface XPWordDocumentProps {
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

const XPWordDocument = ({
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  zIndex = 1,
  isMaximized = false,
  isActive = true,
  onPositionChange,
}: XPWordDocumentProps) => {
  const { data: profile } = useProfile();
  const isDragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);
  const [story, setStory] = useState<any>(null);

  useEffect(() => {
    fetch('/api/documents?type=wordpad')
      .then((r) => r.json())
      .then((data) => {
        if (data && data.sections) {
          setStory(data);
        }
      })
      .catch((err) => console.warn('Failed to load dynamic story from Vercel Blob:', err));
  }, []);

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

  const sectionsToRender = Array.isArray(story?.sections) ? story.sections : [];

  return (
    <div
      ref={windowRef}
      className={`flex flex-col w-full h-full overflow-hidden ${
        isMaximized ? '' : 'xp-window-frame'
      } ${!isActive ? 'inactive' : ''}`}
      style={{
        width: '100%',
        height: '100%',
        zIndex,
        borderRadius: isMaximized ? "0" : "8px 8px 0 0",
      }}
      onMouseDown={onFocus}
    >
      {/* Title Bar - Draggable */}
      <div
        className={`h-[30px] flex items-center justify-between px-1.5 select-none shrink-0 ${
          isActive ? 'xp-title-bar' : 'xp-title-bar-inactive'
        }`}
        onMouseDown={handleTitleMouseDown}
        onDoubleClick={onMaximize}
        style={{ cursor: !isMaximized ? 'default' : 'default' }}
      >
        <div className="flex items-center gap-1.5 ml-1">
          <div className="w-4 h-4 flex items-center justify-center shrink-0">
            <img src={WordIcon} alt="Word" className="w-4 h-4 object-contain" />
          </div>
          <span className="font-['Trebuchet_MS',Tahoma,sans-serif] font-bold text-[13px] text-white drop-shadow-[1px_1px_1px_rgba(15,16,137,0.8)]">
            {profile?.name ? `${profile.name.replace(/\s+/g, '_')}_About_Me.doc` : 'About_Me.doc'} - Microsoft Word
          </span>
        </div>

        <div className="flex items-center mr-1 shrink-0">
          <button
            onClick={(e) => { e.stopPropagation(); onMinimize?.(); }}
            onMouseDown={(e) => e.stopPropagation()}
            className="xp-caption-btn xp-caption-min"
            title="Minimize"
            aria-label="Minimize"
          />
          <button
            onClick={(e) => { e.stopPropagation(); onMaximize?.(); }}
            onMouseDown={(e) => e.stopPropagation()}
            className={`xp-caption-btn ${isMaximized ? 'xp-caption-restore' : 'xp-caption-max'}`}
            title={isMaximized ? "Restore" : "Maximize"}
            aria-label={isMaximized ? "Restore" : "Maximize"}
          />
          <button
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            onMouseDown={(e) => e.stopPropagation()}
            className="xp-caption-btn xp-caption-close"
            title="Close"
            aria-label="Close"
          />
        </div>
      </div>

      {/* Menu Bar */}
      <div className="flex items-center gap-4 px-2 py-1 bg-[hsl(var(--xp-toolbar-bg))] border-b border-border text-[11px]">
        <span className="hover:bg-primary/20 px-2 py-1 cursor-pointer rounded">File</span>
        <span className="hover:bg-primary/20 px-2 py-1 cursor-pointer rounded">Edit</span>
        <span className="hover:bg-primary/20 px-2 py-1 cursor-pointer rounded">View</span>
        <span className="hover:bg-primary/20 px-2 py-1 cursor-pointer rounded">Insert</span>
        <span className="hover:bg-primary/20 px-2 py-1 cursor-pointer rounded">Format</span>
        <span className="hover:bg-primary/20 px-2 py-1 cursor-pointer rounded">Tools</span>
        <span className="hover:bg-primary/20 px-2 py-1 cursor-pointer rounded">Table</span>
        <span className="hover:bg-primary/20 px-2 py-1 cursor-pointer rounded">Help</span>
      </div>

      {/* Toolbar Row 1 */}
      <div className="flex items-center gap-1 px-2 py-1 bg-[hsl(var(--xp-toolbar-bg))] border-b border-border">
        <button className="xp-button flex items-center gap-1 text-[10px]" title="Save">
          <Save size={14} />
        </button>
        <button className="xp-button flex items-center gap-1 text-[10px]" title="Print">
          <Printer size={14} />
        </button>
        <div className="w-px h-5 bg-border mx-1" />
        <select className="xp-button text-[11px] px-2 py-1">
          <option>Times New Roman</option>
          <option>Arial</option>
          <option>Calibri</option>
        </select>
        <select className="xp-button text-[11px] px-2 py-1 w-16">
          <option>11pt</option>
          <option>12pt</option>
          <option>14pt</option>
        </select>
      </div>

      {/* Toolbar Row 2 - Formatting */}
      <div className="flex items-center gap-1 px-2 py-1 bg-[hsl(var(--xp-toolbar-bg))] border-b border-border">
        <button className="xp-button p-1" title="Bold">
          <Bold size={14} />
        </button>
        <button className="xp-button p-1" title="Italic">
          <Italic size={14} />
        </button>
        <button className="xp-button p-1" title="Underline">
          <Underline size={14} />
        </button>
        <div className="w-px h-5 bg-border mx-1" />
        <button className="xp-button p-1" title="Align Left">
          <AlignLeft size={14} />
        </button>
        <button className="xp-button p-1" title="Align Center">
          <AlignCenter size={14} />
        </button>
        <button className="xp-button p-1" title="Align Right">
          <AlignRight size={14} />
        </button>
        <button className="xp-button p-1" title="Justify">
          <AlignJustify size={14} />
        </button>
      </div>

      {/* Ruler */}
      <div className="h-6 bg-card border-b border-border flex items-center px-4">
        <div className="flex-1 h-4 bg-muted/30 relative">
          {Array.from({ length: 17 }, (_, i) => (
            <div
              key={i}
              className="absolute top-0 bottom-0 w-px bg-muted-foreground/30"
              style={{ left: `${(i / 16) * 100}%` }}
            >
              {i % 2 === 0 && (
                <span className="absolute -top-3 -left-2 text-[8px] text-muted-foreground">
                  {i}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Document Content Area */}
      <div className="flex-1 bg-[#C0C0C0] p-4 overflow-y-auto flex justify-center">
        {/* Paper */}
        <div className="bg-white w-full max-w-[816px] min-h-[900px] shadow-xl p-16 text-black flex flex-col justify-between">
          <div>
            {story?.title ? (
              /* Header */
              <div className="text-center mb-8">
                <h1 className="text-[36px] font-bold text-[#0066CC] mb-3">
                  {story.title}
                </h1>
                {story.subtitle && (
                  <p className="text-[14px] text-gray-600 mb-2">
                    {story.subtitle}
                  </p>
                )}
                {story.contact && (
                  <p className="text-[11px] text-gray-500">
                    {story.contact}
                  </p>
                )}
                <div className="mt-1 flex items-center justify-center gap-2">
                  <span className="text-[10px] text-emerald-600 font-mono">
                    🟢 Powered dynamically by Vercel Blob (wordpad-story.json)
                  </span>
                </div>
                <hr className="mt-4 border-t-2 border-[#0066CC]" />
              </div>
            ) : null}

            {/* Dynamic Sections from Vercel Blob */}
            {sectionsToRender.length > 0 ? (
              <div className="space-y-8">
                {sectionsToRender.map((section: any, idx: number) => (
                  <section key={section.id || idx} className="mb-6">
                    <h2 className="text-[20px] font-bold text-[#0066CC] mb-4 pb-1 border-b-2 border-[#0066CC]/20">
                      {section.heading}
                    </h2>
                    {section.paragraphs?.map((p: string, pIdx: number) => (
                      <p key={pIdx} className="text-[13px] leading-relaxed text-gray-800 mb-3">
                        {p}
                      </p>
                    ))}
                    {section.highlights && Array.isArray(section.highlights) && section.highlights.length > 0 && (
                      <div className="my-4 p-4 bg-gray-50 border-l-4 border-[#0066CC] rounded-r">
                        <h3 className="text-[12px] font-bold uppercase tracking-wider text-[#0066CC] mb-2">
                          Key Highlights & Metrics
                        </h3>
                        <ul className="list-disc list-inside space-y-1">
                          {section.highlights.map((h: string, hIdx: number) => (
                            <li key={hIdx} className="text-[12px] text-gray-700">
                              {h}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </section>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-40 text-center select-none">
                <img src={WordIcon} alt="Word" className="w-12 h-12 opacity-25 mb-3" />
                <p className="text-[14px] font-bold text-gray-600 font-['MSSans',Tahoma,sans-serif]">
                  Blank Document
                </p>
                <p className="text-[11px] text-gray-400 mt-1 max-w-sm font-['MSSans',Tahoma,sans-serif]">
                  No document has been published in Vercel Blob yet. You can create or upload documents at /admin.
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          {profile?.email && (
            <div className="mt-12 pt-6 border-t-2 border-gray-300 text-center">
              <p className="text-[11px] text-gray-600 mb-1">
                📧 {profile.email}
              </p>
              <p className="text-[11px] text-gray-600 mb-2">
                🔗 {profile.github} • {profile.linkedin}
              </p>
              <p className="text-[10px] text-gray-500">
                {profile.location} • {profile.status}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-2 py-1 bg-[hsl(var(--xp-toolbar-bg))] border-t border-border text-[11px] text-muted-foreground">
        <div className="flex items-center gap-4">
          <span>Page 1 of 1</span>
          <span>|</span>
          <span>Dynamically Loaded from Vercel Blob</span>
        </div>
        <div className="flex items-center gap-2">
          <span>English (India)</span>
        </div>
      </div>
    </div>
  );
};

export default XPWordDocument;
