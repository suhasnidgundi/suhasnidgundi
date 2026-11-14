import React, { useState, useRef, useCallback } from 'react';
import MyComputerIcon from '@/assets/xp/icons/my_computer.png';
import InternetExplorerIcon from '@/assets/xp/icons/internet_explorer_icon.png';
import FolderIcon from '@/assets/xp/icons/folder_icon.png';
import NotepadIcon from '@/assets/xp/icons/notepad_icon.png';
import GithubIcon from '@/assets/xp/icons/github_icon.png';
import LinkedinIcon from '@/assets/xp/icons/linkedin_icon.png';
import BriefcaseIcon from '@/assets/xp/icons/briefcase_icon.png';
import SearchIcon from '@/assets/xp/icons/search_icon.png';
import WordIcon from '@/assets/xp/icons/ms_word_logo_icon.png';
import PdfIcon from '@/assets/xp/icons/word_file_icon.png';
import WallpaperDark from '@/assets/xp/wallpaper_dark.jpg';
import { XPDesktopContextMenu } from './XPDesktopContextMenu';
import { useProfile } from '@/hooks/useProfile';

interface DesktopIconProps {
  id: string;
  icon: string;
  label: string;
  onClick?: (e: React.MouseEvent) => void;
  onDoubleClick?: () => void;
  selected?: boolean;
}

const DesktopIcon = ({ icon, label, onClick, onDoubleClick, selected }: DesktopIconProps) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onDoubleClick?.();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={label}
      data-icon-id={label}
      className={`desktop-icon group flex flex-col items-center justify-start w-[76px] p-1.5 cursor-pointer select-none rounded-[2px] transition-all relative ${
        selected ? 'selected' : 'hover:bg-white/10'
      }`}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onKeyDown={handleKeyDown}
    >
      <div className="icon-img relative w-11 h-11 flex items-center justify-center mb-1">
        <img
          src={icon}
          alt={label}
          className={`w-11 h-11 object-contain transition-all pointer-events-none ${
            selected ? 'brightness-75' : 'drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]'
          }`}
        />
        {selected && (
          <div 
            className="absolute inset-0 bg-[#316ac5] opacity-50 pointer-events-none rounded-[2px]"
            style={{
              maskImage: `url(${icon})`,
              WebkitMaskImage: `url(${icon})`,
              maskSize: 'contain',
              WebkitMaskSize: 'contain',
              maskRepeat: 'no-repeat',
              WebkitMaskRepeat: 'no-repeat',
              maskPosition: 'center',
            }}
          />
        )}
      </div>

      <span
        className={`label text-[11px] text-center leading-snug font-['MSSans',Tahoma,sans-serif] px-1 py-0.5 rounded-[1px] break-words line-clamp-2 ${
          selected
            ? 'bg-[#316ac5] text-white outline outline-1 outline-dotted outline-[#ffff80]'
            : 'text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]'
        }`}
        style={{
          textShadow: selected ? 'none' : '1px 1px 1px #000, 0 0 3px #000',
        }}
      >
        {label}
      </span>
    </div>
  );
};

interface XPDesktopProps {
  onOpenMyComputer: () => void;
  onOpenBrowser: (url: string) => void;
  onNavigateToProjects: () => void;
  onNavigateToExperience: () => void;
  onOpenAIChat?: () => void;
  onOpenWordDoc?: () => void;
  onOpenPdfViewer?: () => void;
  onOpenNotepad?: () => void;
  onOpenCalculator?: () => void;
  onOpenMinesweeper?: () => void;
  onOpenGuestbook?: () => void;
  onOpenWindowsPhone?: () => void;
  onUnfocusAll?: () => void;
  isDark: boolean;
}

const XPDesktop: React.FC<XPDesktopProps> = ({
  onOpenMyComputer,
  onOpenBrowser,
  onNavigateToProjects,
  onNavigateToExperience,
  onOpenAIChat,
  onOpenWordDoc,
  onOpenPdfViewer,
  onOpenNotepad,
  onOpenCalculator,
  onOpenMinesweeper,
  onOpenGuestbook,
  onOpenWindowsPhone,
  onUnfocusAll,
  isDark,
}) => {
  const [selectedIcons, setSelectedIcons] = useState<Set<string>>(new Set());
  const [contextMenuPos, setContextMenuPos] = useState<{ x: number; y: number } | null>(null);
  const { data: profile } = useProfile();

  // Marquee selection state
  const [marquee, setMarquee] = useState<{ startX: number; startY: number; currX: number; currY: number } | null>(null);
  const desktopRef = useRef<HTMLDivElement>(null);
  const isDraggingMarquee = useRef(false);

  const desktopIcons = [
    {
      id: 'my-computer',
      icon: MyComputerIcon,
      label: 'My Computer',
      onDoubleClick: onOpenMyComputer,
    },
    {
      id: 'projects',
      icon: FolderIcon,
      label: 'Projects',
      onDoubleClick: onNavigateToProjects,
    },
    {
      id: 'experience',
      icon: BriefcaseIcon,
      label: 'Experience',
      onDoubleClick: onNavigateToExperience,
    },
    {
      id: 'about-me',
      icon: WordIcon,
      label: 'About Me',
      onDoubleClick: () => onOpenWordDoc?.(),
    },
    {
      id: 'resume',
      icon: PdfIcon,
      label: 'Resume.pdf',
      onDoubleClick: () => onOpenPdfViewer?.(),
    },
    {
      id: 'ai-assistant',
      icon: SearchIcon,
      label: 'AI Assistant',
      onDoubleClick: () => onOpenAIChat?.(),
    },
    {
      id: 'readme',
      icon: NotepadIcon,
      label: 'README.txt',
      onDoubleClick: () => onOpenNotepad?.(),
    },
    {
      id: 'calculator',
      icon: '/icons/calculator_32.png',
      label: 'Calculator',
      onDoubleClick: () => onOpenCalculator?.(),
    },
    {
      id: 'minesweeper',
      icon: '/icons/minesweeper_32.png',
      label: 'Minesweeper',
      onDoubleClick: () => onOpenMinesweeper?.(),
    },
    {
      id: 'guestbook',
      icon: '/icons/display_properties_32.png',
      label: 'Guestbook',
      onDoubleClick: () => onOpenGuestbook?.(),
    },
    {
      id: 'windows-phone',
      icon: '/icons/phone_32.png',
      label: 'Windows Phone',
      onDoubleClick: () => onOpenWindowsPhone?.(),
    },
    {
      id: 'recycle-bin',
      icon: '/icons/recycle_bin_empty_32.png',
      label: 'Recycle Bin',
      onDoubleClick: () => onOpenMyComputer(),
    },
    {
      id: 'internet-explorer',
      icon: InternetExplorerIcon,
      label: 'Internet Explorer',
      onDoubleClick: () => onOpenBrowser(profile?.website || 'https://suhasnidgundi.tech'),
    },
    {
      id: 'github',
      icon: GithubIcon,
      label: 'GitHub',
      onDoubleClick: () => onOpenBrowser(profile?.github || 'https://github.com/suhasnidgundi'),
    },
    {
      id: 'linkedin',
      icon: LinkedinIcon,
      label: 'LinkedIn',
      onDoubleClick: () => onOpenBrowser(profile?.linkedin || 'https://linkedin.com/in/suhasnidgundi'),
    },
    {
      id: 'blog',
      icon: NotepadIcon,
      label: 'Blog',
      onDoubleClick: () => onOpenBrowser('https://medium.com/@suhasnidgundi'),
    },
  ];

  const handleIconClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onUnfocusAll?.();
    if (e.ctrlKey || e.metaKey) {
      setSelectedIcons((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });
    } else {
      setSelectedIcons(new Set([id]));
    }
  };

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return; // Left click only
    if ((e.target as HTMLElement).closest('.desktop-icon, .context-menu')) return;

    isDraggingMarquee.current = true;
    onUnfocusAll?.();
    setSelectedIcons(new Set());
    setMarquee({
      startX: e.clientX,
      startY: e.clientY,
      currX: e.clientX,
      currY: e.clientY,
    });
  }, [onUnfocusAll]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDraggingMarquee.current) return;
    setMarquee((prev) => (prev ? { ...prev, currX: e.clientX, currY: e.clientY } : null));

    // Check intersection with icons
    if (!marquee || !desktopRef.current) return;
    const rectX = Math.min(marquee.startX, e.clientX);
    const rectY = Math.min(marquee.startY, e.clientY);
    const rectW = Math.abs(e.clientX - marquee.startX);
    const rectH = Math.abs(e.clientY - marquee.startY);

    const hit = new Set<string>();
    const iconEls = desktopRef.current.querySelectorAll('.desktop-icon');
    iconEls.forEach((el) => {
      const box = el.getBoundingClientRect();
      if (
        rectX < box.right &&
        rectX + rectW > box.left &&
        rectY < box.bottom &&
        rectY + rectH > box.top
      ) {
        const iconId = el.getAttribute('data-icon-id');
        if (iconId) hit.add(iconId);
      }
    });

    if (hit.size > 0) {
      setSelectedIcons(hit);
    }
  }, [marquee]);

  const handleMouseUp = useCallback(() => {
    isDraggingMarquee.current = false;
    setMarquee(null);
  }, []);

  const handleDesktopContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    onUnfocusAll?.();
    setContextMenuPos({ x: e.clientX, y: e.clientY });
  };

  // Marquee rectangle dimensions
  const marqueeStyle = marquee
    ? {
        left: `${Math.min(marquee.startX, marquee.currX)}px`,
        top: `${Math.min(marquee.startY, marquee.currY)}px`,
        width: `${Math.abs(marquee.currX - marquee.startX)}px`,
        height: `${Math.abs(marquee.currY - marquee.startY)}px`,
      }
    : null;

  return (
    <div
      ref={desktopRef}
      className="absolute inset-0 bottom-[30px] overflow-hidden select-none"
      style={{
        backgroundImage: `url(${isDark ? WallpaperDark : '/wallpapers/bliss.jpg'})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onContextMenu={handleDesktopContextMenu}
    >
      {/* Desktop Icons Grid - Column-first layout like real Windows XP */}
      <div
        className="absolute top-2 left-2 bottom-2 flex flex-col flex-wrap gap-2 content-start pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {desktopIcons.map((icon) => (
          <DesktopIcon
            key={icon.id}
            id={icon.id}
            icon={icon.icon}
            label={icon.label}
            onClick={(e) => handleIconClick(icon.id, e)}
            onDoubleClick={icon.onDoubleClick}
            selected={selectedIcons.has(icon.id) || selectedIcons.has(icon.label)}
          />
        ))}
      </div>

      {/* Rubberband / Marquee selection rectangle */}
      {marquee && marqueeStyle && (
        <div
          className="marquee fixed pointer-events-none z-[99997] border border-[#316ac5] bg-[#316ac5]/25 outline-dotted outline-1 outline-white/80"
          style={marqueeStyle}
        />
      )}

      {/* Desktop Right Click Context Menu */}
      {contextMenuPos && (
        <XPDesktopContextMenu
          x={contextMenuPos.x}
          y={contextMenuPos.y}
          onRefresh={() => setSelectedIcons(new Set())}
          onOpenMyComputer={onOpenMyComputer}
          onDismiss={() => setContextMenuPos(null)}
        />
      )}
    </div>
  );
};

export default XPDesktop;
