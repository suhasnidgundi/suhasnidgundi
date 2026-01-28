import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { useExperiences } from "@/hooks/useExperiences";

import WPStatusBar from "@/components/wp/WPStatusBar";
import WPAppBar from "@/components/wp/WPAppBar";

const WPExperienceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: experiences, isLoading } = useExperiences();
  const exp = experiences?.find((e) => e.$id === id);

  const formatDate = (date: string | undefined) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  const appBarButtons = [
    {
      icon: <ArrowLeft className="w-5 h-5" />,
      label: "Back",
      onClick: () => navigate(-1),
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-wp-bg flex items-center justify-center text-wp-text/60">
        Loading experience...
      </div>
    );
  }

  if (!exp) {
    return (
      <div className="min-h-screen bg-wp-bg flex items-center justify-center text-wp-text/60">
        Experience not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-wp-bg text-wp-text flex flex-col">
      <WPStatusBar />

      {/* Panorama */}
      <div className="relative h-56 w-full bg-wp-accent/30 flex items-end p-6">
        <h1 className="text-[38px] font-light tracking-tight wp-list-enter leading-tight">
          {exp.role.toLowerCase()}
        </h1>
      </div>

      <div className="flex-1 px-6 py-8 space-y-10 overflow-y-auto">
        {/* Overview */}
        <section className="wp-list-enter">
          <h2 className="text-wp-text/60 uppercase text-[15px] mb-2">
            overview
          </h2>

          <p className="text-[18px] font-semibold">{exp.company}</p>

          <p className="text-wp-text/70 mt-1 text-[15px]">
            {exp.is_current
              ? `${formatDate(exp.start_date)} — Present`
              : `${formatDate(exp.start_date)} — ${formatDate(exp.end_date)}`}
          </p>

          {exp.experience_type && (
            <p className="text-wp-accent text-[13px] font-semibold mt-1 uppercase">
              {exp.experience_type}
            </p>
          )}

          {/* Summary */}
          {exp.summary && (
            <p className="text-wp-text/80 text-[15px] mt-4 leading-relaxed">
              {exp.summary}
            </p>
          )}
        </section>

        {/* Responsibilities */}
        <section className="wp-list-enter wp-delay-1">
          <h2 className="text-wp-text/60 uppercase text-[15px] mb-3">
            responsibilities
          </h2>

          {exp.responsibilities?.length ? (
            <ul className="list-disc ml-5 space-y-2 text-wp-text/80 text-[15px]">
              {exp.responsibilities.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          ) : (
            <p className="text-wp-text/40 text-[14px]">
              No responsibilities added.
            </p>
          )}
        </section>

        {/* Impact */}
        <section className="wp-list-enter wp-delay-2">
          <h2 className="text-wp-text/60 uppercase text-[15px] mb-3">impact</h2>

          {exp.impact?.length ? (
            <ul className="list-disc ml-5 space-y-2 text-wp-text/80 text-[15px]">
              {exp.impact.map((i, idx) => (
                <li key={idx}>{i}</li>
              ))}
            </ul>
          ) : (
            <p className="text-wp-text/40 text-[14px]">No impact added.</p>
          )}
        </section>

        {/* Skills */}
        <section className="wp-list-enter wp-delay-1">
          <h2 className="text-wp-text/60 uppercase text-[15px] mb-3">
            skills applied
          </h2>

          <div className="flex flex-wrap gap-2">
            {exp.skills?.map((s) => (
              <span
                key={s}
                className="px-3 py-1 bg-wp-accent text-wp-bg text-[12px]"
              >
                {s}
              </span>
            ))}
          </div>
        </section>

        {/* Description */}
        <section className="wp-list-enter wp-delay-2">
          <h2 className="text-wp-text/60 uppercase text-[15px] mb-3">
            description
          </h2>

          <p className="mb-20 text-wp-text/80 text-[15px] leading-relaxed whitespace-pre-line">
            {exp.description || "No description provided."}
          </p>
        </section>
      </div>

      <WPAppBar buttons={appBarButtons} />
    </div>
  );
};

export default WPExperienceDetail;
