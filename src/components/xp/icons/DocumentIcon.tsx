interface DocumentIconProps {
  className?: string;
}

const DocumentIcon = ({ className = '' }: DocumentIconProps) => {
  return (
    <svg 
      viewBox="0 0 48 48" 
      className={`w-12 h-12 ${className}`}
      fill="none"
    >
      {/* Document shadow */}
      <path 
        d="M14 6L14 42C14 44 16 46 18 46H38C40 46 42 44 42 42V14L34 6H14Z" 
        fill="#E5E7EB"
        transform="translate(2, 2)"
        opacity="0.3"
      />
      {/* Document body */}
      <path 
        d="M12 4L12 40C12 42 14 44 16 44H36C38 44 40 42 40 40V12L32 4H12Z" 
        fill="url(#docGradient)"
        stroke="#9CA3AF"
        strokeWidth="1"
      />
      {/* Fold corner */}
      <path 
        d="M32 4V12H40L32 4Z" 
        fill="#D1D5DB"
        stroke="#9CA3AF"
        strokeWidth="1"
      />
      {/* Lines */}
      <line x1="18" y1="18" x2="34" y2="18" stroke="#9CA3AF" strokeWidth="1" />
      <line x1="18" y1="24" x2="34" y2="24" stroke="#9CA3AF" strokeWidth="1" />
      <line x1="18" y1="30" x2="28" y2="30" stroke="#9CA3AF" strokeWidth="1" />
      <defs>
        <linearGradient id="docGradient" x1="26" y1="4" x2="26" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#F3F4F6" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default DocumentIcon;
