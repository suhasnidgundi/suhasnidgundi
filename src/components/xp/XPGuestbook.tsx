import React, { useState, useEffect } from 'react';
import XPWindow from './XPWindow';
import { GuestbookEntry } from '../../../api/guestbook';
import UserIcon from '@/assets/xp/icons/user_icon.png';
import { Send, RefreshCw, CheckCircle2 } from 'lucide-react';

interface XPGuestbookProps {
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
  onFocus?: () => void;
  zIndex?: number;
  isMaximized?: boolean;
  isActive?: boolean;
  onPositionChange?: (pos: { x: number; y: number }) => void;
  onSizeChange?: (size: { width: number; height: number }) => void;
}

export const XPGuestbook: React.FC<XPGuestbookProps> = ({
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  zIndex = 1,
  isMaximized,
  isActive,
  onPositionChange,
  onSizeChange,
}) => {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successNotice, setSuccessNotice] = useState(false);

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/guestbook');
      if (res.ok) {
        const data = await res.json();
        setEntries(data);
      }
    } catch (err) {
      console.warn('Failed to load guestbook:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim() || submitting) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/guestbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, company, message }),
      });

      if (res.ok) {
        const data = await res.json();
        setEntries((prev) => [data.entry, ...prev]);
        setName('');
        setCompany('');
        setMessage('');
        setSuccessNotice(true);
        setTimeout(() => setSuccessNotice(false), 4000);
      }
    } catch (err) {
      console.error('Failed to sign guestbook:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <XPWindow
      title="Guestbook — Suhas Nidgundi Portfolio"
      icon={<img src="/icons/display_properties_32.png" alt="Guestbook" className="w-4 h-4" />}
      onClose={onClose}
      onMinimize={onMinimize}
      onMaximize={onMaximize}
      onFocus={onFocus}
      zIndex={zIndex}
      isMaximized={isMaximized}
      isActive={isActive}
      onPositionChange={onPositionChange}
      onSizeChange={onSizeChange}
    >
      {/* Menu Bar */}
      <div className="flex items-center justify-between px-2 py-0.5 bg-[#ece9d8] border-b border-[#aca899] text-[11px] font-['MSSans',Tahoma,sans-serif] select-none text-black">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 hover:bg-[#316ac5] hover:text-white cursor-pointer rounded-sm">File</span>
          <span className="px-2 py-0.5 hover:bg-[#316ac5] hover:text-white cursor-pointer rounded-sm">Edit</span>
          <span className="px-2 py-0.5 hover:bg-[#316ac5] hover:text-white cursor-pointer rounded-sm">View</span>
        </div>
        <button
          onClick={fetchEntries}
          className="flex items-center gap-1 hover:underline text-[11px] text-[#0055ea] cursor-pointer"
          title="Refresh Signatures"
        >
          <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Main Layout: Left Form + Right Signatures */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-[#ece9d8]">
        {/* Left Pane: Sign Form */}
        <div className="w-full md:w-[280px] p-3 border-r border-[#aca899] bg-[#f5f4ed] overflow-y-auto shrink-0 select-none">
          <h3 className="text-[12px] font-bold text-black font-['MSSans',Tahoma,sans-serif] mb-1 flex items-center gap-1.5">
            <span>✍️ Sign My Guestbook</span>
          </h3>
          <p className="text-[10px] text-gray-600 font-['MSSans',Tahoma,sans-serif] mb-3 leading-relaxed">
            Leave a note, recruiter message, or say hi! Stored on Vercel Edge.
          </p>

          {successNotice && (
            <div className="mb-3 p-2 bg-green-50 border border-green-500 rounded text-[11px] text-green-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
              <span>Thank you! Your entry is published live.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-2.5">
            <div>
              <label className="block text-[10px] font-bold text-gray-700 font-['MSSans',Tahoma,sans-serif] mb-0.5">
                Your Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sarah Connor"
                className="w-full px-2 py-1 bg-white border border-[#7f9db9] text-[11px] outline-none text-black rounded-sm shadow-inner"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-700 font-['MSSans',Tahoma,sans-serif] mb-0.5">
                Role / Company / City
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Recruiter @ Tech Corp"
                className="w-full px-2 py-1 bg-white border border-[#7f9db9] text-[11px] outline-none text-black rounded-sm shadow-inner"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-700 font-['MSSans',Tahoma,sans-serif] mb-0.5">
                Message *
              </label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Say hello, share feedback on the XP portfolio, or send job opportunities!"
                className="w-full p-2 bg-white border border-[#7f9db9] text-[11px] outline-none text-black rounded-sm resize-none shadow-inner"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full xp-button py-1.5 flex items-center justify-center gap-1.5 font-['MSSans',Tahoma,sans-serif] text-[11px] font-bold cursor-pointer"
            >
              <Send className="w-3.5 h-3.5 text-blue-700" />
              <span>{submitting ? 'Publishing...' : 'Sign Guestbook!'}</span>
            </button>
          </form>

          {/* Vercel Badge */}
          <div className="mt-4 pt-3 border-t border-[#aca899] text-center">
            <span className="inline-block px-2 py-0.5 bg-black text-white text-[9px] font-mono rounded">
              ▲ Powered by Vercel Serverless
            </span>
          </div>
        </div>

        {/* Right Pane: Signatures Feed */}
        <div className="flex-1 p-3 overflow-y-auto bg-white flex flex-col">
          <div className="flex items-center justify-between pb-2 border-b border-[#7f9db9] mb-3">
            <h4 className="text-[12px] font-bold text-black font-['MSSans',Tahoma,sans-serif]">
              Recent Signatures ({entries.length})
            </h4>
            <span className="text-[10px] text-gray-500 font-['MSSans',Tahoma,sans-serif]">
              Live updates
            </span>
          </div>

          {loading ? (
            <div className="flex-1 flex items-center justify-center text-[12px] text-gray-500 font-['MSSans',Tahoma,sans-serif]">
              Loading guestbook entries...
            </div>
          ) : entries.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-[12px] text-gray-500 font-['MSSans',Tahoma,sans-serif]">
              No entries yet. Be the first to sign!
            </div>
          ) : (
            <div className="space-y-2.5">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="p-2.5 bg-[#f9f9f6] border border-[#d3d3d3] rounded shadow-sm hover:border-[#316ac5] transition-colors"
                >
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <img src={UserIcon} alt="Avatar" className="w-5 h-5 rounded-full" />
                      <div>
                        <span className="text-[12px] font-bold text-black font-['MSSans',Tahoma,sans-serif]">
                          {entry.name}
                        </span>
                        {entry.company && (
                          <span className="text-[10px] text-gray-500 ml-1.5">
                            • {entry.company}
                          </span>
                        )}
                      </div>
                    </div>
                    {entry.badge && (
                      <span className="px-1.5 py-0.2 bg-[#0055ea]/10 text-[#0055ea] text-[9px] font-bold rounded font-['MSSans',Tahoma,sans-serif]">
                        {entry.badge}
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-gray-800 font-['MSSans',Tahoma,sans-serif] leading-relaxed mt-1 whitespace-pre-wrap">
                    {entry.message}
                  </p>

                  <div className="text-[9px] text-gray-400 mt-2 text-right">
                    {new Date(entry.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </XPWindow>
  );
};

export default XPGuestbook;
