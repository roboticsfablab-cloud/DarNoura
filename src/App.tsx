import { useState, useCallback } from 'react';
import { Header } from '@/components/Header';
import { HomePage } from '@/pages/HomePage';
import { RecordingsPage } from '@/pages/RecordingsPage';
import { useRecordings } from '@/hooks/useRecordings';

type Page = 'home' | 'recordings';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const { addRecording } = useRecordings();

  const handleRecordingSaved = useCallback(
    async (audioBlob: Blob, duration: number, sessionId: string) => {
      await addRecording(audioBlob, duration, sessionId);
    },
    [addRecording],
  );

  return (
    <div className="min-h-screen bg-snd-950 text-sand-50">
      <Header currentPage={currentPage} onNavigate={setCurrentPage} />

      {currentPage === 'home' ? (
        <HomePage onRecordingSaved={handleRecordingSaved} />
      ) : (
        <RecordingsPage />
      )}
    </div>
  );
}
