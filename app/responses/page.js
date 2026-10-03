'use client';
import { useEffect, useState } from 'react';

const fmt = (iso) => { try { return new Date(iso).toLocaleString(); } catch { return iso; } };

export default function Responses() {
  const [r, setR] = useState(null);
  const load = () => fetch('/api/response').then((x) => x.json()).then(setR);
  useEffect(() => { load(); const t = setInterval(load, 15000); return () => clearInterval(t); }, []);

  const none = !r || !r.yesAt;
  let when = '';
  if (r && r.dateDay) { try { when = new Date(`${r.dateDay}T${r.dateTime || '00:00'}`).toLocaleString([], { dateStyle: 'full', timeStyle: 'short' }); } catch { when = `${r.dateDay} ${r.dateTime}`; } }

  return (
    <main>
      <div className="card pop">
        <p className="big">{none ? '👀' : '💖'}</p>
        <h1 className="script">Her response</h1>
        {none ? <p>No answer yet. This page refreshes by itself.</p> : (
          <div>
            <div className="row2"><span>Answer</span><b>YES ✅ ({fmt(r.yesAt)})</b></div>
            <div className="row2"><span>Times she said No first</span><b>{r.nos}</b></div>
            <div className="row2"><span>Gift she picked</span><b>{r.gift || 'Not yet'}</b></div>
            <div className="row2"><span>Date and time</span><b>{when || 'Not yet'}</b></div>
            <div className="row2"><span>Extra gifts</span><b>{r.extras && r.extras.length ? r.extras.join(', ') : 'Not yet'}</b></div>
            <p style={{ fontSize: 12 }}>Last update: {fmt(r.updatedAt)}</p>
          </div>
        )}
        <button className="go" onClick={load}>Refresh 🔄</button>
      </div>
    </main>
  );
}
