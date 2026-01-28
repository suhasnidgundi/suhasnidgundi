import { ReactNode } from 'react';

interface XPContentSectionProps {
  title: string;
  children: ReactNode;
}

const XPContentSection = ({ title, children }: XPContentSectionProps) => {
  return (
    <div className="mb-6">
      {/* Section Title - Authentic win32.run style */}
      <h2 className="text-[11px] font-bold text-black dark:text-gray-100 mb-1">{title}</h2>
      {/* Blue gradient divider line like win32.run */}
      <div className="xp-content-divider" />
      <div className="flex flex-wrap gap-2">
        {children}
      </div>
    </div>
  );
};

export default XPContentSection;
