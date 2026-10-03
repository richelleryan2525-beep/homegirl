import { handleUpload } from '@vercel/blob/client';
import { readDb, writeDb } from '@/lib/db';

// Step 1: the browser uploads the video straight to Vercel Blob (this route issues the token)
export async function POST(req) {
  const body = await req.json();
  const json = await handleUpload({
    body,
    request: req,
    onBeforeGenerateToken: async () => ({
      allowedContentTypes: ['video/*'],
      maximumSizeInBytes: 200 * 1024 * 1024,
      addRandomSuffix: true,
    }),
    onUploadCompleted: async () => {},
  });
  return Response.json(json);
}

// Step 2: the browser tells us the uploaded video's URL so we can remember it
export async function PUT(req) {
  const { url } = await req.json();
  const db = await readDb();
  db.videoUrl = String(url || '');
  await writeDb(db);
  return Response.json({ videoUrl: db.videoUrl });
}
