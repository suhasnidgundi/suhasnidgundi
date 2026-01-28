interface BriefcaseIconProps {
  className?: string;
}

const BriefcaseIcon = ({ className = '' }: BriefcaseIconProps) => {
  return (
    <svg 
      viewBox="0 0 48 48" 
      className={`w-12 h-12 ${className}`}
      fill="none"
    >
      {/* Handle */}
      <path 
        d="M18 12V8C18 6 20 4 22 4H26C28 4 30 6 30 8V12" 
        stroke="#78350F"
        strokeWidth="2"
        fill="none"
      />
      {/* Case body */}
      <rect 
        x="4" y="12" width="40" height="28" rx="3" 
        fill="url(#briefcaseGradient)"
        stroke="#78350F"
        strokeWidth="2"
      />
      {/* Center band */}
      <rect 
        x="4" y="22" width="40" height="8" 
        fill="#92400E"
      />
      {/* Buckle */}
      <rect 
        x="20" y="20" width="8" height="12" rx="1" 
        fill="url(#buckleGradient)"
        stroke="#78350F"
        strokeWidth="1"
      />
      <defs>
        <linearGradient id="briefcaseGradient" x1="24" y1="12" x2="24" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#D97706" />
          <stop offset="1" stopColor="#92400E" />
        </linearGradient>
        <linearGradient id="buckleGradient" x1="24" y1="20" x2="24" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FCD34D" />
          <stop offset="1" stopColor="#F59E0B" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default BriefcaseIcon;
