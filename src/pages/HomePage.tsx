import { VideoSection } from '@/components/VideoSection';
import { RecordingModal } from '@/components/RecordingModal';
import { ThankYouScreen } from '@/components/ThankYouScreen';
import { FloatingOrbs, GoldDivider, GeometricPattern, PalmSilhouette } from '@/components/Decorations';
import { useState, useCallback } from 'react';
import { Mic } from 'lucide-react';
import { getSessionId } from '@/utils/helpers';

interface HomePageProps {
  onRecordingSaved: (audioBlob: Blob, duration: number, sessionId: string) => Promise<void>;
}

type Screen = 'home' | 'recording' | 'thankyou';

export function HomePage({ onRecordingSaved }: HomePageProps) {
  const [screen, setScreen] = useState<Screen>('home');
  const [resetKey, setResetKey] = useState(0);

  const handleVideoEnded = useCallback(() => {
    setScreen('recording');
  }, []);

  const handleSave = useCallback(
    async (audioBlob: Blob, duration: number) => {
      const sessionId = getSessionId();
      await onRecordingSaved(audioBlob, duration, sessionId);
    },
    [onRecordingSaved],
  );

  const handleThankYou = useCallback(() => {
    setScreen('thankyou');
  }, []);

  const handleReturnHome = useCallback(() => {
    setScreen('home');
    setResetKey((k) => k + 1);
  }, []);

  return (
    <>
      {screen !== 'thankyou' && (
        <div className="relative min-h-screen snd-identity-bg overflow-hidden">
          {/* Background decorations */}
          <FloatingOrbs />
          <div className="absolute inset-0 bg-snd-950/20 pointer-events-none" />
          <PalmSilhouette className="absolute bottom-0 right-0 w-64 h-64 opacity-30 pointer-events-none" />
          <PalmSilhouette className="absolute bottom-0 left-0 w-48 h-48 opacity-20 pointer-events-none" />

          {/* Hero Section */}
          <section className="relative pt-32 pb-12 px-6 text-center">
            <div className="max-w-4xl mx-auto">
              {/* Decorative star */}
              <div className="flex justify-center mb-6 animate-fade-in">
                <GeometricPattern className="w-16 h-16 text-gold-300 animate-float" />
              </div>

              {/* Main title */}
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-black mb-4 animate-fade-in-up">
                <span className="text-gradient-gold">وش شعورك؟</span>
              </h1>

              {/* Subtitle */}
              <p className="text-lg md:text-xl text-sand-100/60 font-body mb-2 animate-fade-in-up animate-delay-200">
                شاهد الفيديو ثم سجّل مشاعرك بصوتك
              </p>
              <p className="text-sm md:text-base text-gold-300/60 font-body animate-fade-in-up animate-delay-300">
                تجربة تفاعلية بمناسبة اليوم الوطني السعودي 96
              </p>

              <GoldDivider className="mt-8 mb-12 animate-fade-in animate-delay-500" />
            </div>
          </section>

          {/* Video Section */}
          <section className="relative px-6 pb-20">
            <VideoSection onVideoEnded={handleVideoEnded} resetKey={resetKey} />

            <div className="flex flex-col items-center gap-3 mt-10 animate-fade-in-up animate-delay-300">
              <button
                onClick={() => setScreen('recording')}
                className="relative btn-gold min-h-[64px] px-10 md:px-14 text-xl md:text-2xl touch-manipulation no-select group"
                aria-label="تسجيل مشاعرك الآن"
              >
                <span className="absolute inset-0 rounded-2xl border-2 border-gold-300/40 animate-pulse-ring" />
                <Mic className="w-7 h-7 transition-transform duration-300 group-hover:scale-110" />
                <span>سجّل مشاعرك الآن</span>
              </button>
              <p className="text-sand-100/55 text-sm font-body text-center">
                يمكنك التسجيل الآن أو بعد انتهاء الفيديو
              </p>
            </div>
          </section>

          {/* Footer */}
          <footer className="relative pb-8 text-center">
            <p className="text-sand-100/30 text-sm font-body">
              اليوم الوطني السعودي 96 — كل عام والوطن بخير
            </p>
          </footer>
        </div>
      )}

      {/* Recording Modal */}
      <RecordingModal
        open={screen === 'recording'}
        onClose={() => setScreen('home')}
        onSave={handleSave}
        onThankYou={handleThankYou}
      />

      {/* Thank You Screen */}
      {screen === 'thankyou' && <ThankYouScreen onReturnHome={handleReturnHome} />}
    </>
  );
}
