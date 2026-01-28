import { Signal, Wifi, Battery } from 'lucide-react';

const WPStatusBar = () => {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const formattedTime = `${hours}:${minutes}`;

  return (
    <div className="flex items-center justify-between px-3 py-1 bg-transparent text-wp-text/80">
      <div className="flex items-center gap-1">
        <Signal className="w-3.5 h-3.5" />
        <span className="text-[11px] font-light">Jio</span>
      </div>
      
      <div className="text-[11px] font-light">
        {formattedTime}
      </div>
      
      <div className="flex items-center gap-1">
        <Wifi className="w-3.5 h-3.5" />
        <Battery className="w-4 h-3.5" />
      </div>
    </div>
  );
};

export default WPStatusBar;
