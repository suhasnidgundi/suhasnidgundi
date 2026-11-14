import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  User,
  Sparkles,
  BookOpen,
  Mail,
  Briefcase,
  Github,
  BookMarked,
  Globe,
  Linkedin,
  FileText,
  Folder,
  Settings,
  Activity,
  ArrowRight,
} from 'lucide-react';
import { useWPTheme } from '@/contexts/WPThemeContext';

interface AppItem {
  id: string;
  name: string;
  letter: string;
  icon: React.ReactNode;
  subtitle?: string;
  onClick: () => void;
}

interface WPAllAppsListProps {
  onBackToStart: () => void;
}

const WPAllAppsList: React.FC<WPAllAppsListProps> = ({ onBackToStart }) => {
  const navigate = useNavigate();
  const { setCortanaOpen } = useWPTheme();
  const [searchTerm, setSearchTerm] = useState('');

  const openUrl = (url: string) => window.open(url, '_blank');

  const allApps: AppItem[] = [
    {
      id: 'about',
      name: 'About Me',
      letter: 'A',
      icon: <User className="w-5 h-5 text-white" />,
      subtitle: 'Profile, skills & background',
      onClick: () => navigate('/about'),
    },
    {
      id: 'cortana',
      name: 'AI Assistant (Cortana)',
      letter: 'A',
      icon: <Sparkles className="w-5 h-5 text-white" />,
      subtitle: 'Talk with portfolio AI',
      onClick: () => setCortanaOpen(true),
    },
    {
      id: 'blog',
      name: 'Blog (Medium)',
      letter: 'B',
      icon: <BookOpen className="w-5 h-5 text-white" />,
      subtitle: 'Tech articles & deep dives',
      onClick: () => openUrl('https://medium.com/@suhasnidgundi'),
    },
    {
      id: 'contact',
      name: 'Contact',
      letter: 'C',
      icon: <Mail className="w-5 h-5 text-white" />,
      subtitle: 'Send direct message',
      onClick: () => navigate('/contact'),
    },
    {
      id: 'experience',
      name: 'Experience',
      letter: 'E',
      icon: <Briefcase className="w-5 h-5 text-white" />,
      subtitle: 'Work & leadership history',
      onClick: () => navigate('/experience'),
    },
    {
      id: 'github',
      name: 'GitHub',
      letter: 'G',
      icon: <Github className="w-5 h-5 text-white" />,
      subtitle: '@suhasnidgundi repos',
      onClick: () => openUrl('https://github.com/suhasnidgundi'),
    },
    {
      id: 'guestbook',
      name: 'Guestbook',
      letter: 'G',
      icon: <BookMarked className="w-5 h-5 text-white" />,
      subtitle: 'View & sign visitor wall',
      onClick: () => navigate('/guestbook'),
    },
    {
      id: 'ie',
      name: 'Internet Explorer',
      letter: 'I',
      icon: <Globe className="w-5 h-5 text-white" />,
      subtitle: 'Web links & live demos',
      onClick: () => openUrl('https://suhasnidgundi.tech'),
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      letter: 'L',
      icon: <Linkedin className="w-5 h-5 text-white" />,
      subtitle: 'Professional network',
      onClick: () => openUrl('https://linkedin.com/in/suhasnidgundi'),
    },
    {
      id: 'office',
      name: 'Office Hub (Resume)',
      letter: 'O',
      icon: <FileText className="w-5 h-5 text-white" />,
      subtitle: 'The Engineering Journey & PDF',
      onClick: () => navigate('/office'),
    },
    {
      id: 'projects',
      name: 'Projects',
      letter: 'P',
      icon: <Folder className="w-5 h-5 text-white" />,
      subtitle: 'Software systems & architecture',
      onClick: () => navigate('/projects'),
    },
    {
      id: 'settings',
      name: 'Settings',
      letter: 'S',
      icon: <Settings className="w-5 h-5 text-white" />,
      subtitle: 'start+theme, accents & system',
      onClick: () => navigate('/settings'),
    },
    {
      id: 'visitors',
      name: 'Visitor Telemetry',
      letter: 'V',
      icon: <Activity className="w-5 h-5 text-white" />,
      subtitle: 'Real-time counters & analytics',
      onClick: () => navigate('/settings'),
    },
  ];

  const filteredApps = allApps.filter((app) =>
    app.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group apps by letter
  const groupedApps: { [letter: string]: AppItem[] } = {};
  filteredApps.forEach((app) => {
    if (!groupedApps[app.letter]) {
      groupedApps[app.letter] = [];
    }
    groupedApps[app.letter].push(app);
  });

  const sortedLetters = Object.keys(groupedApps).sort();

  return (
    <div className="min-h-full flex flex-col font-['Segoe_UI',sans-serif] px-4 pt-2 pb-24 select-none">
      {/* Header with swipe indicator to go back to Start */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[34px] font-extralight tracking-tight text-white lowercase">
          apps
        </h2>
        <button
          onClick={onBackToStart}
          className="flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded text-[12px] text-white/80 active:bg-white/20 transition-colors"
        >
          <span>start</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Search Input */}
      <div className="relative mb-6">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="search apps"
          className="w-full bg-white/10 text-white placeholder-white/40 text-[15px] px-3 py-2 pl-9 rounded border border-white/20 focus:outline-none focus:border-[hsl(var(--wp-accent))]"
        />
        <Search className="w-4 h-4 text-white/50 absolute left-3 top-3" />
      </div>

      {/* Grouped App List */}
      <div className="space-y-6">
        {sortedLetters.map((letter) => (
          <div key={letter} className="space-y-3">
            {/* Letter jump badge */}
            <div className="w-9 h-9 bg-[hsl(var(--wp-accent))] text-white font-bold text-[18px] flex items-center justify-center shadow">
              {letter}
            </div>

            {/* Apps in this letter group */}
            <div className="space-y-2.5 pl-1">
              {groupedApps[letter].map((app) => (
                <div
                  key={app.id}
                  onClick={app.onClick}
                  className="flex items-center gap-3.5 py-1.5 px-2 active:bg-white/10 rounded cursor-pointer transition-colors"
                >
                  {/* Colored icon square */}
                  <div className="w-9 h-9 bg-[hsl(var(--wp-accent))] flex items-center justify-center flex-shrink-0 shadow-sm">
                    {app.icon}
                  </div>

                  {/* App Name and Subtitle */}
                  <div className="flex-1 overflow-hidden">
                    <span className="text-[17px] font-normal text-white block leading-tight">
                      {app.name}
                    </span>
                    {app.subtitle && (
                      <span className="text-[12px] font-light text-white/60 truncate block">
                        {app.subtitle}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {sortedLetters.length === 0 && (
          <div className="text-center py-12 text-white/50 text-[14px]">
            No apps matching "{searchTerm}"
          </div>
        )}
      </div>
    </div>
  );
};

export default WPAllAppsList;
