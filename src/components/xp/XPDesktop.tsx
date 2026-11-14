import { useState } from 'react';
import MyComputerIcon from '@/assets/xp/icons/my_computer.png';
import InternetExplorerIcon from '@/assets/xp/icons/internet_explorer_icon.png';
import FolderIcon from '@/assets/xp/icons/folder_icon.png';
import NotepadIcon from '@/assets/xp/icons/notepad_icon.png';
import GithubIcon from '@/assets/xp/icons/github_icon.png';
import LinkedinIcon from '@/assets/xp/icons/linkedin_icon.png';
import BriefcaseIcon from '@/assets/xp/icons/briefcase_icon.png';
import SearchIcon from '@/assets/xp/icons/search_icon.png';
import WallpaperLight from '@/assets/xp/wallpaper_light.jpg';
import WallpaperDark from '@/assets/xp/wallpaper_dark.jpg';
import { XPDesktopContextMenu } from './XPDesktopContextMenu';

interface DesktopIconProps {
  icon: string;
  label: string;
  onClick?: () => void;
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
      className={`flex flex-col items-center justify-center w-[82px] p-1.5 cursor-pointer select-none rounded-[2px] transition-all ${
        selected ? 'bg-[#316ac5]/30 ring-1 ring-[#316ac5]/60' : 'hover:bg-white/10'
      }`}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onKeyDown={handleKeyDown}
    >
      <img
        src={icon}
        alt={label}
        className={`w-11 h-11 object-contain mb-1 transition-all ${
          selected ? 'filter drop-shadow-[0_0_2px_#316ac5]' : 'drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]'
        }`}
      />
      <span
        className={`text-[11px] text-center leading-snug text-white font-['MSSans',Tahoma,sans-serif] px-1 py-0.5 rounded-[1px] ${
          selected
            ? 'bg-[#316ac5] text-white outline outline-1 outline-dotted outline-white/80'
            : 'drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]'
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
  onUnfocusAll?: () => void;
  isDark: boolean;
}

const XPDesktop = ({
  onOpenMyComputer,
  onOpenBrowser,
  onNavigateToProjects,
  onNavigateToExperience,
  onOpenAIChat,
  onUnfocusAll,
  isDark,
}: XPDesktopProps) => {
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [contextMenuPos, setContextMenuPos] = useState<{ x: number; y: number } | null>(null);

  const handleIconClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIcon(selectedIcon === id ? null : id);
    onUnfocusAll?.();
  };

  const handleDesktopClick = () => {
    if (selectedIcon) setSelectedIcon(null);
    onUnfocusAll?.();
  };

  const handleDesktopContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    onUnfocusAll?.();
    setContextMenuPos({ x: e.clientX, y: e.clientY });
  };

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
      id: 'ai-assistant',
      icon: SearchIcon,
      label: 'AI Assistant',
      onDoubleClick: onOpenAIChat,
    },
    {
      id: 'github',
      icon: GithubIcon,
      label: 'GitHub',
      onDoubleClick: () => onOpenBrowser('https://github.com/suhasnidgundi'),
    },
    {
      id: 'linkedin',
      icon: LinkedinIcon,
      label: 'LinkedIn',
      onDoubleClick: () => onOpenBrowser('https://linkedin.com/in/suhasnidgundi'),
    },
    {
      id: 'internet-explorer',
      icon: InternetExplorerIcon,
      label: 'Internet Explorer',
      onDoubleClick: () => onOpenBrowser('https://www.bing.com'),
    },
    {
      id: 'blog',
      icon: NotepadIcon,
      label: 'Blog',
      onDoubleClick: () => onOpenBrowser('https://medium.com/@suhasnidgundi'),
    },
  ];

  return (
    <div
      className="absolute inset-0 bottom-[30px] overflow-hidden select-none"
      style={{
        backgroundImage: `url(${isDark ? WallpaperDark : WallpaperLight})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
      onClick={handleDesktopClick}
      onContextMenu={handleDesktopContextMenu}
    >
      {/* Desktop Icons Grid */}
      <div
        className="absolute top-4 left-4 flex flex-col gap-1"
        onClick={(e) => e.stopPropagation()}
      >
        {desktopIcons.map((icon) => (
          <DesktopIcon
            key={icon.id}
            icon={icon.icon}
            label={icon.label}
            onClick={(e) => handleIconClick(icon.id, e as unknown as React.MouseEvent)}
            onDoubleClick={icon.onDoubleClick}
            selected={selectedIcon === icon.id}
          />
        ))}
      </div>

      {/* Desktop Right Click Context Menu */}
      {contextMenuPos && (
        <XPDesktopContextMenu
          x={contextMenuPos.x}
          y={contextMenuPos.y}
          onRefresh={() => setSelectedIcon(null)}
          onOpenMyComputer={onOpenMyComputer}
          onDismiss={() => setContextMenuPos(null)}
        />
      )}
    </div>
  );
};

export default XPDesktop;
