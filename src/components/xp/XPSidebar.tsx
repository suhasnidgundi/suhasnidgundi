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
    <div className="mb-3">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="xp-sidebar-header w-full flex justify-between items-center"
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
}

const SidebarLink = ({ icon, label, onClick, href }: SidebarLinkProps) => {
  const content = (
    <>
      <span className="">{icon}</span>
      <span className="xp-link">{label}</span>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-primary-foreground hover:text-primary-foreground/80 cursor-pointer"
      >
        {content}
      </a>
    );
  }

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 text-primary-foreground hover:text-primary-foreground/80 cursor-pointer w-full text-left"
    >
      {content}
    </button>
  );
};

interface XPSidebarProps {
  onViewAboutMe?: () => void;
  onDownloadResume?: () => void;
}

const XPSidebar = ({ onViewAboutMe, onDownloadResume }: XPSidebarProps) => {
  const handleDownloadResume = () => {
    if (onDownloadResume) {
      onDownloadResume();
    } else {
      // Fallback to direct download
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

  return (
    <div className="w-[180px] xp-sidebar flex-shrink-0 overflow-y-auto">
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

      <SidebarSection title="Navigate To">
        <SidebarLink 
          icon={<img src={FolderOpenIcon} alt="Folder Open" className="w-4 h-4 text-yellow-500" />} 
          label="Projects" 
          onClick={() => window.location.href = '/projects'}
        />
        <SidebarLink 
          icon={<img src={BriefCaseIcon} alt="Briefcase" className="w-4 h-4 text-yellow-500" />} 
          label="Experience" 
          onClick={() => window.location.href = '/experience'}
        />
        <SidebarLink 
          icon={<img src={GlobeIcon} alt="Globe" className="w-4 h-4 text-yellow-500" />} 
          label="My Portfolio" 
          onClick={() => window.location.href = '/'}
        />
      </SidebarSection>
    </div>
  );
};

export default XPSidebar;
