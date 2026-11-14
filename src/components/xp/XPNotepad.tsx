import React, { useState, useEffect } from 'react';
import XPWindow from './XPWindow';
import NotepadIcon from '@/assets/xp/icons/notepad_icon.png';
import { Save, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface XPNotepadProps {
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
  onFocus?: () => void;
  zIndex?: number;
  isMaximized?: boolean;
  isActive?: boolean;
  onPositionChange?: (pos: { x: number; y: number }) => void;
  onSizeChange?: (size: { width: number; height: number }) => void;
  initialText?: string;
}

const XPNotepad: React.FC<XPNotepadProps> = ({
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  zIndex = 1,
  isMaximized,
  isActive,
  onPositionChange,
  onSizeChange,
  initialText,
}) => {
  const [content, setContent] = useState(initialText || '');
  const [loading, setLoading] = useState(!initialText);
  const [saving, setSaving] = useState(false);
  const [wordWrap, setWordWrap] = useState(true);
  const [source, setSource] = useState('connecting');

  const fetchDocument = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/notepad');
      if (res.ok) {
        const data = await res.json();
        setContent(data.content || '');
        setSource(data.source || 'blob');
      }
    } catch (err) {
      console.warn('Failed to fetch from /api/notepad:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initialText) {
      fetchDocument();
    }
  }, [initialText]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/notepad', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      if (res.ok) {
        toast.success('Document saved to Vercel Blob storage (readme.txt)');
      } else {
        toast.error('Failed to save document');
      }
    } catch (err) {
      toast.error('Network error while saving to Vercel Blob');
    } finally {
      setSaving(false);
    }
  };

  // Line & Column calculation
  const lines = content.split('\n');
  const lineCount = lines.length;
  const colCount = lines[lineCount - 1]?.length || 0;

  return (
    <XPWindow
      title="README.txt - Notepad (Vercel Cloud)"
      icon={<img src={NotepadIcon} alt="Notepad" className="w-4 h-4" />}
      onClose={onClose}
      onMinimize={onMinimize}
      onMaximize={onMaximize}
      onFocus={onFocus}
      zIndex={zIndex}
      isMaximized={isMaximized}
      isActive={isActive}
      onPositionChange={onPositionChange}
      onSizeChange={onSizeChange}
    >
      {/* Classic Menu Bar */}
      <div className="flex items-center justify-between px-1 py-0.5 bg-[#ece9d8] border-b border-[#aca899] text-[11px] font-['MSSans',Tahoma,sans-serif] select-none text-black">
        <div className="flex items-center">
          <span 
            className="px-2 py-0.5 hover:bg-[#316ac5] hover:text-white cursor-pointer rounded-sm font-bold"
            onClick={handleSave}
            title="Save to Vercel Blob"
          >
            File
          </span>
          <span className="px-2 py-0.5 hover:bg-[#316ac5] hover:text-white cursor-pointer rounded-sm">Edit</span>
          <span 
            className="px-2 py-0.5 hover:bg-[#316ac5] hover:text-white cursor-pointer rounded-sm"
            onClick={() => setWordWrap(!wordWrap)}
          >
            Format {wordWrap ? '✓' : ''}
          </span>
          <span className="px-2 py-0.5 hover:bg-[#316ac5] hover:text-white cursor-pointer rounded-sm">View</span>
          <span className="px-2 py-0.5 hover:bg-[#316ac5] hover:text-white cursor-pointer rounded-sm">Help</span>
        </div>

        <div className="flex items-center gap-1 pr-2">
          <button
            onClick={handleSave}
            disabled={saving || loading}
            className="xp-button px-2 py-0.5 flex items-center gap-1 text-[10px] cursor-pointer"
            title="Save document directly to Vercel Blob Storage"
          >
            <Save size={12} />
            {saving ? 'Saving...' : 'Save'}
          </button>
          <button
            onClick={fetchDocument}
            disabled={loading}
            className="xp-button p-0.5 flex items-center text-[10px] cursor-pointer"
            title="Reload from Vercel Blob"
          >
            <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="flex-1 flex flex-col bg-white overflow-hidden relative">
        {loading ? (
          <div className="flex-1 flex items-center justify-center text-[12px] text-gray-500 font-['MSSans',Tahoma,sans-serif]">
            Loading live README from Vercel Blob...
          </div>
        ) : (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            wrap={wordWrap ? 'soft' : 'off'}
            className={`flex-1 p-2 outline-none resize-none font-mono text-[13px] leading-relaxed text-black bg-white ${
              wordWrap ? 'overflow-y-auto overflow-x-hidden' : 'overflow-auto whitespace-pre'
            }`}
            spellCheck={false}
            autoFocus
          />
        )}
      </div>

      {/* Status Bar */}
      <div className="h-[20px] bg-[#ece9d8] border-t border-[#aca899] flex items-center justify-between px-2 text-[11px] font-['MSSans',Tahoma,sans-serif] text-gray-700 select-none">
        <div className="flex-1 truncate">
          {source === 'blob' ? '🟢 Vercel Blob Cloud (readme.txt)' : 'Windows (CRLF)'}
        </div>
        <div className="border-l border-[#aca899] px-4">Ln {lineCount}, Col {colCount + 1}</div>
      </div>
    </XPWindow>
  );
};

export default XPNotepad;
