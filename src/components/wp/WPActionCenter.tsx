import React, { useEffect, useState, useRef } from 'react';
import { useWPTheme } from '@/contexts/WPThemeContext';
import { useEdgeConfig } from '@/hooks/useEdgeConfig';
import { WPIcon } from './WPIcons';

interface WPActionCenterProps {
  isDark: boolean;
  toggleTheme: () => void;
  notifications?: NotificationGroup[];
  onOpenVercelHub?: () => void;
}

interface NotificationItem {
  id: string;
  sender: string;
  text: string;
  time: string;
}

interface NotificationGroup {
  id: string;
  appName: string;
  icon: React.ReactNode;
  items: NotificationItem[];
}

/**
 * Authentic Windows Phone 8.1 Swipeable Notification Row
 * Supports 1:1 horizontal drag-to-dismiss with velocity flick detection
 */
const SwipeableNotificationItem: React.FC<{
  item: NotificationItem;
  onDismiss: (id: string) => void;
  onClick?: () => void;
}> = ({ item, onDismiss, onClick }) => {
  const [translateX, setTranslateX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const startX = useRef(0);
  const startTime = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    startTime.current = e.timeStamp;
    setIsSwiping(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSwiping) return;
    const diff = e.touches[0].clientX - startX.current;
    setTranslateX(diff);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isSwiping) return;
    setIsSwiping(false);
    const duration = e.timeStamp - startTime.current;
    const velocity = Math.abs(translateX) / (duration || 1);

    // If dragged > 80px or fast flick > 0.35 px/ms
    if (Math.abs(translateX) > 80 || (velocity > 0.35 && Math.abs(translateX) > 25)) {
      const exitDir = translateX > 0 ? 350 : -350;
      setTranslateX(exitDir);
      setTimeout(() => onDismiss(item.id), 180);
    } else {
      setTranslateX(0);
    }
  };

  return (
    <div
      className="relative overflow-hidden transition-all duration-200"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background dismiss indicator */}
      {Math.abs(translateX) > 12 && (
        <div
          className={`absolute inset-0 flex items-center px-4 transition-colors ${
            translateX > 0 ? 'justify-start bg-red-600/30' : 'justify-end bg-red-600/30'
          }`}
        >
          <WPIcon name="close" size={16} className="text-white/90" />
        </div>
      )}

      {/* Foreground notification item */}
      <div
        onClick={() => {
          if (Math.abs(translateX) < 6) {
            onClick?.();
          }
        }}
        className={`flex items-start justify-between gap-3 pb-2.5 border-b border-white/[0.07] bg-black transition-transform cursor-pointer active:bg-white/[0.03] ${
          isSwiping ? '!transition-none' : 'duration-200 ease-out'
        }`}
        style={{
          transform: `translateX(${translateX}px)`,
          opacity: 1 - Math.min(0.85, Math.abs(translateX) / 160),
        }}
      >
        <div className="flex-1 min-w-0 pr-2">
          <div className="text-[14px] font-[600] text-white leading-tight">
            {item.sender}
          </div>
          <div className="text-[13px] font-[300] text-white/85 leading-snug mt-0.5">
            {item.text}
          </div>
        </div>
        <span className="flex items-center gap-1 text-[11px] font-[400] text-emerald-400 whitespace-nowrap pt-0.5">
          {item.time === 'live' && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          )}
          {item.time}
        </span>
      </div>
    </div>
  );
};

export const WPActionCenter: React.FC<WPActionCenterProps> = ({
  isDark,
  toggleTheme,
  notifications = [],
  onOpenVercelHub,
}) => {
  const {
    actionCenterOpen,
    setActionCenterOpen,
    accent,
    cycleNextAccent,
    setForceView,
    lockScreen,
  } = useWPTheme();
  const { data: edgeConfig } = useEdgeConfig();
  const [isExpanded, setIsExpanded] = useState(false);
  const [dismissedItemIds, setDismissedItemIds] = useState<string[]>([]);
  const [isClosing, setIsClosing] = useState(false);

  // Vertical shade drag-to-dismiss gesture state
  const shadeStartY = useRef(0);
  const shadeStartTime = useRef(0);
  const [shadeDragY, setShadeDragY] = useState(0);
  const [isShadeDragging, setIsShadeDragging] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setActionCenterOpen(false);
      setIsClosing(false);
      setShadeDragY(0);
    }, 240);
  };

  const handleLock = () => {
    handleClose();
    setTimeout(() => {
      lockScreen();
    }, 150);
  };

  // Live Edge Broadcast notification group directly from Vercel Edge Config
  const edgeAnnouncement = edgeConfig?.announcement?.trim();
  const edgeNotificationId = edgeAnnouncement
    ? `edge-broadcast-${edgeAnnouncement.length}-${edgeConfig?.region || 'edge'}`
    : 'edge-broadcast-none';

  const liveEdgeGroup: NotificationGroup | null = edgeAnnouncement
    ? {
        id: 'edge-broadcast-group',
        appName: 'edge broadcast',
        icon: <WPIcon name="vercel" size={16} className="fill-white" />,
        items: [
          {
            id: edgeNotificationId,
            sender: `Vercel Edge Config • ${edgeConfig?.region?.toUpperCase() || 'BOM1'}`,
            text: edgeAnnouncement,
            time: 'live',
          },
        ],
      }
    : null;

  const allGroups: NotificationGroup[] = [
    ...(liveEdgeGroup ? [liveEdgeGroup] : []),
    ...notifications,
  ];

  const clearAllNotifications = () => {
    setDismissedItemIds(allGroups.flatMap((g) => g.items.map((i) => i.id)));
  };

  const dismissItem = (itemId: string) => {
    setDismissedItemIds((prev) => [...prev, itemId]);
  };

  // Drag-up gesture handlers on the shade & bottom handle
  const handleShadeTouchStart = (e: React.TouchEvent) => {
    shadeStartY.current = e.touches[0].clientY;
    shadeStartTime.current = e.timeStamp;
    setIsShadeDragging(true);
  };

  const handleShadeTouchMove = (e: React.TouchEvent) => {
    if (!isShadeDragging) return;
    const diff = shadeStartY.current - e.touches[0].clientY;
    if (diff > 0) {
      setShadeDragY(diff);
    }
  };

  const handleShadeTouchEnd = (e: React.TouchEvent) => {
    if (!isShadeDragging) return;
    setIsShadeDragging(false);
    const duration = e.timeStamp - shadeStartTime.current;
    const velocity = shadeDragY / (duration || 1);

    if (shadeDragY > 65 || (velocity > 0.35 && shadeDragY > 20)) {
      handleClose();
    } else {
      setShadeDragY(0);
    }
  };

  if (!actionCenterOpen) return null;

  // Filter out individual dismissed items
  const activeGroups = allGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => !dismissedItemIds.includes(item.id)),
    }))
    .filter((group) => group.items.length > 0);

  const translateYStyle = isClosing
    ? '-translate-y-full'
    : isShadeDragging
    ? `translateY(-${shadeDragY}px)`
    : 'translate-y-0';

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-start select-none font-['Segoe_WP','Segoe_UI',sans-serif]"
      onClick={handleClose}
    >
      {/* Dimmed backdrop */}
      <div
        className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${
          isClosing ? 'opacity-0' : 'opacity-100'
        }`}
      />

      {/* Action Center Pull-Down Shade (Authentic Windows Phone 8.1 Solid Black Metro Sheet) */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative z-10 w-full max-h-[88vh] bg-[#000000] text-white flex flex-col shadow-[0_12px_36px_rgba(0,0,0,0.8)] border-b border-white/10 ${
          isShadeDragging ? '!transition-none' : 'transition-transform duration-300 ease-out'
        }`}
        style={{
          transform: isShadeDragging ? `translateY(-${shadeDragY}px)` : undefined,
        }}
      >
        {/* 1. Quick Action Tiles Grid (Sharp Metro Rectangles, 0 border-radius) */}
        <div className="pt-2 px-3">
          <div className="grid grid-cols-4 gap-[3px]">
            {/* Quick Action 1: Wi-Fi */}
            <button
              onClick={() => {}}
              className="flex flex-col items-center justify-center h-[72px] text-white transition-opacity active:opacity-75"
              style={{ backgroundColor: accent.hex }}
              title="Wi-Fi (Connected)"
            >
              <WPIcon name="wifi" size={20} className="mb-1.5" />
              <span className="text-[10px] uppercase font-normal tracking-[0.5px]">Wi-Fi</span>
              <span className="text-[9px] text-white/80 font-light truncate max-w-[64px]">Connected</span>
            </button>

            {/* Quick Action 2: Accent Colour */}
            <button
              onClick={cycleNextAccent}
              className="flex flex-col items-center justify-center h-[72px] text-white transition-opacity active:opacity-75"
              style={{ backgroundColor: accent.hex }}
              title={`Accent: ${accent.name} (Click to change)`}
            >
              <WPIcon name="palette" size={20} className="mb-1.5" />
              <span className="text-[10px] uppercase font-normal tracking-[0.5px]">Accent</span>
              <span className="text-[9px] text-white/80 font-light truncate max-w-[64px]">
                {accent.name}
              </span>
            </button>

            {/* Quick Action 3: Theme Light/Dark */}
            <button
              onClick={toggleTheme}
              className="flex flex-col items-center justify-center h-[72px] text-white border border-white/30 bg-transparent transition-opacity active:opacity-75"
              title={`Theme: ${isDark ? 'Dark' : 'Light'}`}
            >
              {isDark ? (
                <WPIcon name="sun" size={20} className="mb-1.5 text-white/90" />
              ) : (
                <WPIcon name="moon" size={20} className="mb-1.5 text-white/90" />
              )}
              <span className="text-[10px] uppercase font-normal tracking-[0.5px]">Theme</span>
              <span className="text-[9px] text-white/60 font-light">{isDark ? 'Dark' : 'Light'}</span>
            </button>

            {/* Quick Action 4: Lock screen */}
            <button
              onClick={handleLock}
              className="flex flex-col items-center justify-center h-[72px] text-white border border-white/30 bg-transparent transition-opacity active:opacity-75"
              title="Lock phone now"
            >
              <WPIcon name="lock" size={20} className="mb-1.5 text-white/90" />
              <span className="text-[10px] uppercase font-normal tracking-[0.5px]">Lock</span>
              <span className="text-[9px] text-white/60 font-light">Screen</span>
            </button>
          </div>

          {/* Expandable Second Row of Metro Tiles */}
          {isExpanded && (
            <div className="grid grid-cols-4 gap-[3px] mt-[3px] animate-in fade-in duration-200">
              {/* Quick Action 5: Desktop XP Switch */}
              <button
                onClick={() => {
                  setForceView('desktop');
                  handleClose();
                  window.location.href = '/?view=desktop';
                }}
                className="flex flex-col items-center justify-center h-[72px] text-white border border-white/30 bg-transparent transition-opacity active:opacity-75"
                title="Switch to Windows XP Luna"
              >
                <WPIcon name="monitor" size={20} className="mb-1.5 text-white/90" />
                <span className="text-[10px] uppercase font-normal tracking-[0.5px]">Desktop</span>
                <span className="text-[9px] text-white/60 font-light">XP Luna</span>
              </button>

              {/* Quick Action 6: Battery Status */}
              <button
                className="flex flex-col items-center justify-center h-[72px] text-white border border-white/30 bg-transparent transition-opacity"
                title="Battery Telemetry"
              >
                <WPIcon name="battery" size={20} className="mb-1.5 text-white/90" />
                <span className="text-[10px] uppercase font-normal tracking-[0.5px]">Battery</span>
                <span className="text-[9px] text-white/60 font-light">Active</span>
              </button>

              {/* Quick Action 7: All Settings */}
              <button
                onClick={cycleNextAccent}
                className="flex flex-col items-center justify-center h-[72px] text-white border border-white/30 bg-transparent transition-opacity active:opacity-75"
                title="Personalize theme"
              >
                <WPIcon name="settings" size={20} className="mb-1.5 text-white/90" />
                <span className="text-[10px] uppercase font-normal tracking-[0.5px]">Settings</span>
                <span className="text-[9px] text-white/60 font-light">Theme</span>
              </button>

              {/* Quick Action 8: Vercel Cloud Hub */}
              <button
                onClick={() => {
                  handleClose();
                  onOpenVercelHub?.();
                }}
                className="flex flex-col items-center justify-center h-[72px] text-white border border-white/30 bg-transparent transition-opacity active:opacity-75"
                title="Vercel Cloud & Edge Telemetry"
              >
                <WPIcon name="vercel" size={18} className="mb-1.5 fill-white" />
                <span className="text-[10px] uppercase font-normal tracking-[0.5px]">Vercel</span>
                <span className="text-[9px] text-emerald-400 font-mono">BOM1 • LIVE</span>
              </button>
            </div>
          )}

          {/* Expand / Collapse Action Center toggle */}
          <div className="flex justify-center pt-2 pb-1">
            <button
              onClick={() => setIsExpanded((prev) => !prev)}
              className="flex items-center gap-1.5 text-[11px] uppercase tracking-[1px] text-white/60 hover:text-white transition-colors py-1 px-3"
            >
              <span>{isExpanded ? 'collapse' : 'expand'}</span>
              <WPIcon name={isExpanded ? 'chevronUp' : 'chevronDown'} size={14} />
            </button>
          </div>
        </div>

        {/* 2. Action Bar ("ALL SETTINGS" on left, "CLEAR ALL" on right) */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-white/[0.08] text-white/70">
          <button
            onClick={cycleNextAccent}
            className="flex items-center gap-1.5 text-[13px] font-[300] lowercase text-white/70 hover:text-white transition-colors"
          >
            <WPIcon name="settings" size={14} />
            <span>all settings</span>
          </button>

          {activeGroups.length > 0 && (
            <button
              onClick={clearAllNotifications}
              className="text-[13px] font-[300] lowercase text-white/70 hover:text-white transition-colors"
            >
              clear all
            </button>
          )}
        </div>

        {/* 3. Authentic Grouped Notifications List with Swipe-to-Dismiss */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-5 min-h-[140px] max-h-[50vh]">
          {activeGroups.length === 0 ? (
            <div className="py-12 text-center text-white/40">
              <p className="text-[18px] font-[200]">no new notifications</p>
            </div>
          ) : (
            activeGroups.map((group) => (
              <div key={group.id} className="space-y-1.5">
                {/* App Title Header in Large Segoe WP Light */}
                <div className="flex items-center justify-between pb-1">
                  <div className="flex items-center gap-2">
                    {group.icon}
                    <h3 className="text-[18px] font-[300] tracking-tight text-white capitalize">
                      {group.appName}
                    </h3>
                  </div>
                  <span className="text-[11px] text-white/35 font-light">swipe to dismiss</span>
                </div>

                {/* Notification Items with 1:1 Horizontal Touch Swipe */}
                <div className="space-y-1">
                  {group.items.map((item) => (
                    <SwipeableNotificationItem
                      key={item.id}
                      item={item}
                      onDismiss={dismissItem}
                      onClick={
                        group.id === 'edge-broadcast-group'
                          ? () => {
                              handleClose();
                              onOpenVercelHub?.();
                            }
                          : undefined
                      }
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* 4. Bottom Native Windows Phone Drag Handle with Drag-Up to Dismiss Gesture */}
        <div
          onTouchStart={handleShadeTouchStart}
          onTouchMove={handleShadeTouchMove}
          onTouchEnd={handleShadeTouchEnd}
          onClick={handleClose}
          className="w-full py-3 bg-black flex flex-col items-center justify-center cursor-pointer hover:bg-white/[0.04] active:bg-white/[0.08] transition-colors border-t border-white/[0.06]"
          title="Drag up to close Action Center"
        >
          <div className="w-9 h-[3px] bg-white/40 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default WPActionCenter;