import { Users, Mic } from 'lucide-react';
import type { RecordingStats } from '@/types';

interface StatsCardsProps {
  stats: RecordingStats;
  loading: boolean;
}

export function StatsCards({ stats, loading }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 md:gap-6">
      {/* Participants count */}
      <div className="glass-card relative overflow-hidden p-6 md:p-8 animate-slide-up">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-l from-snd-400 to-snd-600" />
        <div className="absolute -top-4 -left-4 w-24 h-24 bg-snd-500/10 rounded-full blur-2xl" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-snd-500/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-snd-300" />
            </div>
            <span className="text-sand-100/60 font-body text-sm">عدد المتفاعلين</span>
          </div>
          <div className="text-4xl md:text-5xl font-heading font-black text-gradient-green tabular-nums">
            {loading ? '...' : stats.participantsCount}
          </div>
        </div>
      </div>

      {/* Recordings count */}
      <div className="glass-card relative overflow-hidden p-6 md:p-8 animate-slide-up animate-delay-100">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-l from-gold-300 to-gold-400" />
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-gold-400/10 rounded-full blur-2xl" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gold-400/20 flex items-center justify-center">
              <Mic className="w-5 h-5 text-gold-300" />
            </div>
            <span className="text-sand-100/60 font-body text-sm">عدد التسجيلات</span>
          </div>
          <div className="text-4xl md:text-5xl font-heading font-black text-gradient-gold tabular-nums">
            {loading ? '...' : stats.recordingsCount}
          </div>
        </div>
      </div>
    </div>
  );
}
