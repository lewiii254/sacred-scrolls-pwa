import { createContext, useContext, useState, useRef, useEffect, ReactNode } from 'react';
import { BibleVerse } from '@/lib/bible-api';

interface AudioContextType {
  isPlaying: boolean;
  currentVerse: BibleVerse | null;
  currentTime: number;
  duration: number;
  volume: number;
  playbackRate: number;
  play: (verse?: BibleVerse) => void;
  pause: () => void;
  stop: () => void;
  setVolume: (volume: number) => void;
  setPlaybackRate: (rate: number) => void;
  seekTo: (time: number) => void;
  loading: boolean;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVerse, setCurrentVerse] = useState<BibleVerse | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(1);
  const [playbackRate, setPlaybackRateState] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Initialize audio element
    audioRef.current = new Audio();
    const audio = audioRef.current;

    // Audio event listeners
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };
    const handleLoadStart = () => setLoading(true);
    const handleCanPlay = () => setLoading(false);
    const handleError = () => {
      setLoading(false);
      console.error('Audio playback error');
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
    };
  }, []);

  const play = async (verse?: BibleVerse) => {
    if (!audioRef.current) return;

    try {
      if (verse && verse !== currentVerse) {
        // Generate audio URL for the verse
        const audioUrl = generateAudioUrl(verse);
        audioRef.current.src = audioUrl;
        setCurrentVerse(verse);
      }

      await audioRef.current.play();
      setIsPlaying(true);
    } catch (error) {
      console.error('Failed to play audio:', error);
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setCurrentTime(0);
    }
  };

  const setVolume = (newVolume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      setVolumeState(newVolume);
    }
  };

  const setPlaybackRate = (rate: number) => {
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
      setPlaybackRateState(rate);
    }
  };

  const seekTo = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  // Generate audio URL for a verse (mock implementation)
  const generateAudioUrl = (verse: BibleVerse): string => {
    // This would integrate with a real audio Bible API
    // For now, return a placeholder URL
    return `https://audio-bible-api.com/${verse.book_id}/${verse.chapter}/${verse.verse}.mp3`;
  };

  const value: AudioContextType = {
    isPlaying,
    currentVerse,
    currentTime,
    duration,
    volume,
    playbackRate,
    play,
    pause,
    stop,
    setVolume,
    setPlaybackRate,
    seekTo,
    loading
  };

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}