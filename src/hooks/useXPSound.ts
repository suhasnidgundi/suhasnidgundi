import { useCallback, useRef, useEffect } from 'react';

// Import all XP sounds
import XPStartup from '@/assets/xp/sounds/XPStartup.mp3';
import XPStart from '@/assets/xp/sounds/XPStart.mp3';
import XPMinimize from '@/assets/xp/sounds/XPMinimize.mp3';
import XPRestore from '@/assets/xp/sounds/XPRestore.mp3';
import XPDing from '@/assets/xp/sounds/XPDing.mp3';
import XPNotify from '@/assets/xp/sounds/XPNotify.mp3';
import XPMenuCommand from '@/assets/xp/sounds/XPMenuCommand.mp3';
import XPExclamation from '@/assets/xp/sounds/XPExclamation.mp3';
import XPLogoffSound from '@/assets/xp/sounds/XPLogoffSound.mp3';

export type SoundType = 
  | 'startup'
  | 'start'
  | 'minimize'
  | 'restore'
  | 'close'
  | 'click'
  | 'notify'
  | 'error'
  | 'logoff';

const soundMap: Record<SoundType, string> = {
  startup: XPStartup,
  start: XPStart,
  minimize: XPMinimize,
  restore: XPRestore,
  close: XPDing,
  click: XPMenuCommand,
  notify: XPNotify,
  error: XPExclamation,
  logoff: XPLogoffSound,
};

export const useXPSound = () => {
  const audioRefs = useRef<Map<SoundType, HTMLAudioElement>>(new Map());
  const isMuted = useRef(false);

  // Preload sounds
  useEffect(() => {
    const audioMap = audioRefs.current;
    
    Object.entries(soundMap).forEach(([key, src]) => {
      const audio = new Audio(src);
      audio.preload = 'auto';
      audio.volume = 0.3;
      audioMap.set(key as SoundType, audio);
    });

    return () => {
      audioMap.forEach(audio => {
        audio.pause();
        audio.src = '';
      });
      audioMap.clear();
    };
  }, []);

  const playSound = useCallback((type: SoundType) => {
    if (isMuted.current) return;
    
    const audio = audioRefs.current.get(type);
    if (audio) {
      // Clone the audio to allow overlapping sounds
      const clone = audio.cloneNode() as HTMLAudioElement;
      clone.volume = 0.3;
      
      // Clean up clone after playback to prevent memory leak
      clone.addEventListener('ended', () => {
        clone.remove();
      });
      clone.addEventListener('error', () => {
        clone.remove();
      });
      
      clone.play().catch(() => {
        // Autoplay errors expected on first load before user interaction
        clone.remove();
      });
    }
  }, []);

  const setMuted = useCallback((muted: boolean) => {
    isMuted.current = muted;
  }, []);

  const toggleMute = useCallback(() => {
    isMuted.current = !isMuted.current;
    return isMuted.current;
  }, []);

  return {
    playSound,
    setMuted,
    toggleMute,
  };
};

export default useXPSound;
