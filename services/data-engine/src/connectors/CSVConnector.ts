// services/data-engine/src/connectors/CSVConnector.ts
import csv from 'csv-parser';
import fs from 'fs';
import path from 'path';

interface CSVConfig {
  file_path: string;
  delimiter?: string;
  headers?: string[] | boolean;
  skip_lines?: number;
}

export class CSVConnector {
  private config: CSVConfig;

  constructor(config: CSVConfig) {
    this.config = config;
  }

  async test(): Promise<boolean> {
    try {
      return fs.existsSync(this.config.file_path);
    } catch (error) {
      console.error('CSV file test failed:', error);
      return false;
    }
  }

  async fetch(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const results: any[] = [];

      const parserOptions: any = {};

      if (this.config.delimiter) {
        parserOptions.separator = this.config.delimiter;
      }

      if (this.config.headers !== undefined) {
        parserOptions.headers = this.config.headers;
      }

      if (this.config.skip_lines) {
        parserOptions.skipLines = this.config.skip_lines;
      }

      fs.createReadStream(this.config.file_path)
        .pipe(csv(parserOptions))
        .on('data', (data) => results.push(data))
        .on('end', () => resolve(results))
        .on('error', reject);
    });
  }

  async getFileInfo(): Promise<any> {
    try {
      const stats = fs.statSync(this.config.file_path);
      return {
        file_name: path.basename(this.config.file_path),
        file_path: this.config.file_path,
        file_size: stats.size,
        file_size_mb: (stats.size / 1024 / 1024).toFixed(2),
        created_at: stats.birthtime,
        modified_at: stats.mtime,
        is_file: stats.isFile()
      };
    } catch (error) {
      console.error('Failed to get file info:', error);
      throw error;
    }
  }

  async preview(lines: number = 5): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const results: any[] = [];
      let count = 0;

      fs.createReadStream(this.config.file_path)
        .pipe(csv(this.config.delimiter ? { separator: this.config.delimiter } : {}))
        .on('data', (data) => {
          if (count < lines) {
            results.push(data);
            count++;
          }
        })
        .on('end', () => resolve(results))
        .on('error', reject);
    });
  }

  async disconnect(): Promise<void> {
    // No persistent connection for CSV files
  }
}

// Example usage:
/*
const connector = new CSVConnector({
  file_path: './data/customers.csv',
  delimiter: ',',
  headers: true
});

const exists = await connector.test();
if (exists) {
  const preview = await connector.preview(10);
  console.log('Preview:', preview);

  const allData = await connector.fetch();
  console.log('Total records:', allData.length);
}
*/
