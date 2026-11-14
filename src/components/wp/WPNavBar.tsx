import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search } from 'lucide-react';
import { useWPTheme } from '@/contexts/WPThemeContext';

interface WPNavBarProps {
  className?: string;
}

const WPNavBar = ({ className = '' }: WPNavBarProps) => {
  const navigate = useNavigate();
  const { setCortanaOpen, setActionCenterOpen } = useWPTheme();

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
      className={`fixed bottom-0 left-0 right-0 h-12 bg-black border-t border-white/10 flex items-center justify-around px-6 z-40 select-none ${className}`}
    >
      {/* 1. Back Key */}
      <button
        onClick={handleBack}
        className="w-12 h-10 flex items-center justify-center text-white/70 hover:text-white active:scale-90 active:text-white transition-all focus:outline-none"
        title="Back"
        aria-label="Back"
      >
        <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
      </button>

      {/* 2. Windows Start Key */}
      <button
        onClick={handleHome}
        className="w-14 h-10 flex items-center justify-center text-white/80 hover:text-white active:scale-90 active:text-white transition-all focus:outline-none"
        title="Start"
        aria-label="Start Screen"
      >
        {/* Authentic Windows 8 / Phone Flag Icon */}
        <svg
          viewBox="0 0 24 24"
          className="w-5 h-5 fill-current"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.951-1.8" />
        </svg>
      </button>

      {/* 3. Cortana / Search Key */}
      <button
        onClick={handleSearch}
        className="w-12 h-10 flex items-center justify-center text-white/70 hover:text-white active:scale-90 active:text-white transition-all focus:outline-none"
        title="Cortana / Search"
        aria-label="Search"
      >
        <Search className="w-5 h-5 stroke-[2.2]" />
      </button>
    </nav>
  );
};

export default WPNavBar;
