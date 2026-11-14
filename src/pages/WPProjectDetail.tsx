import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Globe, Github, Sparkles } from "lucide-react";
import { useProjects } from "@/hooks/useProjects";
import WPStatusBar from "@/components/wp/WPStatusBar";
import WPNavBar from "@/components/wp/WPNavBar";

const WPProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: projects, isLoading } = useProjects();
  const project = projects?.find((p) => p.$id === id);

  const openUrl = (url?: string) => {
    if (url) window.open(url, "_blank");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center text-[14px] text-white/50 font-['Segoe_UI',sans-serif]">
        Loading project from Vercel Blob…
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center font-['Segoe_UI',sans-serif] space-y-4">
        <p className="text-[18px]">Project not found.</p>
        <button
          onClick={() => navigate("/projects")}
          className="px-4 py-2 bg-[hsl(var(--wp-accent))] text-white rounded text-[13px]"
        >
          Return to Projects
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-['Segoe_UI',sans-serif] flex flex-col select-none">
      <WPStatusBar />

      {/* Hero Banner with Panorama styling */}
      <div className="relative h-64 w-full overflow-hidden bg-neutral-900">
        {project.screenshot_url ? (
          <img
            src={project.screenshot_url}
            alt={project.title}
            className="w-full h-full object-cover opacity-75"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[hsl(var(--wp-accent))]/30 to-black flex items-center justify-center">
            <Sparkles className="w-16 h-16 text-white/20" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

        <div className="absolute bottom-5 left-5 right-5">
          <h1 className="text-[38px] font-extralight text-white tracking-tight leading-none lowercase">
            {project.title.toLowerCase()}
          </h1>
          {project.impact_metric && (
            <p className="text-[hsl(var(--wp-accent))] text-[13px] font-semibold mt-1">
              {project.impact_metric}
            </p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 pt-4 pb-24 space-y-6">
        {/* Action Buttons */}
        <div className="flex gap-3">
          {project.live_url && (
            <button
              onClick={() => openUrl(project.live_url)}
              className="flex-1 py-2.5 bg-[hsl(var(--wp-accent))] text-white rounded font-medium text-[13px] flex items-center justify-center gap-2 active:scale-95 transition-transform shadow"
            >
              <Globe className="w-4 h-4" /> Live Website
            </button>
          )}
          {project.github_url && (
            <button
              onClick={() => openUrl(project.github_url)}
              className="flex-1 py-2.5 bg-white/10 text-white rounded font-medium text-[13px] flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              <Github className="w-4 h-4" /> Source Code
            </button>
          )}
        </div>

        {/* Overview Description */}
        <section className="space-y-1">
          <h2 className="text-white/60 uppercase tracking-wide text-[12px] font-semibold">
            Overview
          </h2>
          <p className="text-white/85 text-[14px] leading-relaxed font-light">
            {project.description}
          </p>
        </section>

        {/* Problem Statement */}
        {project.problem_statement && (
          <section className="space-y-1">
            <h2 className="text-white/60 uppercase tracking-wide text-[12px] font-semibold">
              The Problem
            </h2>
            <p className="text-white/85 text-[14px] leading-relaxed font-light">
              {project.problem_statement}
            </p>
          </section>
        )}

        {/* Solution */}
        {project.solution && (
          <section className="space-y-1">
            <h2 className="text-white/60 uppercase tracking-wide text-[12px] font-semibold">
              The Solution
            </h2>
            <p className="text-white/85 text-[14px] leading-relaxed font-light">
              {project.solution}
            </p>
          </section>
        )}

        {/* Contribution */}
        {project.contribution && (
          <section className="space-y-1">
            <h2 className="text-white/60 uppercase tracking-wide text-[12px] font-semibold">
              My Contribution
            </h2>
            <p className="text-white/85 text-[14px] leading-relaxed font-light">
              {project.contribution}
            </p>
          </section>
        )}

        {/* Tech Stack */}
        <section className="space-y-2">
          <h2 className="text-white/60 uppercase tracking-wide text-[12px] font-semibold">
            Technologies Used
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {project.tech_stack?.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 bg-white/10 text-white text-[12px] rounded font-mono"
              >
                {tag}
              </span>
            ))}
          </div>
        </section>
      </div>

      <WPNavBar />
    </div>
  );
};

export default WPProjectDetail;
