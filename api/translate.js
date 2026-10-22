// EchoTwin — Node.js translation edge function
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(204).end();
  try {
    const body = req.method === 'POST' ? (typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {}) : req.query;
    const q = String(body.q || '').slice(0, 4000);
    const sl = String(body.sl || 'auto');
    const tl = String(body.tl || 'en');
    if (!q.trim()) return res.status(400).json({ error: 'Missing text' });
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${encodeURIComponent(sl)}&tl=${encodeURIComponent(tl)}&dt=t&q=${encodeURIComponent(q)}`;
    const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 EchoTwin' } });
    if (!r.ok) throw new Error(`Upstream ${r.status}`);
    const data = await r.json();
    const text = (data[0] || []).map((s) => s[0]).join('');
    return res.status(200).json({ text, detected: data[2], engine: 'echotwin-node' });
  } catch (e) {
    return res.status(502).json({ error: String(e.message || e) });
  }
}
