import { readDb } from '@/lib/db';
export const dynamic = 'force-dynamic';

export async function GET() {
  const db = await readDb();
  return Response.json({ names: db.names, benefits: db.benefits, duties: db.duties, videoUrl: db.videoUrl || null });
}
