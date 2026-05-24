import { API_BASE_URL } from '@/constants/api';

export type FrameScanStatus = 'ignored' | 'saved_no_ai' | 'processed' | 'error';
// error = vision LLM failed; frame may still be in storage

export type UploadFrameResponse = {
  status: FrameScanStatus;
  difference_score: number | null;
  events_saved: number;
  message: string;
};

export type AskResponse = {
  object: string;
  location: string | null;
  confidence: number | null;
  scene_summary: string | null;
  image_url: string | null;
  message: string | null;
  answer: string | null;
  last_seen_location: string | null;
  last_seen_at: string | null;
  last_action: string | null;
  visibility: string | null;
  what_likely_happened: string | null;
  timeline_event_count: number;
};

export async function uploadFrame(imageUri: string): Promise<UploadFrameResponse> {
  const formData = new FormData();
  formData.append('file', {
    uri: imageUri,
    name: `frame-${Date.now()}.jpg`,
    type: 'image/jpeg',
  } as unknown as Blob);

  const response = await fetch(`${API_BASE_URL}/api/upload-frame`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(detail || `Upload failed (${response.status})`);
  }

  return response.json() as Promise<UploadFrameResponse>;
}

export async function askQuestion(question: string): Promise<AskResponse> {
  const response = await fetch(`${API_BASE_URL}/api/ask`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(detail || `Ask failed (${response.status})`);
  }

  return response.json() as Promise<AskResponse>;
}
