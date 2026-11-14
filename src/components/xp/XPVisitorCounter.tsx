import React, { useEffect, useState } from 'react';

export const XPVisitorCounter: React.FC = () => {
  const [total, setTotal] = useState<number | null>(null);
  const [source, setSource] = useState<string>('connecting');

  useEffect(() => {
    let isMounted = true;

    const recordVisit = async () => {
      const hasCounted = sessionStorage.getItem('xp-visitor-counted');
      const method = hasCounted ? 'GET' : 'POST';

      try {
        const res = await fetch('/api/visitor-counter', { method });
        if (res.ok) {
          const data = await res.json();
          if (isMounted && typeof data.total === 'number') {
            setTotal(data.total);
            setSource(data.source || 'live');
            sessionStorage.setItem('xp-visitor-counted', 'true');
          }
        }
      } catch (err) {
        console.warn('Visitor counter fetch failed:', err);
      }
    };

    recordVisit();

    return () => {
      isMounted = false;
    };
  }, []);

  // Format as 6 digits with leading zeros or dashes while connecting
  const digits = total !== null
    ? String(total).padStart(6, '0').split('')
    : ['-', '-', '-', '-', '-', '-'];

  return (
    <div
      className="flex items-center gap-1 px-1.5 py-0.5 bg-[#000000] border border-[#092e51] rounded-[2px] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.8)] select-none cursor-help"
      title={
        total !== null
          ? `Live Visitor Counter (${source === 'upstash' ? 'Upstash Redis' : source === 'blob' ? 'Vercel Blob Persistent' : 'Live Cloud'}): ${total} visits`
          : 'Connecting to visitor counter...'
      }
    >
      <span className="text-[9px] text-gray-400 font-['MSSans',Tahoma,sans-serif] mr-0.5">VISITORS</span>
      <div className="flex items-center gap-[1px]">
        {digits.map((digit, idx) => (
          <span
            key={idx}
            className="w-[11px] h-[15px] bg-[#1a1a1a] text-[#00ff66] border border-[#333333] text-[10px] font-mono font-bold flex items-center justify-center leading-none rounded-[1px] shadow-inner"
            style={{
              textShadow: '0 0 3px #00ff66',
            }}
          >
            {digit}
          </span>
        ))}
      </div>
    </div>
  );
};

export default XPVisitorCounter;
