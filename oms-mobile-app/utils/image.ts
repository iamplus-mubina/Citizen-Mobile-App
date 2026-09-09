import { BASE_URL } from '@/services/api';

/**
 * Safely resolves any photo representation (string, JSON string, Array of objects/strings, or object)
 * into a valid, single image URI string, or null.
 * Automatically resolves relative server paths (e.g. "citizen-complaints/...") to full downloadable URLs.
 * Prevents React Native Android RCTImageView from crashing with:
 * "Value for uri cannot be cast from ReadableNativeArray to String"
 */
export function getCleanImageUrl(photo: any): string | null {
  if (!photo) return null;

  // If array, inspect the first item
  if (Array.isArray(photo)) {
    if (photo.length === 0) return null;
    return getCleanImageUrl(photo[0]);
  }

  // If object, look for url, access_url, uri, path
  if (typeof photo === 'object') {
    return getCleanImageUrl(photo.url || photo.access_url || photo.uri || photo.path);
  }

  // If string, handle JSON arrays/objects or direct URLs
  if (typeof photo === 'string') {
    const trimmed = photo.trim();
    if (
      !trimmed ||
      trimmed === '[]' ||
      trimmed === '{}' ||
      trimmed === 'null' ||
      trimmed === 'undefined' ||
      trimmed === '[object Object]'
    ) {
      return null;
    }

    if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
      try {
        const parsed = JSON.parse(trimmed);
        return getCleanImageUrl(parsed);
      } catch {
        return null;
      }
    }

    // Direct web or local file URI
    if (
      trimmed.startsWith('http://') ||
      trimmed.startsWith('https://') ||
      trimmed.startsWith('file://') ||
      trimmed.startsWith('content://') ||
      trimmed.startsWith('data:')
    ) {
      // Fix if system-config was incorrectly routed to file2 in an existing full URL
      if (trimmed.includes('/file-uploader/file2?path=system-config')) {
        return trimmed.replace('/file-uploader/file2?path=', '/file-uploader/downloadS3?path=');
      }
      return trimmed;
    }

    // Relative server path from file-uploader
    // citizen-complaints are saved locally via upload2 and served via file2
    // system-config (branding images) and other entities are in S3 and served via downloadS3
    const baseUrl = BASE_URL;
    const endpoint = trimmed.startsWith('citizen-complaints/') ? 'file2' : 'downloadS3';
    return `${baseUrl}/file-uploader/${endpoint}?path=${encodeURIComponent(trimmed)}`;
  }

  return null;
}
