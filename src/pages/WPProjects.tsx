import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";
import useAnalytics from "@/hooks/useAnalytics";
import { useProjects } from "@/hooks/useProjects";
import WPStatusBar from "@/components/wp/WPStatusBar";
import WPHeader from "@/components/wp/WPHeader";
import WPAppBar from "@/components/wp/WPAppBar";
import WPFolderIcon from "@/components/wp/icons/WPFolderIcon";

interface WPProjectsProps {
  isDark: boolean;
  toggleTheme: () => void;
}

const WPProjects = (props: WPProjectsProps) => {
  const navigate = useNavigate();
  useAnalytics();

  const { data: projects, isLoading } = useProjects();

  const appBarButtons = [
    { icon: <Home className="w-5 h-5" />, label: "Home", onClick: () => navigate("/") },
    { icon: <ArrowLeft className="w-5 h-5" />, label: "Back", onClick: () => navigate(-1) },
  ];

  return (
    <div className="min-h-screen bg-wp-bg flex flex-col">
      <WPStatusBar />
      <WPHeader title="projects" showBack />

      <div className="flex-1 overflow-y-auto pb-24">
        {isLoading ? (
          <div className="px-4 py-6 text-wp-text/60 text-center">
            Loading projects...
          </div>
        ) : projects && projects.length > 0 ? (
          <div className="divide-y divide-wp-text/10">
            {projects.map((project, index) => (
              <div
                key={project.$id}
                onClick={() => navigate(`/projects/${project.$id}`)}
                className={`relative px-5 py-4 active:bg-wp-text/10 wp-list-enter wp-delay-${
                  (index % 4) + 1
                }`}
              >
                <div className="wp-accent-bar" />

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-wp-accent flex items-center justify-center text-wp-bg">
                    <WPFolderIcon />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-[17px] font-semibold text-wp-text mb-1">
                      {project.title}
                    </h3>

                    <p className="text-wp-text/70 text-[14px] font-light mb-2">
                      {project.impact_metric || project.description}
                    </p>

                    <div className="flex flex-wrap gap-1">
                      {project.tech_stack?.map((tag) => (
                        <span
                          key={tag}
                          className="text-[11px] bg-wp-text/10 text-wp-text/70 px-2 py-0.5"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-4 py-6 text-wp-text/60 text-center">
            No projects found.
          </div>
        )}
      </div>

      <WPAppBar buttons={appBarButtons} />
    </div>
  );
};

export default WPProjects;
