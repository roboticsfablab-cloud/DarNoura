/**
 * Type definitions for the Saudi National Day 96 recording experience.
 * These types define the contract between the frontend and the future backend API.
 */

export interface Recording {
  /** Unique identifier for the recording */
  id: string;
  /** Object URL or remote URL for the audio file */
  audioUrl: string;
  /** Duration of the recording in seconds */
  duration: number;
  /** ISO timestamp of when the recording was created */
  createdAt: string;
  /** Anonymous session/participant identifier */
  sessionId: string;
  /** Status of the recording */
  status: RecordingStatus;
}

export type RecordingStatus = 'saved' | 'uploading' | 'failed';

export interface RecordingStats {
  /** Total number of unique participants who interacted */
  participantsCount: number;
  /** Total number of recordings */
  recordingsCount: number;
}

export interface UploadRecordingData {
  /** The audio Blob from MediaRecorder */
  audioBlob: Blob;
  /** Duration in seconds */
  duration: number;
  /** Anonymous session identifier */
  sessionId: string;
}

/**
 * API service interface — defines the contract the backend must implement.
 * The mock implementation lives in services/recordingsService.ts.
 * Replace the mock with real HTTP calls when the backend is ready.
 */
export interface RecordingsApi {
  getRecordings(): Promise<Recording[]>;
  getRecordingStats(): Promise<RecordingStats>;
  uploadRecording(data: UploadRecordingData): Promise<Recording>;
  deleteRecording(id: string): Promise<void>;
  deleteAllRecordings(): Promise<void>;
}
