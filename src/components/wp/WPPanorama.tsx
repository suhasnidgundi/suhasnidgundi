import { ReactNode, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface WPPanoramaSection {
  title: string;
  content: ReactNode;
}

interface WPPanoramaProps {
  title: string;
  sections: WPPanoramaSection[];
  backgroundImage?: string;
}

const WPPanorama = ({ title, sections, backgroundImage }: WPPanoramaProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const scrollLeft = scrollRef.current.scrollLeft;
    const sectionWidth = window.innerWidth * 0.85;
    const newIndex = Math.round(scrollLeft / sectionWidth);
    setActiveIndex(Math.min(newIndex, sections.length - 1));
  };

  return (
    <div className="h-full bg-wp-bg overflow-hidden relative">
      {/* Background Image with Parallax */}
      {backgroundImage && (
        <div 
          className="absolute inset-0 opacity-20 bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      )}
      
      {/* Panorama Title */}
      <div className="pt-8 px-4 relative z-10">
        <h1 className="text-wp-text text-[46px] font-light tracking-tight leading-none">
          {title}
        </h1>
      </div>

      {/* Scrollable Sections */}
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide h-[calc(100%-100px)] relative z-10"
        style={{ scrollBehavior: 'smooth' }}
      >
        {sections.map((section, index) => (
          <div
            key={index}
            className={cn(
              'flex-shrink-0 w-[85vw] snap-start px-4 pt-4',
              index === sections.length - 1 && 'pr-8'
            )}
          >
            {/* Section Title */}
            <h2 className="text-wp-text text-[22px] font-light mb-4 opacity-80">
              {section.title}
            </h2>
            
            {/* Section Content */}
            <div className="overflow-y-auto h-[calc(100%-40px)] pb-20">
              {section.content}
            </div>
          </div>
        ))}
      </div>

      {/* Section Indicators */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
        {sections.map((_, index) => (
          <div
            key={index}
            className={cn(
              'w-2 h-2 rounded-full transition-all',
              index === activeIndex 
                ? 'bg-wp-accent w-4' 
                : 'bg-wp-text/30'
            )}
          />
        ))}
      </div>
    </div>
  );
};

export default WPPanorama;
