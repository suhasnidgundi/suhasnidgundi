interface UserIconProps {
  className?: string;
}

const UserIcon = ({ className = '' }: UserIconProps) => {
  return (
    <svg 
      viewBox="0 0 48 48" 
      className={`w-12 h-12 ${className}`}
      fill="none"
    >
      {/* Background circle */}
      <circle cx="24" cy="24" r="20" fill="url(#userBgGradient)" stroke="#3B82F6" strokeWidth="2" />
      {/* Head */}
      <circle cx="24" cy="18" r="8" fill="url(#skinGradient)" stroke="#D97706" strokeWidth="1" />
      {/* Body */}
      <path 
        d="M12 40C12 32 17 28 24 28C31 28 36 32 36 40" 
        fill="url(#shirtGradient)"
        stroke="#1E40AF"
        strokeWidth="1"
      />
      <defs>
        <linearGradient id="userBgGradient" x1="24" y1="4" x2="24" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#BFDBFE" />
          <stop offset="1" stopColor="#93C5FD" />
        </linearGradient>
        <linearGradient id="skinGradient" x1="24" y1="10" x2="24" y2="26" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FED7AA" />
          <stop offset="1" stopColor="#FDBA74" />
        </linearGradient>
        <linearGradient id="shirtGradient" x1="24" y1="28" x2="24" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3B82F6" />
          <stop offset="1" stopColor="#1E40AF" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default UserIcon;
