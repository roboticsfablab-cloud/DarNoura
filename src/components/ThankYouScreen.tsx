import { SNDLogo } from '@/components/SNDLogo';
import { GoldDivider, FloatingOrbs } from '@/components/Decorations';
import { Home } from 'lucide-react';

interface ThankYouScreenProps {
  onReturnHome: () => void;
}

export function ThankYouScreen({ onReturnHome }: ThankYouScreenProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center snd-identity-bg animate-fade-in">
      <FloatingOrbs />
      <div className="absolute inset-0 bg-snd-950/30 pointer-events-none" />
      <div className="relative text-center px-6 animate-scale-in max-w-2xl">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <SNDLogo size={100} className="animate-float" />
          </div>
        </div>

        {/* Saudi flag emoji */}
        <div className="text-6xl mb-4">🇸🇦</div>

        {/* Main message */}
        <h1 className="text-4xl md:text-6xl font-heading font-black text-gradient-gold mb-4">
          شكرًا لمشاركتك
        </h1>
        <p className="text-xl md:text-2xl text-sand-100/70 font-body mb-2">
          صوتك جزء من حكاية وطن.
        </p>

        <GoldDivider className="my-8" />

        <p className="text-sand-100/50 font-body text-lg mb-10">
          تم حفظ تسجيلك بنجاح
        </p>

        {/* Return button */}
        <button
          onClick={onReturnHome}
          className="btn-gold text-lg px-10 py-5 touch-manipulation no-select group"
          aria-label="العودة للصفحة الرئيسية"
        >
          <Home className="w-6 h-6 transition-transform group-hover:scale-110" />
          <span>العودة للصفحة الرئيسية</span>
        </button>
      </div>
    </div>
  );
}
