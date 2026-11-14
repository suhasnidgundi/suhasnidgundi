import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  BookMarked,
  FileText,
  Activity,
  Settings,
  Mail,
  User,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

import useAnalytics from '@/hooks/useAnalytics';
import { useProjects } from '@/hooks/useProjects';
import { useExperiences } from '@/hooks/useExperiences';
import { useEdgeConfig } from '@/hooks/useEdgeConfig';
import { useWPTheme } from '@/contexts/WPThemeContext';

import WPStatusBar from '@/components/wp/WPStatusBar';
import WPNavBar from '@/components/wp/WPNavBar';
import WPActionCenter from '@/components/wp/WPActionCenter';
import WPCortana from '@/components/wp/WPCortana';
import WPTile from '@/components/wp/WPTile';
import WPAllAppsList from '@/components/wp/WPAllAppsList';

import WPFolderIcon from '@/components/wp/icons/WPFolderIcon';
import WPExperienceIcon from '@/components/wp/icons/WPBriefcaseIcon';
import WPGithubIcon from '@/components/wp/icons/WPGithubIcon';
import WPLinkedInIcon from '@/components/wp/icons/WPLinkedInIcon';
import WPBlogIcon from '@/components/wp/icons/WPBlogIcon';
import WPMailIcon from '@/components/wp/icons/WPMailIcon';

import profilePhoto from '@/assets/profile-photo.jpg';

interface WPHomeProps {
  isDark: boolean;
  toggleTheme: () => void;
}

const WPHome = ({ isDark, toggleTheme }: WPHomeProps) => {
  const navigate = useNavigate();
  useAnalytics();

  const {
    accent,
    transparentTiles,
    background,
    setCortanaOpen,
  } = useWPTheme();

  const { data: projects } = useProjects();
  const { data: experiences } = useExperiences();
  const { data: edgeConfig } = useEdgeConfig();

  // Active Screen: 'start' | 'apps'
  const [activeScreen, setActiveScreen] = useState<'start' | 'apps'>('start');

  // Dynamic Blob States
  const [visitorCount, setVisitorCount] = useState<{ total: number; today: number }>({
    total: 0,
    today: 0,
  });
  const [guestbookCount, setGuestbookCount] = useState<number>(0);
  const [latestGuestbookEntry, setLatestGuestbookEntry] = useState<any>(null);

  useEffect(() => {
    // 1. Fetch live visitor count
    fetch('/api/visitor-counter')
      .then((r) => r.json())
      .then((d) => {
        if (d && typeof d.total === 'number') setVisitorCount(d);
      })
      .catch(() => {});

    // 2. Fetch live guestbook count
    fetch('/api/guestbook')
      .then((r) => r.json())
      .then((d) => {
        if (d && Array.isArray(d.entries)) {
          setGuestbookCount(d.entries.length);
          if (d.entries.length > 0) {
            setLatestGuestbookEntry(d.entries[0]);
          }
        }
      })
      .catch(() => {});
  }, []);

  const openUrl = (url: string) => window.open(url, '_blank');

  // Latest featured or first project
  const featured = projects && projects.length > 0 ? projects[0] : null;
  const currentExp = experiences?.find((e) => e.is_current) || experiences?.[0];

  return (
    <div
      className={`min-h-screen text-white font-['Segoe_UI',sans-serif] flex flex-col relative overflow-hidden select-none ${
        isDark ? 'bg-black' : 'bg-neutral-900'
      }`}
    >
      {/* Background Wallpaper for WP8.1 Parallax Start screen */}
      {transparentTiles && background && background !== 'none' && (
        <div
          className="fixed inset-0 z-0 bg-cover bg-center opacity-30 filter saturate-150 transition-all duration-700 pointer-events-none"
          style={{ backgroundImage: `url(${background})` }}
        />
      )}

      {/* Top Status Bar (Tap to open Action Center) */}
      <WPStatusBar />

      {/* Pull-down Action Center Shade */}
      <WPActionCenter isDark={isDark} toggleTheme={toggleTheme} />

      {/* Cortana Assistant Modal */}
      <WPCortana />

      {/* Screen Container (Start vs All Apps) */}
      <div className="flex-1 overflow-y-auto relative z-10">
        {activeScreen === 'start' ? (
          <div className="px-4 pt-4 pb-28 max-w-md mx-auto">
            {/* Start Header with subtle swipe button */}
            <div className="flex items-center justify-between mb-5">
              <h1 className="text-[44px] font-extralight tracking-tight text-white leading-none lowercase">
                start
              </h1>

              <button
                onClick={() => setActiveScreen('apps')}
                className="w-9 h-9 rounded-full border border-white/40 flex items-center justify-center text-white/80 active:bg-white/20 transition-all shadow-sm"
                title="All Apps"
                aria-label="View all apps"
              >
                <ArrowRight className="w-4 h-4 stroke-[2.2]" />
              </button>
            </div>

            {/* Metro Live Tiles Grid */}
            <div className="grid grid-cols-2 gap-3">
              {/* 1. Me / Profile Tile (Wide) */}
              <WPTile
                size="wide"
                label={edgeConfig?.name || 'Suhas Nidgundi'}
                color="bg-[hsl(var(--wp-accent))]"
                badge={edgeConfig?.openToWork ? 'OPEN TO WORK' : 'AVAILABLE'}
                onClick={() => navigate('/about')}
                flipInterval={6000}
                icon={
                  <div className="flex items-center gap-4">
                    <img
                      src={profilePhoto}
                      alt="Suhas"
                      className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
                    />
                    <div className="text-left">
                      <span className="text-[17px] font-semibold text-white block">
                        {edgeConfig?.name || 'Suhas Nidgundi'}
                      </span>
                      <span className="text-[12px] text-white/80 font-light block leading-tight">
                        {edgeConfig?.role || 'Full Stack Engineer & System Designer'}
                      </span>
                    </div>
                  </div>
                }
                backContent={
                  <div className="flex flex-col justify-between h-full">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold tracking-wider uppercase text-cyan-300">
                        Profile Telemetry
                      </span>
                      <span className="text-[10px] text-white/50">LIVE</span>
                    </div>
                    <div>
                      <p className="text-[13px] text-white/95 font-medium leading-snug">
                        {edgeConfig?.status ||
                          'Available for exciting Full Stack & System Engineering opportunities'}
                      </p>
                      <span className="text-[11px] text-white/60 block mt-1">
                        📍 {edgeConfig?.location || 'Belgaum / Pune, India'}
                      </span>
                    </div>
                    <span className="text-[11px] text-[hsl(var(--wp-accent))] font-medium flex items-center gap-1">
                      Tap to open People Hub <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                }
              />

              {/* 2. Projects Tile (Wide with Live Flip) */}
              <WPTile
                size="wide"
                label="Projects"
                color="bg-[hsl(var(--wp-emerald))]"
                count={projects?.length || 0}
                onClick={() => navigate('/projects')}
                flipInterval={7500}
                icon={<WPFolderIcon />}
                backContent={
                  <div className="flex flex-col justify-between h-full">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold tracking-wider uppercase text-emerald-300">
                        Latest Project
                      </span>
                      <span className="text-[11px] bg-emerald-600 text-white px-1.5 py-0.2 rounded font-bold">
                        {projects?.length || 0} ITEMS
                      </span>
                    </div>
                    {featured ? (
                      <div>
                        <span className="text-[15px] font-semibold text-white block truncate">
                          {featured.title}
                        </span>
                        <p className="text-[12px] text-white/80 font-light line-clamp-2 mt-0.5">
                          {featured.impact_metric || featured.description}
                        </p>
                      </div>
                    ) : (
                      <p className="text-[13px] text-white/70">
                        Explore clean-slate projects from Vercel Blob.
                      </p>
                    )}
                    <span className="text-[11px] text-emerald-300 font-medium flex items-center gap-1">
                      Tap to view all projects <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                }
              />

              {/* 3. Experience Tile (Medium) */}
              <WPTile
                size="medium"
                label="Experience"
                color="bg-[hsl(var(--wp-violet))]"
                onClick={() => navigate('/experience')}
                flipInterval={8000}
                icon={<WPExperienceIcon />}
                backContent={
                  <div className="flex flex-col justify-between h-full">
                    <span className="text-[11px] font-semibold tracking-wider uppercase text-purple-300">
                      Career
                    </span>
                    {currentExp ? (
                      <div>
                        <span className="text-[14px] font-semibold text-white block leading-tight">
                          {currentExp.role}
                        </span>
                        <span className="text-[12px] text-white/80 font-light block mt-0.5">
                          @ {currentExp.company}
                        </span>
                      </div>
                    ) : (
                      <p className="text-[12px] text-white/70">
                        Full Stack & System Engineering history.
                      </p>
                    )}
                    <span className="text-[10px] text-purple-300 font-medium">
                      Timeline →
                    </span>
                  </div>
                }
              />

              {/* 4. Cortana Assistant Tile (Medium) */}
              <WPTile
                size="medium"
                label="Cortana AI"
                color="bg-[hsl(var(--wp-cobalt))]"
                onClick={() => setCortanaOpen(true)}
                icon={
                  <div className="relative w-14 h-14 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-2 border-cyan-400/50 animate-pulse" />
                    <div className="w-10 h-10 rounded-full bg-cyan-500/20 border-2 border-cyan-300 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-cyan-300 animate-spin" />
                    </div>
                  </div>
                }
                backContent={
                  <div className="flex flex-col justify-between h-full">
                    <span className="text-[11px] font-semibold tracking-wider uppercase text-cyan-300">
                      Cortana
                    </span>
                    <p className="text-[13px] text-white/90 font-light leading-snug">
                      "Ask me anything about Suhas's engineering work!"
                    </p>
                    <span className="text-[10px] text-cyan-300 font-medium">
                      Start Voice / Chat →
                    </span>
                  </div>
                }
              />

              {/* 5. Visitor Telemetry Tile (Medium with Live Counts) */}
              <WPTile
                size="medium"
                label="Visitor Stats"
                color="bg-[hsl(var(--wp-teal))]"
                onClick={() => navigate('/settings')}
                flipInterval={5000}
                icon={
                  <div className="flex flex-col items-center">
                    <Activity className="w-8 h-8 text-white mb-1" />
                    <span className="text-[20px] font-mono font-bold text-white tracking-wider">
                      {visitorCount.total}
                    </span>
                  </div>
                }
                backContent={
                  <div className="flex flex-col justify-between h-full">
                    <span className="text-[11px] font-semibold tracking-wider uppercase text-teal-300">
                      Telemetry
                    </span>
                    <div>
                      <span className="text-[10px] text-white/60 block">TODAY'S VISITS</span>
                      <span className="text-[24px] font-mono font-bold text-teal-300 block">
                        +{visitorCount.today}
                      </span>
                    </div>
                    <span className="text-[10px] text-white/50 font-mono">
                      Vercel Blob Storage
                    </span>
                  </div>
                }
              />

              {/* 6. Guestbook Tile (Medium with Live Flip) */}
              <WPTile
                size="medium"
                label="Guestbook"
                color="bg-[hsl(var(--wp-orange))]"
                count={guestbookCount}
                onClick={() => navigate('/guestbook')}
                flipInterval={9000}
                icon={<BookMarked className="w-8 h-8 text-white" />}
                backContent={
                  <div className="flex flex-col justify-between h-full">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold tracking-wider uppercase text-amber-300">
                        Guestbook
                      </span>
                      <span className="text-[10px] text-white/60 font-mono">
                        {guestbookCount} total
                      </span>
                    </div>
                    {latestGuestbookEntry ? (
                      <div>
                        <span className="text-[12px] font-semibold text-white block truncate">
                          {latestGuestbookEntry.name}
                        </span>
                        <p className="text-[11px] text-white/80 font-light line-clamp-2 italic">
                          "{latestGuestbookEntry.message}"
                        </p>
                      </div>
                    ) : (
                      <p className="text-[12px] text-white/70">
                        Leave your mark on the visitor wall!
                      </p>
                    )}
                    <span className="text-[10px] text-amber-300 font-medium">
                      Sign Now →
                    </span>
                  </div>
                }
              />

              {/* 7. Office Hub / Resume Tile (Medium) */}
              <WPTile
                size="medium"
                label="Office / Resume"
                color="bg-[hsl(var(--wp-cyan))]"
                onClick={() => navigate('/office')}
                icon={<FileText className="w-8 h-8 text-white" />}
              />

              {/* 8. Settings Tile (Medium with Active Accent Color) */}
              <WPTile
                size="medium"
                label="Settings"
                color="bg-[hsl(var(--wp-steel))]"
                onClick={() => navigate('/settings')}
                icon={
                  <div className="flex flex-col items-center">
                    <div
                      className="w-7 h-7 rounded-full border-2 border-white mb-1 shadow"
                      style={{ backgroundColor: accent.hex }}
                    />
                    <Settings className="w-5 h-5 text-white/80" />
                  </div>
                }
              />

              {/* 9. GitHub Tile (Medium) */}
              <WPTile
                size="medium"
                label="GitHub"
                color="bg-[#24292e]"
                onClick={() => openUrl('https://github.com/suhasnidgundi')}
                icon={<WPGithubIcon />}
              />

              {/* 10. LinkedIn Tile (Medium) */}
              <WPTile
                size="medium"
                label="LinkedIn"
                color="bg-[#0077b5]"
                onClick={() => openUrl('https://linkedin.com/in/suhasnidgundi')}
                icon={<WPLinkedInIcon />}
              />

              {/* 11. Blog Tile (Medium) */}
              <WPTile
                size="medium"
                label="Blog (Medium)"
                color="bg-[hsl(var(--wp-magenta))]"
                onClick={() => openUrl('https://medium.com/@suhasnidgundi')}
                icon={<WPBlogIcon />}
              />

              {/* 12. Contact Tile (Medium) */}
              <WPTile
                size="medium"
                label="Contact"
                color="bg-[hsl(var(--wp-emerald))]"
                onClick={() => navigate('/contact')}
                icon={<WPMailIcon />}
              />
            </div>

            {/* Bottom Swipe Indicator to All Apps */}
            <div
              onClick={() => setActiveScreen('apps')}
              className="mt-8 flex items-center justify-center gap-2 py-3 px-4 bg-white/5 border border-white/10 rounded cursor-pointer active:bg-white/10 transition-colors"
            >
              <span className="text-[14px] font-light text-white/80 lowercase">
                swipe or tap for all apps
              </span>
              <ArrowRight className="w-4 h-4 text-white/60" />
            </div>
          </div>
        ) : (
          /* View 2: All Apps Alphabetical View */
          <WPAllAppsList onBackToStart={() => setActiveScreen('start')} />
        )}
      </div>

      {/* Pinned Windows Phone 3-Key Navigation Bar (Back, Windows, Cortana) */}
      <WPNavBar />
    </div>
  );
};

export default WPHome;
