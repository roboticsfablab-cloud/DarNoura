import { useState, useEffect, useCallback } from 'react';
import type { Recording, RecordingStats } from '@/types';
import { recordingsService } from '@/services/recordingsService';

/**
 * Hook to manage recordings state with the service layer.
 * Provides loading state, error handling, and CRUD operations.
 */
export function useRecordings() {
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [stats, setStats] = useState<RecordingStats>({ participantsCount: 0, recordingsCount: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      const [recs, st] = await Promise.all([
        recordingsService.getRecordings(),
        recordingsService.getRecordingStats(),
      ]);
      setRecordings(recs);
      setStats(st);
      setError(null);
    } catch {
      setError('تعذر تحميل التسجيلات.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addRecording = useCallback(
    async (audioBlob: Blob, duration: number, sessionId: string) => {
      try {
        const recording = await recordingsService.uploadRecording({
          audioBlob,
          duration,
          sessionId,
        });
        setRecordings((prev) => [recording, ...prev]);
        setStats((prev) => ({
          participantsCount: prev.participantsCount + 1,
          recordingsCount: prev.recordingsCount + 1,
        }));
        return recording;
      } catch {
        setError('فشل رفع التسجيل. تم الاحتفاظ بالتسجيل مؤقتًا.');
        throw new Error('upload_failed');
      }
    },
    [],
  );

  const deleteRecording = useCallback(async (id: string) => {
    try {
      await recordingsService.deleteRecording(id);
      setRecordings((prev) => prev.filter((r) => r.id !== id));
      setStats((prev) => ({
        participantsCount: Math.max(0, prev.participantsCount - 1),
        recordingsCount: Math.max(0, prev.recordingsCount - 1),
      }));
    } catch {
      setError('تعذر حذف التسجيل.');
    }
  }, []);

  const deleteAllRecordings = useCallback(async () => {
    try {
      await recordingsService.deleteAllRecordings();
      setRecordings([]);
      setStats({ participantsCount: 0, recordingsCount: 0 });
    } catch {
      setError('تعذر حذف التسجيلات.');
    }
  }, []);

  return {
    recordings,
    stats,
    loading,
    error,
    refresh,
    addRecording,
    deleteRecording,
    deleteAllRecordings,
  };
}
