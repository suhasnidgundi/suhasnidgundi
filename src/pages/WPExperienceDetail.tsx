import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Building2, CheckCircle2 } from "lucide-react";
import { useExperiences } from "@/hooks/useExperiences";
import WPStatusBar from "@/components/wp/WPStatusBar";
import WPNavBar from "@/components/wp/WPNavBar";

const WPExperienceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: experiences, isLoading } = useExperiences();
  const exp = experiences?.find((e) => e.$id === id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center text-[14px] text-white/50 font-['Segoe_UI',sans-serif]">
        Loading experience details…
      </div>
    );
  }

  if (!exp) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center font-['Segoe_UI',sans-serif] space-y-4">
        <p className="text-[18px]">Experience entry not found.</p>
        <button
          onClick={() => navigate("/experience")}
          className="px-4 py-2 bg-[hsl(var(--wp-accent))] text-white rounded text-[13px]"
        >
          Return to Experience
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-['Segoe_UI',sans-serif] flex flex-col select-none">
      <WPStatusBar />

      {/* Hero Header */}
      <div className="relative h-56 w-full bg-gradient-to-br from-[hsl(var(--wp-violet))]/40 to-black flex items-end p-6 border-b border-white/10">
        <div>
          <span className="text-[11px] font-mono uppercase bg-[hsl(var(--wp-accent))] text-white px-2 py-0.5 rounded font-bold">
            {exp.is_current ? "Current Role" : exp.experience_type || "Career"}
          </span>
          <h1 className="text-[34px] font-extralight text-white tracking-tight leading-tight lowercase mt-2">
            {exp.role.toLowerCase()}
          </h1>
          <p className="text-[hsl(var(--wp-accent))] text-[15px] font-medium mt-0.5">
            @ {exp.company}
          </p>
        </div>
      </div>

      {/* Details */}
      <div className="flex-1 px-6 py-6 space-y-6 overflow-y-auto pb-24">
        {/* Timeline Metadata */}
        <div className="flex items-center gap-2 text-[13px] text-white/60">
          <Calendar className="w-4 h-4 text-[hsl(var(--wp-accent))]" />
          <span>
            {exp.start_date} – {exp.is_current ? "Present" : exp.end_date || "2023"}
          </span>
        </div>

        {/* Role Overview */}
        <section className="space-y-1">
          <h2 className="text-white/60 uppercase tracking-wide text-[12px] font-semibold">
            Role Responsibilities
          </h2>
          <p className="text-white/85 text-[14px] leading-relaxed font-light whitespace-pre-line">
            {exp.description}
          </p>
        </section>

        {/* Skills & Technologies */}
        {exp.skills && exp.skills.length > 0 && (
          <section className="space-y-2">
            <h2 className="text-white/60 uppercase tracking-wide text-[12px] font-semibold">
              Skills & Stack
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {exp.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-2.5 py-1 bg-white/10 text-white text-[12px] rounded font-mono"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>

      <WPNavBar />
    </div>
  );
};

export default WPExperienceDetail;
