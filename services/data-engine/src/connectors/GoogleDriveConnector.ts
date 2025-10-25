/**
 * Google Drive Connector
 *
 * Connects to Google Drive API to sync files and documents
 */

import { BaseConnector, ConnectorInstance } from './ConnectorRegistry';

export interface GoogleDriveConfig {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  folderId?: string; // Optional: specific folder to sync
  fileTypes?: string[]; // Optional: filter by file types
}

export class GoogleDriveConnector extends BaseConnector {
  id = 'google-drive';
  name = 'Google Drive';
  type = 'saas' as const;
  description = 'Sync files and documents from Google Drive';
  icon = '📁';

  configSchema = {
    type: 'object',
    properties: {
      clientId: { type: 'string', required: true },
      clientSecret: { type: 'string', required: true },
      refreshToken: { type: 'string', required: true },
      folderId: { type: 'string' },
      fileTypes: { type: 'array', items: { type: 'string' } },
    },
  };

  protected async createInstance(config: GoogleDriveConfig): Promise<ConnectorInstance> {
    return new GoogleDriveInstance(this.id, config);
  }
}

class GoogleDriveInstance implements ConnectorInstance {
  id: string;
  connectorId: string;
  config: GoogleDriveConfig;
  isConnected: boolean = false;
  private accessToken: string | null = null;
  private tokenExpiry: Date | null = null;

  constructor(connectorId: string, config: GoogleDriveConfig) {
    this.id = `gd_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.connectorId = connectorId;
    this.config = config;
  }

  /**
   * Test the connection to Google Drive
   */
  async test(): Promise<boolean> {
    try {
      await this.ensureAuthenticated();

      // Test API call: get user info
      const response = await fetch('https://www.googleapis.com/drive/v3/about?fields=user', {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Google Drive API error: ${response.statusText}`);
      }

      this.isConnected = true;
      return true;
    } catch (error) {
      console.error('[Google Drive] Connection test failed:', error);
      this.isConnected = false;
      return false;
    }
  }

  /**
   * Fetch files from Google Drive
   */
  async fetch(params?: { pageSize?: number; pageToken?: string }): Promise<any[]> {
    await this.ensureAuthenticated();

    const pageSize = params?.pageSize || 100;
    const pageToken = params?.pageToken;

    // Build query
    let query = "trashed = false";

    if (this.config.folderId) {
      query += ` and '${this.config.folderId}' in parents`;
    }

    if (this.config.fileTypes && this.config.fileTypes.length > 0) {
      const mimeTypeQuery = this.config.fileTypes
        .map(type => `mimeType = '${this.getMimeType(type)}'`)
        .join(' or ');
      query += ` and (${mimeTypeQuery})`;
    }

    // Fetch files
    const url = new URL('https://www.googleapis.com/drive/v3/files');
    url.searchParams.set('q', query);
    url.searchParams.set('pageSize', pageSize.toString());
    url.searchParams.set('fields', 'nextPageToken, files(id, name, mimeType, createdTime, modifiedTime, size, owners, webViewLink)');

    if (pageToken) {
      url.searchParams.set('pageToken', pageToken);
    }

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch files: ${response.statusText}`);
    }

    const data = await response.json();

    // Transform files to standard format
    const files = data.files.map((file: any) => ({
      id: file.id,
      name: file.name,
      type: file.mimeType,
      size: file.size ? parseInt(file.size) : 0,
      createdAt: new Date(file.createdTime),
      modifiedAt: new Date(file.modifiedTime),
      owner: file.owners?.[0]?.emailAddress,
      url: file.webViewLink,
      source: 'google-drive',
    }));

    console.log(`[Google Drive] Fetched ${files.length} files`);

    return files;
  }

  /**
   * Download file content
   */
  async downloadFile(fileId: string): Promise<string> {
    await this.ensureAuthenticated();

    // Get file metadata first
    const metaUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?fields=mimeType`;
    const metaResponse = await fetch(metaUrl, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
      },
    });

    if (!metaResponse.ok) {
      throw new Error(`Failed to get file metadata: ${metaResponse.statusText}`);
    }

    const metadata = await metaResponse.json();
    const mimeType = metadata.mimeType;

    // Handle Google Docs, Sheets, Slides (export as text/csv)
    let downloadUrl: string;
    if (mimeType.includes('google-apps')) {
      const exportType = this.getExportMimeType(mimeType);
      downloadUrl = `https://www.googleapis.com/drive/v3/files/${fileId}/export?mimeType=${exportType}`;
    } else {
      downloadUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
    }

    const response = await fetch(downloadUrl, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to download file: ${response.statusText}`);
    }

    return await response.text();
  }

  /**
   * Disconnect and cleanup
   */
  async disconnect(): Promise<void> {
    this.isConnected = false;
    this.accessToken = null;
    this.tokenExpiry = null;
    console.log('[Google Drive] Disconnected');
  }

  // Private helper methods

  private async ensureAuthenticated(): Promise<void> {
    // Check if token is expired
    if (this.accessToken && this.tokenExpiry && this.tokenExpiry > new Date()) {
      return;
    }

    // Refresh access token
    await this.refreshAccessToken();
  }

  private async refreshAccessToken(): Promise<void> {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        refresh_token: this.config.refreshToken,
        grant_type: 'refresh_token',
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to refresh token: ${response.statusText}`);
    }

    const data = await response.json();
    this.accessToken = data.access_token;

    // Set expiry (usually 3600 seconds, subtract 5 minutes for safety)
    const expiresIn = data.expires_in || 3600;
    this.tokenExpiry = new Date(Date.now() + (expiresIn - 300) * 1000);

    console.log('[Google Drive] Access token refreshed');
  }

  private getMimeType(fileType: string): string {
    const mimeTypes: Record<string, string> = {
      'doc': 'application/vnd.google-apps.document',
      'sheet': 'application/vnd.google-apps.spreadsheet',
      'slide': 'application/vnd.google-apps.presentation',
      'pdf': 'application/pdf',
      'txt': 'text/plain',
      'csv': 'text/csv',
    };

    return mimeTypes[fileType] || fileType;
  }

  private getExportMimeType(googleMimeType: string): string {
    const exportTypes: Record<string, string> = {
      'application/vnd.google-apps.document': 'text/plain',
      'application/vnd.google-apps.spreadsheet': 'text/csv',
      'application/vnd.google-apps.presentation': 'text/plain',
    };

    return exportTypes[googleMimeType] || 'text/plain';
  }
}

// Export the connector class
export default GoogleDriveConnector;
