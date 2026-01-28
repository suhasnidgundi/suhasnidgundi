import { useState, useEffect, useRef, useCallback } from 'react';
import WindowsXPLogo from '@/assets/xp/xp_loading_logo.jpg';

interface PreloaderProps {
  onComplete: () => void;
}

// Custom hook for detecting mobile viewport
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
};

// XP Boot Phase enum
type XPPhase = 'boot' | 'welcome';

const Preloader = ({ onComplete }: PreloaderProps) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Initializing portfolio...');
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [audioReady, setAudioReady] = useState(false);
  const [xpPhase, setXpPhase] = useState<XPPhase>('boot');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasPlayedRef = useRef(false);
  const audioUnlockedRef = useRef(false);
  const isMobile = useIsMobile();

  // Initialize audio element from public folder
  useEffect(() => {
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
  }, []);

  // Unlock audio on ANY user interaction (not just click)
  useEffect(() => {
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
  }, []);

  // Play sound when progress reaches 100%
  const playStartupSound = useCallback(() => {
    if (audioRef.current && !hasPlayedRef.current && audioUnlockedRef.current) {
      hasPlayedRef.current = true;
      audioRef.current.play().catch((err) => {
        console.log('Audio playback failed:', err);
      });
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Handle XP phase transitions based on progress
  useEffect(() => {
    if (!isMobile && progress >= 70 && xpPhase === 'boot') {
      setXpPhase('welcome');
    }
  }, [progress, isMobile, xpPhase]);

  useEffect(() => {
    const statusMessages = [
      'Initializing portfolio...',
      'Loading project data...',
      'Fetching experience timeline...',
      'Compiling skills matrix...',
      'Rendering UI components...',
      'Almost there...',
    ];

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + Math.random() * 15;

        // Update status text based on progress
        const statusIndex = Math.min(
          Math.floor(newProgress / 20),
          statusMessages.length - 1
        );
        setStatusText(statusMessages[statusIndex]);

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
  }, [onComplete, playStartupSound]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Desktop: XP Boot Screen (Phase 1)
  if (!isMobile && xpPhase === 'boot') {
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
          <span>Copyright © Suhas Nidgundi</span>
          <span className="text-white/80 text-sm font-semibold" style={{ fontFamily: 'Arial, sans-serif' }}>
            Suhas Nidgundi
          </span>
        </div>
      </div>
    );
  }

  // Desktop: XP Welcome Screen (Phase 2)
  if (!isMobile && xpPhase === 'welcome') {
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
  }

  // Mobile: Original BSOD Preloader
  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-center bg-[hsl(var(--bsod-bg))] px-8 md:px-16 lg:px-24">
      {/* Audio Status - subtle indicator */}
      <div className="absolute top-4 right-4 flex items-center gap-2 text-[hsl(var(--bsod-text))/0.5] text-sm">
        <span>{audioReady ? '🔊' : '🔇'}</span>
      </div>

      {/* Sad Face */}
      <div className="mb-8 text-[80px] md:text-[120px] font-light text-[hsl(var(--bsod-text))] leading-none">
        :(
      </div>

      {/* Main Message */}
      <h1 className="mb-6 text-2xl md:text-4xl lg:text-5xl font-light text-[hsl(var(--bsod-text))] leading-tight max-w-4xl">
        This portfolio ran into a problem and needs to restart. We're just collecting some metadata, and then we'll restart for you.
      </h1>

      {/* Status Text */}
      <p className="mb-6 text-lg md:text-xl text-[hsl(var(--bsod-text))/0.8]">
        {statusText}
      </p>

      {/* Progress Bar */}
      <div className="mb-4 w-full max-w-md">
        <div className="h-1 w-full overflow-hidden rounded-full bg-[hsl(var(--bsod-text))/0.3]">
          <div
            className="h-full bg-[hsl(var(--bsod-text))] transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Progress Percentage */}
      <p className="mb-8 text-lg text-[hsl(var(--bsod-text))]">
        {Math.round(progress)}% complete
      </p>

      {/* Time Elapsed */}
      <p className="text-base text-[hsl(var(--bsod-text))/0.7]">
        Time Elapsed: {formatTime(timeElapsed)}
      </p>
    </div>
  );
};

export default Preloader;
