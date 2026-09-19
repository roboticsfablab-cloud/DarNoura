import { useRef, useState, useCallback, useEffect } from 'react';
import { RECORDING_CONFIG } from '@/config';

export type RecorderState = 'idle' | 'recording' | 'paused' | 'stopped';

interface UseAudioRecorderReturn {
  state: RecorderState;
  audioBlob: Blob | null;
  audioUrl: string | null;
  duration: number;
  error: string | null;
  start: () => Promise<void>;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  reset: () => void;
  analyser: AnalyserNode | null;
}

/**
 * Audio recorder hook using MediaRecorder API.
 * Supports pause/resume without losing recorded data.
 * Collects chunks incrementally to handle long recordings.
 * Provides an AnalyserNode for waveform visualization.
 */
export function useAudioRecorder(): UseAudioRecorderReturn {
  const [state, setState] = useState<RecorderState>('idle');
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);
  const pausedDurationRef = useRef<number>(0);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);

  const cleanupStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    analyserRef.current = null;
    setAnalyser(null);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      setDuration(pausedDurationRef.current + elapsed);
    }, 100);
  }, []);

  const start = useCallback(async () => {
    setError(null);
    setAudioBlob(null);
    setAudioUrl(null);
    setDuration(0);
    pausedDurationRef.current = 0;
    chunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Set up audio analyser for waveform visualization
      const AudioCtx =
        window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;
      const source = ctx.createMediaStreamSource(stream);
      const analyserNode = ctx.createAnalyser();
      analyserNode.fftSize = 256;
      source.connect(analyserNode);
      analyserRef.current = analyserNode;
      setAnalyser(analyserNode);

      // Determine supported mime type
      const mimeType = MediaRecorder.isTypeSupported(RECORDING_CONFIG.mimeType)
        ? RECORDING_CONFIG.mimeType
        : '';

      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e: BlobEvent) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType || 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioUrl(url);
        setState('stopped');
        stopTimer();
        cleanupStream();
      };

      recorder.onerror = () => {
        setError('حدث خطأ أثناء التسجيل، يرجى المحاولة مرة أخرى.');
        setState('idle');
        stopTimer();
        cleanupStream();
      };

      // Request data every second for incremental chunk collection
      recorder.start(1000);
      setState('recording');
      startTimer();
    } catch (err) {
      if (err instanceof DOMException && err.name === 'NotAllowedError') {
        setError('نحتاج إلى السماح باستخدام الميكروفون حتى تتمكن من مشاركة مشاعرك.');
      } else if (err instanceof DOMException && err.name === 'NotFoundError') {
        setError('لا يوجد ميكروفون متاح على هذا الجهاز.');
      } else {
        setError('حدث خطأ أثناء التسجيل، يرجى المحاولة مرة أخرى.');
      }
      setState('idle');
      cleanupStream();
    }
  }, [cleanupStream, startTimer, stopTimer]);

  const pause = useCallback(() => {
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state === 'recording') {
      recorder.pause();
      setState('paused');
      stopTimer();
      pausedDurationRef.current += (Date.now() - startTimeRef.current) / 1000;
    }
  }, [stopTimer]);

  const resume = useCallback(() => {
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state === 'paused') {
      recorder.resume();
      setState('recording');
      startTimer();
    }
  }, [startTimer]);

  const stop = useCallback(() => {
    const recorder = mediaRecorderRef.current;
    if (recorder && (recorder.state === 'recording' || recorder.state === 'paused')) {
      if (recorder.state === 'paused') {
        pausedDurationRef.current += (Date.now() - startTimeRef.current) / 1000;
      }
      recorder.stop();
    }
    stopTimer();
  }, [stopTimer]);

  const reset = useCallback(() => {
    stopTimer();
    cleanupStream();
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    mediaRecorderRef.current = null;
    chunksRef.current = [];
    setState('idle');
    setAudioBlob(null);
    setAudioUrl(null);
    setDuration(0);
    setError(null);
    pausedDurationRef.current = 0;
  }, [audioUrl, cleanupStream, stopTimer]);

  useEffect(() => {
    return () => {
      stopTimer();
      cleanupStream();
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    state,
    audioBlob,
    audioUrl,
    duration,
    error,
    start,
    pause,
    resume,
    stop,
    reset,
    analyser,
  };
}
