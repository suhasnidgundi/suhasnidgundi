import { useNavigate } from "react-router-dom";
import {
  Github,
  Linkedin,
  Mail,
  FileText,
  MapPin,
  Sparkles,
  Download,
  BookOpen,
} from "lucide-react";
import WPStatusBar from "@/components/wp/WPStatusBar";
import WPNavBar from "@/components/wp/WPNavBar";
import { useEdgeConfig } from "@/hooks/useEdgeConfig";
import profilePhoto from "@/assets/profile-photo.jpg";

interface WPAboutMeProps {
  isDark: boolean;
  toggleTheme: () => void;
}

const WPAboutMe = ({ isDark }: WPAboutMeProps) => {
  const navigate = useNavigate();
  const { data: config } = useEdgeConfig();

  const openUrl = (url: string) => window.open(url, "_blank");

  return (
    <div className="min-h-screen bg-black text-white font-['Segoe_UI',sans-serif] flex flex-col select-none">
      <WPStatusBar />

      {/* Panorama-style Hero Header */}
      <div className="relative h-72 overflow-hidden bg-neutral-900">
        <img
          src={profilePhoto}
          alt={config?.name || "Suhas"}
          className="w-full h-full object-cover object-top opacity-85"
        />
        {/* Windows Phone Panorama Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

        <div className="absolute bottom-5 left-5 right-5">
          <h1 className="text-[44px] font-extralight tracking-tight text-white leading-none lowercase">
            {config?.name ? config.name.toLowerCase() : "about me"}
          </h1>
          <p className="text-[hsl(var(--wp-accent))] text-[14px] font-semibold tracking-wide mt-1">
            {config?.role || "Full Stack Engineer & System Designer"}
          </p>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto px-5 pt-4 pb-24 space-y-6">
        {/* Quick Contact & Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => openUrl(`mailto:${config?.email || "suhasnidgundi@gmail.com"}`)}
            className="flex-1 py-2.5 bg-[hsl(var(--wp-accent))] text-white rounded font-medium text-[13px] flex items-center justify-center gap-2 active:scale-95 shadow transition-transform"
          >
            <Mail className="w-4 h-4" /> Email Me
          </button>
          <button
            onClick={() => openUrl(config?.linkedin || "https://linkedin.com/in/suhasnidgundi")}
            className="flex-1 py-2.5 bg-[#0077b5] text-white rounded font-medium text-[13px] flex items-center justify-center gap-2 active:scale-95 shadow transition-transform"
          >
            <Linkedin className="w-4 h-4" /> LinkedIn
          </button>
          <button
            onClick={() => openUrl(config?.github || "https://github.com/suhasnidgundi")}
            className="w-10 h-10 bg-white/10 rounded flex items-center justify-center text-white active:bg-white/20 transition-colors"
            title="GitHub"
          >
            <Github className="w-5 h-5" />
          </button>
        </div>

        {/* Bio / Headline */}
        <div className="p-4 bg-white/5 border-l-4 border-[hsl(var(--wp-accent))] rounded-r space-y-2">
          <h2 className="text-[13px] uppercase tracking-wider text-white/50 font-semibold">
            Engineering Philosophy
          </h2>
          <p className="text-[14px] text-white/90 leading-relaxed font-light">
            {config?.headline ||
              "Building high-impact systems, distributed architectures, and nostalgic web experiences."}
          </p>
          <div className="flex items-center gap-1.5 text-[12px] text-white/60 pt-1">
            <MapPin className="w-3.5 h-3.5 text-[hsl(var(--wp-accent))]" />
            <span>{config?.location || "Belgaum / Pune, India"}</span>
          </div>
        </div>

        {/* Core Skills */}
        <section className="space-y-2">
          <h2 className="text-white/60 uppercase tracking-wide text-[13px] font-semibold">
            Core Technologies & Stack
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {[
              "React",
              "TypeScript",
              "Next.js",
              "Node.js",
              "Python",
              "Tailwind CSS",
              "PostgreSQL",
              "Vercel Cloud",
              "Docker",
              "Git",
              "Distributed Systems",
              "REST APIs",
            ].map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 bg-[hsl(var(--wp-accent))] text-white text-[12px] font-medium shadow-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>

        {/* Education */}
        <section className="space-y-2">
          <h2 className="text-white/60 uppercase tracking-wide text-[13px] font-semibold">
            Education
          </h2>
          <div className="bg-white/5 p-4 rounded border-l-4 border-indigo-500">
            <p className="text-white text-[15px] font-semibold">
              Bachelor of Engineering — Computer Science & Engineering
            </p>
            <p className="text-white/60 text-[13px] mt-0.5">
              Visvesvaraya Technological University (VTU)
            </p>
            <span className="text-white/40 text-[11px] block mt-1 font-mono">
              Class of 2023
            </span>
          </div>
        </section>

        {/* Quick Navigation to other Hubs */}
        <section className="space-y-2">
          <h2 className="text-white/60 uppercase tracking-wide text-[13px] font-semibold">
            Explore More Hubs
          </h2>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => navigate("/projects")}
              className="p-3 bg-white/5 rounded border border-white/10 text-left active:bg-white/10 transition-colors"
            >
              <span className="text-[14px] font-medium text-white block">Projects Hub</span>
              <span className="text-[11px] text-white/50">Full portfolio list →</span>
            </button>
            <button
              onClick={() => navigate("/office")}
              className="p-3 bg-white/5 rounded border border-white/10 text-left active:bg-white/10 transition-colors"
            >
              <span className="text-[14px] font-medium text-white block">Office / Resume</span>
              <span className="text-[11px] text-white/50">Case studies & PDF →</span>
            </button>
          </div>
        </section>
      </div>

      <WPNavBar />
    </div>
  );
};

export default WPAboutMe;
