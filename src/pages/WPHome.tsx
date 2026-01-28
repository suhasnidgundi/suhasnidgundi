import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, Info, Moon, Sun, FileText, BadgeCheck } from "lucide-react";

import useAnalytics from "@/hooks/useAnalytics";
import { useFeaturedProject, useProjects } from "@/hooks/useProjects";
import { useCurrentExperience } from "@/hooks/useExperiences";

import WPStatusBar from "@/components/wp/WPStatusBar";
import WPTile from "@/components/wp/WPTile";
import WPAppBar from "@/components/wp/WPAppBar";
import WPProfileTile from "@/components/wp/WPProfileTile";
import WPInfoModal from "@/components/wp/WPInfoModal";

import WPFolderIcon from "@/components/wp/icons/WPFolderIcon";
import WPGithubIcon from "@/components/wp/icons/WPGithubIcon";
import WPBlogIcon from "@/components/wp/icons/WPBlogIcon";
import WPMailIcon from "@/components/wp/icons/WPMailIcon";
import WPLinkedInIcon from "@/components/wp/icons/WPLinkedInIcon";

import profilePhoto from "@/assets/profile-photo.jpg";
import WPExperienceIcon from "@/components/wp/icons/WPBriefcaseIcon";

interface WPHomeProps {
  isDark: boolean;
  toggleTheme: () => void;
}

const WPHome = ({ isDark, toggleTheme }: WPHomeProps) => {
  const navigate = useNavigate();
  const [showInfoModal, setShowInfoModal] = useState(false);

  useAnalytics();

  const { data: projects } = useProjects();
  const { data: featuredProject } = useFeaturedProject();
  const { data: currentExperience } = useCurrentExperience();

  const openUrl = (url: string) => window.open(url, "_blank");

  const appBarButtons = [
    {
      icon: <Home className="w-5 h-5" />,
      label: "Home",
      onClick: () => navigate("/"),
    },
    {
      icon: <FileText className="w-5 h-5" />,
      label: "Resume",
      onClick: () => openUrl("/resume.pdf"),
    },
    {
      icon: isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />,
      label: "Toggle Theme",
      onClick: toggleTheme,
    },
    {
      icon: <Info className="w-5 h-5" />,
      label: "About",
      onClick: () => setShowInfoModal(true),
    },
  ];

  return (
    <div className="min-h-screen bg-wp-bg flex flex-col">
      <WPStatusBar />

      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-28">
        {/* Title */}
        <h1 className="text-wp-text text-[46px] font-extralight tracking-tight mb-6">
          suhas nidgundi
        </h1>

        <div className="flex flex-col gap-3">
          {/* Profile Hero Tile */}
          <WPProfileTile
            className="wp-tile-enter [animation-delay:0.05s]"
            imageSrc={profilePhoto}
            name="About Me"
            subtitle="Tap to view profile"
            accentColor="bg-wp-cobalt/80"
            onClick={() => navigate("/about")}
          />

          {/* Row 1: Projects + Experience */}
          <div className="flex gap-3">
            <WPTile
              className="wp-tile-enter [animation-delay:0.10s]"
              icon={<WPFolderIcon />}
              label="Projects"
              size="medium"
              color="bg-wp-emerald"
              count={projects?.length || 0}
              onClick={() => navigate("/projects")}
            />

            <WPTile
              className="wp-tile-enter [animation-delay:0.15s]"
              icon={<WPExperienceIcon />}
              label="Experience"
              size="medium"
              color="bg-wp-violet"
              onClick={() => navigate("/experience")}
            />
          </div>

          {/* Row 2: GitHub + LinkedIn */}
          <div className="flex gap-3">
            <WPTile
              className="wp-tile-enter [animation-delay:0.20s]"
              icon={<WPGithubIcon />}
              label="GitHub"
              size="medium"
              color="bg-wp-steel"
              onClick={() => openUrl("https://github.com/suhasnidgundi")}
            />

            <WPTile
              className="wp-tile-enter [animation-delay:0.25s]"
              icon={<WPLinkedInIcon />}
              label="LinkedIn"
              size="medium"
              color="bg-wp-cyan"
              onClick={() => openUrl("https://linkedin.com/in/suhasnidgundi")}
            />
          </div>

          {/* Blog (wide) */}
          <WPTile
            className="wp-tile-enter [animation-delay:0.30s]"
            icon={<WPBlogIcon />}
            label="Blog"
            size="wide"
            color="bg-wp-magenta"
            onClick={() => openUrl("https://medium.com/@suhasnidgundi")}
          />

          {/* Contact (wide — FIXED) */}
          <WPTile
            className="wp-tile-enter [animation-delay:0.35s]"
            icon={<WPMailIcon />}
            label="Contact"
            size="wide"
            color="bg-wp-teal"
            onClick={() => navigate("/contact")}
          />
        </div>

        {/* Featured */}
        {featuredProject && (
          <div className="mt-6">
            <h2 className="text-wp-text/60 uppercase tracking-wide text-[15px] mb-3">
              Featured
            </h2>

            <div className="bg-wp-chrome p-4 rounded">
              <span className="text-[11px] bg-wp-accent text-wp-bg px-2 py-0.5">
                PINNED
              </span>

              <h3 className="text-wp-text text-[17px] font-semibold mt-2">
                {featuredProject.title}
              </h3>

              <p className="text-wp-text/60 text-[14px] font-light mb-3">
                {featuredProject.impact_metric || featuredProject.description}
              </p>

              <div className="flex flex-wrap gap-1">
                {featuredProject.tech_stack?.slice(0, 3).map((tech) => (
                  <span
                    key={tech}
                    className="text-[11px] bg-wp-text/10 text-wp-text/80 px-2 py-0.5"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Current Experience */}
        {currentExperience && (
          <div className="mt-4 bg-wp-chrome p-4 rounded">
            <div className="flex items-center gap-2 mb-2">
              <BadgeCheck className="w-5 h-5 text-wp-accent" />
              <span className="text-wp-accent text-[13px] font-semibold uppercase">
                Current Role
              </span>
            </div>

            <h3 className="text-wp-text text-[17px] font-semibold">
              {currentExperience.role}
            </h3>

            <p className="text-wp-text/60 text-[14px]">
              @ {currentExperience.company}
            </p>

            {currentExperience.description && (
              <p className="text-wp-text/50 text-[13px] mt-1">
                {currentExperience.description}
              </p>
            )}
          </div>
        )}
      </div>

      <WPAppBar buttons={appBarButtons} />

      <WPInfoModal
        isOpen={showInfoModal}
        onClose={() => setShowInfoModal(false)}
        isDark={isDark}
        toggleTheme={toggleTheme}
      />
    </div>
  );
};

export default WPHome;
