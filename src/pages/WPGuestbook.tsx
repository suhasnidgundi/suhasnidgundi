import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, RefreshCw, BookMarked, User, Sparkles } from 'lucide-react';
import WPStatusBar from '@/components/wp/WPStatusBar';
import WPNavBar from '@/components/wp/WPNavBar';
import { toast } from 'sonner';

interface GuestbookEntry {
  id: string;
  name: string;
  company?: string;
  message: string;
  createdAt: string;
  badge?: string;
}

const WPGuestbook: React.FC = () => {
  const navigate = useNavigate();
  const [activePivot, setActivePivot] = useState<'entries' | 'sign'>('entries');
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Sign Form State
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/guestbook');
      if (res.ok) {
        const data = await res.json();
        setEntries(data.entries || []);
      }
    } catch {
      toast.error('Failed to load guestbook entries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleSign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      toast.error('Please provide your name and a message');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/guestbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, company, message }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success('Signed successfully in Vercel Blob!');
        setName('');
        setCompany('');
        setMessage('');
        setActivePivot('entries');
        fetchEntries();
      } else {
        toast.error(data.error || 'Failed to sign guestbook');
      }
    } catch {
      toast.error('Network error. Failed to save signature.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-['Segoe_UI',sans-serif] flex flex-col select-none">
      <WPStatusBar />

      {/* Main Title & Pivot Bar */}
      <div className="px-5 pt-4 pb-2">
        <h1 className="text-[44px] font-extralight tracking-tight text-white lowercase leading-none">
          guestbook
        </h1>

        {/* Pivot Navigation */}
        <div className="flex items-center gap-6 mt-4 border-b border-white/10 pb-2">
          <button
            onClick={() => setActivePivot('entries')}
            className={`text-[20px] font-light lowercase transition-colors ${
              activePivot === 'entries'
                ? 'text-[hsl(var(--wp-accent))] font-medium'
                : 'text-white/40 hover:text-white/70'
            }`}
          >
            entries ({entries.length})
          </button>
          <button
            onClick={() => setActivePivot('sign')}
            className={`text-[20px] font-light lowercase transition-colors ${
              activePivot === 'sign'
                ? 'text-[hsl(var(--wp-accent))] font-medium'
                : 'text-white/40 hover:text-white/70'
            }`}
          >
            sign the wall
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto px-5 pt-4 pb-24">
        {activePivot === 'entries' ? (
          <div>
            {loading ? (
              <div className="flex items-center justify-center py-20 text-white/50 text-[14px]">
                Loading signatures from Vercel Blob…
              </div>
            ) : entries.length > 0 ? (
              <div className="space-y-4">
                {entries.map((entry) => (
                  <div
                    key={entry.id}
                    className="p-4 bg-white/5 border-l-4 border-[hsl(var(--wp-accent))] rounded-r shadow-sm active:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[16px] font-semibold text-white">
                          {entry.name}
                        </span>
                        {entry.badge && (
                          <span className="text-[10px] bg-[hsl(var(--wp-accent))] text-white px-1.5 py-0.2 rounded uppercase font-bold">
                            {entry.badge}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-white/40 font-mono">
                        {new Date(entry.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {entry.company && (
                      <p className="text-[13px] text-white/60 mb-2">
                        {entry.company}
                      </p>
                    )}

                    <p className="text-[14px] text-white/90 leading-relaxed font-light">
                      "{entry.message}"
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-white/50 space-y-3">
                <BookMarked className="w-12 h-12 mx-auto text-white/20" />
                <p className="text-[16px]">No signatures yet.</p>
                <button
                  onClick={() => setActivePivot('sign')}
                  className="px-4 py-2 bg-[hsl(var(--wp-accent))] text-white rounded text-[13px] font-medium"
                >
                  Be the first to sign!
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Sign Form */
          <form onSubmit={handleSign} className="space-y-4 max-w-lg">
            <p className="text-[14px] text-white/70 font-light leading-relaxed">
              Leave a note, feedback, or a quick hello! Your signature is saved dynamically to Vercel Blob storage.
            </p>

            <div>
              <label className="text-[12px] uppercase tracking-wider text-white/60 block mb-1">
                Your Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Satya Nadella"
                required
                className="w-full bg-white/10 text-white text-[15px] px-3.5 py-2.5 rounded border border-white/20 focus:outline-none focus:border-[hsl(var(--wp-accent))]"
              />
            </div>

            <div>
              <label className="text-[12px] uppercase tracking-wider text-white/60 block mb-1">
                Company / Role (Optional)
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Microsoft / Engineering"
                className="w-full bg-white/10 text-white text-[15px] px-3.5 py-2.5 rounded border border-white/20 focus:outline-none focus:border-[hsl(var(--wp-accent))]"
              />
            </div>

            <div>
              <label className="text-[12px] uppercase tracking-wider text-white/60 block mb-1">
                Message *
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                placeholder="Write your note here..."
                required
                className="w-full bg-white/10 text-white text-[15px] px-3.5 py-2.5 rounded border border-white/20 focus:outline-none focus:border-[hsl(var(--wp-accent))]"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-[hsl(var(--wp-accent))] text-white font-semibold text-[15px] rounded active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow"
            >
              {submitting ? (
                <>Saving to Vercel Blob…</>
              ) : (
                <>
                  <Send className="w-4 h-4" /> Sign Guestbook
                </>
              )}
            </button>
          </form>
        )}
      </div>

      <WPNavBar />
    </div>
  );
};

export default WPGuestbook;
