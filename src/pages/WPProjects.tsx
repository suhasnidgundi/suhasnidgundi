import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Folder, ExternalLink, Github, Sparkles } from 'lucide-react';
import useAnalytics from '@/hooks/useAnalytics';
import { useProjects } from '@/hooks/useProjects';
import WPStatusBar from '@/components/wp/WPStatusBar';
import WPNavBar from '@/components/wp/WPNavBar';

interface WPProjectsProps {
  isDark: boolean;
  toggleTheme: () => void;
}

const WPProjects = ({ isDark }: WPProjectsProps) => {
  const navigate = useNavigate();
  useAnalytics();

  const { data: projects, isLoading } = useProjects();
  const [activePivot, setActivePivot] = useState<'all' | 'featured'>('all');
  const [query, setQuery] = useState('');

  const filtered = (projects || [])
    .filter((p) => (activePivot === 'featured' ? p.is_featured : true))
    .filter(
      (p) =>
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.description?.toLowerCase().includes(query.toLowerCase()) ||
        p.tech_stack?.some((t) => t.toLowerCase().includes(query.toLowerCase()))
    );

  return (
    <div className="min-h-screen bg-black text-white font-['Segoe_UI',sans-serif] flex flex-col select-none">
      <WPStatusBar />

      {/* Main Header & Pivot */}
      <div className="px-5 pt-4 pb-2">
        <h1 className="text-[44px] font-extralight tracking-tight text-white lowercase leading-none">
          projects
        </h1>

        {/* Pivot Tabs */}
        <div className="flex items-center gap-6 mt-4 border-b border-white/10 pb-2">
          <button
            onClick={() => setActivePivot('all')}
            className={`text-[20px] font-light lowercase transition-colors ${
              activePivot === 'all'
                ? 'text-[hsl(var(--wp-accent))] font-medium'
                : 'text-white/40 hover:text-white/70'
            }`}
          >
            all ({projects?.length || 0})
          </button>
          <button
            onClick={() => setActivePivot('featured')}
            className={`text-[20px] font-light lowercase transition-colors ${
              activePivot === 'featured'
                ? 'text-[hsl(var(--wp-accent))] font-medium'
                : 'text-white/40 hover:text-white/70'
            }`}
          >
            featured
          </button>
        </div>

        {/* Search bar */}
        <div className="mt-3 relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="filter projects by name or stack..."
            className="w-full bg-white/10 text-white placeholder-white/40 text-[14px] px-3 py-2 pl-9 rounded border border-white/20 focus:outline-none focus:border-[hsl(var(--wp-accent))]"
          />
          <Search className="w-4 h-4 text-white/50 absolute left-3 top-3" />
        </div>
      </div>

      {/* Projects List */}
      <div className="flex-1 overflow-y-auto px-5 pt-2 pb-24">
        {isLoading ? (
          <div className="py-20 text-center text-white/50 text-[14px]">
            Syncing projects from Vercel Blob…
          </div>
        ) : filtered.length > 0 ? (
          <div className="space-y-4">
            {filtered.map((project, index) => (
              <div
                key={project.$id}
                onClick={() => navigate(`/projects/${project.$id}`)}
                className="relative p-4 bg-white/5 border-l-4 border-[hsl(var(--wp-accent))] rounded-r shadow-sm active:bg-white/10 cursor-pointer transition-colors"
              >
                <div className="flex items-start justify-between gap-3 mb-1.5">
                  <h3 className="text-[17px] font-semibold text-white leading-tight">
                    {project.title}
                  </h3>
                  {project.is_featured && (
                    <span className="text-[9px] bg-[hsl(var(--wp-accent))] text-white font-bold px-1.5 py-0.2 rounded uppercase">
                      Featured
                    </span>
                  )}
                </div>

                <p className="text-[13px] text-white/75 font-light leading-relaxed mb-3 line-clamp-2">
                  {project.impact_metric || project.description}
                </p>

                {/* Tech Stack Badges */}
                <div className="flex flex-wrap gap-1.5">
                  {project.tech_stack?.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] bg-white/10 text-white/80 px-2 py-0.5 rounded font-mono"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-white/50 space-y-2">
            <Folder className="w-12 h-12 mx-auto text-white/20" />
            <p className="text-[15px]">No projects found.</p>
            <p className="text-[12px] text-white/40">
              {query
                ? 'Try a different search keyword.'
                : 'Add projects via the Admin dashboard at /admin.'}
            </p>
          </div>
        )}
      </div>

      <WPNavBar />
    </div>
  );
};

export default WPProjects;
