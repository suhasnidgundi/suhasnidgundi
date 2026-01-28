import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MyComputerIcon from "@/assets/xp/icons/my_computer.png";
import { useFeaturedProject } from "@/hooks/useProjects";
import { useCurrentExperience } from "@/hooks/useExperiences";
import XPWindow from "@/components/xp/XPWindow";
import XPMenuBar from "@/components/xp/XPMenuBar";
import XPToolbar from "@/components/xp/XPToolbar";
import XPAddressBar from "@/components/xp/XPAddressBar";
import XPSidebar from "@/components/xp/XPSidebar";
import FolderIcon from "@/assets/xp/icons/folder_icon.png";
import DocumentIcon from "@/assets/xp/icons/word_file_icon.png";
import UserIcon from "@/assets/xp/icons/user_icon.png";
import BriefcaseIcon from "@/assets/xp/icons/briefcase_icon.png";
import GithubIcon from "@/assets/xp/icons/github_icon.png";
import NotepadIcon from "@/assets/xp/icons/notepad_icon.png";
import MailIcon from "@/assets/xp/icons/email_icon.png";
import LinkedinIcon from "@/assets/xp/icons/linkedin_icon.png";

// My Computer style file/folder item component
interface FileItemProps {
  icon: string;
  label: string;
  onClick?: () => void;
  onDoubleClick?: () => void;
  selected?: boolean;
}

const FileItem = ({ icon, label, onClick, onDoubleClick, selected }: FileItemProps) => {
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
      className={`xp-file-item w-[150px] overflow-hidden inline-flex flex-row items-center m-2 cursor-pointer
        ${selected ? 'bg-blue-600/20' : ''}`}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onKeyDown={handleKeyDown}
    >
      <img
        src={icon}
        alt={label}
        className="w-[50px] h-[50px] shrink-0 object-contain"
      />
      <div className={`px-1 text-[11px] line-clamp-2 text-ellipsis leading-tight
        ${selected ? 'bg-blue-600 text-white' : ''}`}>
        {label}
      </div>
    </div>
  );
};

// Section divider component (win32.run style)
const SectionDivider = ({ title }: { title: string }) => (
  <>
    <p className="xp-section-title ml-2 mt-4 text-black dark:text-gray-100 text-[11px] font-bold">
      {title}
    </p>
    <div className="mb-4 w-[300px] h-[2px] bg-gradient-to-r from-blue-500 to-slate-50 dark:to-gray-800" />
  </>
);

interface XPMyComputerWindowProps {
  isDark: boolean;
  onMinimize?: () => void;
  onMaximize?: () => void;
  onClose?: () => void;
  onOpenWordDoc: () => void;
  onOpenPdfViewer: () => void;
  onOpenBrowser: (url: string) => void;
  zIndex?: number;
  onFocus?: () => void;
}

const XPMyComputerWindow = ({ 
  isDark,
  onMinimize, 
  onMaximize, 
  onClose,
  onOpenWordDoc,
  onOpenPdfViewer,
  onOpenBrowser,
  zIndex = 1,
  onFocus
}: XPMyComputerWindowProps) => {
  const navigate = useNavigate();
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);

  // Fetch dynamic content
  const { data: featuredProject } = useFeaturedProject();
  const { data: currentExperience } = useCurrentExperience();

  const handleIconClick = (id: string) => {
    setSelectedIcon(selectedIcon === id ? null : id);
  };

  const handleIconDoubleClick = (path: string) => {
    navigate(path);
  };

  return (
    <XPWindow
      title="My Portfolio"
      icon={<img src={MyComputerIcon} alt="My Computer" className="w-4 h-4 text-primary-foreground" />}
      onMinimize={onMinimize}
      onMaximize={onMaximize}
      onClose={onClose}
      zIndex={zIndex}
      onFocus={onFocus}
    >
      {/* Sticky Headers */}
      <XPMenuBar />
      <XPToolbar />
      <XPAddressBar />

      {/* Main Content Area - Scrollable */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Sidebar */}
        <XPSidebar 
          onViewAboutMe={onOpenWordDoc}
          onDownloadResume={() => {
            const link = document.createElement('a');
            link.href = '/resume.pdf';
            link.download = 'Suhas_Nidgundi_Resume.pdf';
            link.click();
          }}
        />

        {/* Content - My Computer style viewer */}
        <div className="flex-1 bg-slate-50 dark:bg-gray-900 overflow-y-auto">
          <div className="w-full min-h-full p-2">
            {/* Files Stored Section - My Computer Style */}
            <SectionDivider title="About Me" />
            <FileItem
              icon={UserIcon}
              label="Suhas Nidgundi"
              onClick={() => handleIconClick("about")}
              onDoubleClick={onOpenWordDoc}
              selected={selectedIcon === "about"}
            />
            <FileItem
              icon={DocumentIcon}
              label="Resume.pdf"
              onClick={() => handleIconClick("resume")}
              onDoubleClick={onOpenPdfViewer}
              selected={selectedIcon === "resume"}
            />

            {/* Portfolio Folders - My Computer Style */}
            <SectionDivider title="Portfolio Sections" />
            <FileItem
              icon={FolderIcon}
              label="Projects"
              onClick={() => handleIconClick("projects")}
              onDoubleClick={() => handleIconDoubleClick("/projects")}
              selected={selectedIcon === "projects"}
            />
            <FileItem
              icon={BriefcaseIcon}
              label="Experience"
              onClick={() => handleIconClick("experience")}
              onDoubleClick={() => handleIconDoubleClick("/experience")}
              selected={selectedIcon === "experience"}
            />
            <FileItem
              icon={NotepadIcon}
              label="Blog Posts"
              onClick={() => handleIconClick("blog")}
              onDoubleClick={() => onOpenBrowser("https://medium.com/@suhasnidgundi")}
              selected={selectedIcon === "blog"}
            />

            {/* Social Links - Devices with Removable Storage Style */}
            <SectionDivider title="Connect With Me" />
            <FileItem
              icon={GithubIcon}
              label="GitHub"
              onClick={() => handleIconClick("github")}
              onDoubleClick={() => onOpenBrowser("https://github.com/suhasnidgundi")}
              selected={selectedIcon === "github"}
            />
            <FileItem
              icon={LinkedinIcon}
              label="LinkedIn"
              onClick={() => handleIconClick("linkedin")}
              onDoubleClick={() => onOpenBrowser("https://linkedin.com/in/suhasnidgundi")}
              selected={selectedIcon === "linkedin"}
            />
            <FileItem
              icon={MailIcon}
              label="Contact Me"
              onClick={() => handleIconClick("contact")}
              onDoubleClick={() => { window.location.href = 'mailto:suhasnidgundi@gmail.com'; }}
              selected={selectedIcon === "contact"}
            />

            {/* Featured Project - Dynamic */}
            {featuredProject && (
              <div className="mt-4 p-4 bg-white dark:bg-gray-800 border border-[#7f9db9] dark:border-gray-600 rounded mx-2">
                <h3 className="xp-section-title text-[12px] font-bold text-black dark:text-gray-100 mb-2">
                  📌 Featured Project
                </h3>
                <p className="text-[11px] text-gray-600 dark:text-gray-400 mb-2">
                  <strong>{featuredProject.title}</strong> - {featuredProject.impact_metric || featuredProject.description}
                </p>
                <div className="flex gap-1 flex-wrap">
                  {featuredProject.tech_stack?.slice(0, 3).map((tech) => (
                    <span key={tech} className="px-2 py-0.5 bg-[#3366cc]/20 text-[#3366cc] dark:text-blue-400 text-[10px] rounded">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Current Experience - Dynamic */}
            {currentExperience && (
              <div className="mt-4 p-4 bg-white dark:bg-gray-800 border border-[#7f9db9] dark:border-gray-600 rounded mx-2">
                <h3 className="xp-section-title text-[12px] font-bold text-black dark:text-gray-100 mb-2">
                  💼 Current Position
                </h3>
                <p className="text-[11px] text-gray-600 dark:text-gray-400">
                  <strong>{currentExperience.role}</strong> @ {currentExperience.company}
                </p>
                {currentExperience.description && (
                  <p className="text-[10px] text-gray-600 dark:text-gray-400 mt-1">
                    {currentExperience.description}
                  </p>
                )}
              </div>
            )}

            {/* GitHub Graph */}
            <div className="mt-4 mb-8 p-4 bg-white dark:bg-gray-800 border border-[#7f9db9] dark:border-gray-600 rounded mx-2">
              <h3 className="xp-section-title text-[12px] font-bold text-black dark:text-gray-100 mb-2">
                📊 GitHub Activity
              </h3>
              <div className="overflow-x-auto">
                <img
                  src={`https://ghchart.rshah.org/${isDark ? '3b82f6' : '0066cc'}/suhasnidgundi`}
                  alt="GitHub Contribution Graph"
                  className="max-w-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </XPWindow>
  );
};

export default XPMyComputerWindow;
