import { useNavigate } from 'react-router-dom';
import { Monitor } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import useAnalytics from '@/hooks/useAnalytics';
import { useProjects } from '@/hooks/useProjects';
import XPWindow from '@/components/xp/XPWindow';
import XPMenuBar from '@/components/xp/XPMenuBar';
import XPToolbar from '@/components/xp/XPToolbar';
import XPAddressBar from '@/components/xp/XPAddressBar';
import XPSidebar from '@/components/xp/XPSidebar';
import XPTaskbar from '@/components/xp/XPTaskbar';
import XPContentSection from '@/components/xp/XPContentSection';
import FolderIcon from '@/assets/xp/icons/folder_icon.png';
import WPProjects from './WPProjects';

interface ProjectsProps {
  isDark: boolean;
  toggleTheme: () => void;
}

const Projects = ({ isDark, toggleTheme }: ProjectsProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Track page view
  useAnalytics();

  // Fetch dynamic content
  const { data: projects, isLoading } = useProjects();

  // Render Windows Phone UI on mobile
  if (isMobile) {
    return <WPProjects isDark={isDark} toggleTheme={toggleTheme} />;
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-background">
      {/* Main Window */}
      <div className="flex-1 p-2 pb-0 flex flex-col overflow-hidden">
        <XPWindow 
          title="My Portfolio - Projects" 
          icon={<Monitor className="w-4 h-4 text-primary-foreground" />}
        >
          {/* Sticky Headers */}
          <XPMenuBar />
          <XPToolbar />
          <XPAddressBar />
          
          {/* Main Content Area - Scrollable */}
          <div className="flex-1 flex min-h-0 overflow-hidden">
            <XPSidebar />
            
            <div className="flex-1 xp-content p-4 overflow-y-auto">
              <XPContentSection title="All Projects">
                {isLoading ? (
                  <div className="text-muted-foreground text-sm">Loading projects...</div>
                ) : projects && projects.length > 0 ? (
                  <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {projects.map((project) => (
                      <div
                        key={project.$id}
                        className="flex flex-col items-center p-3 rounded border border-transparent hover:border-primary/40 hover:bg-primary/5 cursor-pointer transition-all group"
                      >
                        <img src={FolderIcon} alt="Folder" className="w-16 h-16 mb-2" />
                        <h3 className="text-[11px] font-bold text-foreground text-center mb-1">
                          {project.title}
                        </h3>
                        <p className="text-[10px] text-muted-foreground text-center mb-2 line-clamp-2">
                          {project.description}
                        </p>
                        <div className="flex gap-1 flex-wrap justify-center mb-2">
                          {project.tech_stack?.slice(0, 2).map((t) => (
                            <span key={t} className="px-1.5 py-0.5 bg-primary/20 text-primary text-[9px] rounded">
                              {t}
                            </span>
                          ))}
                        </div>
                        <p className="text-[9px] text-accent font-medium">{project.impact_metric}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-muted-foreground text-sm">No projects found. Add some from the admin dashboard.</div>
                )}
              </XPContentSection>

              <button
                onClick={() => navigate('/')}
                className="mt-4 xp-button"
              >
                ← Back to My Portfolio
              </button>
            </div>
          </div>
        </XPWindow>
      </div>

      {/* Taskbar - Sticky at Bottom */}
      <XPTaskbar isDark={isDark} toggleTheme={toggleTheme} />
    </div>
  );
};

export default Projects;
