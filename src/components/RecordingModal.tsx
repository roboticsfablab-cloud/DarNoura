import { useState, useCallback } from 'react';
import { Mic, Pause, Play, Square, Check, AlertCircle, X } from 'lucide-react';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import { Waveform } from '@/components/Waveform';
import { formatDuration, getSessionId } from '@/utils/helpers';
import { SNDLogo } from '@/components/SNDLogo';
import { GoldDivider } from '@/components/Decorations';

interface RecordingModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (audioBlob: Blob, duration: number) => void;
  onThankYou: () => void;
}

type Phase = 'intro' | 'recording' | 'preview' | 'error';

export function RecordingModal({ open, onClose, onSave, onThankYou }: RecordingModalProps) {
  const recorder = useAudioRecorder();
  const [phase, setPhase] = useState<Phase>('intro');
  const [isSaving, setIsSaving] = useState(false);

  const handleStart = useCallback(async () => {
    setPhase('recording');
    await recorder.start();
  }, [recorder]);

  const handlePause = useCallback(() => {
    recorder.pause();
  }, [recorder]);

  const handleResume = useCallback(() => {
    recorder.resume();
  }, [recorder]);

  const handleStop = useCallback(() => {
    recorder.stop();
    setPhase('preview');
  }, [recorder]);

  const handleSave = useCallback(async () => {
    if (!recorder.audioBlob) return;
    setIsSaving(true);
    try {
      await onSave(recorder.audioBlob, recorder.duration);
      setPhase('intro');
      onThankYou();
    } catch {
      // Keep recording in preview state if save fails
      setPhase('error');
    } finally {
      setIsSaving(false);
    }
  }, [recorder.audioBlob, recorder.duration, onSave, onThankYou]);

  const handleRetake = useCallback(() => {
    recorder.reset();
    setPhase('intro');
  }, [recorder]);

  const handleClose = useCallback(() => {
    recorder.reset();
    setPhase('intro');
    onClose();
  }, [recorder, onClose]);

  // Show error if recorder has error
  if (recorder.error && phase !== 'error') {
    setPhase('error');
  }

  if (!open) return null;

  const isRecording = recorder.state === 'recording';
  const isPaused = recorder.state === 'paused';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-snd-950/90 backdrop-blur-xl"
        onClick={handleClose}
      />

      {/* Modal content */}
      <div className="relative w-full max-w-2xl mx-4 animate-scale-in">
        <div className="glass-card relative overflow-hidden p-8 md:p-12">
          {/* Decorative pattern background */}
          <div className="absolute inset-0 arabic-pattern-bg opacity-30 pointer-events-none" />
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-l from-snd-400 via-gold-300 to-snd-400" />

          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 left-4 p-2 rounded-lg text-sand-100/40 hover:text-sand-50 hover:bg-white/10 transition-all touch-manipulation"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Logo */}
          <div className="flex justify-center mb-6">
            <SNDLogo size={56} />
          </div>

          {/* INTRO PHASE */}
          {phase === 'intro' && (
            <div className="relative text-center animate-fade-in-up">
              <h2 className="text-3xl md:text-4xl font-heading font-black text-sand-50 mb-3">
                سجّل مشاعرك حول هذا الفيديو
              </h2>
              <p className="text-sand-100/60 font-body text-lg mb-8">
                شاركنا شعورك بكلماتك وصوتك
              </p>
              <GoldDivider className="mb-8" />
              <button
                onClick={handleStart}
                className="relative btn-gold text-xl px-12 py-6 touch-manipulation no-select group"
                aria-label="ابدأ التسجيل"
              >
                {/* Pulse ring */}
                <span className="absolute inset-0 rounded-2xl border-2 border-gold-300/40 animate-pulse-ring" />
                <Mic className="w-7 h-7 transition-transform group-hover:scale-110" />
                <span>ابدأ التسجيل</span>
              </button>
              <p className="text-sand-100/40 text-sm mt-6 font-body">
                سيتم طلب إذن استخدام الميكروفون
              </p>
            </div>
          )}

          {/* RECORDING PHASE */}
          {phase === 'recording' && (
            <div className="relative text-center animate-fade-in">
              <div className="flex items-center justify-center gap-2 mb-6">
                <span
                  className={`inline-block w-3 h-3 rounded-full ${
                    isRecording ? 'bg-red-400 animate-pulse' : 'bg-gold-300'
                  }`}
                />
                <span className="text-sand-100/70 font-body text-sm">
                  {isRecording ? 'جاري التسجيل' : 'متوقف مؤقتًا'}
                </span>
              </div>

              {/* Timer */}
              <div className="text-5xl font-heading font-black text-gradient-gold mb-6 tabular-nums">
                {formatDuration(recorder.duration)}
              </div>

              {/* Waveform */}
              <div className="h-24 mb-8 rounded-2xl bg-snd-950/40 overflow-hidden px-4">
                <Waveform analyser={recorder.analyser} isRecording={isRecording} />
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-4 flex-wrap">
                {isRecording && (
                  <button
                    onClick={handlePause}
                    className="btn-ghost text-base px-8 py-4 touch-manipulation no-select"
                    aria-label="إيقاف مؤقت"
                  >
                    <Pause className="w-6 h-6" />
                    <span>إيقاف مؤقت</span>
                  </button>
                )}
                {isPaused && (
                  <button
                    onClick={handleResume}
                    className="btn-primary text-base px-8 py-4 touch-manipulation no-select"
                    aria-label="استكمال التسجيل"
                  >
                    <Play className="w-6 h-6" fill="white" />
                    <span>استكمال</span>
                  </button>
                )}
                <button
                  onClick={handleStop}
                  className="relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg
                    bg-red-500/20 text-red-200 border border-red-500/40
                    transition-all duration-300 hover:bg-red-500/30 active:scale-95
                    touch-manipulation no-select"
                  aria-label="إنهاء التسجيل"
                >
                  <span className="absolute inset-0 rounded-2xl border-2 border-red-400/40 animate-pulse-ring" />
                  <Square className="w-6 h-6" fill="currentColor" />
                  <span>إنهاء</span>
                </button>
              </div>
              <p className="text-sand-100/40 text-sm mt-6 font-body">
                لا يوجد حد زمني — سجّل للمدة التي تريدها
              </p>
            </div>
          )}

          {/* PREVIEW PHASE */}
          {phase === 'preview' && recorder.audioUrl && (
            <div className="relative text-center animate-fade-in-up">
              <h2 className="text-2xl md:text-3xl font-heading font-black text-sand-50 mb-3">
                استمع لتسجيلك
              </h2>
              <p className="text-sand-100/60 font-body mb-6">
                المدة: {formatDuration(recorder.duration)}
              </p>
              <GoldDivider className="mb-6" />

              {/* Audio player */}
              <div className="bg-snd-950/50 rounded-2xl p-6 mb-8">
                <audio
                  src={recorder.audioUrl}
                  controls
                  className="w-full"
                  style={{ direction: 'ltr' }}
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <button
                  onClick={handleRetake}
                  className="btn-ghost text-base px-8 py-4 touch-manipulation no-select"
                  aria-label="إعادة التسجيل"
                >
                  <Mic className="w-5 h-5" />
                  <span>إعادة التسجيل</span>
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="btn-primary text-base px-10 py-4 touch-manipulation no-select"
                  aria-label="حفظ التسجيل"
                >
                  <Check className="w-6 h-6" />
                  <span>{isSaving ? 'جاري الحفظ...' : 'حفظ التسجيل'}</span>
                </button>
              </div>
            </div>
          )}

          {/* ERROR PHASE */}
          {phase === 'error' && (
            <div className="relative text-center animate-fade-in-up py-8">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-red-300" />
                </div>
              </div>
              <h2 className="text-2xl font-heading font-bold text-sand-50 mb-3">
                {recorder.error || 'حدث خطأ أثناء التسجيل'}
              </h2>
              <p className="text-sand-100/50 font-body mb-8">
                يرجى المحاولة مرة أخرى
              </p>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <button
                  onClick={() => {
                    recorder.reset();
                    setPhase('intro');
                  }}
                  className="btn-primary touch-manipulation no-select"
                  aria-label="المحاولة مرة أخرى"
                >
                  <Mic className="w-5 h-5" />
                  <span>المحاولة مرة أخرى</span>
                </button>
                <button
                  onClick={handleClose}
                  className="btn-ghost touch-manipulation no-select"
                  aria-label="إغلاق"
                >
                  <span>إغلاق</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
