interface FolderIconProps {
  className?: string;
}

const FolderIcon = ({ className = '' }: FolderIconProps) => {
  return (
    <svg 
      viewBox="0 0 48 48" 
      className={`w-12 h-12 ${className}`}
      fill="none"
    >
      {/* Folder back */}
      <path 
        d="M4 14V40C4 42 6 44 8 44H40C42 44 44 42 44 40V18C44 16 42 14 40 14H24L20 8H8C6 8 4 10 4 12V14Z" 
        fill="url(#folderGradient)"
        stroke="#C4A000"
        strokeWidth="1"
      />
      {/* Folder front */}
      <path 
        d="M4 18V40C4 42 6 44 8 44H40C42 44 44 42 44 40V22C44 20 42 18 40 18H4Z" 
        fill="url(#folderFrontGradient)"
        stroke="#C4A000"
        strokeWidth="1"
      />
      <defs>
        <linearGradient id="folderGradient" x1="24" y1="8" x2="24" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFE066" />
          <stop offset="1" stopColor="#EAB308" />
        </linearGradient>
        <linearGradient id="folderFrontGradient" x1="24" y1="18" x2="24" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FCD34D" />
          <stop offset="1" stopColor="#D97706" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default FolderIcon;
