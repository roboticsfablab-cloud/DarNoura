import { useRef, useState, useCallback } from 'react';
import { Trash2, Mic, RefreshCw } from 'lucide-react';
import { useRecordings } from '@/hooks/useRecordings';
import { StatsCards } from '@/components/StatsCards';
import { RecordingCard } from '@/components/RecordingCard';
import { ConfirmModal } from '@/components/ConfirmModal';
import { GoldDivider, FloatingOrbs } from '@/components/Decorations';

export function RecordingsPage() {
  const { recordings, stats, loading, error, deleteRecording, deleteAllRecordings, refresh } =
    useRecordings();
  const [playingId, setPlayingId] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [confirmDeleteAll, setConfirmDeleteAll] = useState(false);

  // Keep refs to all audio elements so we can pause others
  const audioElementsRef = useRef<Map<string, HTMLAudioElement>>(new Map());

  const handlePlay = useCallback((id: string) => {
    // Pause all other audio elements
    audioElementsRef.current.forEach((audio, key) => {
      if (key !== id) {
        audio.pause();
      }
    });
    setPlayingId(id);
  }, []);

  const setAudioRef = useCallback((el: HTMLAudioElement | null) => {
    // We need the recording id to track, but RecordingCard passes el only
    // We'll track by src
    if (el) {
      const src = el.src;
      audioElementsRef.current.set(src, el);
    }
  }, []);

  const handleDelete = useCallback(
    async (id: string) => {
      await deleteRecording(id);
      setConfirmDelete(null);
      if (playingId === id) setPlayingId('');
    },
    [deleteRecording, playingId],
  );

  const handleDeleteAll = useCallback(async () => {
    await deleteAllRecordings();
    setConfirmDeleteAll(false);
    setPlayingId('');
  }, [deleteAllRecordings]);

  return (
    <div className="relative min-h-screen snd-identity-bg pt-24 pb-12 px-6 overflow-hidden">
      <FloatingOrbs />
      <div className="absolute inset-0 bg-snd-950/20 pointer-events-none" />

      <div className="relative max-w-4xl mx-auto">
        {/* Page header */}
        <div className="text-center mb-8 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-heading font-black text-gradient-gold mb-2">
            التسجيلات
          </h1>
          <p className="text-sand-100/50 font-body">
            جميع التسجيلات الصوتية من المتفاعلين
          </p>
        </div>

        {/* Stats */}
        <div className="mb-8">
          <StatsCards stats={stats} loading={loading} />
        </div>

        <GoldDivider className="mb-8" />

        {/* Error message */}
        {error && (
          <div className="glass-card p-4 mb-6 text-center text-red-300 font-body text-sm border-red-500/20">
            {error}
          </div>
        )}

        {/* Actions bar */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-heading font-bold text-sand-50">
            قائمة التسجيلات
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={refresh}
              className="btn-ghost text-sm px-4 py-2 touch-manipulation no-select"
              aria-label="تحديث"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">تحديث</span>
            </button>
            {recordings.length > 0 && (
              <button
                onClick={() => setConfirmDeleteAll(true)}
                className="btn-danger text-sm px-4 py-2 touch-manipulation no-select"
                aria-label="حذف جميع التسجيلات"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">حذف الكل</span>
              </button>
            )}
          </div>
        </div>

        {/* Recordings list */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="glass-card p-6 animate-pulse"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-snd-500/20" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-24 bg-snd-500/20 rounded" />
                    <div className="h-2 w-16 bg-snd-500/10 rounded" />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-snd-500/20" />
                  <div className="flex-1 h-2 bg-snd-500/10 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : recordings.length === 0 ? (
          <div className="glass-card p-12 text-center animate-fade-in-up">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-snd-500/10 flex items-center justify-center">
                <Mic className="w-8 h-8 text-snd-300/40" />
              </div>
            </div>
            <h3 className="text-lg font-heading font-bold text-sand-100/60 mb-2">
              لا توجد تسجيلات بعد
            </h3>
            <p className="text-sand-100/40 font-body text-sm">
              ستظهر التسجيلات هنا بعد أن يشارك المتفاعلون مشاعرهم
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {recordings.map((recording, index) => (
              <RecordingCard
                key={recording.id}
                recording={recording}
                index={index}
                onDelete={(id) => setConfirmDelete(id)}
                isPlaying={playingId === recording.id}
                onPlay={handlePlay}
                audioRef={setAudioRef}
              />
            ))}
          </div>
        )}
      </div>

      {/* Confirm delete single */}
      <ConfirmModal
        open={confirmDelete !== null}
        title="هل أنت متأكد من حذف هذا التسجيل؟"
        message="سيتم حذف هذا التسجيل نهائيًا ولا يمكن التراجع عن هذا الإجراء."
        confirmLabel="حذف التسجيل"
        cancelLabel="إلغاء"
        onConfirm={() => confirmDelete && handleDelete(confirmDelete)}
        onCancel={() => setConfirmDelete(null)}
        danger
      />

      {/* Confirm delete all */}
      <ConfirmModal
        open={confirmDeleteAll}
        title="هل أنت متأكد؟"
        message="سيتم حذف جميع التسجيلات ولا يمكن التراجع عن هذا الإجراء."
        confirmLabel="حذف الكل"
        cancelLabel="إلغاء"
        onConfirm={handleDeleteAll}
        onCancel={() => setConfirmDeleteAll(false)}
        danger
      />
    </div>
  );
}
