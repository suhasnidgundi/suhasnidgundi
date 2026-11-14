import React, { useState, useEffect } from 'react';
import { Download, FileText, ExternalLink, CheckCircle } from 'lucide-react';
import WPStatusBar from '@/components/wp/WPStatusBar';
import WPNavBar from '@/components/wp/WPNavBar';
import { useProfile } from '@/hooks/useProfile';

const WPOffice: React.FC = () => {
  const { data: profile } = useProfile();
  const [activePivot, setActivePivot] = useState<'story' | 'resume'>('story');
  const [storyData, setStoryData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/documents?type=wordpad')
      .then((res) => res.json())
      .then((data) => {
        setStoryData(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-['Segoe_UI',sans-serif] flex flex-col select-none">
      <WPStatusBar />

      {/* Main Header & Pivot */}
      <div className="px-5 pt-4 pb-2">
        <h1 className="text-[44px] font-extralight tracking-tight text-white lowercase leading-none">
          office hub
        </h1>

        <div className="flex items-center gap-6 mt-4 border-b border-white/10 pb-2">
          <button
            onClick={() => setActivePivot('story')}
            className={`text-[20px] font-light lowercase transition-colors ${
              activePivot === 'story'
                ? 'text-[hsl(var(--wp-accent))] font-medium'
                : 'text-white/40 hover:text-white/70'
            }`}
          >
            engineering story
          </button>
          <button
            onClick={() => setActivePivot('resume')}
            className={`text-[20px] font-light lowercase transition-colors ${
              activePivot === 'resume'
                ? 'text-[hsl(var(--wp-accent))] font-medium'
                : 'text-white/40 hover:text-white/70'
            }`}
          >
            resume pdf
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 pt-4 pb-24">
        {activePivot === 'story' ? (
          <div className="space-y-6 max-w-xl">
            {loading ? (
              <div className="py-20 text-center text-white/50 text-[14px]">
                Loading document from Vercel Blob…
              </div>
            ) : storyData && Array.isArray(storyData.sections) && storyData.sections.length > 0 ? (
              <div>
                <div className="mb-6 p-4 bg-white/5 border-l-4 border-[hsl(var(--wp-accent))] rounded-r">
                  <h2 className="text-[20px] font-semibold text-white">
                    {storyData.title || profile?.name}
                  </h2>
                  {storyData.subtitle && (
                    <p className="text-[13px] text-white/70 mt-1">
                      {storyData.subtitle}
                    </p>
                  )}
                  {storyData.contact && (
                    <p className="text-[11px] text-white/40 font-mono mt-2">
                      {storyData.contact}
                    </p>
                  )}
                </div>

                <div className="space-y-6">
                  {storyData.sections.map((sec: any) => (
                    <section key={sec.id} className="space-y-2">
                      <h3 className="text-[18px] font-medium text-[hsl(var(--wp-accent))] tracking-wide">
                        {sec.heading}
                      </h3>
                      {sec.paragraphs?.map((p: string, idx: number) => (
                        <p
                          key={idx}
                          className="text-[14px] text-white/85 leading-relaxed font-light"
                        >
                          {p}
                        </p>
                      ))}
                    </section>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-20 text-white/50 space-y-2">
                <FileText className="w-12 h-12 mx-auto text-white/20" />
                <p className="text-[15px]">No documents published in Office Hub.</p>
                <p className="text-[12px] text-white/40">
                  You can upload or edit documents in Vercel Blob via /admin.
                </p>
              </div>
            )}
          </div>
        ) : (
          /* Resume Download & Overview */
          <div className="space-y-6 max-w-xl">
            <div className="p-5 bg-white/5 border border-white/10 rounded space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[hsl(var(--wp-accent))] flex items-center justify-center text-white">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-[17px] font-semibold text-white">
                    {profile?.resumeFilename || 'Resume.pdf'}
                  </h3>
                  <span className="text-[12px] text-white/60 font-mono">
                    Official Technical Resume • 2026 Edition
                  </span>
                </div>
              </div>

              <p className="text-[14px] text-white/80 font-light leading-relaxed">
                Contains complete technical history, engineering projects, distributed systems experience, and contact references.
              </p>

              <div className="pt-2 flex flex-col gap-2">
                <a
                  href={profile?.resumeUrl || '/resume.pdf'}
                  download={profile?.resumeFilename || 'Resume.pdf'}
                  className="w-full py-3 bg-[hsl(var(--wp-accent))] text-white font-semibold text-[14px] rounded flex items-center justify-center gap-2 active:scale-95 transition-transform shadow"
                >
                  <Download className="w-4 h-4" /> Download Resume (PDF)
                </a>

                <a
                  href={profile?.resumeUrl || '/resume.pdf'}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 bg-white/10 text-white font-medium text-[14px] rounded flex items-center justify-center gap-2 active:scale-95 transition-transform"
                >
                  <ExternalLink className="w-4 h-4" /> Open in Browser Viewer
                </a>
              </div>
            </div>

            {/* Quick Skills Summary */}
            <div className="space-y-2">
              <h4 className="text-[14px] font-semibold text-white/70 uppercase tracking-wider">
                Core Competencies
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'React',
                  'TypeScript',
                  'Next.js',
                  'Node.js',
                  'Python',
                  'Tailwind CSS',
                  'PostgreSQL',
                  'Vercel',
                  'Docker',
                  'Git',
                  'REST APIs',
                  'Distributed Systems',
                ].map((s) => (
                  <span
                    key={s}
                    className="text-[12px] bg-white/10 text-white/90 px-2.5 py-1 rounded-sm font-medium"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <WPNavBar />
    </div>
  );
};

export default WPOffice;
