import { put, list } from '@vercel/blob';

const seed = {
  names: { her: '', me: '' },
  benefits: ['Free snacks 🍟', 'Last-minute ride to anywhere 🚗', 'Unlimited venting sessions 🎧', 'Protected from my bad jokes (partially) 😅'],
  duties: ['Reply to my texts within 24 hrs 📱', 'Approve my outfits 👕', 'Share the good gossip ☕', 'Be the loudest at my wins 🎉'],
  videoUrl: null,
};

export async function readDb() {
  try {
    const { blobs } = await list({ prefix: 'db.json' });
    if (!blobs.length) return structuredClone(seed);
    const res = await fetch(`${blobs[0].url}?t=${Date.now()}`, { cache: 'no-store' });
    return await res.json();
  } catch { return structuredClone(seed); }
}

export async function writeDb(d) {
  await put('db.json', JSON.stringify(d), {
    access: 'public', addRandomSuffix: false, allowOverwrite: true,
    contentType: 'application/json', cacheControlMaxAge: 60,
  });
}
