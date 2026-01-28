interface BlogIconProps {
  className?: string;
}

const BlogIcon = ({ className = '' }: BlogIconProps) => {
  return (
    <svg 
      viewBox="0 0 48 48" 
      className={`w-12 h-12 ${className}`}
      fill="none"
    >
      {/* Book back */}
      <path 
        d="M8 8C8 6 10 4 12 4H36C38 4 40 6 40 8V40C40 42 38 44 36 44H12C10 44 8 42 8 40V8Z" 
        fill="url(#bookGradient)"
        stroke="#065F46"
        strokeWidth="2"
      />
      {/* Book pages */}
      <rect 
        x="12" y="8" width="24" height="32" 
        fill="#FFFBEB"
        stroke="#D1D5DB"
        strokeWidth="1"
      />
      {/* Spine */}
      <rect 
        x="8" y="4" width="6" height="40" 
        fill="url(#spineGradient)"
      />
      {/* Text lines */}
      <line x1="16" y1="14" x2="32" y2="14" stroke="#9CA3AF" strokeWidth="1" />
      <line x1="16" y1="20" x2="32" y2="20" stroke="#9CA3AF" strokeWidth="1" />
      <line x1="16" y1="26" x2="28" y2="26" stroke="#9CA3AF" strokeWidth="1" />
      <line x1="16" y1="32" x2="30" y2="32" stroke="#9CA3AF" strokeWidth="1" />
      <defs>
        <linearGradient id="bookGradient" x1="24" y1="4" x2="24" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#10B981" />
          <stop offset="1" stopColor="#047857" />
        </linearGradient>
        <linearGradient id="spineGradient" x1="11" y1="4" x2="11" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#059669" />
          <stop offset="1" stopColor="#065F46" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default BlogIcon;
