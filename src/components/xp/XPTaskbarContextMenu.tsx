import React, { useEffect, useRef } from 'react';

interface XPTaskbarContextMenuProps {
  x: number;
  y: number;
  isAllMinimized: boolean;
  onCascade: () => void;
  onTileHorizontal: () => void;
  onTileVertical: () => void;
  onToggleShowDesktop: () => void;
  onOpenMyComputer: () => void;
  onDismiss: () => void;
}

export const XPTaskbarContextMenu: React.FC<XPTaskbarContextMenuProps> = ({
  x,
  y,
  isAllMinimized,
  onCascade,
  onTileHorizontal,
  onTileVertical,
  onToggleShowDesktop,
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
      className="fixed z-[99999] bg-white border border-[#716f64] shadow-[2px_2px_4px_rgba(0,0,0,0.35)] py-1 min-w-[170px] text-xs font-['MSSans',Tahoma,sans-serif] select-none rounded-[1px]"
      style={{ left: `${Math.min(x, window.innerWidth - 180)}px`, bottom: `${window.innerHeight - y}px` }}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <button
        onClick={() => {
          onCascade();
          onDismiss();
        }}
        className="w-full text-left px-4 py-1 flex items-center justify-between hover:bg-[#316ac5] hover:text-white cursor-default"
      >
        <span>Cascade Windows</span>
      </button>

      <button
        onClick={() => {
          onTileHorizontal();
          onDismiss();
        }}
        className="w-full text-left px-4 py-1 flex items-center justify-between hover:bg-[#316ac5] hover:text-white cursor-default"
      >
        <span>Tile Windows Horizontally</span>
      </button>

      <button
        onClick={() => {
          onTileVertical();
          onDismiss();
        }}
        className="w-full text-left px-4 py-1 flex items-center justify-between hover:bg-[#316ac5] hover:text-white cursor-default"
      >
        <span>Tile Windows Vertically</span>
      </button>

      <button
        onClick={() => {
          onToggleShowDesktop();
          onDismiss();
        }}
        className="w-full text-left px-4 py-1 flex items-center justify-between hover:bg-[#316ac5] hover:text-white cursor-default font-bold"
      >
        <span>{isAllMinimized ? 'Show Open Windows' : 'Show the Desktop'}</span>
      </button>

      <div className="my-1 border-t border-[#d3d3d3]" />

      <button
        onClick={() => {
          onOpenMyComputer();
          onDismiss();
        }}
        className="w-full text-left px-4 py-1 flex items-center justify-between hover:bg-[#316ac5] hover:text-white cursor-default"
      >
        <span>Task Manager</span>
      </button>

      <div className="my-1 border-t border-[#d3d3d3]" />

      <button
        onClick={() => onDismiss()}
        className="w-full text-left px-4 py-1 flex items-center justify-between hover:bg-[#316ac5] hover:text-white cursor-default"
      >
        <span>✓ Lock the Taskbar</span>
      </button>

      <button
        onClick={() => onDismiss()}
        className="w-full text-left px-4 py-1 flex items-center justify-between hover:bg-[#316ac5] hover:text-white cursor-default"
      >
        <span>Properties</span>
      </button>
    </div>
  );
};
