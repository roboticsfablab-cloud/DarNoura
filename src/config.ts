/**
 * Application Configuration
 * --------------------------------
 * Central place for all configurable values.
 * Change VIDEO_URL here when you have the final video.
 */

// Replace this URL with your final National Day 96 video
export const VIDEO_URL =
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

// The theme / branding text
export const APP_TITLE = 'وش شعورك؟';
export const APP_SUBTITLE = 'تجربة تفاعلية - اليوم الوطني السعودي 96';
export const NATIONAL_DAY_TEXT = 'اليوم الوطني السعودي 96';

// Recording configuration
export const RECORDING_CONFIG = {
  mimeType: 'audio/webm',
  audioBitsPerSecond: 128000,
} as const;

// API base URL — will be set when backend is ready
// Leave empty to use mock API
export const API_BASE_URL = '';

// Storage keys for local mock persistence
export const STORAGE_KEYS = {
  RECORDINGS: 'snd96_recordings',
  PARTICIPANT_ID: 'snd96_participant_id',
} as const;
