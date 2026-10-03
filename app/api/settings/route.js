import { readDb, writeDb } from '@/lib/db';

export async function PUT(req) {
  const { her, me } = await req.json();
  const db = await readDb();
  db.names = { her: String(her || '').trim().slice(0, 60), me: String(me || '').trim().slice(0, 60) };
  await writeDb(db);
  return Response.json(db.names);
}
