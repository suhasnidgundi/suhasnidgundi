import { ChevronRight } from 'lucide-react';
import MyComputerIcon from '@/assets/xp/icons/my_computer.png';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';

interface XPAddressBarProps {
  currentPath?: string;
  onNavigate?: (path: string) => void;
}

const XPAddressBar = ({ currentPath, onNavigate }: XPAddressBarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const getPath = () => {
    if (currentPath) return currentPath;
    switch (location.pathname) {
      case '/':
        return 'My Portfolio';
      case '/projects':
        return 'My Portfolio > Projects';
      case '/experience':
        return 'My Portfolio > Experience';
      default:
        return 'My Portfolio';
    }
  };

  const handleAddressBarClick = () => {
    setIsEditing(true);
    setInputValue(getPath());
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      setIsEditing(false);
    }, 200);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleGo = () => {
    const target = inputValue.toLowerCase().trim();
    if (onNavigate) {
      if (target.includes('project')) {
        onNavigate('projects');
      } else if (target.includes('exp')) {
        onNavigate('experience');
      } else {
        onNavigate('root');
      }
    } else {
      if (target.includes('project')) {
        navigate('/projects');
      } else if (target.includes('exp')) {
        navigate('/experience');
      } else {
        navigate('/');
      }
    }
    setIsEditing(false);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleGo();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setInputValue(getPath());
    }
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    if (!isEditing) {
      setInputValue(getPath());
    }
  }, [currentPath, location.pathname, isEditing]);

  return (
    <div className="xp-address-bar flex items-center gap-2 px-2 py-1 bg-[hsl(var(--xp-toolbar-bg))] border-b border-border select-none">
      <span className="text-[11px] text-foreground font-['MSSans',Tahoma,sans-serif]">Address</span>
      
      {isEditing ? (
        <div className="flex-1 flex items-center bg-white dark:bg-input border border-primary rounded-sm px-1.5 py-0.5">
          <img src={MyComputerIcon} alt="My Computer" className="w-3.5 h-3.5 text-muted-foreground mr-1 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onKeyDown={handleInputKeyDown}
            className="w-full text-[11px] outline-none bg-transparent"
          />
        </div>
      ) : (
        <div 
          className="flex-1 flex items-center bg-white dark:bg-input border border-[#7f9db9] rounded-sm px-1.5 py-0.5 cursor-text hover:border-primary/50 transition-colors shadow-inner"
          onClick={handleAddressBarClick}
        >
          <img src={MyComputerIcon} alt="My Computer" className="w-3.5 h-3.5 mr-1" />
          <span className="text-[11px] text-foreground flex-1 font-['MSSans',Tahoma,sans-serif]">{getPath()}</span>
        </div>
      )}
      
      <button 
        className="px-2.5 py-0.5 xp-button flex items-center gap-1 cursor-pointer"
        onClick={handleGo}
        onMouseDown={(e) => e.preventDefault()}
      >
        <ChevronRight className="w-3 h-3 text-green-600" />
        <span className="text-[11px]">Go</span>
      </button>
    </div>
  );
};

export default XPAddressBar;
