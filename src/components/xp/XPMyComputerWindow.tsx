import { useState, useEffect } from "react";
import MyComputerIcon from "@/assets/xp/icons/my_computer.png";
import { useFeaturedProject, useProjects } from "@/hooks/useProjects";
import { useCurrentExperience, useExperiences } from "@/hooks/useExperiences";
import { useProfile } from "@/hooks/useProfile";
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
import InternetExplorerIcon from "@/assets/xp/icons/internet_explorer_icon.png";
import { ExternalLink, Github, ArrowUp } from "lucide-react";

export type ExplorerFolder = 'root' | 'projects' | 'experience';

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
      className={`xp-file-item w-[150px] overflow-hidden inline-flex flex-row items-center m-2 cursor-pointer select-none rounded-[2px] transition-all
        ${selected ? 'bg-[#316ac5]/20 ring-1 ring-[#316ac5]/40' : 'hover:bg-black/5 dark:hover:bg-white/5'}`}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onKeyDown={handleKeyDown}
    >
      <img
        src={icon}
        alt={label}
        className="w-[48px] h-[48px] shrink-0 object-contain p-1"
      />
      <div className={`px-1 text-[11px] line-clamp-2 text-ellipsis leading-tight font-['MSSans',Tahoma,sans-serif]
        ${selected ? 'bg-[#316ac5] text-white outline outline-1 outline-dotted outline-white/80' : 'text-foreground'}`}>
        {label}
      </div>
    </div>
  );
};

// Section divider component (win32.run style)
const SectionDivider = ({ title }: { title: string }) => (
  <>
    <p className="xp-section-title ml-2 mt-4 text-black dark:text-gray-100 text-[11px] font-bold font-['MSSans',Tahoma,sans-serif]">
      {title}
    </p>
    <div className="mb-4 w-[300px] h-[2px] bg-gradient-to-r from-blue-500 to-slate-50 dark:to-gray-800" />
  </>
);

interface XPMyComputerWindowProps {
  isDark: boolean;
  initialFolder?: ExplorerFolder;
  currentFolderProp?: ExplorerFolder;
  onMinimize?: () => void;
  onMaximize?: () => void;
  onClose?: () => void;
  onOpenWordDoc: () => void;
  onOpenPdfViewer: () => void;
  onOpenBrowser: (url: string) => void;
  zIndex?: number;
  onFocus?: () => void;
  isMaximized?: boolean;
  isActive?: boolean;
  onPositionChange?: (pos: { x: number; y: number }) => void;
  onSizeChange?: (size: { width: number; height: number }) => void;
  onTitleChange?: (title: string) => void;
}

const XPMyComputerWindow = ({
  isDark,
  initialFolder = 'root',
  currentFolderProp,
  onMinimize,
  onMaximize,
  onClose,
  onOpenWordDoc,
  onOpenPdfViewer,
  onOpenBrowser,
  zIndex = 1,
  onFocus,
  isMaximized,
  isActive,
  onPositionChange,
  onSizeChange,
  onTitleChange,
}: XPMyComputerWindowProps) => {
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [history, setHistory] = useState<ExplorerFolder[]>([initialFolder]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const currentFolder: ExplorerFolder = history[historyIndex] || 'root';

  // Fetch dynamic content
  const { data: profile } = useProfile();
  const { data: featuredProject } = useFeaturedProject();
  const { data: currentExperience } = useCurrentExperience();
  const { data: projects, isLoading: projectsLoading } = useProjects();
  const { data: experiences, isLoading: expLoading } = useExperiences();

  // Synchronize when currentFolderProp changes from external triggers (e.g. Start Menu, Desktop shortcuts)
  useEffect(() => {
    if (currentFolderProp && currentFolderProp !== currentFolder) {
      navigateToFolder(currentFolderProp);
    }
  }, [currentFolderProp]);

  // Navigate folder logic (in-window navigation)
  const navigateToFolder = (folder: ExplorerFolder) => {
    setSelectedIcon(null);
    if (folder === currentFolder) return;
    const newHistory = [...history.slice(0, historyIndex + 1), folder];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const goBack = () => {
    if (historyIndex > 0) {
      setSelectedIcon(null);
      setHistoryIndex(historyIndex - 1);
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      setSelectedIcon(null);
      setHistoryIndex(historyIndex + 1);
    }
  };

  const goUp = () => {
    if (currentFolder !== 'root') {
      navigateToFolder('root');
    }
  };

  const getTitle = () => {
    switch (currentFolder) {
      case 'projects':
        return 'Projects - My Portfolio';
      case 'experience':
        return 'Experience - My Portfolio';
      default:
        return 'My Portfolio';
    }
  };

  const getAddressPath = () => {
    switch (currentFolder) {
      case 'projects':
        return 'My Portfolio > Projects';
      case 'experience':
        return 'My Portfolio > Experience';
      default:
        return 'My Portfolio';
    }
  };

  // Update window title in WindowManager so taskbar button and caption stay in sync
  useEffect(() => {
    onTitleChange?.(getTitle());
  }, [currentFolder]);

  const handleIconClick = (id: string) => {
    setSelectedIcon(selectedIcon === id ? null : id);
  };

  // Past & Current Experience partitioning
  const pastExperiences = experiences?.filter((e) => !e.is_current) || [];
  const currentExperiencesList = experiences?.filter((e) => e.is_current) || [];

  return (
    <XPWindow
      title={getTitle()}
      icon={<img src={currentFolder === 'projects' ? FolderIcon : currentFolder === 'experience' ? BriefcaseIcon : MyComputerIcon} alt="Window Icon" className="w-4 h-4 text-primary-foreground" />}
      onMinimize={onMinimize}
      onMaximize={onMaximize}
      onClose={onClose}
      zIndex={zIndex}
      onFocus={onFocus}
      isMaximized={isMaximized}
      isActive={isActive}
      onPositionChange={onPositionChange}
      onSizeChange={onSizeChange}
    >
      {/* Sticky Headers */}
      <XPMenuBar />
      <XPToolbar
        canGoBack={historyIndex > 0}
        canGoForward={historyIndex < history.length - 1}
        canGoUp={currentFolder !== 'root'}
        onBack={goBack}
        onForward={goForward}
        onUp={goUp}
        onFolders={() => navigateToFolder('projects')}
        onNavigateFolder={navigateToFolder}
      />
      <XPAddressBar
        currentPath={getAddressPath()}
        onNavigate={(path) => {
          if (path === 'projects') navigateToFolder('projects');
          else if (path === 'experience') navigateToFolder('experience');
          else navigateToFolder('root');
        }}
      />

      {/* Main Content Area - Scrollable */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Left Sidebar */}
        <XPSidebar
          onViewAboutMe={onOpenWordDoc}
          onDownloadResume={() => {
            const link = document.createElement('a');
            link.href = profile?.resumeUrl || '/resume.pdf';
            link.download = profile?.resumeFilename || 'Resume.pdf';
            link.click();
          }}
          onNavigateFolder={navigateToFolder}
          currentFolder={currentFolder}
        />

        {/* Content Viewer */}
        <div className="flex-1 bg-slate-50 dark:bg-gray-900 overflow-y-auto" onClick={() => setSelectedIcon(null)}>
          {/* ================= VIEW: ROOT (My Computer) ================= */}
          {currentFolder === 'root' && (
            <div className="w-full min-h-full p-2">
              {/* Files Stored Section */}
              <SectionDivider title="About Me" />
              <FileItem
                icon={UserIcon}
                label={profile?.name || 'About Me'}
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

              {/* Portfolio Folders - Stays in the SAME window */}
              <SectionDivider title="Portfolio Sections" />
              <FileItem
                icon={FolderIcon}
                label="Projects"
                onClick={() => handleIconClick("projects")}
                onDoubleClick={() => navigateToFolder('projects')}
                selected={selectedIcon === "projects"}
              />
              <FileItem
                icon={BriefcaseIcon}
                label="Experience"
                onClick={() => handleIconClick("experience")}
                onDoubleClick={() => navigateToFolder('experience')}
                selected={selectedIcon === "experience"}
              />
              <FileItem
                icon={NotepadIcon}
                label="Blog Posts"
                onClick={() => handleIconClick("blog")}
                onDoubleClick={() => onOpenBrowser("https://medium.com/@suhasnidgundi")}
                selected={selectedIcon === "blog"}
              />

              {/* Social Links */}
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
                onDoubleClick={() => onOpenBrowser(profile?.linkedin || "https://linkedin.com")}
                selected={selectedIcon === "linkedin"}
              />
              <FileItem
                icon={MailIcon}
                label="Contact Me"
                onClick={() => handleIconClick("contact")}
                onDoubleClick={() => { window.location.href = `mailto:${profile?.email || 'contact@example.com'}`; }}
                selected={selectedIcon === "contact"}
              />

              {/* Featured Project */}
              {featuredProject && (
                <div className="mt-4 p-4 bg-white dark:bg-gray-800 border border-[#7f9db9] dark:border-gray-600 rounded mx-2 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="xp-section-title text-[12px] font-bold text-black dark:text-gray-100 font-['MSSans',Tahoma,sans-serif]">
                      📌 Featured Project
                    </h3>
                    <button
                      onClick={() => navigateToFolder('projects')}
                      className="text-[11px] text-[#0055ea] hover:underline font-['MSSans',Tahoma,sans-serif] cursor-pointer"
                    >
                      View all projects →
                    </button>
                  </div>
                  <p className="text-[11px] text-gray-700 dark:text-gray-300 mb-2 font-['MSSans',Tahoma,sans-serif]">
                    <strong>{featuredProject.title}</strong> - {featuredProject.impact_metric || featuredProject.description}
                  </p>
                  <div className="flex gap-1 flex-wrap">
                    {featuredProject.tech_stack?.slice(0, 4).map((tech) => (
                      <span key={tech} className="px-2 py-0.5 bg-[#3366cc]/15 text-[#0055ea] dark:text-blue-400 text-[10px] rounded font-['MSSans',Tahoma,sans-serif]">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Current Experience */}
              {currentExperience && (
                <div className="mt-4 p-4 bg-white dark:bg-gray-800 border border-[#7f9db9] dark:border-gray-600 rounded mx-2 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="xp-section-title text-[12px] font-bold text-black dark:text-gray-100 font-['MSSans',Tahoma,sans-serif]">
                      💼 Current Position
                    </h3>
                    <button
                      onClick={() => navigateToFolder('experience')}
                      className="text-[11px] text-[#0055ea] hover:underline font-['MSSans',Tahoma,sans-serif] cursor-pointer"
                    >
                      View full experience →
                    </button>
                  </div>
                  <p className="text-[11px] text-gray-700 dark:text-gray-300 font-['MSSans',Tahoma,sans-serif]">
                    <strong>{currentExperience.role}</strong> @ {currentExperience.company}
                  </p>
                  {currentExperience.description && (
                    <p className="text-[10px] text-gray-600 dark:text-gray-400 mt-1 font-['MSSans',Tahoma,sans-serif]">
                      {currentExperience.description}
                    </p>
                  )}
                  {currentExperiencesList.length === 0 && pastExperiences.length === 0 && (
                    <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground font-['MSSans',Tahoma,sans-serif]">
                      <img src={BriefcaseIcon} alt="Empty Folder" className="w-12 h-12 opacity-35 mb-2" />
                      <p className="text-[12px] font-bold text-gray-700 dark:text-gray-200">This folder is empty.</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">There are no experience records published yet.</p>
                    </div>
                  )}
                </div>
              )}

              {/* GitHub Graph */}
              {profile?.github && (
                <div className="mt-4 mb-8 p-4 bg-white dark:bg-gray-800 border border-[#7f9db9] dark:border-gray-600 rounded mx-2 shadow-sm">
                  <h3 className="xp-section-title text-[12px] font-bold text-black dark:text-gray-100 mb-2 font-['MSSans',Tahoma,sans-serif]">
                    📊 GitHub Activity
                  </h3>
                  <div className="overflow-x-auto">
                    <img
                      src={`https://ghchart.rshah.org/${isDark ? '3b82f6' : '0066cc'}/${profile.handle || profile.github.split('/').filter(Boolean).pop()}`}
                      alt="GitHub Contribution Graph"
                      className="max-w-none"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= VIEW: PROJECTS FOLDER ================= */}
          {currentFolder === 'projects' && (
            <div className="w-full min-h-full p-4 select-none">
              <div className="flex items-center justify-between pb-3 border-b border-[#7f9db9] mb-4">
                <div className="flex items-center gap-2">
                  <img src={FolderIcon} alt="Projects" className="w-7 h-7" />
                  <div>
                    <h2 className="text-[13px] font-bold text-black dark:text-gray-100 font-['MSSans',Tahoma,sans-serif]">
                      Projects Folder
                    </h2>
                    <p className="text-[10px] text-muted-foreground font-['MSSans',Tahoma,sans-serif]">
                      {projects?.length || 0} items — Double-click to inspect or launch
                    </p>
                  </div>
                </div>
                <button
                  onClick={goUp}
                  className="xp-button flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-['MSSans',Tahoma,sans-serif] cursor-pointer"
                  title="Up to My Portfolio"
                >
                  <ArrowUp className="w-3.5 h-3.5 text-amber-700" />
                  <span>Up to Portfolio</span>
                </button>
              </div>

              {projectsLoading ? (
                <div className="flex items-center justify-center p-12 text-[12px] text-muted-foreground font-['MSSans',Tahoma,sans-serif]">
                  Loading projects...
                </div>
              ) : projects && projects.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {projects.map((project) => {
                    const isSelected = selectedIcon === project.$id;
                    return (
                      <div
                        key={project.$id}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleIconClick(project.$id);
                        }}
                        onDoubleClick={() => {
                          if (project.live_url) {
                            onOpenBrowser(project.live_url);
                          } else if (project.github_url) {
                            onOpenBrowser(project.github_url);
                          }
                        }}
                        className={`flex flex-col p-3 rounded bg-white dark:bg-gray-800 border transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#316ac5] ring-2 ring-[#316ac5]/40 shadow-md bg-blue-50/50 dark:bg-blue-950/20'
                            : 'border-[#7f9db9] dark:border-gray-700 hover:border-[#316ac5]/60 hover:shadow-sm'
                        }`}
                      >
                        <div className="flex items-start gap-2.5 mb-2">
                          <img src={FolderIcon} alt="Folder" className="w-10 h-10 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <h3 className="text-[12px] font-bold text-black dark:text-gray-100 truncate font-['MSSans',Tahoma,sans-serif]">
                              {project.title}
                            </h3>
                            {project.impact_metric && (
                              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold font-['MSSans',Tahoma,sans-serif]">
                                {project.impact_metric}
                              </p>
                            )}
                          </div>
                        </div>

                        <p className="text-[11px] text-gray-600 dark:text-gray-300 line-clamp-3 mb-3 flex-1 font-['MSSans',Tahoma,sans-serif] leading-relaxed">
                          {project.description}
                        </p>

                        {/* Tech tags */}
                        {project.tech_stack && project.tech_stack.length > 0 && (
                          <div className="flex gap-1 flex-wrap mb-3">
                            {project.tech_stack.slice(0, 4).map((tech) => (
                              <span
                                key={tech}
                                className="px-1.5 py-0.5 bg-[#3366cc]/10 text-[#0055ea] dark:text-blue-300 text-[9px] rounded font-['MSSans',Tahoma,sans-serif]"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Action buttons */}
                        <div className="flex items-center gap-2 pt-2 border-t border-border mt-auto">
                          {project.github_url && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onOpenBrowser(project.github_url!);
                              }}
                              className="xp-button flex-1 flex items-center justify-center gap-1 py-1 text-[10px] font-['MSSans',Tahoma,sans-serif] cursor-pointer"
                              title="View GitHub Repository"
                            >
                              <Github className="w-3 h-3" />
                              <span>Code</span>
                            </button>
                          )}
                          {project.live_url && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onOpenBrowser(project.live_url!);
                              }}
                              className="xp-button flex-1 flex items-center justify-center gap-1 py-1 text-[10px] font-['MSSans',Tahoma,sans-serif] cursor-pointer"
                              title="Launch Live Demo"
                            >
                              <ExternalLink className="w-3 h-3 text-green-600" />
                              <span>Demo</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground font-['MSSans',Tahoma,sans-serif]">
                  <img src={FolderIcon} alt="Empty Folder" className="w-12 h-12 opacity-35 mb-2" />
                  <p className="text-[12px] font-bold text-gray-700 dark:text-gray-200">This folder is empty.</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">There are no projects published in this portfolio yet.</p>
                </div>
              )}
            </div>
          )}

          {/* ================= VIEW: EXPERIENCE FOLDER ================= */}
          {currentFolder === 'experience' && (
            <div className="w-full min-h-full p-4 select-none">
              <div className="flex items-center justify-between pb-3 border-b border-[#7f9db9] mb-4">
                <div className="flex items-center gap-2">
                  <img src={BriefcaseIcon} alt="Experience" className="w-7 h-7" />
                  <div>
                    <h2 className="text-[13px] font-bold text-black dark:text-gray-100 font-['MSSans',Tahoma,sans-serif]">
                      Work Experience
                    </h2>
                    <p className="text-[10px] text-muted-foreground font-['MSSans',Tahoma,sans-serif]">
                      Career history & roles
                    </p>
                  </div>
                </div>
                <button
                  onClick={goUp}
                  className="xp-button flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-['MSSans',Tahoma,sans-serif] cursor-pointer"
                  title="Up to My Portfolio"
                >
                  <ArrowUp className="w-3.5 h-3.5 text-amber-700" />
                  <span>Up to Portfolio</span>
                </button>
              </div>

              {expLoading ? (
                <div className="flex items-center justify-center p-12 text-[12px] text-muted-foreground font-['MSSans',Tahoma,sans-serif]">
                  Loading experience...
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Current Work */}
                  {currentExperiencesList.length > 0 && (
                    <div>
                      <h3 className="text-[12px] font-bold text-black dark:text-gray-100 mb-2 font-['MSSans',Tahoma,sans-serif] flex items-center gap-2">
                        <span>🌟 Present Positions</span>
                      </h3>
                      <div className="space-y-3">
                        {currentExperiencesList.map((exp) => (
                          <div
                            key={exp.$id}
                            className="flex gap-3 p-3.5 bg-white dark:bg-gray-800 border border-[#7f9db9] dark:border-gray-700 rounded shadow-sm"
                          >
                            <img src={BriefcaseIcon} alt="Briefcase" className="w-10 h-10 shrink-0" />
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <h4 className="text-[12px] font-bold text-black dark:text-gray-100 font-['MSSans',Tahoma,sans-serif]">
                                  {exp.role}
                                </h4>
                                <span className="text-[10px] px-2 py-0.5 bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300 rounded font-semibold">
                                  Current
                                </span>
                              </div>
                              <p className="text-[11px] text-[#0055ea] dark:text-blue-400 font-['MSSans',Tahoma,sans-serif] mb-1">
                                {exp.company}
                                {exp.start_date && ` • ${exp.start_date}`}
                                {exp.end_date ? ` - ${exp.end_date}` : ' - Present'}
                              </p>
                              {exp.description && (
                                <p className="text-[11px] text-gray-700 dark:text-gray-300 font-['MSSans',Tahoma,sans-serif] leading-relaxed mt-1">
                                  {exp.description}
                                </p>
                              )}
                              {exp.skills && exp.skills.length > 0 && (
                                <div className="flex gap-1 mt-2.5 flex-wrap">
                                  {exp.skills.map((s) => (
                                    <span
                                      key={s}
                                      className="px-1.5 py-0.5 bg-[#3366cc]/15 text-[#0055ea] dark:text-blue-300 text-[9px] rounded font-['MSSans',Tahoma,sans-serif]"
                                    >
                                      {s}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Past Work */}
                  {pastExperiences.length > 0 && (
                    <div>
                      <h3 className="text-[12px] font-bold text-black dark:text-gray-100 mb-2 font-['MSSans',Tahoma,sans-serif]">
                        📜 Previous Experience
                      </h3>
                      <div className="space-y-3">
                        {pastExperiences.map((exp) => (
                          <div
                            key={exp.$id}
                            className="flex gap-3 p-3.5 bg-white dark:bg-gray-800 border border-[#7f9db9] dark:border-gray-700 rounded shadow-sm"
                          >
                            <img src={BriefcaseIcon} alt="Briefcase" className="w-10 h-10 shrink-0 opacity-80" />
                            <div className="flex-1">
                              <h4 className="text-[12px] font-bold text-black dark:text-gray-100 font-['MSSans',Tahoma,sans-serif]">
                                {exp.role}
                              </h4>
                              <p className="text-[11px] text-[#0055ea] dark:text-blue-400 font-['MSSans',Tahoma,sans-serif] mb-1">
                                {exp.company}
                                {exp.start_date && ` • ${exp.start_date}`}
                                {exp.end_date && ` - ${exp.end_date}`}
                              </p>
                              {exp.description && (
                                <p className="text-[11px] text-gray-700 dark:text-gray-300 font-['MSSans',Tahoma,sans-serif] leading-relaxed mt-1">
                                  {exp.description}
                                </p>
                              )}
                              {exp.skills && exp.skills.length > 0 && (
                                <div className="flex gap-1 mt-2.5 flex-wrap">
                                  {exp.skills.map((s) => (
                                    <span
                                      key={s}
                                      className="px-1.5 py-0.5 bg-[#3366cc]/10 text-gray-700 dark:text-gray-300 text-[9px] rounded font-['MSSans',Tahoma,sans-serif]"
                                    >
                                      {s}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {currentExperiencesList.length === 0 && pastExperiences.length === 0 && (
                    <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground font-['MSSans',Tahoma,sans-serif]">
                      <img src={BriefcaseIcon} alt="Empty Folder" className="w-12 h-12 opacity-35 mb-2" />
                      <p className="text-[12px] font-bold text-gray-700 dark:text-gray-200">This folder is empty.</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">There are no experience records published yet.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </XPWindow>
  );
};

export default XPMyComputerWindow;
