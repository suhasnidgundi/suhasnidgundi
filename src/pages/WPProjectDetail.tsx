import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Globe, Github } from "lucide-react";

import { useProjects } from "@/hooks/useProjects";

import WPStatusBar from "@/components/wp/WPStatusBar";
import WPAppBar from "@/components/wp/WPAppBar";

const WPProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: projects, isLoading } = useProjects();
  const project = projects?.find((p) => p.$id === id);

  const openUrl = (url: string) => {
    if (url) window.open(url, "_blank");
  };

  const appBarButtons = [
    { icon: <ArrowLeft className="w-5 h-5" />, label: "Back", onClick: () => navigate(-1) },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-wp-bg flex items-center justify-center text-wp-text/60">
        Loading project...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-wp-bg flex items-center justify-center text-wp-text/60">
        Project not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-wp-bg flex flex-col">
      <WPStatusBar />

      {/* Panorama Header */}
      <div className="relative h-64 w-full overflow-hidden bg-wp-chrome">
        {project.screenshot_url ? (
          <img
            src={project.screenshot_url}
            alt={project.title}
            className="w-full h-full object-cover opacity-80"
          />
        ) : (
          <div className="w-full h-full bg-wp-accent/20" />
        )}

        <div className="absolute inset-0 bg-gradient-to-b from-wp-accent/40 via-transparent to-wp-bg" />

        <div className="absolute bottom-5 left-5 right-5">
          <h1 className="text-[40px] font-light text-wp-text tracking-tight wp-list-enter">
            {project.title.toLowerCase()}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 pt-6 pb-24 space-y-10">

        {/* Quick Actions */}
        <div className="flex gap-3 wp-list-enter">
          {project.github_url && (
            <button
              onClick={() => openUrl(project.github_url)}
              className="bg-wp-accent text-wp-bg px-4 py-2 flex items-center gap-2"
            >
              <Github className="w-4 h-4" /> GitHub
            </button>
          )}

          {project.live_url && (
            <button
              onClick={() => openUrl(project.live_url)}
              className="bg-wp-text text-wp-bg px-4 py-2 flex items-center gap-2"
            >
              <Globe className="w-4 h-4" /> Live Demo
            </button>
          )}
        </div>

        {/* Overview */}
        <section className="wp-list-enter">
          <h2 className="text-wp-text/60 uppercase tracking-wide text-[15px] mb-2">
            overview
          </h2>

          <p className="text-wp-text/80 text-[15px] leading-relaxed font-light">
            {project.description}
          </p>
        </section>

        {/* Problem Statement */}
        <section className="wp-list-enter wp-delay-1">
          <h2 className="text-wp-text/60 uppercase tracking-wide text-[15px] mb-2">
            problem
          </h2>

          <p className="text-wp-text/80 text-[15px] font-light leading-relaxed">
            {project.problem_statement || "No problem statement provided yet."}
          </p>
        </section>

        {/* Solution */}
        <section className="wp-list-enter wp-delay-2">
          <h2 className="text-wp-text/60 uppercase tracking-wide text-[15px] mb-2">
            solution
          </h2>

          <p className="text-wp-text/80 text-[15px] font-light leading-relaxed">
            {project.solution || "No solution details available yet."}
          </p>
        </section>

        {/* Impact */}
        <section className="wp-list-enter wp-delay-3">
          <h2 className="text-wp-text/60 uppercase tracking-wide text-[15px] mb-2">
            impact
          </h2>

          <p className="text-wp-text/80 text-[15px] font-light leading-relaxed">
            {project.impact_metric || "No impact data provided yet."}
          </p>
        </section>

        {/* Contribution */}
        <section className="wp-list-enter wp-delay-2">
          <h2 className="text-wp-text/60 uppercase tracking-wide text-[15px] mb-2">
            contribution
          </h2>

          <p className="text-wp-text/80 text-[15px] font-light leading-relaxed whitespace-pre-line">
            {project.contribution || "Contribution details not added yet."}
          </p>
        </section>

        {/* Tech Stack */}
        <section className="wp-list-enter wp-delay-1">
          <h2 className="text-wp-text/60 uppercase tracking-wide text-[15px] mb-3">
            tech stack
          </h2>

          <div className="flex flex-wrap gap-2">
            {project.tech_stack?.length > 0 ? (
              project.tech_stack.map((stack) => (
                <span
                  key={stack}
                  className="px-3 py-1 bg-wp-accent text-wp-bg text-[12px]"
                >
                  {stack}
                </span>
              ))
            ) : (
              <p className="text-wp-text/40 text-[13px]">No tech stack listed.</p>
            )}
          </div>
        </section>
      </div>

      <WPAppBar buttons={appBarButtons} />
    </div>
  );
};

export default WPProjectDetail;
