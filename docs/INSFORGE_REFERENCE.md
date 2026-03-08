# InsForge reference (from docs.insforge.dev)

> Fetched from [InsForge Docs](https://docs.insforge.dev). For the full index use: https://docs.insforge.dev/llms.txt

## What is InsForge

- **AI-optimized Backend-as-a-Service**: PostgreSQL, JWT auth, S3-compatible storage.
- Connect via MCP or use the SDK; every endpoint is agent-friendly with consistent patterns.

## Client setup

```javascript
import { createClient } from '@insforge/sdk';

const insforge = createClient({
  baseUrl: 'https://your-app.insforge.app',
  anonKey: 'your-anon-key'  // Optional
});
```

## Storage SDK

### Get a bucket

```javascript
const bucket = insforge.storage.from('bucket-name');
```

### upload(path, file)

Upload with a specific key. Returns `{ data: { bucket, key, size, mimeType, uploadedAt, url }, error }`.  
If a file with the same key exists, the backend auto-renames. **Save both `url` and `key` to your database.**

### uploadAuto(file)

Upload with auto-generated unique key. Same return shape as `upload()`.  
**Save both `url` and `key` to your database.**

Example return:

```json
{
  "data": {
    "bucket": "uploads",
    "key": "myfile-1705315200000-abc123.jpg",
    "size": 45678,
    "mimeType": "image/jpeg",
    "uploadedAt": "2024-01-15T10:30:00Z",
    "url": "https://your-app.region.insforge.app/api/storage/buckets/uploads/objects/myfile-1705315200000-abc123.jpg"
  },
  "error": null
}
```

### download(path)

Returns `{ data: Blob | null, error }`. Use the stored `key` as `path`.

### remove(path)

Deletes the file. Use the stored `key` as `path`.

## For this chat app

- **Bucket**: Create a bucket named `chat-attachments` in Insforge dashboard → **Storage** (or set `NEXT_PUBLIC_CHAT_ATTACHMENTS_BUCKET`).
- **Database**: `messages` table should have nullable columns: `attachment_url`, `attachment_name`, `attachment_type`.
- **Usage**: `insforge.storage.from('chat-attachments').uploadAuto(file)` then store `data.url`, `data.key` (and filename/type) in `messages`.

## Docs index

- Full index for LLMs: https://docs.insforge.dev/llms.txt  
- Storage SDK: https://docs.insforge.dev/core-concepts/storage/sdk  
- Main docs: https://docs.insforge.dev
