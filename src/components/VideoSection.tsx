import { useState, useRef, useCallback } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';
import { VIDEO_URL } from '@/config';
import { GoldDivider, GeometricPattern } from '@/components/Decorations';

interface VideoSectionProps {
  onVideoEnded: () => void;
  resetKey: number;
}

/**
 * The main video player section.
 * Video does NOT autoplay — user must click to play.
 * When the video ends, calls onVideoEnded to trigger the recording modal.
 */
export function VideoSection({ onVideoEnded, resetKey }: VideoSectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);

  const handlePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
      setHasStarted(true);
      setShowOverlay(false);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }, []);

  const handleEnded = useCallback(() => {
    setIsPlaying(false);
    setShowOverlay(true);
    onVideoEnded();
  }, [onVideoEnded]);

  // Reset when resetKey changes (new participant)
  const resetVideo = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      video.currentTime = 0;
      video.pause();
    }
    setIsPlaying(false);
    setHasStarted(false);
    setShowOverlay(true);
  }, []);

  // Use resetKey to trigger reset
  const lastResetKey = useRef(resetKey);
  if (lastResetKey.current !== resetKey) {
    lastResetKey.current = resetKey;
    resetVideo();
  }

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Decorative frame */}
      <div className="absolute -inset-4 pointer-events-none">
        <div className="absolute inset-0 rounded-3xl border border-gold-300/20" />
        <div className="absolute inset-2 rounded-2xl border border-gold-300/10" />
        {/* Corner ornaments */}
        {[
          'top-0 right-0',
          'top-0 left-0',
          'bottom-0 right-0',
          'bottom-0 left-0',
        ].map((pos) => (
          <div key={pos} className={`absolute ${pos} w-12 h-12 pointer-events-none`}>
            <GeometricPattern className="w-full h-full text-gold-300" />
          </div>
        ))}
      </div>

      {/* Glow effect */}
      <div className="absolute -inset-8 bg-snd-500/10 blur-3xl rounded-full pointer-events-none animate-glow" />

      {/* Video container */}
      <div className="relative aspect-video rounded-2xl overflow-hidden bg-snd-950 shadow-2xl shadow-snd-500/20">
        <video
          ref={videoRef}
          src={VIDEO_URL}
          onEnded={handleEnded}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          className="absolute inset-0 w-full h-full object-cover"
          playsInline
          preload="metadata"
        />

        {/* Play overlay */}
        {showOverlay && (
          <button
            onClick={handlePlay}
            className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-gradient-to-t from-snd-950/90 via-snd-950/40 to-snd-950/60 transition-all duration-500 group touch-manipulation no-select"
            aria-label={isPlaying ? 'إيقاف الفيديو' : 'تشغيل الفيديو'}
          >
            {/* Pulse rings around play button */}
            <div className="relative flex items-center justify-center">
              {!hasStarted && (
                <>
                  <div className="absolute w-24 h-24 rounded-full border-2 border-gold-300/40 animate-pulse-ring" />
                  <div
                    className="absolute w-24 h-24 rounded-full border-2 border-gold-300/30 animate-pulse-ring"
                    style={{ animationDelay: '0.5s' }}
                  />
                </>
              )}
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-snd-400 to-snd-600 flex items-center justify-center shadow-2xl shadow-snd-500/40 transition-all duration-300 group-hover:scale-110 group-active:scale-95">
                {isPlaying ? (
                  <Pause className="w-8 h-8 text-white" fill="white" />
                ) : (
                  <Play className="w-8 h-8 text-white mr-[-4px]" fill="white" />
                )}
              </div>
            </div>
            <div className="text-center">
              <p className="text-sand-50 font-heading font-bold text-xl mb-1">
                {hasStarted ? 'الفيديو انتهى' : 'اضغط لمشاهدة الفيديو'}
              </p>
              <p className="text-sand-100/50 text-sm font-body">
                {hasStarted ? 'شاركنا مشاعرك بعد المشاهدة' : 'شاهد ثم سجّل مشاعرك'}
              </p>
            </div>
          </button>
        )}

        {/* Minimal controls bar when playing */}
        {isPlaying && (
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-snd-950/80 to-transparent p-4 pointer-events-none">
            <div className="flex items-center gap-3 text-sand-100/60 text-sm">
              <Volume2 className="w-4 h-4" />
              <span className="font-body">يعمل الآن...</span>
            </div>
          </div>
        )}
      </div>

      <GoldDivider className="mt-8" />
    </div>
  );
}
