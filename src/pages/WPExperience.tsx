import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";
import useAnalytics from "@/hooks/useAnalytics";
import { useExperiences } from "@/hooks/useExperiences";
import WPStatusBar from "@/components/wp/WPStatusBar";
import WPAppBar from "@/components/wp/WPAppBar";

const typeColors: Record<string, string> = {
  internship: "bg-wp-accent text-wp-bg",
  volunteer: "bg-wp-text text-wp-bg",
  work: "bg-wp-chrome text-wp-text",
};

interface WPExperienceProps {
  isDark: boolean;
  toggleTheme: () => void;
}

const WPExperience = (props: WPExperienceProps) => {
  const navigate = useNavigate();

  useAnalytics();

  const { data: experiences, isLoading } = useExperiences();

  const sorted = experiences?.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));

  const appBarButtons = [
    {
      icon: <Home className="w-5 h-5" />,
      label: "Home",
      onClick: () => navigate("/"),
    },
    {
      icon: <ArrowLeft className="w-5 h-5" />,
      label: "Back",
      onClick: () => navigate(-1),
    },
  ];

  return (
    <div className="min-h-screen bg-wp-bg text-wp-text flex flex-col">
      <WPStatusBar />

      {/* Header */}
      <div className="px-5 pt-6 pb-3">
        <h1 className="text-[38px] font-light tracking-tight wp-list-enter">
          experience
        </h1>
      </div>

      {/* Loader */}
      {isLoading && (
        <div className="flex-1 flex items-center justify-center text-wp-text/60">
          Loading experience…
        </div>
      )}

      {/* List */}
      <div className="flex-1 overflow-y-auto px-5 pb-24 space-y-4">
        {sorted?.map((exp) => (
          <div
            key={exp.$id}
            onClick={() => navigate(`/experience/${exp.$id}`)}
            className="wp-list-enter active:bg-wp-text/10 cursor-pointer border-b border-wp-text/10 pb-4 pt-2"
          >
            {/* Top row: role + badge */}
            <div className="flex items-center justify-between">
              <h2 className="text-[18px] font-semibold">{exp.role}</h2>

              {exp.experience_type && (
                <span
                  className={`px-2 py-1 text-[11px] uppercase tracking-wide ${
                    typeColors[exp.experience_type] || "bg-wp-accent text-wp-bg"
                  }`}
                >
                  {exp.experience_type}
                </span>
              )}
            </div>

            {/* Company */}
            <p className="text-wp-text/70 text-[15px] mt-1">{exp.company}</p>

            {/* Summary */}
            {exp.summary && (
              <p className="text-wp-text/80 text-[14px] font-light mt-2">
                {exp.summary}
              </p>
            )}

            {/* Impact preview */}
            {exp.impact && exp.impact.length > 0 && (
              <p className="text-wp-accent text-[13px] font-semibold mt-2">
                • {exp.impact[0]}
              </p>
            )}

            {/* Skills preview */}
            <div className="flex flex-wrap gap-1 mt-3">
              {exp.skills?.slice(0, 3).map((s) => (
                <span key={s} className="px-2 py-1 bg-wp-text/10 text-[12px]">
                  {s}
                </span>
              ))}

              {exp.skills && exp.skills.length > 3 && (
                <span className="px-2 py-1 text-[12px] text-wp-accent">
                  +{exp.skills.length - 3} more
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
      <WPAppBar buttons={appBarButtons} />
    </div>
  );
};

export default WPExperience;
