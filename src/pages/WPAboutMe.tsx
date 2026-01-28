import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Github,
  Linkedin,
  Mail,
  FileText,
  MailIcon,
  LinkedinIcon,
  GithubIcon,
  FileIcon,
} from "lucide-react";
import WPStatusBar from "@/components/wp/WPStatusBar";
import WPAppBar from "@/components/wp/WPAppBar";
import profilePhoto from "@/assets/profile-photo.jpg";

interface WPAboutMeProps {
  isDark: boolean;
  toggleTheme: () => void;
}

const WPAboutMe = ({ isDark, toggleTheme }: WPAboutMeProps) => {
  const navigate = useNavigate();

  const openUrl = (url: string) => window.open(url, "_blank");

  const appBarButtons = [
    {
      icon: <ArrowLeft className="w-5 h-5" />,
      label: "Back",
      onClick: () => navigate("/"),
    },
    {
      icon: <Github className="w-5 h-5" />,
      label: "GitHub",
      onClick: () => openUrl("https://github.com/suhasnidgundi"),
    },
    {
      icon: <Linkedin className="w-5 h-5" />,
      label: "LinkedIn",
      onClick: () => openUrl("https://linkedin.com/in/suhasnidgundi"),
    },
    {
      icon: <Mail className="w-5 h-5" />,
      label: "Contact",
      onClick: () => openUrl("mailto:suhasnidgundi@gmail.com"),
    },
  ];

  return (
    <div className="min-h-screen bg-wp-bg flex flex-col">
      <WPStatusBar />

      {/* Panorama-style header */}
      <div className="relative h-80 overflow-hidden">
        <img
          src={profilePhoto}
          alt="Suhas"
          className="w-full h-full object-cover object-center"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-wp-accent/40 via-transparent to-wp-bg" />

        <div className="absolute bottom-8 left-5 right-5">
          <h1 className="text-[42px] font-light tracking-tight text-wp-text wp-list-enter">
            about me
          </h1>
          {/* Tagline */}
          <p className="text-wp-accent text-[15px] font-semibold wp-list-enter">
            Final-Year Computer Engineer | Software Engineer (Freelance +
            Community)
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 pt-6 pb-24 space-y-8">
        {/* Bio */}
        <p className="text-wp-text/80 text-[14px] leading-relaxed font-light wp-list-enter wp-delay-1">
          engineer building scalable systems, cloud-native services,
          and empowering developers through thoughtful engineering.
        </p>

        {/* Quick Actions — Icon Only */}
        <div className="flex flex-row items-center gap-4 mt-5 wp-list-enter">
          {/* Email */}
          <button
            onClick={() => window.open("mailto:suhasnidgundi@gmail.com")}
            className="w-14 h-14 rounded-full bg-wp-chrome flex items-center justify-center text-wp-text active:bg-wp-text/20"
          >
            <MailIcon className="w-6 h-6" />
          </button>

          {/* LinkedIn */}
          <button
            onClick={() => window.open("https://linkedin.com/in/suhasnidgundi")}
            className="w-14 h-14 rounded-full bg-wp-chrome flex items-center justify-center text-wp-text active:bg-wp-text/20"
          >
            <LinkedinIcon className="w-6 h-6" />
          </button>

          {/* GitHub */}
          <button
            onClick={() => window.open("https://github.com/suhasnidgundi")}
            className="w-14 h-14 rounded-full bg-wp-chrome flex items-center justify-center text-wp-text active:bg-wp-text/20"
          >
            <GithubIcon className="w-6 h-6" />
          </button>

          {/* Resume */}
          <button
            onClick={() => window.open("/resume.pdf")}
            className="w-14 h-14 rounded-full bg-wp-chrome flex items-center justify-center text-wp-text active:bg-wp-text/20"
          >
            <FileIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Skills */}
        <section className="wp-list-enter wp-delay-2">
          <h2 className="text-wp-text/60 uppercase tracking-wide text-[15px] mb-3">
            skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {[
              "React",
              "TypeScript",
              "Node.js",
              "AWS",
              "Docker",
              "Kubernetes",
              "PostgreSQL",
              "Python",
            ].map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 bg-wp-accent text-wp-bg text-[12px] font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>

        {/* Education */}
        <section className="wp-list-enter wp-delay-3">
          <h2 className="text-wp-text/60 uppercase tracking-wide text-[15px] mb-3">
            education
          </h2>
          <div className="bg-wp-chrome p-4 relative">
            <div className="wp-accent-bar" />
            <p className="text-wp-text text-[16px] font-semibold">
              Bachelor of Engineering - Computer Engineering
            </p>
            <p className="text-wp-text/60 text-[13px]" onClick={() => window.open("https://www.dypcoei.edu.in")}>DYPCOEI</p>
            <p className="text-wp-text/40 text-[12px] mt-1">Expected 2026</p>
          </div>
        </section>

        {/* Fun Facts / Beyond Tech */}
        <section className="mt-10 wp-list-enter wp-delay-1">
          <h2 className="text-wp-text/60 uppercase tracking-wide text-[15px] mb-3">
            beyond tech
          </h2>

          <div className="space-y-2 text-wp-text/80 text-[15px] font-light">
            <p>
              🎹 I enjoy playing melodica and guitar, exploring music in my free
              time.
            </p>
            <p>
              🤝 Active volunteer at tech communities like AWS User Group Pune.
            </p>
            <p>
              🌐 Love simplifying technology and sharing knowledge with others.
            </p>
            <p>
              📺 I love watching tech videos and follow creators like Fireship,
              DIY Perks, and NetworkChuck.
            </p>
          </div>
        </section>
      </div>

      <WPAppBar buttons={appBarButtons} />
    </div>
  );
};

export default WPAboutMe;
