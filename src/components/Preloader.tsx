import { useState, useEffect, useRef, useCallback } from 'react';
import WindowsXPLogo from '@/assets/xp/xp_loading_logo.jpg';
import { useIsMobile } from '@/hooks/use-mobile';
import { useProfile } from '@/hooks/useProfile';

interface PreloaderProps {
  onComplete: () => void;
}

// XP Boot Phase enum
type XPPhase = 'boot' | 'welcome';

const Preloader = ({ onComplete }: PreloaderProps) => {
  const isMobile = useIsMobile();
  const { data: profile } = useProfile();
  const [progress, setProgress] = useState(0);
  const [audioReady, setAudioReady] = useState(false);
  const [xpPhase, setXpPhase] = useState<XPPhase>('boot');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasPlayedRef = useRef(false);
  const audioUnlockedRef = useRef(false);

  // If mobile, do not show preloader and complete immediately
  useEffect(() => {
    if (isMobile) {
      onComplete();
    }
  }, [isMobile, onComplete]);

  // Initialize audio element from public folder
  useEffect(() => {
    if (isMobile) return;
    audioRef.current = new Audio('/startup_sound_xp.mp3');
    audioRef.current.volume = 1;

    // Try muted autoplay trick - play muted, then unmute
    audioRef.current.muted = true;
    audioRef.current.play().then(() => {
      // Autoplay worked! Pause and prepare for real playback
      audioRef.current?.pause();
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.muted = false;
      }
      audioUnlockedRef.current = true;
      setAudioReady(true);
    }).catch(() => {
      // Muted autoplay failed, need user interaction
    });
  }, [isMobile]);

  // Unlock audio on ANY user interaction (not just click)
  useEffect(() => {
    if (isMobile) return;
    const unlockAudio = () => {
      if (!audioUnlockedRef.current && audioRef.current) {
        audioRef.current.muted = true;
        audioRef.current.play().then(() => {
          audioRef.current?.pause();
          if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.muted = false;
          }
          audioUnlockedRef.current = true;
          setAudioReady(true);
        }).catch(() => { });
      }
    };

    // Listen for any user interaction
    const events = ['click', 'touchstart', 'keydown', 'mousemove', 'scroll'];
    events.forEach(event => {
      document.addEventListener(event, unlockAudio, { once: true, passive: true });
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, unlockAudio);
      });
    };
  }, [isMobile]);

  // Play sound when progress reaches 100%
  const playStartupSound = useCallback(() => {
    if (audioRef.current && !hasPlayedRef.current && audioUnlockedRef.current) {
      hasPlayedRef.current = true;
      audioRef.current.play().catch((err) => {
        console.log('Audio playback failed:', err);
      });
    }
  }, []);

  // Handle XP phase transitions based on progress
  useEffect(() => {
    if (isMobile) return;
    if (progress >= 70 && xpPhase === 'boot') {
      setXpPhase('welcome');
    }
  }, [progress, xpPhase, isMobile]);

  useEffect(() => {
    if (isMobile) return;
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + Math.random() * 15;

        if (newProgress >= 100) {
          clearInterval(progressInterval);

          // Play XP startup sound
          playStartupSound();

          setTimeout(onComplete, 500);
          return 100;
        }
        return newProgress;
      });
    }, 400);

    return () => clearInterval(progressInterval);
  }, [onComplete, playStartupSound, isMobile]);

  if (isMobile) {
    return null;
  }

  // Desktop: XP Boot Screen (Phase 1)
  if (xpPhase === 'boot') {
    return (
      <div className="xp-boot-screen">
        {/* Audio Status - subtle indicator */}
        <div className="absolute top-4 right-4 text-white/30 text-sm">
          {audioReady ? '🔊' : '🔇'}
        </div>

        {/* Windows XP Logo */}
        <img src={WindowsXPLogo} alt="Windows XP Logo" height="25%" width="25%" />

        {/* XP Loading Bar */}
        <div className="xp-loading-bar mt-10">
          <div className="xp-loading-segments">
            <div className="xp-loading-segment" />
            <div className="xp-loading-segment" />
            <div className="xp-loading-segment" />
          </div>
        </div>

        {/* Copyright Footer */}
        <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end text-white/60 text-xs">
          <span>Copyright © {profile?.name || 'Portfolio'}</span>
          <span className="text-white/80 text-sm font-semibold" style={{ fontFamily: 'Arial, sans-serif' }}>
            {profile?.name || 'Portfolio'}
          </span>
        </div>
      </div>
    );
  }

  // Desktop: XP Welcome Screen (Phase 2)
  return (
    <div className="xp-welcome-screen">
      {/* Audio Status - subtle indicator */}
      <div className="absolute top-4 right-4 text-white/30 text-sm z-10">
        {audioReady ? '🔊' : '🔇'}
      </div>

      {/* Glow overlay */}
      <div className="xp-welcome-glow" />

      {/* Welcome Text */}
      <h1 className="xp-welcome-text">Welcome</h1>

      {/* Bottom bar */}
      <div className="xp-welcome-bar" />
    </div>
  );
};

export default Preloader;
