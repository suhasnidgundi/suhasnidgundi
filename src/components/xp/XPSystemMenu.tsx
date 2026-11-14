import React, { useEffect, useRef } from 'react';

interface XPSystemMenuProps {
  x: number;
  y: number;
  isMaximized: boolean;
  onRestore: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onClose: () => void;
  onDismiss: () => void;
}

export const XPSystemMenu: React.FC<XPSystemMenuProps> = ({
  x,
  y,
  isMaximized,
  onRestore,
  onMinimize,
  onMaximize,
  onClose,
  onDismiss,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onDismiss();
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onDismiss();
      }
    };

    window.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onDismiss]);

  return (
    <div
      ref={menuRef}
      className="fixed z-[99999] bg-white border border-[#716f64] shadow-[2px_2px_4px_rgba(0,0,0,0.35)] py-1 min-w-[150px] text-xs font-['MSSans',Tahoma,sans-serif] select-none rounded-[1px]"
      style={{ left: `${x}px`, top: `${y}px` }}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <button
        disabled={!isMaximized}
        onClick={() => {
          onRestore();
          onDismiss();
        }}
        className="w-full text-left px-4 py-1 flex items-center justify-between hover:bg-[#316ac5] hover:text-white disabled:opacity-45 disabled:hover:bg-transparent disabled:hover:text-gray-500 cursor-default"
      >
        <span>Restore</span>
      </button>

      <button
        disabled={isMaximized}
        onClick={() => onDismiss()}
        className="w-full text-left px-4 py-1 flex items-center justify-between hover:bg-[#316ac5] hover:text-white disabled:opacity-45 disabled:hover:bg-transparent disabled:hover:text-gray-500 cursor-default"
      >
        <span>Move</span>
      </button>

      <button
        disabled={isMaximized}
        onClick={() => onDismiss()}
        className="w-full text-left px-4 py-1 flex items-center justify-between hover:bg-[#316ac5] hover:text-white disabled:opacity-45 disabled:hover:bg-transparent disabled:hover:text-gray-500 cursor-default"
      >
        <span>Size</span>
      </button>

      <button
        onClick={() => {
          onMinimize();
          onDismiss();
        }}
        className="w-full text-left px-4 py-1 flex items-center justify-between hover:bg-[#316ac5] hover:text-white cursor-default"
      >
        <span>Minimize</span>
      </button>

      <button
        disabled={isMaximized}
        onClick={() => {
          onMaximize();
          onDismiss();
        }}
        className="w-full text-left px-4 py-1 flex items-center justify-between hover:bg-[#316ac5] hover:text-white disabled:opacity-45 disabled:hover:bg-transparent disabled:hover:text-gray-500 cursor-default"
      >
        <span>Maximize</span>
      </button>

      <div className="my-1 border-t border-[#d3d3d3]" />

      <button
        onClick={() => {
          onClose();
          onDismiss();
        }}
        className="w-full text-left px-4 py-1 flex items-center justify-between hover:bg-[#316ac5] hover:text-white cursor-default font-bold"
      >
        <span>Close</span>
        <span className="text-[10px] opacity-70 font-normal">Alt+F4</span>
      </button>
    </div>
  );
};
