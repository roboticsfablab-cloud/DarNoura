/**
 * Utility functions used across the app.
 */

/** Format seconds into MM:SS or HH:MM:SS */
export function formatDuration(seconds: number): string {
  if (!seconds || isNaN(seconds)) return '00:00';
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const pad = (n: number) => n.toString().padStart(2, '0');
  if (hrs > 0) return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
  return `${pad(mins)}:${pad(secs)}`;
}

/** Format an ISO date string into a readable Arabic-style date/time */
export function formatDateTime(iso: string): string {
  const date = new Date(iso);
  const pad = (n: number) => n.toString().padStart(2, '0');
  let h = date.getHours();
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${pad(h)}:${pad(date.getMinutes())} ${ampm}`;
}

/** Format an ISO date string into a short date */
export function formatDate(iso: string): string {
  const date = new Date(iso);
  const months = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر',
  ];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

/** Generate a short random ID */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

/** Generate a sequential recording number like #024 */
export function formatRecordingNumber(index: number): string {
  return `#${(index + 1).toString().padStart(3, '0')}`;
}

/** Get or create a persistent anonymous session ID */
export function getSessionId(): string {
  const key = 'snd96_participant_id';
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = 'p_' + generateId();
    sessionStorage.setItem(key, id);
  }
  return id;
}
