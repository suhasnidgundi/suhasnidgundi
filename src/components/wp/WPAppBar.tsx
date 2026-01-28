import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface WPAppBarButton {
  icon: ReactNode;
  label: string;
  onClick?: () => void;
}

interface WPAppBarProps {
  buttons: WPAppBarButton[];
}

const WPAppBar = ({ buttons }: WPAppBarProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-wp-chrome z-50 border-t border-wp-border">
      {/* Icon Bar */}
      <div className="flex items-center justify-around py-2 px-4">
        {buttons.map((button, index) => (
          <button
            key={index}
            onClick={button.onClick}
            className="flex flex-col items-center gap-1 p-2 rounded-full active:bg-wp-text/10"
          >
            <div className="w-12 h-12 rounded-full border-2 border-wp-text/50 flex items-center justify-center">
              <span className="w-6 h-6 flex items-center justify-center text-wp-text">
                {button.icon}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default WPAppBar;
