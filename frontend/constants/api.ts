/**
 * Backend URL for FastAPI.
 * On a physical phone, use your computer's LAN IP (not localhost).
 * Example: EXPO_PUBLIC_API_URL=http://192.168.1.42:8000
 */
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '') ?? 'http://localhost:8000';
