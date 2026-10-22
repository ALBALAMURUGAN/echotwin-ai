import { getLang } from './languages';

export type TranslateResult = { text: string; detected?: string; latency: number; engine: string };
export type VoiceResult = { url: string | null; blob: Blob | null; engine: 'neural' | 'browser' };

async function viaApi(q: string, sl: string, tl: string) {
  const r = await fetch('/api/translate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ q, sl, tl }),
  });
  const ct = r.headers.get('content-type') || '';
  if (!r.ok || !ct.includes('json')) throw new Error('api unavailable');
  const d = await r.json();
  if (!d.text) throw new Error('empty');
  return { text: d.text as string, detected: d.detected as string | undefined, engine: 'EchoTwin Edge' };
}

async function viaGoogle(q: string, sl: string, tl: string) {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${encodeURIComponent(sl)}&tl=${encodeURIComponent(tl)}&dt=t&q=${encodeURIComponent(q)}`;
  const r = await fetch(url);
  if (!r.ok) throw new Error('gtx');
  const d = await r.json();
  const text = (d[0] as Array<[string]>).map((s) => s[0]).join('');
  if (!text) throw new Error('empty');
  return { text, detected: d[2] as string, engine: 'EchoTwin Direct' };
}

async function viaMyMemory(q: string, sl: string, tl: string) {
  const r = await fetch(
    `https://api.mymemory.translated.net/get?q=${encodeURIComponent(q)}&langpair=${sl.split('-')[0]}|${tl.split('-')[0]}`,
  );
  const d = await r.json();
  const text = d?.responseData?.translatedText as string;
  if (!text) throw new Error('empty');
  return { text, engine: 'EchoTwin Fallback' };
}

export async function translateText(q: string, sl: string, tl: string): Promise<TranslateResult> {
  const t0 = performance.now();
  if (sl === tl) return { text: q, latency: 0, engine: 'Passthrough' };
  const attempts = [viaApi, viaGoogle, viaMyMemory];
  let lastErr: unknown;
  for (const fn of attempts) {
    try {
      const res = await fn(q, sl, tl);
      return { ...res, latency: Math.round(performance.now() - t0) };
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error('Translation failed');
}

export async function synthesize(text: string, lang: string): Promise<VoiceResult> {
  try {
    const r = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, tl: lang }),
    });
    const ct = r.headers.get('content-type') || '';
    if (!r.ok || !ct.includes('audio')) throw new Error('tts unavailable');
    const blob = await r.blob();
    if (blob.size < 200) throw new Error('empty audio');
    return { url: URL.createObjectURL(blob), blob, engine: 'neural' };
  } catch {
    return { url: null, blob: null, engine: 'browser' };
  }
}

let currentAudio: HTMLAudioElement | null = null;

export function stopAll() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
}

export function speakBrowser(text: string, code: string): Promise<void> {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) return resolve();
    const synth = window.speechSynthesis;
    const locale = getLang(code).locale;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = locale;
    const voices = synth.getVoices();
    const v =
      voices.find((x) => x.lang === locale) ||
      voices.find((x) => x.lang.toLowerCase().startsWith(code.split('-')[0].toLowerCase()));
    if (v) u.voice = v;
    u.rate = 0.98;
    u.onend = () => resolve();
    u.onerror = () => resolve();
    synth.speak(u);
  });
}

export function playVoice(voice: VoiceResult | null, text: string, code: string): Promise<void> {
  stopAll();
  if (voice?.url) {
    return new Promise((resolve) => {
      const a = new Audio(voice.url!);
      currentAudio = a;
      a.onended = () => resolve();
      a.onerror = () => {
        speakBrowser(text, code).then(resolve);
      };
      a.play().catch(() => speakBrowser(text, code).then(resolve));
    });
  }
  return speakBrowser(text, code);
}

export function downloadText(filename: string, content: string, type = 'text/plain') {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
