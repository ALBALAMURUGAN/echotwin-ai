import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeftRight, Copy, Check, Download, FileText, Loader2, Mic, Square, Volume2, Wand2, AlertTriangle, Gauge, Timer, Type } from 'lucide-react';
import LangSelect from '../components/LangSelect';
import { Backdrop, PageHero, Waveform } from '../components/ui';
import { getLang } from '../lib/languages';
import { downloadText, playVoice, synthesize, translateText, type TranslateResult, type VoiceResult } from '../lib/engine';
import { useSpeechCapture } from '../lib/useSpeechCapture';
import { addEntry } from '../lib/db';

export default function Studio() {
  const [from, setFrom] = useState('en');
  const [to, setTo] = useState('ta');
  const [source, setSource] = useState('');
  const [result, setResult] = useState<TranslateResult | null>(null);
  const [voice, setVoice] = useState<VoiceResult | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [stage, setStage] = useState<'idle' | 'translating' | 'voicing' | 'playing'>('idle');
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [copied, setCopied] = useState<'o' | 't' | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const cap = useSpeechCapture();

  const run = async (text: string, conf: number | null, sl = from, tl = to) => {
    if (!text.trim()) return;
    setErr(null);
    setStage('translating');
    setVoice(null);
    try {
      const r = await translateText(text.trim(), sl, tl);
      setResult(r);
      setStage('voicing');
      const v = await synthesize(r.text, tl);
      setVoice(v);
      addEntry({ mode: 'studio', from: sl, to: tl, source: text.trim(), translated: r.text, confidence: conf ?? 100, latency: r.latency });
      if (autoSpeak) {
        setStage('playing');
        await playVoice(v, r.text, tl);
      }
    } catch {
      setErr('Translation service could not be reached. Check your connection and try again.');
    }
    setStage('idle');
  };

  const toggleMic = () => {
    if (cap.listening) return cap.stop();
    setResult(null);
    setVoice(null);
    setConfidence(null);
    cap.start(getLang(from).locale, (text, conf) => {
      setSource(text);
      setConfidence(conf);
      if (text) run(text, conf);
    });
  };

  const swap = () => {
    setFrom(to);
    setTo(from);
    if (result) {
      setSource(result.text);
      setResult(null);
      setVoice(null);
    }
  };

  const copy = (which: 'o' | 't', text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(which);
    setTimeout(() => setCopied(null), 1500);
  };

  const live = cap.listening ? `${cap.transcript} ${cap.interim}`.trim() : source;
  const fl = getLang(from);
  const tlang = getLang(to);
  const words = live.trim() ? live.trim().split(/\s+/).length : 0;
  const busy = stage === 'translating' || stage === 'voicing';

  return (
    <div className="relative">
      <Backdrop />
      <PageHero
        eyebrow="Translation Studio"
        title="Say it in yours."
        accent="Hear it in theirs."
        sub="Pick your languages, tap the orb and speak. Your words appear live, get translated, and come back as a downloadable voice."
      />

      <div className="relative mx-auto max-w-7xl px-6 pb-28">
        {/* Control bar */}
        <div className="glass flex flex-col gap-4 rounded-[2rem] p-5 md:flex-row md:items-end md:p-6">
          <LangSelect label="I speak" value={from} onChange={setFrom} />
          <button
            onClick={swap}
            aria-label="Swap languages"
            className="mx-auto grid h-12 w-12 shrink-0 place-items-center rounded-full border border-line bg-ink text-sun transition hover:rotate-180 hover:border-sun md:mb-1"
            style={{ transitionDuration: '500ms' }}
          >
            <ArrowLeftRight className="h-5 w-5" />
          </button>
          <LangSelect label="Translate to" value={to} onChange={setTo} tone="iris" />
          <button
            onClick={() => setAutoSpeak((s) => !s)}
            className="flex shrink-0 items-center gap-3 rounded-2xl border border-line px-4 py-3 text-sm md:mb-0"
          >
            <span className={`relative h-6 w-11 rounded-full transition ${autoSpeak ? 'bg-sun' : 'bg-white/15'}`}>
              <span className={`absolute top-1 h-4 w-4 rounded-full bg-ink transition-all ${autoSpeak ? 'left-6' : 'left-1'}`} />
            </span>
            Auto-speak
          </button>
        </div>

        {/* Orb */}
        <div className="relative my-12 flex flex-col items-center">
          <div className="relative grid h-56 w-56 place-items-center">
            {cap.listening && (
              <>
                <span className="absolute inset-6 animate-ring rounded-full bg-sun/30" />
                <span className="absolute inset-6 animate-ring rounded-full bg-iris/30 [animation-delay:0.8s]" />
              </>
            )}
            <div className={`ring-conic absolute inset-0 rounded-full p-[2px] ${cap.listening ? 'animate-spin-slow opacity-100' : 'opacity-40'}`}>
              <div className="h-full w-full rounded-full bg-ink" />
            </div>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleMic}
              style={{ scale: cap.listening ? 1 + cap.level * 0.12 : 1 }}
              className={`relative grid h-36 w-36 place-items-center rounded-full shadow-[0_30px_80px_-20px_rgba(255,212,59,0.6)] transition-colors ${
                cap.listening ? 'bg-gradient-to-br from-iris to-violet text-white' : 'bg-gradient-to-br from-sun to-amber text-ink'
              }`}
              aria-label={cap.listening ? 'Stop recording' : 'Start recording'}
            >
              {cap.listening ? <Square className="h-10 w-10 fill-current" /> : <Mic className="h-12 w-12" />}
            </motion.button>
          </div>
          <Waveform level={cap.level} active={cap.listening} className="mt-6 h-14 w-full max-w-md" bars={48} tone={cap.listening ? 'sun' : 'iris'} />
          <p className="mt-4 font-mono text-xs uppercase tracking-[0.25em] text-mist">
            {cap.listening
              ? `Listening in ${fl.name} · ${cap.elapsed.toFixed(1)}s — tap to finish`
              : stage === 'translating'
                ? 'Translating…'
                : stage === 'voicing'
                  ? 'Generating voice…'
                  : stage === 'playing'
                    ? `Speaking ${tlang.name}…`
                    : `Tap to speak ${fl.name}`}
          </p>
          <AnimatePresence>
            {(cap.error || err) && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-5 flex max-w-lg items-start gap-3 rounded-2xl border border-amber/40 bg-amber/10 px-4 py-3 text-sm text-cream"
              >
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber" />
                {cap.error || err}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Transcripts */}
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="relative flex flex-col overflow-hidden rounded-[2rem] border border-sun/25 bg-gradient-to-b from-plum/70 to-ink">
            <div className="flex items-center justify-between border-b border-line px-6 py-4">
              <div className="flex items-center gap-3">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-sun font-mono text-[11px] font-bold text-ink">{fl.tag}</span>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-sun">Original transcript</p>
                  <p className="text-sm">{fl.name} · {fl.native}</p>
                </div>
              </div>
              <button onClick={() => copy('o', live)} disabled={!live} className="rounded-full p-2 text-mist hover:bg-white/5 hover:text-cream disabled:opacity-30" aria-label="Copy original">
                {copied === 'o' ? <Check className="h-4 w-4 text-sun" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
            <textarea
              value={live}
              onChange={(e) => setSource(e.target.value)}
              readOnly={cap.listening}
              placeholder={`Speak, or type something in ${fl.name}…`}
              className="min-h-[220px] flex-1 resize-none bg-transparent px-6 py-5 text-xl leading-relaxed text-cream outline-none placeholder:text-mist/50"
            />
            <div className="flex flex-wrap items-center gap-3 border-t border-line px-6 py-4">
              <span className="flex items-center gap-1.5 font-mono text-[11px] text-mist"><Type className="h-3.5 w-3.5" /> {words} words</span>
              {confidence !== null && (
                <span className="flex items-center gap-1.5 font-mono text-[11px] text-sun"><Gauge className="h-3.5 w-3.5" /> {confidence.toFixed(1)}% confidence</span>
              )}
              {cap.recordingUrl && !cap.listening && (
                <a href={cap.recordingUrl} download={`echotwin-original-${from}.webm`} className="flex items-center gap-1.5 font-mono text-[11px] text-mist hover:text-cream">
                  <Download className="h-3.5 w-3.5" /> original recording
                </a>
              )}
              <button
                onClick={() => run(source, confidence)}
                disabled={!source.trim() || busy || cap.listening}
                className="ml-auto flex items-center gap-2 rounded-full bg-sun px-5 py-2.5 text-sm font-semibold text-ink transition hover:brightness-110 disabled:opacity-40"
              >
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
                Translate & voice
              </button>
            </div>
          </div>

          <div className="relative flex flex-col overflow-hidden rounded-[2rem] border border-iris/35 bg-gradient-to-b from-grape/70 to-ink">
            <div className="flex items-center justify-between border-b border-line px-6 py-4">
              <div className="flex items-center gap-3">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-iris font-mono text-[11px] font-bold text-white">{tlang.tag}</span>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-lilac">Translated transcript</p>
                  <p className="text-sm">{tlang.name} · {tlang.native}</p>
                </div>
              </div>
              <button onClick={() => result && copy('t', result.text)} disabled={!result} className="rounded-full p-2 text-mist hover:bg-white/5 hover:text-cream disabled:opacity-30" aria-label="Copy translation">
                {copied === 't' ? <Check className="h-4 w-4 text-sun" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
            <div className="relative min-h-[220px] flex-1 px-6 py-5">
              {stage === 'translating' ? (
                <div className="space-y-3">
                  {[90, 75, 60].map((w) => (
                    <div key={w} className="h-5 animate-shimmer rounded-full bg-[linear-gradient(90deg,rgba(255,255,255,0.04),rgba(201,184,255,0.18),rgba(255,255,255,0.04))] bg-[length:200%_100%]" style={{ width: `${w}%` }} />
                  ))}
                </div>
              ) : result ? (
                <motion.p key={result.text} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-xl leading-relaxed">
                  {result.text}
                </motion.p>
              ) : (
                <p className="text-xl text-mist/50">Your translation will appear here, then speak itself aloud.</p>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-3 border-t border-line px-6 py-4">
              {result && (
                <span className="flex items-center gap-1.5 font-mono text-[11px] text-lilac"><Timer className="h-3.5 w-3.5" /> {result.latency} ms · {result.engine}</span>
              )}
              <div className="ml-auto flex items-center gap-2">
                <button
                  onClick={async () => {
                    if (!result) return;
                    setStage('playing');
                    await playVoice(voice, result.text, to);
                    setStage('idle');
                  }}
                  disabled={!result || busy}
                  className="flex items-center gap-2 rounded-full bg-iris px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet disabled:opacity-40"
                >
                  {stage === 'voicing' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Volume2 className="h-4 w-4" />}
                  Play
                </button>
                {voice?.url ? (
                  <a
                    href={voice.url}
                    download={`echotwin-${to}-${Date.now()}.mp3`}
                    className="flex items-center gap-2 rounded-full border border-iris/50 px-4 py-2.5 text-sm font-semibold text-lilac hover:bg-iris/15"
                  >
                    <Download className="h-4 w-4" /> MP3
                  </a>
                ) : (
                  <button
                    disabled
                    title={voice?.engine === 'browser' ? 'Neural voice server unreachable — playing with on-device voice (not downloadable).' : 'Translate first'}
                    className="flex items-center gap-2 rounded-full border border-line px-4 py-2.5 text-sm text-mist opacity-50"
                  >
                    <Download className="h-4 w-4" /> MP3
                  </button>
                )}
                <button
                  onClick={() =>
                    result &&
                    downloadText(
                      `echotwin-transcript-${Date.now()}.txt`,
                      `EchoTwin AI — Bilingual transcript\n${new Date().toLocaleString()}\n\n[${fl.name}]\n${source}\n\n[${tlang.name}]\n${result.text}\n`,
                    )
                  }
                  disabled={!result}
                  className="rounded-full border border-line p-2.5 text-mist hover:text-cream disabled:opacity-30"
                  aria-label="Download transcript"
                >
                  <FileText className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {voice?.engine === 'browser' && result && (
          <p className="mt-4 text-center text-xs text-mist">Neural voice server unavailable — using your device's built-in voice. MP3 download is enabled when the voice server responds.</p>
        )}

        {/* Quick phrases */}
        <div className="mt-14">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-mist">Try a phrase</p>
          <div className="mt-4 flex flex-wrap gap-3">
            {[
              'Where is the nearest railway station?',
              'Thank you so much for your help today.',
              'Could you please speak a little slower?',
              'How much does this cost?',
              'I would like to book a table for two.',
            ].map((p) => (
              <button
                key={p}
                onClick={() => {
                  setFrom('en');
                  setSource(p);
                  setConfidence(null);
                  run(p, null, 'en', to === 'en' ? 'ta' : to);
                  if (to === 'en') setTo('ta');
                }}
                className="rounded-full border border-line bg-white/[0.02] px-4 py-2 text-sm text-cream/80 transition hover:border-sun hover:text-sun"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {!cap.supported && (
          <p className="mt-8 rounded-2xl border border-line p-4 text-center text-sm text-mist">
            Your browser does not expose live speech recognition. Type into the original panel to translate and hear the voice — or open EchoTwin in Chrome or Edge for live capture.
          </p>
        )}
      </div>
    </div>
  );
}
