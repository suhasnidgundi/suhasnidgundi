interface ComputerIconProps {
  className?: string;
}

const ComputerIcon = ({ className = '' }: ComputerIconProps) => {
  return (
    <svg 
      viewBox="0 0 48 48" 
      className={`w-12 h-12 ${className}`}
      fill="none"
    >
      {/* Monitor body */}
      <rect 
        x="4" y="4" width="40" height="30" rx="2" 
        fill="url(#monitorGradient)"
        stroke="#4B5563"
        strokeWidth="2"
      />
      {/* Screen */}
      <rect 
        x="8" y="8" width="32" height="22" rx="1" 
        fill="url(#screenGradient)"
      />
      {/* Stand */}
      <path 
        d="M18 34H30V38H18V34Z" 
        fill="#6B7280"
      />
      <path 
        d="M14 38H34V42C34 43 33 44 32 44H16C15 44 14 43 14 42V38Z" 
        fill="url(#standGradient)"
        stroke="#4B5563"
        strokeWidth="1"
      />
      {/* Screen shine */}
      <path 
        d="M10 10H16V14H10V10Z" 
        fill="white"
        opacity="0.3"
      />
      <defs>
        <linearGradient id="monitorGradient" x1="24" y1="4" x2="24" y2="34" gradientUnits="userSpaceOnUse">
          <stop stopColor="#E5E7EB" />
          <stop offset="1" stopColor="#9CA3AF" />
        </linearGradient>
        <linearGradient id="screenGradient" x1="24" y1="8" x2="24" y2="30" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1E40AF" />
          <stop offset="1" stopColor="#3B82F6" />
        </linearGradient>
        <linearGradient id="standGradient" x1="24" y1="38" x2="24" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#9CA3AF" />
          <stop offset="1" stopColor="#6B7280" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default ComputerIcon;
