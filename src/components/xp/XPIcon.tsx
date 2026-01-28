interface XPIconProps {
  icon: string;
  label: string;
  onClick?: () => void;
  selected?: boolean;
}

const XPIcon = ({ icon, label, onClick, selected = false }: XPIconProps) => {
  return (
    <button
      onClick={onClick}
      onDoubleClick={onClick}
      className={`flex flex-col items-center gap-1 p-2 rounded cursor-pointer transition-colors w-[90px] ${
        selected 
          ? 'bg-[#3366cc]/30 border border-[#3366cc]/50' 
          : 'hover:bg-[#3366cc]/15 border border-transparent'
      }`}
    >
      <div className="w-12 h-12 flex items-center justify-center">
        <img src={icon} alt={label} />
      </div>
      <span className={`text-[11px] text-center leading-tight break-words ${
        selected ? 'bg-[#3366cc] px-1 text-white' : 'text-black dark:text-gray-100'
      }`}>
        {label}
      </span>
    </button>
  );
};

export default XPIcon;
