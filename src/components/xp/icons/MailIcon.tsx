interface MailIconProps {
  className?: string;
}

const MailIcon = ({ className = '' }: MailIconProps) => {
  return (
    <svg 
      viewBox="0 0 48 48" 
      className={`w-12 h-12 ${className}`}
      fill="none"
    >
      {/* Envelope body */}
      <rect 
        x="4" y="10" width="40" height="28" rx="2" 
        fill="url(#envelopeGradient)"
        stroke="#B45309"
        strokeWidth="2"
      />
      {/* Envelope flap */}
      <path 
        d="M4 12L24 26L44 12" 
        stroke="#B45309"
        strokeWidth="2"
        fill="none"
      />
      {/* Inner fold */}
      <path 
        d="M4 38L18 26M44 38L30 26" 
        stroke="#B45309"
        strokeWidth="1"
        opacity="0.5"
      />
      <defs>
        <linearGradient id="envelopeGradient" x1="24" y1="10" x2="24" y2="38" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FEF3C7" />
          <stop offset="1" stopColor="#FDE68A" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default MailIcon;
