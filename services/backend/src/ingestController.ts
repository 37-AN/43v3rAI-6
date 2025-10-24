import { FastifyInstance } from 'fastify';
import { ingestCsvFile } from './connectors/csvIngest.js';
import fs from 'fs';
import path from 'path';

export default async function routes(server: FastifyInstance) {
  server.post('/api/ingest/csv', async (request, reply) => {
    const data = request.body as any;
    const filePath = data.filePath;
    if (!filePath || typeof filePath !== 'string') {
        return reply.status(400).send({ error: 'A string `filePath` is required in the request body.' });
    }

    // Basic security check to prevent path traversal
    if (filePath.includes('..')) {
        return reply.status(400).send({ error: 'Invalid file path.' });
    }

    try {
        const rows = await ingestCsvFile(filePath);
        
        // store rows to disk for next RAG step
        const outPath = path.join('data', `ingest-${Date.now()}.json`);
        fs.writeFileSync(outPath, JSON.stringify(rows, null, 2));
        
        server.log.info(`Ingested ${rows.length} rows from ${filePath} to ${outPath}`);
        return { status: 'ok', ingested: rows.length, path: outPath };
    } catch (error: any) {
        if (error.code === 'ENOENT') {
            server.log.error(`File not found at path: ${filePath}`);
            return reply.status(404).send({ error: `File not found at path: ${filePath}` });
        }
        server.log.error(error, `Failed to ingest CSV file from ${filePath}`);
        return reply.status(500).send({ error: 'Failed to process CSV file.' });
    }
  });
}
