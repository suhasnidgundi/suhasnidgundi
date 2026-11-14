import { useNavigate } from 'react-router-dom';
import { useWPTheme } from '@/contexts/WPThemeContext';
import { WPIcon } from './WPIcons';

interface WPNavBarProps {
  className?: string;
}

const WPNavBar = ({ className = '' }: WPNavBarProps) => {
  const navigate = useNavigate();
  const { setCortanaOpen, setActionCenterOpen, lockScreen } = useWPTheme();

  const handleBack = () => {
    setActionCenterOpen(false);
    navigate(-1);
  };

  const handleHome = () => {
    setActionCenterOpen(false);
    setCortanaOpen(false);
    navigate('/');
  };

  const handleSearch = () => {
    setActionCenterOpen(false);
    setCortanaOpen(true);
  };

  return (
    <nav
      aria-label="Windows Phone Navigation"
      onDoubleClick={(e) => {
        if (e.target === e.currentTarget) lockScreen();
      }}
      title="Double-click empty area to lock screen"
      className={`fixed bottom-0 left-0 right-0 h-12 bg-black border-t border-white/10 flex items-center justify-around px-6 z-40 select-none ${className}`}
    >
      {/* 1. Back Key - Authentic Sharp Chevron Arrow */}
      <button
        onClick={handleBack}
        className="w-12 h-10 flex items-center justify-center text-white/70 hover:text-white active:scale-90 active:text-white transition-all focus:outline-none"
        title="Back"
        aria-label="Back"
      >
        <WPIcon name="back" size={18} />
      </button>

      {/* 2. Windows Start Key - Authentic 4-Pane Angled Windows Flag */}
      <button
        onClick={handleHome}
        className="w-14 h-10 flex items-center justify-center text-white/80 hover:text-white active:scale-90 active:text-white transition-all focus:outline-none"
        title="Start"
        aria-label="Start Screen"
      >
        <WPIcon name="windows" size={20} />
      </button>

      {/* 3. Cortana / Search Key - Authentic Geometric Search */}
      <button
        onClick={handleSearch}
        className="w-12 h-10 flex items-center justify-center text-white/70 hover:text-white active:scale-90 active:text-white transition-all focus:outline-none"
        title="Cortana / Search"
        aria-label="Search"
      >
        <WPIcon name="search" size={18} />
      </button>
    </nav>
  );
};

export default WPNavBar;
