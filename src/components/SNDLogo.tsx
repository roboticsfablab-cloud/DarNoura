/**
 * Saudi National Day 96 SVG logo / emblem.
 * A decorative geometric star pattern inspired by the Saudi flag emblem (palm + swords)
 * rendered in a modern, minimal style using the national colors.
 */

interface LogoProps {
  className?: string;
  size?: number;
}

export function SNDLogo({ className = '', size = 48 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="شعار اليوم الوطني السعودي 96"
    >
      {/* Outer decorative ring */}
      <circle cx="50" cy="50" r="46" stroke="#C5A572" strokeWidth="1.5" opacity="0.4" />
      <circle cx="50" cy="50" r="42" stroke="#C5A572" strokeWidth="0.5" opacity="0.3" />

      {/* Palm tree stylized */}
      <g transform="translate(50 52)">
        {/* Trunk */}
        <path d="M-2 18 L-1.5 -8 L1.5 -8 L2 18 Z" fill="#C5A572" />
        {/* Fronds */}
        <path d="M0 -10 Q-15 -16 -22 -10 Q-18 -14 0 -10" fill="#2E8B65" />
        <path d="M0 -10 Q15 -16 22 -10 Q18 -14 0 -10" fill="#2E8B65" />
        <path d="M0 -12 Q-8 -22 -14 -22 Q-6 -20 0 -12" fill="#006C35" />
        <path d="M0 -12 Q8 -22 14 -22 Q6 -20 0 -12" fill="#006C35" />
        <path d="M0 -13 Q-4 -24 0 -28 Q4 -24 0 -13" fill="#006C35" />
        {/* Dates */}
        <circle cx="-3" cy="-6" r="1.2" fill="#B8915A" />
        <circle cx="3" cy="-6" r="1.2" fill="#B8915A" />
        <circle cx="-5" cy="-3" r="1" fill="#B8915A" />
        <circle cx="5" cy="-3" r="1" fill="#B8915A" />
      </g>

      {/* Crossed swords (simplified) */}
      <g stroke="#C5A572" strokeWidth="2" strokeLinecap="round" opacity="0.7">
        <line x1="20" y1="78" x2="80" y2="22" />
        <line x1="80" y1="78" x2="20" y2="22" />
      </g>

      {/* "96" text */}
      <text
        x="50"
        y="92"
        textAnchor="middle"
        fontSize="11"
        fontWeight="900"
        fill="#C5A572"
        fontFamily="Tajawal, sans-serif"
      >
        96
      </text>
    </svg>
  );
}
