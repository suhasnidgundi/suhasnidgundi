import React, { useEffect, useState } from 'react';

export const XPVisitorCounter: React.FC = () => {
  const [total, setTotal] = useState<number>(4281);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const recordVisit = async () => {
      const hasCounted = sessionStorage.getItem('xp-visitor-counted');
      const method = hasCounted ? 'GET' : 'POST';

      try {
        const res = await fetch('/api/visitor-counter', { method });
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.total) {
            setTotal(data.total);
            sessionStorage.setItem('xp-visitor-counted', 'true');
          }
        }
      } catch (err) {
        console.warn('Visitor counter fetch failed:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    recordVisit();

    return () => {
      isMounted = false;
    };
  }, []);

  // Format as 6 digits with leading zeros
  const digits = String(total).padStart(6, '0').split('');

  return (
    <div
      className="flex items-center gap-1 px-1.5 py-0.5 bg-[#000000] border border-[#092e51] rounded-[2px] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.8)] select-none cursor-help"
      title={`Vercel Edge + Upstash Redis Live Visitor Counter: ${total.toLocaleString()} unique visits`}
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
