import { put, list } from '@vercel/blob';
export const dynamic = 'force-dynamic';

const NAME = 'response.json';
const S = (v) => String(v ?? '').slice(0, 100);

async function read() {
  try {
    const { blobs } = await list({ prefix: NAME });
    if (!blobs.length) return {};
    const res = await fetch(`${blobs[0].url}?t=${Date.now()}`, { cache: 'no-store' });
    return await res.json();
  } catch { return {}; }
}

export async function GET() {
  return Response.json(await read());
}

export async function POST(req) {
  const b = await req.json();
  const clean = {
    yesAt: S(b.yesAt), nos: Number(b.nos) || 0, gift: S(b.gift),
    dateDay: S(b.dateDay), dateTime: S(b.dateTime),
    extras: Array.isArray(b.extras) ? b.extras.slice(0, 5).map(S) : [],
    updatedAt: new Date().toISOString(),
  };
  await put(NAME, JSON.stringify(clean), {
    access: 'public', addRandomSuffix: false, allowOverwrite: true,
    contentType: 'application/json', cacheControlMaxAge: 60,
  });
  return Response.json(clean);
}
