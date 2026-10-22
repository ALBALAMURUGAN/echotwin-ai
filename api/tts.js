// EchoTwin — Node.js neural voice function. Returns a single MP3.
function chunk(text, max = 180) {
  const parts = [];
  const sentences = text.replace(/\s+/g, ' ').split(/(?<=[.!?।。！？,،])\s*/);
  let cur = '';
  for (const s of sentences) {
    if ((cur + ' ' + s).trim().length <= max) cur = (cur + ' ' + s).trim();
    else {
      if (cur) parts.push(cur);
      if (s.length <= max) cur = s;
      else {
        const words = s.split(' ');
        cur = '';
        for (const w of words) {
          if ((cur + ' ' + w).trim().length <= max) cur = (cur + ' ' + w).trim();
          else {
            if (cur) parts.push(cur);
            cur = w.slice(0, max);
          }
        }
      }
    }
  }
  if (cur) parts.push(cur);
  return parts;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(204).end();
  try {
    const body = req.method === 'POST' ? (typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {}) : req.query;
    const text = String(body.text || '').slice(0, 2000);
    const tl = String(body.tl || 'en');
    if (!text.trim()) return res.status(400).json({ error: 'Missing text' });
    const pieces = chunk(text);
    const buffers = [];
    for (let i = 0; i < pieces.length; i++) {
      const p = pieces[i];
      const url = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${encodeURIComponent(tl)}&total=${pieces.length}&idx=${i}&textlen=${p.length}&q=${encodeURIComponent(p)}`;
      const r = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36',
          Referer: 'https://translate.google.com/',
        },
      });
      if (!r.ok) throw new Error(`Voice upstream ${r.status}`);
      buffers.push(Buffer.from(await r.arrayBuffer()));
    }
    const out = Buffer.concat(buffers);
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', out.length);
    res.setHeader('Cache-Control', 'public, max-age=86400');
    return res.status(200).send(out);
  } catch (e) {
    return res.status(502).json({ error: String(e.message || e) });
  }
}
