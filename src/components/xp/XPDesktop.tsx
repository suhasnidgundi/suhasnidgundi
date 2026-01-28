import { useState } from 'react';
import MyComputerIcon from '@/assets/xp/icons/my_computer.png';
import InternetExplorerIcon from '@/assets/xp/icons/internet_explorer_icon.png';
import FolderIcon from '@/assets/xp/icons/folder_icon.png';
import NotepadIcon from '@/assets/xp/icons/notepad_icon.png';
import GithubIcon from '@/assets/xp/icons/github_icon.png';
import LinkedinIcon from '@/assets/xp/icons/linkedin_icon.png';
import BriefcaseIcon from '@/assets/xp/icons/briefcase_icon.png';
import WallpaperLight from '@/assets/xp/wallpaper_light.jpg';
import WallpaperDark from '@/assets/xp/wallpaper_dark.jpg';

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
      className={`flex flex-col items-center justify-center w-[75px] p-2 cursor-pointer
        ${selected ? 'bg-[#316ac5]/50' : 'hover:bg-white/10'} rounded transition-colors`}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onKeyDown={handleKeyDown}
    >
      <img
        src={icon}
        alt={label}
        className="w-12 h-12 object-contain drop-shadow-lg mb-1"
      />
      <span
        className={`text-[11px] text-center leading-tight text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]
          ${selected ? 'bg-[#316ac5] px-1' : ''}`}
        style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
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
  isDark: boolean;
}

const XPDesktop = ({
  onOpenMyComputer,
  onOpenBrowser,
  onNavigateToProjects,
  onNavigateToExperience,
  isDark
}: XPDesktopProps) => {
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);

  const handleIconClick = (id: string) => {
    setSelectedIcon(selectedIcon === id ? null : id);
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
      className="absolute inset-0 bottom-[30px] overflow-hidden"
      style={{
        backgroundImage: `url(${isDark ? WallpaperDark : WallpaperLight})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
      onClick={() => selectedIcon && setSelectedIcon(null)}
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
            onClick={() => handleIconClick(icon.id)}
            onDoubleClick={icon.onDoubleClick}
            selected={selectedIcon === icon.id}
          />
        ))}
      </div>
    </div>
  );
};

export default XPDesktop;
