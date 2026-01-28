import { useNavigate } from 'react-router-dom';
import MyComputer from '@/assets/xp/icons/my_computer.png';
import { useIsMobile } from '@/hooks/use-mobile';
import useAnalytics from '@/hooks/useAnalytics';
import { useExperiences } from '@/hooks/useExperiences';
import XPWindow from '@/components/xp/XPWindow';
import XPMenuBar from '@/components/xp/XPMenuBar';
import XPToolbar from '@/components/xp/XPToolbar';
import XPAddressBar from '@/components/xp/XPAddressBar';
import XPSidebar from '@/components/xp/XPSidebar';
import XPTaskbar from '@/components/xp/XPTaskbar';
import BriefcaseIcon from '@/assets/xp/icons/briefcase_icon.png';
import WPExperience from './WPExperience';

interface ExperienceProps {
  isDark: boolean;
  toggleTheme: () => void;
}

const Experience = ({ isDark, toggleTheme }: ExperienceProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Track page view
  useAnalytics();

  // Fetch dynamic content
  const { data: experiences, isLoading } = useExperiences();

  // Render Windows Phone UI on mobile
  if (isMobile) {
    return <WPExperience isDark={isDark} toggleTheme={toggleTheme} />;
  }

  // Group experiences by type
  const pastExperiences = experiences?.filter(e => !e.is_current) || [];
  const currentExperiences = experiences?.filter(e => e.is_current) || [];

  return (
    <div className="h-screen w-screen flex flex-col bg-background">
      {/* Main Window */}
      <div className="flex-1 p-2 pb-0 flex flex-col overflow-hidden">
        <XPWindow 
          title="My Portfolio - Experience" 
          icon={<img src={MyComputer} alt="My Computer" className="w-5 h-5" />}
        >
          {/* Sticky Headers */}
          <XPMenuBar />
          <XPToolbar />
          <XPAddressBar />
          
          {/* Main Content Area - Scrollable */}
          <div className="flex-1 flex min-h-0 overflow-hidden">
            <XPSidebar />
            
            <div className="flex-1 xp-content p-4 overflow-y-auto">
              {isLoading ? (
                <div className="text-muted-foreground text-sm">Loading experiences...</div>
              ) : (
                <>
                  {/* Past Work */}
                  {pastExperiences.length > 0 && (
                    <div className="mb-6">
                      <h2 className="text-[11px] font-bold text-black dark:text-gray-100 mb-1">
                        What I Did (Past Work)
                      </h2>
                      <div className="xp-content-divider" />
                      <div className="grid gap-3">
                        {pastExperiences.map((exp) => (
                          <div key={exp.$id} className="flex gap-3 p-3 bg-white dark:bg-gray-800 border border-[#7f9db9] dark:border-gray-600 rounded">
                            <img src={BriefcaseIcon} alt="Briefcase" className="w-10 h-10 flex-shrink-0" />
                            <div className="flex-1">
                              <h3 className="text-[12px] font-bold text-black dark:text-gray-100">{exp.role}</h3>
                              <p className="text-[11px] text-[#3366cc] dark:text-blue-400">
                                {exp.company} 
                                {exp.start_date && ` • ${exp.start_date}`}
                                {exp.end_date && ` - ${exp.end_date}`}
                              </p>
                              {exp.description && (
                                <p className="text-[10px] text-gray-600 dark:text-gray-400 mt-1">{exp.description}</p>
                              )}
                              {exp.skills && exp.skills.length > 0 && (
                                <div className="flex gap-1 mt-2 flex-wrap">
                                  {exp.skills.map((s) => (
                                    <span key={s} className="px-1.5 py-0.5 bg-[#3366cc]/20 text-[#3366cc] dark:text-blue-400 text-[9px] rounded">{s}</span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Current Work */}
                  {currentExperiences.length > 0 && (
                    <div className="mb-6">
                      <h2 className="text-[11px] font-bold text-black dark:text-gray-100 mb-1">
                        What I'm Doing Now
                      </h2>
                      <div className="xp-content-divider" />
                      <div className="grid gap-3">
                        {currentExperiences.map((exp) => (
                          <div key={exp.$id} className="flex gap-3 p-3 bg-white dark:bg-gray-800 border border-[#7f9db9] dark:border-gray-600 rounded">
                            <img src={BriefcaseIcon} alt="Briefcase" className="w-10 h-10 flex-shrink-0" />
                            <div className="flex-1">
                              <h3 className="text-[12px] font-bold text-black dark:text-gray-100">{exp.role}</h3>
                              <p className="text-[11px] text-[#3366cc] dark:text-blue-400">
                                {exp.company}
                                {exp.start_date && ` • ${exp.start_date} - Present`}
                              </p>
                              {exp.description && (
                                <p className="text-[10px] text-gray-600 dark:text-gray-400 mt-1">{exp.description}</p>
                              )}
                              {exp.skills && exp.skills.length > 0 && (
                                <div className="flex gap-1 mt-2 flex-wrap">
                                  {exp.skills.map((s) => (
                                    <span key={s} className="px-1.5 py-0.5 bg-[#3366cc]/20 text-[#3366cc] dark:text-blue-400 text-[9px] rounded">{s}</span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {experiences?.length === 0 && (
                    <div className="text-gray-600 dark:text-gray-400 text-sm">No experiences found. Add some from the admin dashboard.</div>
                  )}
                </>
              )}

              <button
                onClick={() => navigate('/')}
                className="mt-2 mb-8 xp-button"
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

export default Experience;
