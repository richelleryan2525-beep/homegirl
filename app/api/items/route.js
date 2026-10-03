import { readDb, writeDb } from '@/lib/db';
const ok = (t) => t === 'benefits' || t === 'duties';

export async function POST(req) {
  const { type, text } = await req.json();
  const clean = String(text || '').trim().slice(0, 200);
  if (!ok(type) || !clean) return Response.json({ error: 'Bad request' }, { status: 400 });
  const db = await readDb();
  db[type].push(clean);
  await writeDb(db);
  return Response.json(db[type]);
}

export async function DELETE(req) {
  const { type, index } = await req.json();
  if (!ok(type)) return Response.json({ error: 'Bad request' }, { status: 400 });
  const db = await readDb();
  db[type].splice(Number(index), 1);
  await writeDb(db);
  return Response.json(db[type]);
}
