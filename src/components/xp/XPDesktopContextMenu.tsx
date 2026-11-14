import React, { useEffect, useRef } from 'react';

interface XPDesktopContextMenuProps {
  x: number;
  y: number;
  onRefresh: () => void;
  onOpenMyComputer: () => void;
  onDismiss: () => void;
}

export const XPDesktopContextMenu: React.FC<XPDesktopContextMenuProps> = ({
  x,
  y,
  onRefresh,
  onOpenMyComputer,
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
      className="fixed z-[99999] bg-white border border-[#716f64] shadow-[2px_2px_4px_rgba(0,0,0,0.35)] py-1 min-w-[160px] text-xs font-['MSSans',Tahoma,sans-serif] select-none rounded-[1px]"
      style={{ left: `${Math.min(x, window.innerWidth - 170)}px`, top: `${Math.min(y, window.innerHeight - 150)}px` }}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div className="w-full text-left px-4 py-1 flex items-center justify-between hover:bg-[#316ac5] hover:text-white cursor-default group">
        <span>Arrange Icons By</span>
        <span className="text-[10px]">▶</span>
      </div>

      <div className="w-full text-left px-4 py-1 flex items-center justify-between hover:bg-[#316ac5] hover:text-white cursor-default">
        <span>Align to Grid</span>
      </div>

      <button
        onClick={() => {
          onRefresh();
          onDismiss();
        }}
        className="w-full text-left px-4 py-1 flex items-center justify-between hover:bg-[#316ac5] hover:text-white cursor-default"
      >
        <span>Refresh</span>
      </button>

      <div className="my-1 border-t border-[#d3d3d3]" />

      <button
        onClick={() => {
          onOpenMyComputer();
          onDismiss();
        }}
        className="w-full text-left px-4 py-1 flex items-center justify-between hover:bg-[#316ac5] hover:text-white cursor-default"
      >
        <span>Open My Computer</span>
      </button>

      <div className="my-1 border-t border-[#d3d3d3]" />

      <button
        onClick={() => onDismiss()}
        className="w-full text-left px-4 py-1 flex items-center justify-between hover:bg-[#316ac5] hover:text-white cursor-default"
      >
        <span>Properties</span>
      </button>
    </div>
  );
};
