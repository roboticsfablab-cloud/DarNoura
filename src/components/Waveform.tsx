import { useRef, useEffect, useCallback } from 'react';

interface WaveformProps {
  analyser: AnalyserNode | null;
  isRecording: boolean;
  className?: string;
  bars?: number;
}

/**
 * Real-time audio waveform visualization using Web Audio API AnalyserNode.
 * Renders animated bars that respond to microphone input.
 */
export function Waveform({ analyser, isRecording, className = '', bars = 48 }: WaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const dataRef = useRef<Uint8Array | null>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const barWidth = width / bars;
    const gap = barWidth * 0.3;
    const actualBarWidth = barWidth - gap;

    if (analyser && isRecording) {
      if (!dataRef.current || dataRef.current.length !== analyser.frequencyBinCount) {
        dataRef.current = new Uint8Array(analyser.frequencyBinCount);
      }
      analyser.getByteFrequencyData(dataRef.current);

      const step = Math.floor(dataRef.current.length / bars);
      for (let i = 0; i < bars; i++) {
        const value = dataRef.current[i * step] || 0;
        const normalizedHeight = (value / 255) * height * 0.9;
        const x = i * barWidth + gap / 2;
        const y = (height - normalizedHeight) / 2;

        // Gradient based on height
        const intensity = value / 255;
        const r = Math.round(197 - intensity * 20);
        const g = Math.round(165 + intensity * 40);
        const b = Math.round(114 + intensity * 20);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${0.6 + intensity * 0.4})`;
        ctx.beginPath();
        ctx.roundRect(x, y, actualBarWidth, Math.max(normalizedHeight, 2), actualBarWidth / 2);
        ctx.fill();
      }
    } else {
      // Idle / paused state — flat line with subtle wave
      const time = Date.now() / 1000;
      for (let i = 0; i < bars; i++) {
        const amplitude = isRecording ? 0.15 : 0.08;
        const wave = Math.sin(time * 2 + i * 0.3) * amplitude;
        const barHeight = height * (0.05 + Math.abs(wave) * height * 0.3);
        const x = i * barWidth + gap / 2;
        const y = (height - barHeight) / 2;
        ctx.fillStyle = 'rgba(197, 165, 114, 0.2)';
        ctx.beginPath();
        ctx.roundRect(x, y, actualBarWidth, Math.max(barHeight, 2), actualBarWidth / 2);
        ctx.fill();
      }
    }

    rafRef.current = requestAnimationFrame(draw);
  }, [analyser, bars, isRecording]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      width={600}
      height={120}
      className={`w-full h-full ${className}`}
      aria-hidden="true"
    />
  );
}
