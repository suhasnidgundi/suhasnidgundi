import { useState, ReactNode } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import GlobeIcon from '@/assets/xp/icons/globe_icon.png';
import BriefCaseIcon from '@/assets/xp/icons/briefcase_icon.png';
import FolderOpenIcon from "@/assets/xp/icons/folder_opened_icon.png";
import MediumBlogLogo from '@/assets/xp/icons/medium_blog_logo.png';
import LinkedinIcon from '@/assets/xp/icons/linkedin_icon.png';
import GithubIcon from '@/assets/xp/icons/github_icon.png';
import EmailIcon from '@/assets/xp/icons/email_icon.png';
import WordFileIcon from '@/assets/xp/icons/word_file_icon.png';
import UserIcon from '@/assets/xp/icons/user_icon.png';

interface SidebarSectionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

const SidebarSection = ({ title, children, defaultOpen = true }: SidebarSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="mb-3 select-none">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="xp-sidebar-header w-full flex justify-between items-center cursor-pointer"
      >
        <span>{title}</span>
        {isOpen ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button>
      {isOpen && (
        <div className="xp-sidebar-section">
          {children}
        </div>
      )}
    </div>
  );
};

interface SidebarLinkProps {
  icon: ReactNode;
  label: string;
  onClick?: () => void;
  href?: string;
  active?: boolean;
}

const SidebarLink = ({ icon, label, onClick, href, active }: SidebarLinkProps) => {
  const content = (
    <>
      <span className="shrink-0">{icon}</span>
      <span className={`xp-link ${active ? 'font-bold underline' : ''}`}>{label}</span>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-primary-foreground hover:text-primary-foreground/80 cursor-pointer py-0.5"
      >
        {content}
      </a>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 text-primary-foreground hover:text-primary-foreground/80 cursor-pointer w-full text-left py-0.5 ${
        active ? 'bg-blue-600/20 rounded-sm' : ''
      }`}
    >
      {content}
    </button>
  );
};

interface XPSidebarProps {
  onViewAboutMe?: () => void;
  onDownloadResume?: () => void;
  onNavigateFolder?: (folder: 'root' | 'projects' | 'experience') => void;
  currentFolder?: 'root' | 'projects' | 'experience';
}

const XPSidebar = ({ onViewAboutMe, onDownloadResume, onNavigateFolder, currentFolder = 'root' }: XPSidebarProps) => {
  const handleDownloadResume = () => {
    if (onDownloadResume) {
      onDownloadResume();
    } else {
      const link = document.createElement('a');
      link.href = '/resume.pdf';
      link.download = 'resume.pdf';
      link.click();
    }
  };

  const handleViewAboutMe = () => {
    if (onViewAboutMe) {
      onViewAboutMe();
    }
  };

  const handleNavigate = (folder: 'root' | 'projects' | 'experience') => {
    if (onNavigateFolder) {
      onNavigateFolder(folder);
    } else {
      if (folder === 'projects') window.location.href = '/projects';
      else if (folder === 'experience') window.location.href = '/experience';
      else window.location.href = '/';
    }
  };

  return (
    <div className="w-[180px] xp-sidebar flex-shrink-0 overflow-y-auto select-none">
      <SidebarSection title="Quick Actions">
        <SidebarLink 
          icon={<img src={UserIcon} alt="User" className="w-4 h-4 text-yellow-300" />} 
          label="View About Me" 
          onClick={handleViewAboutMe}
        />
        <SidebarLink 
          icon={<img src={WordFileIcon} alt="File Text" className="w-4 h-4 text-yellow-300" />} 
          label="Download Resume" 
          onClick={handleDownloadResume}
        />
        <SidebarLink 
          icon={<img src={EmailIcon} alt="Email" className="w-4 h-4 text-yellow-300" />} 
          label="Contact Me" 
          onClick={() => window.open('mailto:suhasnidgundi@gmail.com', '_blank')}
        />
      </SidebarSection>

      <SidebarSection title="Navigate To">
        <SidebarLink 
          icon={<img src={GlobeIcon} alt="Globe" className="w-4 h-4 text-yellow-500" />} 
          label="My Portfolio" 
          onClick={() => handleNavigate('root')}
          active={currentFolder === 'root'}
        />
        <SidebarLink 
          icon={<img src={FolderOpenIcon} alt="Folder Open" className="w-4 h-4 text-yellow-500" />} 
          label="Projects" 
          onClick={() => handleNavigate('projects')}
          active={currentFolder === 'projects'}
        />
        <SidebarLink 
          icon={<img src={BriefCaseIcon} alt="Briefcase" className="w-4 h-4 text-yellow-500" />} 
          label="Experience" 
          onClick={() => handleNavigate('experience')}
          active={currentFolder === 'experience'}
        />
      </SidebarSection>

      <SidebarSection title="Social Links">
        <SidebarLink 
          icon={<img src={GithubIcon} alt="GitHub" className="w-4 h-4 text-yellow-300" />} 
          label="GitHub" 
          href="https://github.com/suhasnidgundi"
        />
        <SidebarLink 
          icon={<img src={LinkedinIcon} alt="LinkedIn" className="w-4 h-4 text-yellow-300" />} 
          label="LinkedIn" 
          href="https://linkedin.com/in/suhasnidgundi"
        />
        <SidebarLink 
          icon={<img src={MediumBlogLogo} alt="Medium Blog" className="w-4 h-4 text-yellow-300" />} 
          label="Medium Blog" 
          href="https://medium.com/@suhasnidgundi"
        />
      </SidebarSection>
    </div>
  );
};

export default XPSidebar;
