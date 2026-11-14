import { useNavigate } from 'react-router-dom';
import MyComputerIcon from '@/assets/xp/icons/my_computer.png';
import FolderIcon from '@/assets/xp/icons/folder_icon.png';
import BriefcaseIcon from '@/assets/xp/icons/briefcase_icon.png';
import NotepadIcon from '@/assets/xp/icons/notepad_icon.png';
import InternetExplorerIcon from '@/assets/xp/icons/internet_explorer_icon.png';
import UserIcon from '@/assets/xp/icons/user_icon.png';
import ShutDownIcon from '@/assets/xp/icons/Power.png';
import LogoutIcon from '@/assets/xp/icons/Logout.png';
import WordIcon from '@/assets/xp/icons/ms_word_logo_icon.png';
import SearchIcon from '@/assets/xp/icons/search_icon.png';
import { useEdgeConfig } from '@/hooks/useEdgeConfig';
import { useProfile } from '@/hooks/useProfile';

interface StartMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenMyComputer: () => void;
  onOpenWordDoc: () => void;
  onOpenBrowser: (url: string) => void;
  onOpenAIChat?: () => void;
  onOpenNotepad?: () => void;
  onOpenCalculator?: () => void;
  onOpenMinesweeper?: () => void;
  onOpenGuestbook?: () => void;
  onLogOff: () => void;
  onOpenFolder?: (folder: 'root' | 'projects' | 'experience') => void;
}

const StartMenu = ({
  isOpen,
  onClose,
  onOpenMyComputer,
  onOpenWordDoc,
  onOpenBrowser,
  onOpenAIChat,
  onOpenNotepad,
  onOpenCalculator,
  onOpenMinesweeper,
  onOpenGuestbook,
  onLogOff,
  onOpenFolder,
}: StartMenuProps) => {
  const navigate = useNavigate();
  const { data: edgeConfig } = useEdgeConfig();
  const { data: profile } = useProfile();

  if (!isOpen) return null;

  const handleItemClick = (action: () => void) => {
    action();
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[199]"
        onClick={onClose}
      />

      {/* Start Menu */}
      <div
        className="fixed bottom-[30px] left-0 z-[200] w-[380px] rounded-t-[7px] shadow-2xl overflow-hidden select-none border-t border-l border-r border-[#0055ea]"
        style={{
          boxShadow: '2px -2px 14px rgba(0, 0, 0, 0.45), inset 1px 1px 0 rgba(255, 255, 255, 0.4)',
        }}
      >
        {/* User Header - Authentic Luna Top Banner */}
        <div 
          className="flex items-center gap-3 px-3 h-[67px]"
          style={{
            backgroundImage: "url('/startmenu/top.png')",
            backgroundSize: '380px 67px',
            backgroundPosition: 'top left',
            backgroundRepeat: 'no-repeat',
            backgroundColor: '#0058ee',
          }}
        >
          <div className="w-[50px] h-[50px] rounded-[4px] overflow-hidden border-2 border-[#ccd6eb] shadow-md bg-white shrink-0">
            <img
              src={UserIcon}
              alt="User"
              className="w-full h-full object-cover bg-gradient-to-br from-[#3a7bd5] to-[#5aa9ff]"
            />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-white font-bold text-[16px] font-['Trebuchet_MS',Tahoma,sans-serif] drop-shadow-[1px_1px_2px_#0a1883b3] truncate">
              {profile?.name || 'Suhas Nidgundi'}
            </span>
            <span className="text-[10px] text-emerald-200 font-medium font-['MSSans',Tahoma,sans-serif] drop-shadow-[0_1px_1px_#000]">
              {edgeConfig?.openToWork || profile?.openToWork ? '🟢 Available for Hire' : '💻 Full Stack Engineer'}
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex h-[360px] border-b border-[#0055ea]">
          {/* Left Column - Programs */}
          <div className="w-[58%] bg-white flex flex-col justify-between">
            <div className="py-1">
              {/* Pinned Programs */}
              <MenuItem
                icon={InternetExplorerIcon}
                title="Internet Explorer"
                subtitle="Browse the Web"
                onClick={() => handleItemClick(() => onOpenBrowser('https://github.com/suhasnidgundi'))}
              />
              <MenuItem
                icon={WordIcon}
                title="About Me"
                subtitle="Microsoft Word"
                onClick={() => handleItemClick(onOpenWordDoc)}
              />
              {onOpenAIChat && (
                <MenuItem
                  icon={SearchIcon}
                  title="AI Assistant"
                  subtitle="Chat with Suhas AI"
                  onClick={() => handleItemClick(onOpenAIChat)}
                />
              )}

              <div className="my-1.5 mx-2.5 h-[1px] bg-gradient-to-r from-transparent via-[#d3d3d3] to-transparent" />

              {/* Recent Programs */}
              <MenuItem
                icon={MyComputerIcon}
                title="My Computer"
                onClick={() => handleItemClick(onOpenMyComputer)}
              />
              <MenuItem
                icon={FolderIcon}
                title="Projects"
                onClick={() => handleItemClick(() => (onOpenFolder ? onOpenFolder('projects') : navigate('/projects')))}
              />
              <MenuItem
                icon={BriefcaseIcon}
                title="Experience"
                onClick={() => handleItemClick(() => (onOpenFolder ? onOpenFolder('experience') : navigate('/experience')))}
              />
              <MenuItem
                icon={NotepadIcon}
                title="Notepad"
                subtitle="README.txt"
                onClick={() => handleItemClick(() => onOpenNotepad?.())}
              />
              <MenuItem
                icon="/icons/calculator_32.png"
                title="Calculator"
                onClick={() => handleItemClick(() => onOpenCalculator?.())}
              />
              <MenuItem
                icon="/icons/minesweeper_32.png"
                title="Minesweeper"
                onClick={() => handleItemClick(() => onOpenMinesweeper?.())}
              />
            </div>

            {/* All Programs - Authentic XP bar */}
            <div className="p-1 border-t border-[#d3d3d3]">
              <div 
                className="flex items-center justify-center gap-2 py-1.5 px-3 rounded hover:bg-[#316ac5] hover:text-white cursor-pointer group transition-colors"
                onClick={() => handleItemClick(onOpenMyComputer)}
              >
                <span className="font-bold text-[11px] text-[#000080] group-hover:text-white font-['MSSans',Tahoma,sans-serif]">
                  All Programs
                </span>
                <span className="text-[#008000] group-hover:text-white font-bold text-[10px]">▶</span>
              </div>
            </div>
          </div>

          {/* Right Column - Quick Links */}
          <div className="w-[42%] bg-gradient-to-b from-[#d3e5fa] to-[#a8c8e8] py-2 border-l border-[#95b4e0]">
            <RightMenuItem
              icon={MyComputerIcon}
              title="My Computer"
              onClick={() => handleItemClick(onOpenMyComputer)}
              bold
            />
            <RightMenuItem
              icon={FolderIcon}
              title="My Documents"
              onClick={() => handleItemClick(() => (onOpenFolder ? onOpenFolder('root') : onOpenMyComputer()))}
            />
            <RightMenuItem
              icon={FolderIcon}
              title="My Projects"
              onClick={() => handleItemClick(() => (onOpenFolder ? onOpenFolder('projects') : navigate('/projects')))}
            />

            <RightMenuItem
              icon="/icons/display_properties_32.png"
              title="Guestbook"
              onClick={() => handleItemClick(() => onOpenGuestbook?.())}
              bold
            />

            <div className="my-2 mx-3 h-[1px] bg-[#95b4e0]" />

            <RightMenuItem
              icon={InternetExplorerIcon}
              title="GitHub"
              onClick={() => handleItemClick(() => onOpenBrowser('https://github.com/suhasnidgundi'))}
            />
            <RightMenuItem
              icon={InternetExplorerIcon}
              title="LinkedIn"
              onClick={() => handleItemClick(() => onOpenBrowser('https://linkedin.com/in/suhasnidgundi'))}
            />
          </div>
        </div>

        {/* Bottom Bar - Authentic Luna Footer */}
        <div 
          className="flex items-center justify-end gap-3 px-4 h-[48px]"
          style={{
            backgroundImage: "url('/startmenu/bottom.png')",
            backgroundSize: '380px 48px',
            backgroundPosition: 'bottom left',
            backgroundRepeat: 'no-repeat',
            backgroundColor: '#1a3fb3',
          }}
        >
          <button
            onClick={() => handleItemClick(onLogOff)}
            className="flex items-center gap-2 px-2.5 py-1 text-white text-[11px] font-['MSSans',Tahoma,sans-serif] hover:bg-white/20 active:bg-black/20 rounded cursor-pointer transition-colors"
          >
            <img src={LogoutIcon} alt="Log Off" className="w-5 h-5 object-contain" />
            <span className="drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)] font-semibold">Log Off</span>
          </button>
          <button
            onClick={() => handleItemClick(onLogOff)}
            className="flex items-center gap-2 px-2.5 py-1 text-white text-[11px] font-['MSSans',Tahoma,sans-serif] hover:bg-white/20 active:bg-black/20 rounded cursor-pointer transition-colors"
          >
            <img src={ShutDownIcon} alt="Turn Off Computer" className="w-5 h-5 object-contain" />
            <span className="drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)] font-semibold">Turn Off Computer</span>
          </button>
        </div>
      </div>
    </>
  );
};

// Menu item component for left column
const MenuItem = ({
  icon,
  title,
  subtitle,
  onClick
}: {
  icon: string;
  title: string;
  subtitle?: string;
  onClick: () => void;
}) => (
  <div
    className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-[#316ac5] hover:text-white group transition-colors"
    onClick={onClick}
  >
    <img src={icon} alt={title} className="w-8 h-8" />
    <div className="flex flex-col">
      <span className="text-[12px] font-semibold text-[#000080] group-hover:text-white">
        {title}
      </span>
      {subtitle && (
        <span className="text-[10px] text-gray-600 group-hover:text-white/80">
          {subtitle}
        </span>
      )}
    </div>
  </div>
);

// Menu item component for right column
const RightMenuItem = ({
  icon,
  title,
  onClick,
  bold
}: {
  icon: string;
  title: string;
  onClick: () => void;
  bold?: boolean;
}) => (
  <div
    className="flex items-center gap-2 px-3 py-1.5 cursor-pointer hover:bg-[#316ac5] hover:text-white group transition-colors"
    onClick={onClick}
  >
    <img src={icon} alt={title} className="w-5 h-5" />
    <span className={`text-[11px] text-[#21347a] group-hover:text-white ${bold ? 'font-bold' : ''}`}>
      {title}
    </span>
  </div>
);

export default StartMenu;
