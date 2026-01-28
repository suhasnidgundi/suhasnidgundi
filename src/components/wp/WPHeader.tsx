import { ArrowLeft, Search, MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface WPHeaderProps {
  title: string;
  showBack?: boolean;
  showSearch?: boolean;
  showMore?: boolean;
  onSearch?: () => void;
  onMore?: () => void;
}

const WPHeader = ({ 
  title, 
  showBack = false, 
  showSearch = false,
  showMore = false,
  onSearch,
  onMore
}: WPHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-wp-bg">
      <div className="flex items-center gap-3">
        {showBack && (
          <button 
            onClick={() => navigate(-1)}
            className="p-1 active:opacity-60"
          >
            <ArrowLeft className="w-6 h-6 text-wp-text" />
          </button>
        )}
        <h1 className="text-wp-text text-[20px] font-semibold uppercase tracking-wide">
          {title}
        </h1>
      </div>
      
      <div className="flex items-center gap-2">
        {showSearch && (
          <button onClick={onSearch} className="p-2 active:opacity-60">
            <Search className="w-5 h-5 text-wp-text" />
          </button>
        )}
        {showMore && (
          <button onClick={onMore} className="p-2 active:opacity-60">
            <MoreVertical className="w-5 h-5 text-wp-text" />
          </button>
        )}
      </div>
    </div>
  );
};

export default WPHeader;
