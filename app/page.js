'use client';
import { useEffect, useState } from 'react';

// ✏️ Type her name and your name between the quotes, then save.
const HER = 'OCHUWA';
const ME = 'PRINCE';

const LEVELS = [
  ['💌', 'will you be my Home Girl?', 'This is my official application. Please be gentle with my heart.'],
  ['🥺', 'Are you sure?', "Think again... I'll wait right here."],
  ['😢', 'Please reconsider', "I'll even share my fries."],
  ['🐶', 'Look at this puppy face', "He's sad because of you."],
  ['😭', "I'm begging now", 'The No button is shrinking out of shame.'],
  ['🍕', 'Pizza on me. Forever.', 'Still no? Bold.'],
  ['💔', "You're breaking my heart", 'The Yes button is getting bigger for a reason...'],
  ['🙏', 'One more chance', "There's only one right answer, beautiful."],
  ['🫠', "I'm melting", 'Just press the big button, bestie.'],
];
const GIFTS = [
  { id: 'Romantic couple date', e: '🌹', d: 'Candlelight, soft music and just the two of us.', c: 'g1' },
  { id: 'Ice date', e: '🍧', d: 'Something cool and sweet: ice cream, ice skating or both.', c: 'g2' },
  { id: 'Surprise date', e: '🎁', d: "You won't know until we get there.", c: 'g3' },
];
const EXTRAS = [
  { id: 'Ice cream tomorrow', e: '🍦', d: "I'll get you ice cream tomorrow.", c: 'g4' },
  { id: 'A surprise from me', e: '🎀', d: 'Something little, just for you.', c: 'g1' },
];

export default function Home() {
  const [tab, setTab] = useState('intro');
  const [stage, setStage] = useState('letter');
  const [lvl, setLvl] = useState(0);
  const [count, setCount] = useState(0);
  const [s, setS] = useState({ benefits: [], duties: [] });
  const [text, setText] = useState('');
  const [hearts, setHearts] = useState([]);
  const [resp, setResp] = useState({});
  const [day, setDay] = useState('');
  const [time, setTime] = useState('');
  const [extras, setExtras] = useState([]);

  const her = HER || 'beautiful';
  const me = ME || 'Your Home Boy';
  const today = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);

  useEffect(() => {
    fetch('/api/state').then((r) => r.json()).then(setS);
    setHearts(Array.from({ length: 14 }, (_, i) => ({
      e: ['💗', '💖', '🌸', '✨'][i % 4], left: i * 7 + Math.random() * 5,
      size: 14 + Math.random() * 20, dur: 9 + Math.random() * 10, delay: -Math.random() * 15,
    })));
  }, []);

  async function api(url, method, body) {
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    return res.ok ? res.json() : null;
  }
  function save(patch) {
    const next = { ...resp, ...patch };
    setResp(next);
    api('/api/response', 'POST', next).catch(() => {});
  }
  async function addItem(type) {
    if (!text.trim()) return;
    const list = await api('/api/items', 'POST', { type, text });
    if (list) { setS({ ...s, [type]: list }); setText(''); }
  }
  async function removeItem(type, index) {
    const list = await api('/api/items', 'DELETE', { type, index });
    if (list) setS({ ...s, [type]: list });
  }

  function List({ type, title, emoji }) {
    return (
      <div className="card pop">
        <p className="big">{emoji}</p>
        <h1 className="script">{title}</h1>
        <ul>
          {s[type].map((x, i) => (
            <li key={i}><span>{x}</span><button aria-label="Remove" onClick={() => removeItem(type, i)}>✕</button></li>
          ))}
        </ul>
        <div className="add">
          <input type="text" value={text} placeholder="Add something sweet" onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addItem(type)} />
          <button onClick={() => addItem(type)}>Add</button>
        </div>
      </div>
    );
  }

  function Letter() {
    const lines = [
      `Dear ${her},`,
      'Somewhere between the random laughs and the late-night talks, you became my favorite person to have around.',
      <>So with a nervous heart and a big smile, I'm writing you this application letter to be considered for the position of <b>your Home Boy</b>.</>,
      'I promise loyalty, good vibes, snacks, and a shoulder whenever you need one. 🌹',
      'Please read on, and be kind to my heart. 💖',
      <>Yours always,<br /><span style={{ fontSize: 32 }}>{me}</span></>,
    ];
    return (
      <div className="card pop">
        <div className="letter script">{lines.map((t, i) => <p key={i} style={{ animationDelay: `${i * 0.9}s` }}>{t}</p>)}</div>
        <div style={{ marginTop: 20 }}>
          <button className="go" style={{ opacity: 0, animation: `fade .8s ${lines.length * 0.9}s forwards` }} onClick={() => setStage('ask')}>Next 💌</button>
        </div>
      </div>
    );
  }

  function Ask() {
    const L = LEVELS[lvl], ys = Math.min(18 + lvl * 7, 70), np = Math.max(14 - lvl * 1.5, 4), nf = Math.max(15 - lvl * 1.4, 5);
    return (
      <div className="card pop" key={lvl} style={lvl >= 6 ? { padding: '24px 8px' } : {}}>
        <p className="big">{L[0]}</p>
        <h1 className="script">{lvl === 0 ? `${her}, ` : ''}{L[1]}</h1>
        <p>{L[2]}</p>
        <div className="btns">
          <button className="yes" style={{ fontSize: ys, padding: `${ys * 0.6}px ${ys * 1.3}px` }} onClick={() => { save({ yesAt: new Date().toISOString(), nos: count }); setStage('yes'); }}>Yes 💖</button>
          <button className="no" style={{ fontSize: nf, padding: `${np * 0.6}px ${np}px` }} onClick={() => { setLvl(Math.min(lvl + 1, LEVELS.length - 1)); setCount(count + 1); }}>No</button>
        </div>
        <p style={{ fontSize: 12, margin: '12px 0 0' }}>Page {lvl + 1} · Nos: {count}</p>
      </div>
    );
  }

  function Yes() {
    return (
      <div className="card pop">
        <p className="big">🎉</p>
        <h1 className="script">She said YES!</h1>
        <p>Welcome to the family, {her}. 💖<br />Now pick a gift you'd love.</p>
        <button className="go" onClick={() => setStage('gift')}>Pick my gift 🎁</button>
      </div>
    );
  }

  function Gift() {
    return (
      <div className="card pop">
        <p className="big">🎁</p>
        <h1 className="script">Choose your gift</h1>
        <p>Pick the date you want most.</p>
        <div className="gifts">
          {GIFTS.map((g) => (
            <button key={g.id} className={`gift ${g.c}`} onClick={() => { save({ gift: g.id }); setStage('when'); }}>
              <span className="e">{g.e}</span><span><b>{g.id}</b>{g.d}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  function When() {
    const ready = day && time;
    return (
      <div className="card pop">
        <p className="big">📅</p>
        <h1 className="script">When shall we go?</h1>
        <p>You picked the <b>{resp.gift}</b>. Choose the day and time that work for you.</p>
        <div className="field"><label>Day</label><input type="date" min={today} value={day} onChange={(e) => setDay(e.target.value)} /></div>
        <div className="field"><label>Time</label><input type="time" value={time} onChange={(e) => setTime(e.target.value)} /></div>
        <button className="go" style={{ opacity: ready ? 1 : 0.5 }} disabled={!ready} onClick={() => { save({ dateDay: day, dateTime: time }); setStage('gift2'); }}>Lock it in 💖</button>
      </div>
    );
  }

  function Gift2() {
    const toggle = (id) => setExtras(extras.includes(id) ? extras.filter((x) => x !== id) : [...extras, id]);
    return (
      <div className="card pop">
        <p className="big">🍦</p>
        <h1 className="script">Two more gifts</h1>
        <p>Tap the ones you want. You can take both!</p>
        <div className="gifts">
          {EXTRAS.map((g) => (
            <button key={g.id} className={`gift ${g.c} ${extras.includes(g.id) ? 'sel' : ''}`} onClick={() => toggle(g.id)}>
              <span className="e">{g.e}</span><span><b>{g.id} {extras.includes(g.id) ? '✓' : ''}</b>{g.d}</span>
            </button>
          ))}
        </div>
        <button className="go" onClick={() => { save({ extras }); setStage('done'); }}>All done 💖</button>
      </div>
    );
  }

  function Done() {
    return (
      <div className="card pop">
        <p className="big">💖</p>
        <h1 className="script">Can't wait, {her}!</h1>
        <p>Your {resp.gift} is set for {day} at {time}.{extras.length ? ` Plus: ${extras.join(' and ')}.` : ''}</p>
        <div className="btns" style={{ minHeight: 0 }}>
          <button className="yes" onClick={() => setTab('benefits')}>See my benefits 🎁</button>
          <button className="no" onClick={() => setTab('duties')}>See my duties 📋</button>
        </div>
      </div>
    );
  }

  const pages = { letter: Letter, ask: Ask, yes: Yes, gift: Gift, when: When, gift2: Gift2, done: Done };

  return (
    <>
      <div id="hearts">
        {hearts.map((h, i) => <span key={i} style={{ left: `${h.left}%`, fontSize: h.size, animationDuration: `${h.dur}s`, animationDelay: `${h.delay}s` }}>{h.e}</span>)}
      </div>
      <nav>
        {[['intro', '💌 Our Story'], ['benefits', '🎁 Benefits'], ['duties', '📋 Duties']].map(([k, t]) => (
          <button key={k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>{t}</button>
        ))}
      </nav>
      <main>
        {tab === 'benefits' ? List({ type: 'benefits', title: 'Home Girl Benefits', emoji: '🎁' })
          : tab === 'duties' ? List({ type: 'duties', title: 'Home Girl Duties', emoji: '📋' })
          : pages[stage]()}
      </main>
    </>
  );
}
