import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Mic, Square, Volume2, Send, Trash2, FileDown, Loader2, AlertTriangle, ArrowLeftRight } from 'lucide-react';
import LangSelect from '../components/LangSelect';
import { Backdrop, PageHero, Waveform } from '../components/ui';
import { getLang } from '../lib/languages';
import { downloadText, playVoice, synthesize, translateText, type VoiceResult } from '../lib/engine';
import { useSpeechCapture } from '../lib/useSpeechCapture';
import { addEntry } from '../lib/db';

type Side = 'A' | 'B';
type Msg = {
  id: string;
  side: Side;
  from: string;
  to: string;
  original: string;
  translated?: string;
  voice?: VoiceResult;
  confidence: number;
  status: 'translating' | 'done' | 'error';
};

export default function Conversation() {
  const [langA, setLangA] = useState('ta');
  const [langB, setLangB] = useState('en');
  const [active, setActive] = useState<Side | null>(null);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [draft, setDraft] = useState<Record<Side, string>>({ A: '', B: '' });
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const cap = useSpeechCapture();
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [msgs.length]);

  const turn = async (side: Side, text: string, conf: number) => {
    if (!text.trim()) return;
    const from = side === 'A' ? langA : langB;
    const to = side === 'A' ? langB : langA;
    const id = crypto.randomUUID();
    setMsgs((m) => [...m, { id, side, from, to, original: text.trim(), confidence: conf, status: 'translating' }]);
    try {
      const r = await translateText(text.trim(), from, to);
      const v = await synthesize(r.text, to);
      setMsgs((m) => m.map((x) => (x.id === id ? { ...x, translated: r.text, voice: v, status: 'done' } : x)));
      addEntry({ mode: 'conversation', speaker: side, from, to, source: text.trim(), translated: r.text, confidence: conf, latency: r.latency });
      if (autoSpeak) {
        setSpeakingId(id);
        await playVoice(v, r.text, to);
        setSpeakingId(null);
      }
    } catch {
      setMsgs((m) => m.map((x) => (x.id === id ? { ...x, status: 'error' } : x)));
    }
  };

  const mic = (side: Side) => {
    if (cap.listening) {
      cap.stop();
      return;
    }
    setActive(side);
    const lang = side === 'A' ? langA : langB;
    cap.start(getLang(lang).locale, (text, conf) => {
      setActive(null);
      turn(side, text, conf);
    });
  };

  const sendDraft = (side: Side) => {
    const t = draft[side];
    if (!t.trim()) return;
    setDraft((d) => ({ ...d, [side]: '' }));
    turn(side, t, 100);
  };

  const exportLog = () => {
    const a = getLang(langA);
    const b = getLang(langB);
    const body = msgs
      .filter((m) => m.status === 'done')
      .map((m) => `${m.side === 'A' ? `Speaker A (${a.name})` : `Speaker B (${b.name})`}:\n  ${m.original}\n  → ${m.translated}`)
      .join('\n\n');
    downloadText(`echotwin-conversation-${Date.now()}.txt`, `EchoTwin AI — Conversation log\n${new Date().toLocaleString()}\n\n${body}\n`);
  };

  const Panel = ({ side }: { side: Side }) => {
    const isA = side === 'A';
    const lang = getLang(isA ? langA : langB);
    const isLive = cap.listening && active === side;
    const otherLive = cap.listening && active !== side;
    return (
      <div className={`relative overflow-hidden rounded-[2rem] border p-6 ${isA ? 'border-sun/30 bg-gradient-to-br from-sun/[0.08] to-ink' : 'border-iris/40 bg-gradient-to-br from-iris/[0.12] to-ink'}`}>
        <div className="flex items-center justify-between">
          <p className={`font-mono text-[11px] uppercase tracking-[0.25em] ${isA ? 'text-sun' : 'text-lilac'}`}>Speaker {side}</p>
          {isLive && <span className="flex items-center gap-2 font-mono text-[10px] text-cream"><span className="h-2 w-2 animate-pulse rounded-full bg-red-400" /> REC {cap.elapsed.toFixed(1)}s</span>}
        </div>
        <div className="mt-4">
          <LangSelect label="Speaks" value={isA ? langA : langB} onChange={isA ? setLangA : setLangB} tone={isA ? 'sun' : 'iris'} />
        </div>
        <div className="mt-6 flex items-center gap-4">
          <div className="relative grid h-20 w-20 shrink-0 place-items-center">
            {isLive && <span className={`absolute inset-0 animate-ring rounded-full ${isA ? 'bg-sun/40' : 'bg-iris/40'}`} />}
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => mic(side)}
              disabled={otherLive}
              style={{ scale: isLive ? 1 + cap.level * 0.15 : 1 }}
              className={`relative grid h-20 w-20 place-items-center rounded-full transition disabled:opacity-30 ${isA ? 'bg-sun text-ink' : 'bg-iris text-white'}`}
              aria-label={isLive ? 'Stop' : `Speak as speaker ${side}`}
            >
              {isLive ? <Square className="h-7 w-7 fill-current" /> : <Mic className="h-8 w-8" />}
            </motion.button>
          </div>
          <div className="min-w-0 flex-1">
            <Waveform level={isLive ? cap.level : 0} active={isLive} bars={26} tone={isA ? 'sun' : 'iris'} className="h-10" />
            <p className="mt-2 truncate text-sm text-mist">
              {isLive ? (`${cap.transcript} ${cap.interim}`.trim() || `Listening in ${lang.name}…`) : `Tap & speak ${lang.native}`}
            </p>
          </div>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendDraft(side);
          }}
          className="mt-5 flex items-center gap-2 rounded-2xl border border-line bg-ink/60 p-1.5 pl-4"
        >
          <input
            value={draft[side]}
            onChange={(e) => setDraft((d) => ({ ...d, [side]: e.target.value }))}
            placeholder={`Or type in ${lang.name}…`}
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-mist/60"
          />
          <button type="submit" className={`grid h-9 w-9 place-items-center rounded-xl ${isA ? 'bg-sun text-ink' : 'bg-iris text-white'}`} aria-label="Send">
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    );
  };

  return (
    <div className="relative">
      <Backdrop />
      <PageHero
        eyebrow="Conversation Mode"
        title="Two voices."
        accent="One understanding."
        sub="Set each speaker's language. Take turns tapping your mic — EchoTwin transcribes, translates and speaks the reply in the other person's language."
      />
      <div className="relative mx-auto max-w-7xl px-6 pb-28">
        <div className="grid gap-6 lg:grid-cols-[1fr_1.35fr_1fr]">
          {Panel({ side: 'A' })}

          <div className="glass order-last flex min-h-[560px] flex-col rounded-[2rem] lg:order-none">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <div className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${cap.listening ? 'animate-pulse bg-red-400' : 'bg-sun'}`} />
                <span className="font-mono text-[11px] uppercase tracking-widest text-mist">
                  {getLang(langA).tag} <ArrowLeftRight className="inline h-3 w-3" /> {getLang(langB).tag} · {msgs.length} turns
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setAutoSpeak((s) => !s)}
                  className={`rounded-full px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest ${autoSpeak ? 'bg-sun text-ink' : 'border border-line text-mist'}`}
                >
                  Voice {autoSpeak ? 'on' : 'off'}
                </button>
                <button onClick={exportLog} disabled={!msgs.length} className="rounded-full p-2 text-mist hover:text-cream disabled:opacity-30" aria-label="Export conversation">
                  <FileDown className="h-4 w-4" />
                </button>
                <button onClick={() => setMsgs([])} disabled={!msgs.length} className="rounded-full p-2 text-mist hover:text-cream disabled:opacity-30" aria-label="Clear">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="scroll-thin flex-1 space-y-4 overflow-y-auto p-5" style={{ maxHeight: 620 }}>
              {!msgs.length && (
                <div className="grid h-full min-h-[380px] place-items-center text-center">
                  <div>
                    <div className="mx-auto flex w-fit -space-x-3">
                      <span className="grid h-14 w-14 place-items-center rounded-full bg-sun font-display text-xl font-bold text-ink">A</span>
                      <span className="grid h-14 w-14 place-items-center rounded-full border-4 border-plum bg-iris font-display text-xl font-bold text-white">B</span>
                    </div>
                    <p className="mt-5 font-display text-2xl font-bold">The floor is open.</p>
                    <p className="mx-auto mt-2 max-w-xs text-sm text-mist">Speaker A taps the yellow mic, Speaker B the violet one. Translations play automatically.</p>
                  </div>
                </div>
              )}
              <AnimatePresence initial={false}>
                {msgs.map((m) => {
                  const isA = m.side === 'A';
                  return (
                    <motion.div
                      key={m.id}
                      layout
                      initial={{ opacity: 0, y: 16, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className={`flex ${isA ? 'justify-start' : 'justify-end'}`}
                    >
                      <div className={`max-w-[88%] rounded-3xl p-4 ${isA ? 'rounded-bl-md bg-sun text-ink' : 'rounded-br-md bg-iris text-white'}`}>
                        <p className={`font-mono text-[9px] uppercase tracking-widest ${isA ? 'text-ink/50' : 'text-white/60'}`}>
                          {getLang(m.from).name} → {getLang(m.to).name} {m.confidence < 100 && `· ${m.confidence.toFixed(1)}%`}
                        </p>
                        <p className="mt-1 font-medium leading-snug">{m.original}</p>
                        <div className={`mt-2 border-t pt-2 ${isA ? 'border-ink/15' : 'border-white/20'}`}>
                          {m.status === 'translating' && <p className="flex items-center gap-2 text-sm opacity-70"><Loader2 className="h-3.5 w-3.5 animate-spin" /> translating…</p>}
                          {m.status === 'error' && <p className="flex items-center gap-2 text-sm"><AlertTriangle className="h-3.5 w-3.5" /> Could not translate.</p>}
                          {m.status === 'done' && (
                            <div className="flex items-start gap-2">
                              <p className={`flex-1 text-sm ${isA ? 'text-ink/75' : 'text-white/85'}`}>{m.translated}</p>
                              <button
                                onClick={async () => {
                                  setSpeakingId(m.id);
                                  await playVoice(m.voice ?? null, m.translated!, m.to);
                                  setSpeakingId(null);
                                }}
                                className={`shrink-0 rounded-full p-1.5 ${isA ? 'bg-ink/10' : 'bg-white/15'} ${speakingId === m.id ? 'animate-pulse' : ''}`}
                                aria-label="Replay"
                              >
                                <Volume2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              <div ref={endRef} />
            </div>
            {cap.error && (
              <p className="mx-5 mb-5 flex items-start gap-2 rounded-2xl border border-amber/40 bg-amber/10 p-3 text-xs">
                <AlertTriangle className="h-4 w-4 shrink-0 text-amber" /> {cap.error}
              </p>
            )}
          </div>

          {Panel({ side: 'B' })}
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {[
            { n: '01', t: 'Pick languages', d: 'Each side chooses the language they will speak — any of 20.' },
            { n: '02', t: 'Take turns', d: 'Tap your mic, speak, tap again. Or just type if you prefer.' },
            { n: '03', t: 'Listen & export', d: 'The other side hears it in their language. Export the full log anytime.' },
          ].map((s) => (
            <div key={s.n} className="rounded-3xl border border-line p-6">
              <p className="font-mono text-xs text-sun">{s.n}</p>
              <p className="mt-2 font-display text-xl font-bold">{s.t}</p>
              <p className="mt-1 text-sm text-mist">{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
