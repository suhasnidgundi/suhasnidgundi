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

interface StartMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenMyComputer: () => void;
  onOpenWordDoc: () => void;
  onOpenBrowser: (url: string) => void;
  onLogOff: () => void;
}

const StartMenu = ({
  isOpen,
  onClose,
  onOpenMyComputer,
  onOpenWordDoc,
  onOpenBrowser,
  onLogOff
}: StartMenuProps) => {
  const navigate = useNavigate();

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
        className="fixed bottom-[30px] left-0 z-[200] w-[380px] bg-gradient-to-b from-[#1f5bff] to-[#0045d4] rounded-tr-lg shadow-2xl overflow-hidden"
        style={{
          boxShadow: '4px -4px 12px rgba(0, 0, 0, 0.4), inset 1px 1px 0 rgba(255, 255, 255, 0.3)',
        }}
      >
        {/* User Header */}
        <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-[#0058ee] to-[#3a88ff]">
          <div className="w-12 h-12 rounded-md overflow-hidden border-2 border-white/50 shadow-md">
            <img
              src={UserIcon}
              alt="User"
              className="w-full h-full object-cover bg-gradient-to-br from-[#3a7bd5] to-[#5aa9ff]"
            />
          </div>
          <span className="text-white font-bold text-[14px] drop-shadow-sm">
            Suhas Nidgundi
          </span>
        </div>

        {/* Main Content */}
        <div className="flex h-[340px]">
          {/* Left Column - Programs */}
          <div className="w-[60%] bg-white flex flex-col">
            <div className="flex-1 py-2">
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

              <div className="my-2 mx-3 h-px bg-gray-300" />

              {/* Recent Programs */}
              <MenuItem
                icon={MyComputerIcon}
                title="My Computer"
                onClick={() => handleItemClick(onOpenMyComputer)}
              />
              <MenuItem
                icon={FolderIcon}
                title="Projects"
                onClick={() => handleItemClick(() => navigate('/projects'))}
              />
              <MenuItem
                icon={BriefcaseIcon}
                title="Experience"
                onClick={() => handleItemClick(() => navigate('/experience'))}
              />
              <MenuItem
                icon={NotepadIcon}
                title="Blog Posts"
                onClick={() => handleItemClick(() => onOpenBrowser('https://medium.com/@suhasnidgundi'))}
              />
            </div>

            {/* All Programs - Visual indicator without functionality */}
            {/* <div className="px-3 py-2 border-t border-gray-200 bg-gradient-to-b from-gray-50 to-gray-100">
              <div 
                className="flex items-center justify-between text-[11px] text-gray-500"
                title="Coming soon"
              >
                <span className="font-semibold">All Programs</span>
                <span>▶</span>
              </div>
            </div> */}
          </div>

          {/* Right Column - Quick Links */}
          <div className="w-[40%] bg-gradient-to-b from-[#d3e5fa] to-[#a8c8e8] py-2">
            <RightMenuItem
              icon={MyComputerIcon}
              title="My Computer"
              onClick={() => handleItemClick(onOpenMyComputer)}
              bold
            />
            <RightMenuItem
              icon={FolderIcon}
              title="My Documents"
              onClick={() => handleItemClick(onOpenMyComputer)}
            />
            <RightMenuItem
              icon={FolderIcon}
              title="My Projects"
              onClick={() => handleItemClick(() => navigate('/projects'))}
            />

            <div className="my-2 mx-3 h-px bg-[#7ba2ce]" />

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

        {/* Bottom Bar */}
        <div className="flex items-center justify-end gap-2 px-3 py-2 bg-gradient-to-r from-[#1a3fb3] to-[#3a6fd9] border-t border-[#4d7dd4]">
          <button
            onClick={() => handleItemClick(onLogOff)}
            className="flex items-center gap-2 px-3 py-1 text-white text-[11px] hover:bg-white/10 rounded transition-colors"
          >
            <img src={LogoutIcon} alt="Log Off" className="w-4 h-4" />
            <span>Log Off</span>
          </button>
          <button
            onClick={() => handleItemClick(onLogOff)}
            className="flex items-center gap-2 px-3 py-1 text-white text-[11px] hover:bg-white/10 rounded transition-colors"
          >
            <img src={ShutDownIcon} alt="Shut Down" className="w-4 h-4" />
            <span>Shut Down</span>
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
