import { useNavigate } from "react-router-dom";
import { Briefcase, Calendar, MapPin, CheckCircle } from "lucide-react";
import useAnalytics from "@/hooks/useAnalytics";
import { useExperiences } from "@/hooks/useExperiences";
import WPStatusBar from "@/components/wp/WPStatusBar";
import WPNavBar from "@/components/wp/WPNavBar";

interface WPExperienceProps {
  isDark: boolean;
  toggleTheme: () => void;
}

const WPExperience = ({ isDark }: WPExperienceProps) => {
  const navigate = useNavigate();
  useAnalytics();

  const { data: experiences, isLoading } = useExperiences();
  const sorted = experiences?.sort(
    (a, b) => (a.display_order || 0) - (b.display_order || 0)
  );

  return (
    <div className="min-h-screen bg-black text-white font-['Segoe_UI',sans-serif] flex flex-col select-none">
      <WPStatusBar />

      {/* Main Header */}
      <div className="px-5 pt-4 pb-2">
        <h1 className="text-[44px] font-extralight tracking-tight text-white lowercase leading-none">
          experience
        </h1>
        <p className="text-[13px] text-white/50 mt-1">
          Career history, engineering leadership & academic foundation
        </p>
      </div>

      {/* Experience Timeline */}
      <div className="flex-1 overflow-y-auto px-5 pt-4 pb-24 space-y-4">
        {isLoading ? (
          <div className="py-20 text-center text-white/50 text-[14px]">
            Syncing experience records from Vercel Blob…
          </div>
        ) : sorted && sorted.length > 0 ? (
          sorted.map((exp) => (
            <div
              key={exp.$id}
              onClick={() => navigate(`/experience/${exp.$id}`)}
              className="relative p-4 bg-white/5 border-l-4 border-[hsl(var(--wp-accent))] rounded-r shadow-sm active:bg-white/10 cursor-pointer transition-colors"
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="text-[17px] font-semibold text-white leading-tight">
                  {exp.role}
                </h3>
                {exp.is_current ? (
                  <span className="text-[9px] bg-emerald-500 text-white font-bold px-1.5 py-0.2 rounded uppercase">
                    Current
                  </span>
                ) : (
                  <span className="text-[9px] bg-white/10 text-white/70 font-mono px-1.5 py-0.2 rounded uppercase">
                    {exp.experience_type || "Work"}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-[13px] text-[hsl(var(--wp-accent))] font-medium mb-2">
                <span>@ {exp.company}</span>
                <span className="text-white/30">•</span>
                <span className="text-white/50 text-[11px] font-mono">
                  {exp.start_date} – {exp.is_current ? "Present" : exp.end_date || "2023"}
                </span>
              </div>

              {exp.description && (
                <p className="text-[13px] text-white/80 font-light leading-relaxed mb-3 line-clamp-3">
                  {exp.description}
                </p>
              )}

              {/* Skills */}
              <div className="flex flex-wrap gap-1">
                {exp.skills?.slice(0, 4).map((s) => (
                  <span
                    key={s}
                    className="text-[11px] bg-white/10 text-white/70 px-2 py-0.5 rounded font-mono"
                  >
                    {s}
                  </span>
                ))}
                {exp.skills && exp.skills.length > 4 && (
                  <span className="text-[11px] text-[hsl(var(--wp-accent))] px-1 py-0.5 font-medium">
                    +{exp.skills.length - 4} more
                  </span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-16 text-white/50 space-y-2">
            <Briefcase className="w-12 h-12 mx-auto text-white/20" />
            <p className="text-[15px]">No experience records found.</p>
            <p className="text-[12px] text-white/40">
              Add experience items via the Admin dashboard at /admin.
            </p>
          </div>
        )}
      </div>

      <WPNavBar />
    </div>
  );
};

export default WPExperience;
