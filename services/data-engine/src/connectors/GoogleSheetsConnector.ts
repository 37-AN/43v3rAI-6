// services/data-engine/src/connectors/GoogleSheetsConnector.ts
import { google } from 'googleapis';

interface GoogleSheetsConfig {
  client_id: string;
  client_secret: string;
  redirect_uri: string;
  refresh_token: string;
  spreadsheet_id: string;
  range?: string;
}

export class GoogleSheetsConnector {
  private sheets: any;
  private config: GoogleSheetsConfig;

  constructor(config: GoogleSheetsConfig) {
    this.config = config;

    const auth = new google.auth.OAuth2(
      config.client_id,
      config.client_secret,
      config.redirect_uri
    );

    auth.setCredentials({
      refresh_token: config.refresh_token
    });

    this.sheets = google.sheets({ version: 'v4', auth });
  }

  async test(): Promise<boolean> {
    try {
      const response = await this.sheets.spreadsheets.get({
        spreadsheetId: this.config.spreadsheet_id
      });
      return response.status === 200;
    } catch (error) {
      console.error('Google Sheets connection test failed:', error);
      return false;
    }
  }

  async fetch(): Promise<any[]> {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.config.spreadsheet_id,
        range: this.config.range || 'A1:Z1000'
      });

      const rows = response.data.values || [];
      if (rows.length === 0) return [];

      // First row is headers
      const headers = rows[0];
      const data = rows.slice(1).map((row: any[]) => {
        const record: any = {};
        headers.forEach((header: string, index: number) => {
          record[header] = row[index] || null;
        });
        return record;
      });

      return data;
    } catch (error) {
      console.error('Failed to fetch from Google Sheets:', error);
      throw error;
    }
  }

  async getSpreadsheetInfo(): Promise<any> {
    try {
      const response = await this.sheets.spreadsheets.get({
        spreadsheetId: this.config.spreadsheet_id
      });
      return {
        title: response.data.properties?.title,
        sheets: response.data.sheets?.map((sheet: any) => ({
          title: sheet.properties?.title,
          sheetId: sheet.properties?.sheetId,
          rowCount: sheet.properties?.gridProperties?.rowCount,
          columnCount: sheet.properties?.gridProperties?.columnCount
        }))
      };
    } catch (error) {
      console.error('Failed to get spreadsheet info:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    // No persistent connection to close for Google Sheets API
    this.sheets = null;
  }
}

// Example usage:
/*
const connector = new GoogleSheetsConnector({
  client_id: process.env.GOOGLE_CLIENT_ID!,
  client_secret: process.env.GOOGLE_CLIENT_SECRET!,
  redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
  refresh_token: 'your-refresh-token',
  spreadsheet_id: 'your-spreadsheet-id',
  range: 'Sheet1!A1:Z1000'
});

const isConnected = await connector.test();
if (isConnected) {
  const data = await connector.fetch();
  console.log('Fetched', data.length, 'records');
}
*/
