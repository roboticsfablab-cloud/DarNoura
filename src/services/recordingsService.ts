import type { Recording, RecordingStats, UploadRecordingData } from '@/types';
import { STORAGE_KEYS } from '@/config';
import { generateId } from '@/utils/helpers';

/**
 * Mock Recordings Service
 * ========================
 * This is a MOCK implementation that uses localStorage for persistence.
 * It simulates the backend API so the frontend can function during development.
 *
 * === WHEN BACKEND IS READY ===
 * Replace every method body with real HTTP fetch() calls to your backend API.
 * The method signatures and return types should stay the same.
 *
 * Expected backend endpoints:
 *   GET    /api/recordings       → Recording[]
 *   GET    /api/stats            → RecordingStats
 *   POST   /api/recordings       → Recording  (multipart/form-data with audio file)
 *   DELETE /api/recordings/:id   → void
 *   DELETE /api/recordings       → void
 *
 * See README.md for the full API contract.
 */

// Simulate network latency for realistic UX
const MOCK_DELAY = 400;

function delay(ms: number = MOCK_DELAY): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// In-memory cache synced with localStorage
let recordingsCache: Recording[] | null = null;

function loadFromStorage(): Recording[] {
  if (recordingsCache) return recordingsCache;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RECORDINGS);
    recordingsCache = raw ? JSON.parse(raw) : [];
  } catch {
    recordingsCache = [];
  }
  return recordingsCache!;
}

function saveToStorage(recordings: Recording[]): void {
  recordingsCache = recordings;
  try {
    // Note: audioUrls are object URLs that won't survive reload,
    // but metadata will persist. This is acceptable for mock mode.
    localStorage.setItem(STORAGE_KEYS.RECORDINGS, JSON.stringify(recordings));
  } catch {
    // localStorage might be full (audio blobs are large) — ignore in mock mode
  }
}

export const recordingsService = {
  async getRecordings(): Promise<Recording[]> {
    await delay();
    return [...loadFromStorage()].reverse(); // newest first
  },

  async getRecordingStats(): Promise<RecordingStats> {
    await delay(200);
    const recordings = loadFromStorage();
    const participants = new Set(recordings.map((r) => r.sessionId));
    return {
      participantsCount: participants.size,
      recordingsCount: recordings.length,
    };
  },

  async uploadRecording(data: UploadRecordingData): Promise<Recording> {
    await delay(300);
    const recordings = loadFromStorage();
    const audioUrl = URL.createObjectURL(data.audioBlob);
    const recording: Recording = {
      id: generateId(),
      audioUrl,
      duration: data.duration,
      createdAt: new Date().toISOString(),
      sessionId: data.sessionId,
      status: 'saved',
    };
    recordings.push(recording);
    saveToStorage(recordings);
    return recording;
  },

  async deleteRecording(id: string): Promise<void> {
    await delay(200);
    const recordings = loadFromStorage();
    const filtered = recordings.filter((r) => r.id !== id);
    saveToStorage(filtered);
  },

  async deleteAllRecordings(): Promise<void> {
    await delay(300);
    saveToStorage([]);
  },
};
