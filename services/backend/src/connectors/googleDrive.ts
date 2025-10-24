/**
 * googleDrive.ts - simple helper to list files using an API key / OAuth token
 * NOTE: Use OAuth2 if real Drive access is needed. For prototype use, allow pulling files from a 'shareable link' or local upload.
 */
import axios from 'axios';

export async function listFiles(apiKeyOrToken: string) {
  // placeholder — for prototyping, return mock data
  return [{ id: '1', name: 'sample_financials.csv', mimeType: 'text/csv' }];
}
