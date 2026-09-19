import { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, Trash2 } from 'lucide-react';
import type { Recording } from '@/types';
import { formatDuration, formatDateTime, formatDate, formatRecordingNumber } from '@/utils/helpers';

interface RecordingCardProps {
  recording: Recording;
  index: number;
  onDelete: (id: string) => void;
  isPlaying: boolean;
  onPlay: (id: string) => void;
  audioRef: (el: HTMLAudioElement | null) => void;
}

export function RecordingCard({
  recording,
  index,
  onDelete,
  isPlaying,
  onPlay,
  audioRef,
}: RecordingCardProps) {
  const localRef = useRef<HTMLAudioElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(recording.duration || 0);

  const setRef = useCallback(
    (el: HTMLAudioElement | null) => {
      localRef.current = el;
      audioRef(el);
    },
    [audioRef],
  );

  useEffect(() => {
    const audio = localRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };
    const handleLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };
    const handleEnded = () => {
      setProgress(0);
      setCurrentTime(0);
      onPlay(''); // stop playing state
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [onPlay]);

  // Play/pause based on isPlaying prop
  useEffect(() => {
    const audio = localRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  const handleTogglePlay = () => {
    onPlay(isPlaying ? '' : recording.id);
  };

  return (
    <div className="glass-card p-5 md:p-6 transition-all duration-300 hover:border-snd-300/25 hover:bg-snd-800/50 animate-slide-up">
      {/* Header row */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-snd-500/20 flex items-center justify-center">
            <span className="text-gold-300 font-heading font-bold text-sm">
              {formatRecordingNumber(index)}
            </span>
          </div>
          <div>
            <div className="text-sand-50 font-body font-medium text-sm">
              {formatDate(recording.createdAt)}
            </div>
            <div className="text-sand-100/40 font-body text-xs">
              {formatDateTime(recording.createdAt)}
            </div>
          </div>
        </div>
        <button
          onClick={() => onDelete(recording.id)}
          className="p-2.5 rounded-lg text-red-300/60 hover:text-red-300 hover:bg-red-500/10 transition-all touch-manipulation no-select"
          aria-label={`حذف التسجيل ${formatRecordingNumber(index)}`}
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {/* Audio player (hidden native, custom UI) */}
      <audio ref={setRef} src={recording.audioUrl} preload="metadata" className="hidden" />

      {/* Custom player UI */}
      <div className="flex items-center gap-4">
        {/* Play/Pause button */}
        <button
          onClick={handleTogglePlay}
          className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-snd-400 to-snd-600 flex items-center justify-center shadow-lg shadow-snd-500/20 transition-all hover:scale-110 active:scale-95 touch-manipulation no-select"
          aria-label={isPlaying ? 'إيقاف' : 'تشغيل'}
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 text-white" fill="white" />
          ) : (
            <Play className="w-5 h-5 text-white mr-[-2px]" fill="white" />
          )}
        </button>

        {/* Progress bar */}
        <div className="flex-1 min-w-0">
          <div
            className="relative h-2 rounded-full bg-snd-950/60 overflow-hidden cursor-pointer"
            onClick={(e) => {
              const audio = localRef.current;
              if (!audio || !audio.duration) return;
              const rect = e.currentTarget.getBoundingClientRect();
              // RTL: rightmost = 0, leftmost = 100
              const ratio = (rect.right - e.clientX) / rect.width;
              audio.currentTime = ratio * audio.duration;
            }}
          >
            <div
              className="absolute top-0 bottom-0 right-0 bg-gradient-to-l from-snd-400 to-gold-300 rounded-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
          {/* Time display */}
          <div className="flex items-center justify-between mt-2 text-xs text-sand-100/40 font-body tabular-nums">
            <span>{formatDuration(duration)}</span>
            <span>{formatDuration(currentTime)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
