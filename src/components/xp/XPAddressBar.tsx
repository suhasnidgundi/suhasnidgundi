import { ChevronRight } from 'lucide-react';
import MyComputerIcon from '@/assets/xp/icons/my_computer.png';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';

const XPAddressBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const getPath = () => {
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

  const getRouteFromPath = (path: string): string => {
    const normalizedPath = path.toLowerCase().trim();
    
    // Direct route matches
    if (normalizedPath === 'my portfolio' || normalizedPath === '' || normalizedPath === '/') {
      return '/';
    }
    if (normalizedPath === 'my portfolio > projects' || normalizedPath === 'projects') {
      return '/projects';
    }
    if (normalizedPath === 'my portfolio > experience' || normalizedPath === 'experience') {
      return '/experience';
    }
    
    // Try to extract route from path
    if (normalizedPath.includes('projects')) {
      return '/projects';
    }
    if (normalizedPath.includes('experience')) {
      return '/experience';
    }
    
    // If path starts with /, use it directly
    if (path.startsWith('/')) {
      return path;
    }
    
    // Default to home
    return '/';
  };

  const handleAddressBarClick = () => {
    setIsEditing(true);
    setInputValue(getPath());
  };

  const handleInputBlur = () => {
    // Delay to allow Go button click to register
    setTimeout(() => {
      setIsEditing(false);
    }, 200);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleGo();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setInputValue(getPath());
    }
  };

  const handleGo = () => {
    const route = getRouteFromPath(inputValue);
    navigate(route);
    setIsEditing(false);
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
  }, [location.pathname, isEditing]);

  return (
    <div className="xp-address-bar">
      <span className="text-[11px] text-foreground">Address</span>
      
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
            className="xp-address-input"
          />
        </div>
      ) : (
        <div 
          className="flex-1 flex items-center bg-input border border-border rounded-sm px-1.5 py-0.5 cursor-text hover:border-primary/50 transition-colors"
          onClick={handleAddressBarClick}
        >
          <img src={MyComputerIcon} alt="My Computer" className="w-3.5 h-3.5 text-muted-foreground mr-1" />
          <span className="text-[11px] text-foreground flex-1">{getPath()}</span>
        </div>
      )}
      
      <button 
        className="px-3 py-0.5 xp-button flex items-center gap-1"
        onClick={handleGo}
        onMouseDown={(e) => e.preventDefault()} // Prevent blur before click
      >
        <ChevronRight className="w-3 h-3 text-green-600" />
        <span className="text-[11px]">Go</span>
      </button>
    </div>
  );
};

export default XPAddressBar;