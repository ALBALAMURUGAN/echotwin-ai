import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, Trash2, Volume2, FileJson, Database, Cloud, CloudOff, Mic, MessagesSquare, Loader2 } from 'lucide-react';
import { Backdrop, PageHero } from '../components/ui';
import { clearEntries, cloudStatus, listEntries, removeEntry, type Entry } from '../lib/db';
import { getLang } from '../lib/languages';
import { downloadText, playVoice, synthesize } from '../lib/engine';

export default function Vault() {
  const [items, setItems] = useState<Entry[]>(() => listEntries());
  const [q, setQ] = useState('');
  const [mode, setMode] = useState<'all' | 'studio' | 'conversation'>('all');
  const [cloud, setCloud] = useState<{ ok: boolean; count: number; engine?: string } | null>(null);
  const [playing, setPlaying] = useState<string | null>(null);

  useEffect(() => {
    cloudStatus().then(setCloud);
  }, []);

  const filtered = useMemo(
    () =>
      items.filter(
        (e) =>
          (mode === 'all' || e.mode === mode) &&
          (!q || `${e.source} ${e.translated} ${getLang(e.from).name} ${getLang(e.to).name}`.toLowerCase().includes(q.toLowerCase())),
      ),
    [items, q, mode],
  );

  const stats = useMemo(() => {
    const langs = new Set(items.flatMap((e) => [e.from, e.to]));
    const avg = items.length ? items.reduce((a, b) => a + b.confidence, 0) / items.length : 0;
    const lat = items.length ? items.reduce((a, b) => a + b.latency, 0) / items.length : 0;
    return { total: items.length, langs: langs.size, avg, lat };
  }, [items]);

  const replay = async (e: Entry) => {
    setPlaying(e.id);
    const v = await synthesize(e.translated, e.to);
    await playVoice(v, e.translated, e.to);
    setPlaying(null);
  };

  return (
    <div className="relative">
      <Backdrop />
      <PageHero eyebrow="Session Vault" title="Every echo," accent="remembered." sub="Each translation is saved to your on-device vault and mirrored to the Python + SQLite ledger. Search, replay and export anytime." />
      <div className="relative mx-auto max-w-7xl px-6 pb-28">
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { l: 'Saved sessions', v: stats.total.toString() },
            { l: 'Languages used', v: stats.langs.toString() },
            { l: 'Avg. confidence', v: `${stats.avg.toFixed(1)}%` },
            { l: 'Avg. translate time', v: `${Math.round(stats.lat)} ms` },
          ].map((s, i) => (
            <motion.div key={s.l} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }} className="rounded-3xl border border-line bg-plum/40 p-6">
              <p className="font-mono text-[10px] uppercase tracking-widest text-mist">{s.l}</p>
              <p className={`mt-3 font-display text-4xl font-bold ${i % 2 ? 'text-lilac' : 'text-sun'}`}>{s.v}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-white/[0.02] px-5 py-3 text-sm">
          <Database className="h-4 w-4 text-sun" />
          <span className="text-mist">Local vault: <span className="text-cream">{items.length} entries</span></span>
          <span className="text-line">|</span>
          {cloud === null ? (
            <span className="flex items-center gap-2 text-mist"><Loader2 className="h-4 w-4 animate-spin" /> checking ledger…</span>
          ) : cloud.ok ? (
            <span className="flex items-center gap-2 text-mist"><Cloud className="h-4 w-4 text-lilac" /> Python ledger online · <span className="text-cream">{cloud.count} records</span> {cloud.engine && `· ${cloud.engine}`}</span>
          ) : (
            <span className="flex items-center gap-2 text-mist"><CloudOff className="h-4 w-4" /> Ledger offline — saving on this device only</span>
          )}
        </div>

        <div className="mt-8 flex flex-col gap-3 md:flex-row md:items-center">
          <div className="flex flex-1 items-center gap-3 rounded-2xl border border-line bg-ink/60 px-4 py-3">
            <Search className="h-4 w-4 text-mist" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search transcripts or languages…" className="flex-1 bg-transparent outline-none placeholder:text-mist/60" />
          </div>
          <div className="flex rounded-2xl border border-line p-1">
            {(['all', 'studio', 'conversation'] as const).map((m) => (
              <button key={m} onClick={() => setMode(m)} className={`rounded-xl px-4 py-2 text-sm capitalize ${mode === m ? 'bg-sun font-semibold text-ink' : 'text-mist hover:text-cream'}`}>
                {m}
              </button>
            ))}
          </div>
          <button
            onClick={() => downloadText(`echotwin-vault-${Date.now()}.json`, JSON.stringify(items, null, 2), 'application/json')}
            disabled={!items.length}
            className="flex items-center justify-center gap-2 rounded-2xl border border-iris/40 px-4 py-3 text-sm text-lilac hover:bg-iris/10 disabled:opacity-40"
          >
            <FileJson className="h-4 w-4" /> Export
          </button>
          <button
            onClick={() => {
              if (confirm('Clear all saved sessions on this device?')) {
                clearEntries();
                setItems([]);
              }
            }}
            disabled={!items.length}
            className="flex items-center justify-center gap-2 rounded-2xl border border-line px-4 py-3 text-sm text-mist hover:text-cream disabled:opacity-40"
          >
            <Trash2 className="h-4 w-4" /> Clear
          </button>
        </div>

        <div className="mt-8 space-y-4">
          {!filtered.length && (
            <div className="rounded-[2rem] border border-dashed border-line p-14 text-center">
              <p className="font-display text-2xl font-bold">{items.length ? 'No matches.' : 'Your vault is empty.'}</p>
              <p className="mt-2 text-mist">{items.length ? 'Try a different search.' : 'Translate something and it will appear here automatically.'}</p>
              {!items.length && (
                <div className="mt-6 flex justify-center gap-3">
                  <Link to="/studio" className="rounded-full bg-sun px-5 py-2.5 text-sm font-semibold text-ink">Open Studio</Link>
                  <Link to="/conversation" className="rounded-full border border-line px-5 py-2.5 text-sm">Conversation</Link>
                </div>
              )}
            </div>
          )}
          <AnimatePresence>
            {filtered.map((e) => (
              <motion.div
                key={e.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -40 }}
                className="group grid gap-4 rounded-[1.75rem] border border-line bg-white/[0.02] p-5 transition hover:border-iris/40 md:grid-cols-[auto_1fr_1fr_auto] md:items-center"
              >
                <span className={`grid h-11 w-11 place-items-center rounded-2xl ${e.mode === 'studio' ? 'bg-sun/15 text-sun' : 'bg-iris/20 text-lilac'}`}>
                  {e.mode === 'studio' ? <Mic className="h-5 w-5" /> : <MessagesSquare className="h-5 w-5" />}
                </span>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-sun">
                    {getLang(e.from).name} {e.speaker && `· Speaker ${e.speaker}`}
                  </p>
                  <p className="mt-1 line-clamp-2">{e.source}</p>
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-lilac">{getLang(e.to).name}</p>
                  <p className="mt-1 line-clamp-2 text-cream/80">{e.translated}</p>
                </div>
                <div className="flex items-center gap-2 md:flex-col md:items-end">
                  <span className="font-mono text-[10px] text-mist">{new Date(e.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
                  <div className="ml-auto flex gap-1 md:ml-0">
                    <button onClick={() => replay(e)} className="rounded-full p-2 text-mist hover:bg-white/5 hover:text-sun" aria-label="Replay">
                      {playing === e.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Volume2 className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={() => {
                        removeEntry(e.id);
                        setItems(listEntries());
                      }}
                      className="rounded-full p-2 text-mist hover:bg-white/5 hover:text-cream"
                      aria-label="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
