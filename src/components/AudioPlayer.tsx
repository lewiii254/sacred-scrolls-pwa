import { useState } from 'react';
import { useAudio } from '@/contexts/AudioContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Play, 
  Pause, 
  Square, 
  Volume2, 
  VolumeX,
  SkipBack,
  SkipForward,
  Loader2
} from 'lucide-react';
import { BibleVerse } from '@/lib/bible-api';

interface AudioPlayerProps {
  verses?: BibleVerse[];
  currentVerseIndex?: number;
  onVerseChange?: (index: number) => void;
}

export function AudioPlayer({ verses = [], currentVerseIndex = 0, onVerseChange }: AudioPlayerProps) {
  const {
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
  } = useAudio();

  const [isMuted, setIsMuted] = useState(false);

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      pause();
    } else {
      const verseToPlay = verses[currentVerseIndex];
      play(verseToPlay);
    }
  };

  const handlePrevious = () => {
    if (currentVerseIndex > 0 && onVerseChange) {
      onVerseChange(currentVerseIndex - 1);
      const previousVerse = verses[currentVerseIndex - 1];
      play(previousVerse);
    }
  };

  const handleNext = () => {
    if (currentVerseIndex < verses.length - 1 && onVerseChange) {
      onVerseChange(currentVerseIndex + 1);
      const nextVerse = verses[currentVerseIndex + 1];
      play(nextVerse);
    }
  };

  const handleVolumeChange = (values: number[]) => {
    const newVolume = values[0];
    setVolume(newVolume);
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const handleMuteToggle = () => {
    if (isMuted) {
      setVolume(1);
      setIsMuted(false);
    } else {
      setVolume(0);
      setIsMuted(true);
    }
  };

  const handleSeek = (values: number[]) => {
    const newTime = values[0];
    seekTo(newTime);
  };

  const playbackRates = [0.5, 0.75, 1, 1.25, 1.5, 2];

  return (
    <Card className="fixed bottom-4 left-4 right-4 md:left-1/2 md:right-auto md:transform md:-translate-x-1/2 md:w-96 z-50 shadow-lg">
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Current verse info */}
          {currentVerse && (
            <div className="text-center">
              <p className="text-sm font-medium">
                {currentVerse.book_name} {currentVerse.chapter}:{currentVerse.verse}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {currentVerse.text}
              </p>
            </div>
          )}

          {/* Progress bar */}
          <div className="space-y-2">
            <Slider
              value={[currentTime]}
              max={duration}
              step={1}
              onValueChange={handleSeek}
              className="w-full"
              disabled={!duration}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Main controls */}
          <div className="flex items-center justify-center space-x-4">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrevious}
              disabled={!verses.length || currentVerseIndex === 0}
            >
              <SkipBack className="h-4 w-4" />
            </Button>

            <Button
              size="icon"
              onClick={handlePlayPause}
              disabled={loading || !verses.length}
              className="h-12 w-12"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5" />
              )}
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={stop}
              disabled={!isPlaying && currentTime === 0}
            >
              <Square className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
              disabled={!verses.length || currentVerseIndex === verses.length - 1}
            >
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>

          {/* Volume and speed controls */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 flex-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleMuteToggle}
                className="h-8 w-8"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </Button>
              <Slider
                value={[volume]}
                max={1}
                step={0.1}
                onValueChange={handleVolumeChange}
                className="flex-1"
              />
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs text-muted-foreground">Speed:</span>
              <Select
                value={playbackRate.toString()}
                onValueChange={(value) => setPlaybackRate(parseFloat(value))}
              >
                <SelectTrigger className="w-16 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {playbackRates.map((rate) => (
                    <SelectItem key={rate} value={rate.toString()}>
                      {rate}x
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}