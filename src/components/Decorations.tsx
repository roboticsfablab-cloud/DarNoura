/**
 * Decorative SVG patterns and elements inspired by Saudi National Day identity.
 * Used as background overlays and section dividers.
 */

export function GeometricPattern({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <g stroke="currentColor" strokeWidth="0.8" opacity="0.15" fill="none">
        {/* 8-pointed star pattern */}
        <path d="M100 20 L120 80 L180 100 L120 120 L100 180 L80 120 L20 100 L80 80 Z" />
        <path d="M100 40 L115 85 L160 100 L115 115 L100 160 L85 115 L40 100 L85 85 Z" />
        <circle cx="100" cy="100" r="30" />
        <circle cx="100" cy="100" r="50" strokeDasharray="4 4" />
        {/* Radiating lines */}
        <line x1="100" y1="0" x2="100" y2="200" />
        <line x1="0" y1="100" x2="200" y2="100" />
        <line x1="30" y1="30" x2="170" y2="170" />
        <line x1="170" y1="30" x2="30" y2="170" />
      </g>
    </svg>
  );
}

export function GoldDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-4 ${className}`} aria-hidden="true">
      <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold-300/50" />
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 2L14 10L22 12L14 14L12 22L10 14L2 12L10 10Z"
          fill="#C5A572"
          opacity="0.7"
        />
      </svg>
      <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold-300/50" />
    </div>
  );
}

export function PalmSilhouette({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <g opacity="0.08" fill="#C5A572">
        <path d="M60 110 L58 50 L62 50 L60 110Z" />
        <path d="M60 50 Q30 35 15 45 Q25 38 60 50Z" />
        <path d="M60 50 Q90 35 105 45 Q95 38 60 50Z" />
        <path d="M60 48 Q40 25 28 22 Q42 28 60 48Z" />
        <path d="M60 48 Q80 25 92 22 Q78 28 60 48Z" />
        <path d="M60 46 Q55 20 60 12 Q65 20 60 46Z" />
      </g>
    </svg>
  );
}

/** Animated floating decorative orbs for background ambiance */
export function FloatingOrbs() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute top-10 right-10 w-72 h-72 bg-snd-500/10 rounded-full blur-3xl animate-float" />
      <div
        className="absolute bottom-10 left-10 w-96 h-96 bg-gold-400/5 rounded-full blur-3xl animate-float"
        style={{ animationDelay: '2s' }}
      />
      <div
        className="absolute top-1/2 left-1/3 w-64 h-64 bg-snd-400/8 rounded-full blur-3xl animate-float"
        style={{ animationDelay: '4s' }}
      />
    </div>
  );
}
