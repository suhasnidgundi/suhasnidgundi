import { useState } from 'react';
import { HelpModal, ToolsModal, FavoritesModal } from './XPMenuModals';

const XPMenuBar = () => {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);

  const menuItems = ['File', 'Edit', 'View', 'Favorites', 'Tools', 'Help'];

  const handleMenuClick = (item: string) => {
    switch (item) {
      case 'Help':
        setIsHelpOpen(true);
        break;
      case 'Tools':
        setIsToolsOpen(true);
        break;
      case 'Favorites':
        setIsFavoritesOpen(true);
        break;
      default:
        // Other menu items can be handled here
        break;
    }
  };

  return (
    <>
      <div className="xp-menu-bar">
        {menuItems.map((item) => (
          <button
            key={item}
            className="xp-menu-btn"
            onClick={() => handleMenuClick(item)}
          >
            {item}
          </button>
        ))}
      </div>

      {/* XP Menu Modals */}
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      <ToolsModal isOpen={isToolsOpen} onClose={() => setIsToolsOpen(false)} />
      <FavoritesModal isOpen={isFavoritesOpen} onClose={() => setIsFavoritesOpen(false)} />
    </>
  );
};

export default XPMenuBar;
